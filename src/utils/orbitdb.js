import { createIPFSNode } from './ipfs';
import { createBlock } from './blockchain';
import { validateBlock } from './hashUtils';

let ipfsInstance = null;
let orbitdbInstance = null;
let dbInstance = null;

/**
 * Mock OrbitDB using localStorage
 */
class MockOrbitDB {
  constructor() {
    this.dbName = 'chaintext-messages';
    this.listeners = {
      replicated: [],
      write: [],
      ready: []
    };
    this.isReady = false;
  }

  async add(data) {
    const messages = this.getAll();
    const hash = `Qm${Math.random().toString(36).substr(2, 44)}`;
    messages.push({ hash, data, timestamp: Date.now() });
    localStorage.setItem(this.dbName, JSON.stringify(messages));
    console.log('✅ Message stored:', hash);
    
    // Emit write event
    this.listeners.write.forEach(cb => cb(this.dbName, { hash, data }));
    
    return hash;
  }

  getAll() {
    const stored = localStorage.getItem(this.dbName);
    return stored ? JSON.parse(stored) : [];
  }

  async load() {
    console.log('📂 Loading messages from storage...');
    const messages = this.getAll();
    console.log(`   Found ${messages.length} messages`);
    
    setTimeout(() => {
      this.isReady = true;
      this.listeners.ready.forEach(cb => cb());
    }, 500);
  }

  iterator(options = {}) {
    return {
      collect: () => {
        const messages = this.getAll();
        return messages.map(m => ({
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
      toString: () => `/orbitdb/${this.dbName}/chaintext`
    };
  }

  async close() {
    console.log('Closing database...');
  }
}

/**
 * Main setup function for IPFS and OrbitDB (Mock Version)
 * @param {function} updateUI - Callback to update UI with new messages
 * @returns {Promise<object>} IPFS, OrbitDB, and DB instances with helper functions
 */
export async function setup(updateUI) {
  try {
    // Check if running in browser
    if (typeof window === 'undefined') {
      throw new Error('ChainText can only run in the browser');
    }

    // Initialize IPFS (Mock)
    console.log('🔧 Initializing storage systems...');
    const ipfs = await createIPFSNode();
    ipfsInstance = ipfs;

    // Initialize OrbitDB (Mock)
    console.log('💾 Setting up message database...');
    const db = new MockOrbitDB();
    dbInstance = db;
    orbitdbInstance = { disconnect: async () => {} };

    // Load existing messages
    await db.load();

    // Listen for replication events
    db.events.on('replicated', (address) => {
      console.log('Database replicated:', address);
      const messages = db.iterator({ limit: -1 }).collect().map(e => e.payload.value);
      const validMessages = messages.filter(msg => validateBlock(msg));
      updateUI(validMessages);
    });

    // Listen for write events
    db.events.on('write', (address, entry) => {
      console.log('📝 Message written:', entry.hash);
      const messages = db.iterator({ limit: -1 }).collect().map(e => e.payload.value);
      updateUI(messages);
    });

    // Listen for ready event
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

        // Add to database
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
     * @returns {string} OrbitDB address
     */
    function getDBAddress() {
      return db.address.toString();
    }

    /**
     * Gets connected peers count (simulated)
     * @returns {Promise<number>} Number of connected peers
     */
    async function getPeerCount() {
      try {
        const peers = await ipfs.swarm.peers();
        return peers.length;
      } catch (error) {
        console.error('Failed to get peer count:', error);
        return 0;
      }
    }

    return {
      ipfs,
      orbitdb: orbitdbInstance,
      db,
      sendMessage,
      getMessages,
      getDBAddress,
      getPeerCount,
    };
  } catch (error) {
    console.error('Setup failed:', error);
    throw error;
  }
}

/**
 * Closes IPFS and OrbitDB instances
 */
export async function shutdown() {
  try {
    if (dbInstance) {
      await dbInstance.close();
      dbInstance = null;
    }
    if (orbitdbInstance) {
      await orbitdbInstance.disconnect();
      orbitdbInstance = null;
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

