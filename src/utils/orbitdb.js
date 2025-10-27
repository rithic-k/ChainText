import { createIPFSNode } from './ipfs';
import { createBlock } from './blockchain';
import { validateBlock } from './hashUtils';
import P2PNetwork from './p2p';

let ipfsInstance = null;
let pubsubTopic = 'chaintext-global'; // Default chat room
let messageHandlers = [];
let localMessages = [];
let p2pNetwork = null;

/**
 * P2P Message Database using IndexedDB + WebRTC
 * Messages are shared via P2P and synced in real-time
 */
class P2PMessageDB {
  constructor(ipfs, topic = 'chaintext-global', p2p) {
    this.ipfs = ipfs;
    this.topic = topic;
    this.p2p = p2p;
    this.messages = [];
    this.listeners = {
      replicated: [],
      write: [],
      ready: []
    };
    this.isReady = false;
    
    // Load from localStorage
    this.loadLocal();
    
    // Setup P2P message handler
    if (this.p2p) {
      this.p2p.onMessage((message, fromPeer) => {
        if (message.type === 'message' && message.room === this.topic) {
          console.log('📥 Received P2P message from', fromPeer);
          this.handleRemoteMessage(message.data);
        } else if (message.type === 'sync-request' && message.room === this.topic) {
          // Send all our messages to the requesting peer
          this.p2p.sendToPeer(fromPeer, {
            type: 'sync-response',
            room: this.topic,
            messages: this.messages
          });
        } else if (message.type === 'sync-response' && message.room === this.topic) {
          // Merge received messages
          this.mergeMessages(message.messages);
        }
      });
    }
  }

  handleRemoteMessage(messageData) {
    // Check if we already have this message
    const exists = this.messages.some(m => m.hash === messageData.hash);
    if (!exists) {
      this.messages.push(messageData);
      this.saveLocal();
      this.listeners.replicated.forEach(cb => cb(this.topic));
    }
  }

  mergeMessages(newMessages) {
    let added = 0;
    newMessages.forEach(msg => {
      const exists = this.messages.some(m => m.hash === msg.hash);
      if (!exists) {
        this.messages.push(msg);
        added++;
      }
    });
    
    if (added > 0) {
      this.saveLocal();
      this.listeners.replicated.forEach(cb => cb(this.topic));
      console.log(`📥 Synced ${added} messages from peer`);
    }
  }

  loadLocal() {
    try {
      const stored = localStorage.getItem(`messages-${this.topic}`);
      if (stored) {
        this.messages = JSON.parse(stored);
        console.log(`📂 Loaded ${this.messages.length} local messages for ${this.topic}`);
      }
    } catch (err) {
      console.error('Failed to load local messages:', err);
    }
  }

  saveLocal() {
    try {
      localStorage.setItem(`messages-${this.topic}`, JSON.stringify(this.messages));
    } catch (err) {
      console.error('Failed to save local messages:', err);
    }
  }

  async add(data) {
    try {
      // Add to IPFS
      const result = await this.ipfs.add(JSON.stringify(data));
      const hash = result.cid.toString();
      
      const message = { hash, data, timestamp: Date.now() };
      this.messages.push(message);
      this.saveLocal();
      
      console.log('✅ Message stored in P2P network:', hash);
      
      // Broadcast to P2P network
      if (this.p2p) {
        const sent = this.p2p.broadcast({
          type: 'message',
          room: this.topic,
          data: message
        });
        console.log(`📡 Broadcast to ${sent} peers`);
      }
      
      // Emit write event
      this.listeners.write.forEach(cb => cb(this.topic, { hash, data }));
      
      return hash;
    } catch (err) {
      console.error('Failed to add message:', err);
      throw err;
    }
  }

  async load() {
    console.log(`🔄 Loading database for topic: ${this.topic}`);
    
    // Request sync from peers
    if (this.p2p) {
      const peers = this.p2p.getConnectedPeers();
      if (peers.length > 0) {
        console.log(`🔄 Requesting sync from ${peers.length} peers`);
        this.p2p.broadcast({
          type: 'sync-request',
          room: this.topic
        });
      }
    }
    
    setTimeout(() => {
      this.isReady = true;
      this.listeners.ready.forEach(cb => cb());
    }, 1000);
  }

  iterator(options = {}) {
    return {
      collect: () => {
        return this.messages.map(m => ({
          hash: m.hash,
          payload: { value: m.data }
        }));
      }
    };
  }

  get events() {
    return {
      on: (event, callback) => {
        if (this.listeners[event]) {
          this.listeners[event].push(callback);
        }
      }
    };
  }

  get address() {
    return {
      toString: () => `/chaintext/${this.topic}`
    };
  }

  async close() {
    console.log('Closing database...');
  }
}

/**
 * Main setup function for P2P messaging with WebRTC
 * @param {function} updateUI - Callback to update UI with new messages
 * @param {string} chatRoom - Chat room ID to join (default: 'chaintext-global')
 * @returns {Promise<object>} IPFS and DB instances with helper functions
 */
export async function setup(updateUI, chatRoom = 'chaintext-global') {
  try {
    // Check if running in browser
    if (typeof window === 'undefined') {
      throw new Error('ChainText can only run in the browser');
    }

    pubsubTopic = chatRoom;

    // Initialize P2P Storage
    console.log('🔧 Initializing P2P system...');
    const ipfs = await createIPFSNode();
    ipfsInstance = ipfs;

    // Initialize P2P Network
    console.log('🌐 Initializing WebRTC P2P network...');
    const nodeId = ipfs._peerId;
    p2pNetwork = new P2PNetwork(nodeId);

    // Initialize P2P Message DB
    console.log(`💾 Setting up message database for: ${chatRoom}`);
    const db = new P2PMessageDB(ipfs, chatRoom, p2pNetwork);
    
    // Load existing messages
    await db.load();

    // Listen for P2P status changes
    p2pNetwork.onStatusChange((status) => {
      console.log('🔄 P2P Status:', status);
      // Update peer count in UI
    });

    // Listen for events
    db.events.on('replicated', (address) => {
      console.log('📡 Database replicated:', address);
      const messages = db.iterator({ limit: -1 }).collect().map(e => e.payload.value);
      const validMessages = messages.filter(msg => validateBlock(msg));
      updateUI(validMessages);
    });

    db.events.on('write', (address, entry) => {
      console.log('📝 Message written:', entry.hash);
      const messages = db.iterator({ limit: -1 }).collect().map(e => e.payload.value);
      updateUI(messages);
    });

    db.events.on('ready', () => {
      console.log('✅ Database ready');
      const messages = db.iterator({ limit: -1 }).collect().map(e => e.payload.value);
      updateUI(messages);
    });

    // Initial load
    const initialMessages = db.iterator({ limit: -1 }).collect().map(e => e.payload.value);
    updateUI(initialMessages);

    /**
     * Sends a new message
     * @param {string} rawMessage - Plain text message to send
     * @param {string} previousHash - Hash of the previous message
     */
    async function sendMessage(rawMessage, previousHash) {
      try {
        // Get MetaMask provider and signer
        if (!window.ethereum) {
          throw new Error('MetaMask not installed');
        }

        const { ethers } = await import('ethers');
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = provider.getSigner();

        // Create signed and encrypted block
        const messageBlock = await createBlock(rawMessage, previousHash, signer);

        // Add to database (will broadcast via P2P)
        const hash = await db.add(messageBlock);
        console.log('Message added with hash:', hash);

        return messageBlock;
      } catch (error) {
        console.error('Failed to send message:', error);
        throw error;
      }
    }

    /**
     * Gets all messages from the database
     * @returns {array} Array of message blocks
     */
    function getMessages() {
      return db.iterator({ limit: -1 }).collect().map(e => e.payload.value);
    }

    /**
     * Gets the database address for sharing
     * @returns {string} Chat room topic
     */
    function getDBAddress() {
      return db.address.toString();
    }

    /**
     * Gets connected peers count
     * @returns {Promise<number>} Number of connected peers
     */
    async function getPeerCount() {
      try {
        const connectedPeers = p2pNetwork.getConnectedPeers();
        return connectedPeers.length;
      } catch (error) {
        console.error('Failed to get peer count:', error);
        return 0;
      }
    }

    /**
     * Get your node ID for sharing
     */
    function getNodeId() {
      return nodeId;
    }

    /**
     * Connect to a peer by their node ID
     */
    async function connectToNode(peerNodeId) {
      try {
        await p2pNetwork.connectToPeer(peerNodeId);
        console.log('✅ Connected to node:', peerNodeId);
        
        // Request sync from this peer
        p2pNetwork.sendToPeer(peerNodeId, {
          type: 'sync-request',
          room: chatRoom
        });
      } catch (error) {
        console.error('Failed to connect to node:', error);
        throw error;
      }
    }

    /**
     * Switch to a different chat room
     * @param {string} newRoom - New chat room ID
     */
    async function switchRoom(newRoom) {
      console.log(`🔄 Switching to room: ${newRoom}`);
      await db.close();
      return setup(updateUI, newRoom);
    }

    return {
      ipfs,
      db,
      p2p: p2pNetwork,
      sendMessage,
      getMessages,
      getDBAddress,
      getPeerCount,
      getNodeId,
      connectToNode,
      switchRoom,
      currentRoom: chatRoom,
    };
  } catch (error) {
    console.error('Setup failed:', error);
    throw error;
  }
}

/**
 * Closes IPFS and P2P instances
 */
export async function shutdown() {
  try {
    if (p2pNetwork) {
      p2pNetwork.disconnect();
      p2pNetwork = null;
    }
    if (ipfsInstance) {
      await ipfsInstance.stop();
      ipfsInstance = null;
    }
    console.log('Shutdown complete');
  } catch (error) {
    console.error('Shutdown failed:', error);
  }
}


