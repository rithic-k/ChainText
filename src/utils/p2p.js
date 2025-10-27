/**
 * True P2P Networking with WebRTC
 * Enables direct browser-to-browser communication
 */

class P2PNetwork {
  constructor(nodeId) {
    this.nodeId = nodeId;
    this.peers = new Map(); // Map of peerId -> RTCPeerConnection
    this.messageHandlers = [];
    this.statusHandlers = [];
    this.dataChannels = new Map(); // Map of peerId -> RTCDataChannel
    
    // Signaling via localStorage for same-computer peers
    // For cross-computer, you'd use a signaling server (Socket.io)
    this.setupSignaling();
  }

  /**
   * Setup signaling mechanism
   */
  setupSignaling() {
    // Listen for signaling messages
    window.addEventListener('storage', async (e) => {
      if (e.key === 'p2p-signal' && e.newValue) {
        try {
          const signal = JSON.parse(e.newValue);
          if (signal.to === this.nodeId) {
            await this.handleSignal(signal);
          }
        } catch (err) {
          console.error('Error processing signal:', err);
        }
      }
    });

    // Announce presence
    this.announce();
    setInterval(() => this.announce(), 30000); // Re-announce every 30s
  }

  /**
   * Announce presence to network
   */
  announce() {
    const announcement = {
      type: 'announce',
      from: this.nodeId,
      timestamp: Date.now()
    };
    
    localStorage.setItem('p2p-announce-' + this.nodeId, JSON.stringify(announcement));
    
    // Check for other nodes
    this.discoverPeers();
  }

  /**
   * Discover other peers
   */
  discoverPeers() {
    const now = Date.now();
    const maxAge = 60000; // 60 seconds
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('p2p-announce-') && !key.includes(this.nodeId)) {
        try {
          const announcement = JSON.parse(localStorage.getItem(key));
          if (now - announcement.timestamp < maxAge) {
            const peerId = announcement.from;
            if (!this.peers.has(peerId)) {
              this.connectToPeer(peerId);
            }
          }
        } catch (err) {
          // Ignore invalid announcements
        }
      }
    }
  }

  /**
   * Connect to a peer by ID
   */
  async connectToPeer(peerId) {
    if (this.peers.has(peerId)) {
      console.log('Already connected to', peerId);
      return;
    }

    console.log('🤝 Connecting to peer:', peerId);
    
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });

    this.peers.set(peerId, pc);

    // Create data channel
    const dataChannel = pc.createDataChannel('messages', {
      ordered: true
    });
    
    this.setupDataChannel(dataChannel, peerId);

    // Create and send offer
    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Wait for ICE gathering
      await new Promise((resolve) => {
        if (pc.iceGatheringState === 'complete') {
          resolve();
        } else {
          pc.addEventListener('icegatheringstatechange', () => {
            if (pc.iceGatheringState === 'complete') {
              resolve();
            }
          });
        }
      });

      // Send offer via signaling
      this.sendSignal({
        type: 'offer',
        from: this.nodeId,
        to: peerId,
        offer: pc.localDescription
      });

    } catch (err) {
      console.error('Error creating offer:', err);
      this.peers.delete(peerId);
    }

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendSignal({
          type: 'ice-candidate',
          from: this.nodeId,
          to: peerId,
          candidate: event.candidate
        });
      }
    };

    // Handle connection state
    pc.onconnectionstatechange = () => {
      console.log(`Connection state with ${peerId}:`, pc.connectionState);
      this.notifyStatus();
      
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        this.peers.delete(peerId);
        this.dataChannels.delete(peerId);
        this.notifyStatus();
      }
    };

    // Handle incoming data channel (for answerer)
    pc.ondatachannel = (event) => {
      this.setupDataChannel(event.channel, peerId);
    };
  }

  /**
   * Setup data channel handlers
   */
  setupDataChannel(dataChannel, peerId) {
    this.dataChannels.set(peerId, dataChannel);

    dataChannel.onopen = () => {
      console.log('✅ Data channel opened with', peerId);
      this.notifyStatus();
    };

    dataChannel.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('📨 Received message from', peerId, message);
        this.notifyMessageHandlers(message, peerId);
      } catch (err) {
        console.error('Error parsing message:', err);
      }
    };

    dataChannel.onclose = () => {
      console.log('Data channel closed with', peerId);
      this.dataChannels.delete(peerId);
      this.notifyStatus();
    };
  }

  /**
   * Handle incoming signal
   */
  async handleSignal(signal) {
    const { from, type } = signal;

    if (type === 'offer') {
      // Received offer, create answer
      let pc = this.peers.get(from);
      
      if (!pc) {
        pc = new RTCPeerConnection({
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
          ]
        });
        this.peers.set(from, pc);

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            this.sendSignal({
              type: 'ice-candidate',
              from: this.nodeId,
              to: from,
              candidate: event.candidate
            });
          }
        };

        pc.onconnectionstatechange = () => {
          console.log(`Connection state with ${from}:`, pc.connectionState);
          this.notifyStatus();
          
          if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
            this.peers.delete(from);
            this.dataChannels.delete(from);
            this.notifyStatus();
          }
        };

        pc.ondatachannel = (event) => {
          this.setupDataChannel(event.channel, from);
        };
      }

      await pc.setRemoteDescription(signal.offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      // Wait for ICE gathering
      await new Promise((resolve) => {
        if (pc.iceGatheringState === 'complete') {
          resolve();
        } else {
          pc.addEventListener('icegatheringstatechange', () => {
            if (pc.iceGatheringState === 'complete') {
              resolve();
            }
          });
        }
      });

      this.sendSignal({
        type: 'answer',
        from: this.nodeId,
        to: from,
        answer: pc.localDescription
      });

    } else if (type === 'answer') {
      const pc = this.peers.get(from);
      if (pc) {
        await pc.setRemoteDescription(signal.answer);
      }

    } else if (type === 'ice-candidate') {
      const pc = this.peers.get(from);
      if (pc && signal.candidate) {
        await pc.addIceCandidate(signal.candidate);
      }
    }
  }

  /**
   * Send signal via localStorage
   */
  sendSignal(signal) {
    const key = `p2p-signal`;
    localStorage.setItem(key, JSON.stringify(signal));
    // Trigger storage event by changing timestamp
    localStorage.setItem('p2p-signal-time', Date.now().toString());
  }

  /**
   * Broadcast message to all connected peers
   */
  broadcast(message) {
    const data = JSON.stringify(message);
    let sent = 0;

    this.dataChannels.forEach((channel, peerId) => {
      if (channel.readyState === 'open') {
        try {
          channel.send(data);
          sent++;
        } catch (err) {
          console.error('Error sending to', peerId, err);
        }
      }
    });

    console.log(`📡 Broadcast to ${sent} peers`);
    return sent;
  }

  /**
   * Send message to specific peer
   */
  sendToPeer(peerId, message) {
    const channel = this.dataChannels.get(peerId);
    if (channel && channel.readyState === 'open') {
      channel.send(JSON.stringify(message));
      return true;
    }
    return false;
  }

  /**
   * Register message handler
   */
  onMessage(handler) {
    this.messageHandlers.push(handler);
  }

  /**
   * Register status change handler
   */
  onStatusChange(handler) {
    this.statusHandlers.push(handler);
  }

  /**
   * Notify message handlers
   */
  notifyMessageHandlers(message, fromPeer) {
    this.messageHandlers.forEach(handler => {
      try {
        handler(message, fromPeer);
      } catch (err) {
        console.error('Error in message handler:', err);
      }
    });
  }

  /**
   * Notify status handlers
   */
  notifyStatus() {
    const status = {
      connectedPeers: Array.from(this.dataChannels.entries())
        .filter(([_, channel]) => channel.readyState === 'open')
        .map(([peerId]) => peerId),
      totalPeers: this.peers.size
    };

    this.statusHandlers.forEach(handler => {
      try {
        handler(status);
      } catch (err) {
        console.error('Error in status handler:', err);
      }
    });
  }

  /**
   * Get connected peers
   */
  getConnectedPeers() {
    return Array.from(this.dataChannels.entries())
      .filter(([_, channel]) => channel.readyState === 'open')
      .map(([peerId]) => peerId);
  }

  /**
   * Disconnect all peers
   */
  disconnect() {
    this.peers.forEach((pc) => {
      pc.close();
    });
    this.peers.clear();
    this.dataChannels.clear();
    
    // Remove announcement
    localStorage.removeItem('p2p-announce-' + this.nodeId);
  }
}

export default P2PNetwork;
