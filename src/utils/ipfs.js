/**
 * IPFS Mock Implementation (Browser-Only)
 * Using localStorage to simulate distributed storage
 */

/**
 * Creates and initializes a mock IPFS node
 * @returns {Promise<object>} Mock IPFS instance
 */
export async function createIPFSNode() {
  // Dynamic import to avoid SSR issues
  if (typeof window === 'undefined') {
    throw new Error('IPFS can only be initialized in the browser');
  }

  console.log('🌐 Initializing Browser Storage (IPFS Mock)...');
  
  // Simulate IPFS initialization delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const nodeId = `Qm${Math.random().toString(36).substr(2, 44)}`;
  
  const ipfs = {
    _nodeId: nodeId,
    
    id: async () => ({
      id: nodeId,
      agentVersion: 'chaintext-browser/1.0.0',
      protocolVersion: 'browser/1.0',
      addresses: []
    }),
    
    add: async (data) => {
      const hash = `Qm${Math.random().toString(36).substr(2, 44)}`;
      const key = `ipfs-${hash}`;
      const content = typeof data === 'string' ? data : JSON.stringify(data);
      localStorage.setItem(key, content);
      console.log(`📦 Stored data with hash: ${hash}`);
      return { 
        cid: { toString: () => hash }, 
        size: content.length,
        path: hash
      };
    },
    
    cat: async (cid) => {
      const key = `ipfs-${cid}`;
      const data = localStorage.getItem(key);
      if (!data) {
        throw new Error(`Content not found: ${cid}`);
      }
      console.log(`📤 Retrieved data for: ${cid}`);
      return new TextEncoder().encode(data);
    },
    
    swarm: {
      peers: async () => {
        // Simulate some peers
        return [
          { peer: 'QmPeer1...abc', addr: '/ip4/127.0.0.1/tcp/4001' },
          { peer: 'QmPeer2...def', addr: '/ip4/127.0.0.1/tcp/4002' }
        ];
      },
      connect: async (addr) => {
        console.log(`🔗 Mock connect to: ${addr}`);
      }
    },
    
    stop: async () => {
      console.log('🛑 Stopping mock IPFS node...');
    }
  };

  console.log('✅ Browser Storage initialized:', nodeId);
  
  return ipfs;
}

/**
 * Connects to a specific peer (Mock)
 * @param {object} ipfs - IPFS instance
 * @param {string} peerMultiaddr - Peer multiaddress
 */
export async function connectToPeer(ipfs, peerMultiaddr) {
  try {
    await ipfs.swarm.connect(peerMultiaddr);
    console.log('Connected to peer:', peerMultiaddr);
  } catch (error) {
    console.error('Failed to connect to peer:', error);
  }
}

/**
 * Gets the list of connected peers (Mock)
 * @param {object} ipfs - IPFS instance
 * @returns {Promise<array>} List of peer objects
 */
export async function getPeers(ipfs) {
  try {
    const peers = await ipfs.swarm.peers();
    return peers;
  } catch (error) {
    console.error('Failed to get peers:', error);
    return [];
  }
}

