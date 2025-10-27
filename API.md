# ChainText API Reference

## Utility Functions

### Encryption (`src/utils/encryption.js`)

#### `encryptMessage(message, key)`
Encrypts a message using AES-256 encryption.

**Parameters:**
- `message` (string): Plain text message to encrypt
- `key` (string): Encryption key (typically wallet address)

**Returns:** (string) Encrypted ciphertext

**Example:**
```javascript
import { encryptMessage } from './utils/encryption';

const encrypted = encryptMessage('Hello World', '0x742d35...');
// Returns: "U2FsdGVkX1+vupppZksvRf5pq5g5XjFRIipRkwB0K1Y="
```

---

#### `decryptMessage(ciphertext, key)`
Decrypts an AES-256 encrypted message.

**Parameters:**
- `ciphertext` (string): Encrypted message
- `key` (string): Decryption key (must match encryption key)

**Returns:** (string) Decrypted plain text

**Example:**
```javascript
import { decryptMessage } from './utils/encryption';

const decrypted = decryptMessage('U2FsdGVk...', '0x742d35...');
// Returns: "Hello World"
```

---

### Hashing (`src/utils/hashUtils.js`)

#### `generateHash(encrypted, timestamp, previousHash)`
Creates a SHA-256 hash from message components.

**Parameters:**
- `encrypted` (string): Encrypted message content
- `timestamp` (string): ISO 8601 timestamp
- `previousHash` (string): Hash of previous message block

**Returns:** (string) SHA-256 hash (64 hex characters)

**Example:**
```javascript
import { generateHash } from './utils/hashUtils';

const hash = generateHash(
  'U2FsdGVk...',
  '2025-10-27T12:34:56.789Z',
  'a1b2c3d4...'
);
// Returns: "e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0..."
```

---

#### `validateBlock(block)`
Validates a message block's hash integrity.

**Parameters:**
- `block` (object): Message block to validate

**Returns:** (boolean) True if block is valid

**Example:**
```javascript
import { validateBlock } from './utils/hashUtils';

const isValid = validateBlock({
  encrypted: 'U2FsdGVk...',
  timestamp: '2025-10-27T12:34:56.789Z',
  previousHash: 'a1b2c3d4...',
  hash: 'e5f6a7b8...'
});
// Returns: true or false
```

---

#### `validateChain(blocks)`
Validates an entire chain of message blocks.

**Parameters:**
- `blocks` (array): Array of message blocks

**Returns:** (boolean) True if entire chain is valid

**Example:**
```javascript
import { validateChain } from './utils/hashUtils';

const isChainValid = validateChain([block1, block2, block3]);
// Returns: true or false
```

---

### Blockchain (`src/utils/blockchain.js`)

#### `createBlock(rawMessage, previousHash, signer)`
Creates a signed and encrypted message block.

**Parameters:**
- `rawMessage` (string): Plain text message
- `previousHash` (string): Hash of previous block (empty string for first message)
- `signer` (object): Ethers.js signer instance from MetaMask

**Returns:** (Promise<object>) Message block object

**Example:**
```javascript
import { createBlock } from './utils/blockchain';
import { ethers } from 'ethers';

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const block = await createBlock('Hello!', 'a1b2c3d4...', signer);
/* Returns:
{
  sender: '0x742d35...',
  encrypted: 'U2FsdGVk...',
  timestamp: '2025-10-27T12:34:56.789Z',
  previousHash: 'a1b2c3d4...',
  hash: 'e5f6a7b8...',
  signature: '0x8f3c2a1b...'
}
*/
```

---

#### `verifySignature(block)`
Verifies a message block's cryptographic signature.

**Parameters:**
- `block` (object): Message block with signature

**Returns:** (Promise<boolean>) True if signature is valid

**Example:**
```javascript
import { verifySignature } from './utils/blockchain';

const isValid = await verifySignature(messageBlock);
// Returns: true or false
```

---

#### `getGenesisBlock()`
Returns the genesis (first) block placeholder.

**Returns:** (object) Genesis block

**Example:**
```javascript
import { getGenesisBlock } from './utils/blockchain';

const genesis = getGenesisBlock();
/* Returns:
{
  sender: '0x0000000000000000000000000000000000000000',
  encrypted: '',
  timestamp: '1970-01-01T00:00:00.000Z',
  previousHash: '',
  hash: '0',
  signature: ''
}
*/
```

---

### IPFS (`src/utils/ipfs.js`)

#### `createIPFSNode()`
Creates and initializes a local IPFS node.

**Returns:** (Promise<object>) IPFS instance

**Example:**
```javascript
import { createIPFSNode } from './utils/ipfs';

const ipfs = await createIPFSNode();
console.log('IPFS node created');

// Get node info
const id = await ipfs.id();
console.log('Node ID:', id.id);
```

---

#### `connectToPeer(ipfs, peerMultiaddr)`
Manually connects to a specific IPFS peer.

**Parameters:**
- `ipfs` (object): IPFS instance
- `peerMultiaddr` (string): Peer's multiaddress

**Returns:** (Promise<void>)

**Example:**
```javascript
import { connectToPeer } from './utils/ipfs';

await connectToPeer(
  ipfs,
  '/dns4/example.com/tcp/443/wss/p2p/QmPeerId...'
);
```

---

#### `getPeers(ipfs)`
Gets list of currently connected IPFS peers.

**Parameters:**
- `ipfs` (object): IPFS instance

**Returns:** (Promise<array>) Array of peer objects

**Example:**
```javascript
import { getPeers } from './utils/ipfs';

const peers = await getPeers(ipfs);
console.log('Connected peers:', peers.length);
```

---

### OrbitDB (`src/utils/orbitdb.js`)

#### `setup(updateUI)`
Main setup function for IPFS and OrbitDB initialization.

**Parameters:**
- `updateUI` (function): Callback function to update UI with new messages

**Returns:** (Promise<object>) System object with IPFS, OrbitDB instances and helper functions

**Example:**
```javascript
import { setup } from './utils/orbitdb';

const system = await setup((messages) => {
  console.log('New messages:', messages);
  setMessages(messages);
});

// System object contains:
// - ipfs: IPFS instance
// - orbitdb: OrbitDB instance
// - db: Message database
// - sendMessage: Function to send messages
// - getMessages: Function to retrieve messages
// - getDBAddress: Function to get database address
// - getPeerCount: Function to get peer count
```

---

#### `system.sendMessage(rawMessage, previousHash)`
Sends a new encrypted and signed message.

**Parameters:**
- `rawMessage` (string): Plain text message to send
- `previousHash` (string): Hash of the previous message

**Returns:** (Promise<object>) Created message block

**Example:**
```javascript
const previousHash = messages.length > 0 
  ? messages[messages.length - 1].hash 
  : '';

await system.sendMessage('Hello World!', previousHash);
```

---

#### `system.getMessages()`
Retrieves all messages from the database.

**Returns:** (array) Array of message blocks

**Example:**
```javascript
const allMessages = system.getMessages();
console.log('Total messages:', allMessages.length);
```

---

#### `system.getDBAddress()`
Gets the OrbitDB database address for sharing.

**Returns:** (string) Database address

**Example:**
```javascript
const dbAddress = system.getDBAddress();
console.log('Share this address:', dbAddress);
// Returns: "/orbitdb/zdpuAm8n..."
```

---

#### `system.getPeerCount()`
Gets the number of connected IPFS peers.

**Returns:** (Promise<number>) Peer count

**Example:**
```javascript
const count = await system.getPeerCount();
console.log('Connected peers:', count);
```

---

#### `shutdown()`
Closes all IPFS and OrbitDB connections.

**Returns:** (Promise<void>)

**Example:**
```javascript
import { shutdown } from './utils/orbitdb';

await shutdown();
console.log('System shut down gracefully');
```

---

## React Components

### WalletConnect

**Props:**
- `onConnect` (function): Callback when wallet connects/disconnects
  - Signature: `(address, signer) => void`
- `connected` (boolean): Whether wallet is currently connected
- `address` (string): Current wallet address

**Example:**
```jsx
<WalletConnect
  onConnect={(address, signer) => {
    setWalletAddress(address);
    setSigner(signer);
  }}
  connected={!!walletAddress}
  address={walletAddress}
/>
```

---

### MessageInput

**Props:**
- `onSend` (function): Callback when message is sent
  - Signature: `(messageText) => Promise<void>`
- `disabled` (boolean): Whether input is disabled
- `connected` (boolean): Whether wallet is connected

**Example:**
```jsx
<MessageInput
  onSend={async (text) => {
    await handleSendMessage(text);
  }}
  disabled={!orbitSystem}
  connected={!!walletAddress}
/>
```

---

### ChatBubble

**Props:**
- `message` (object): Message block to display
- `currentUser` (string): Current user's wallet address
- `index` (number): Message index (for animation delay)

**Example:**
```jsx
<ChatBubble
  message={{
    sender: '0x742d35...',
    encrypted: 'U2FsdGVk...',
    timestamp: '2025-10-27T12:34:56.789Z',
    hash: 'e5f6a7b8...',
    signature: '0x8f3c2a1b...'
  }}
  currentUser={walletAddress}
  index={0}
/>
```

---

### MessageTimeline

**Props:**
- `messages` (array): Array of message blocks
- `currentUser` (string): Current user's wallet address

**Example:**
```jsx
<MessageTimeline
  messages={[message1, message2, message3]}
  currentUser={walletAddress}
/>
```

---

### OrbitStatus

**Props:**
- `ipfs` (object): IPFS instance
- `db` (object): OrbitDB database instance
- `isInitialized` (boolean): Whether system is initialized

**Example:**
```jsx
<OrbitStatus
  ipfs={system.ipfs}
  db={system.db}
  isInitialized={!!system}
/>
```

---

## Events

### OrbitDB Events

#### `db.events.on('replicated', callback)`
Fired when database receives updates from peers.

**Example:**
```javascript
db.events.on('replicated', (address) => {
  console.log('Database replicated from:', address);
  const messages = db.iterator({ limit: -1 }).collect();
  updateUI(messages);
});
```

---

#### `db.events.on('write', callback)`
Fired when local write completes.

**Example:**
```javascript
db.events.on('write', (address, entry) => {
  console.log('Message written:', entry.hash);
});
```

---

#### `db.events.on('ready', callback)`
Fired when database is ready for operations.

**Example:**
```javascript
db.events.on('ready', () => {
  console.log('Database ready');
});
```

---

### MetaMask Events

#### `window.ethereum.on('accountsChanged', callback)`
Fired when user switches MetaMask accounts.

**Example:**
```javascript
window.ethereum.on('accountsChanged', (accounts) => {
  if (accounts.length === 0) {
    console.log('Wallet disconnected');
  } else {
    console.log('Account changed:', accounts[0]);
  }
});
```

---

#### `window.ethereum.on('chainChanged', callback)`
Fired when user switches Ethereum network.

**Example:**
```javascript
window.ethereum.on('chainChanged', (chainId) => {
  console.log('Chain changed:', chainId);
  window.location.reload();
});
```

---

## Type Definitions

### MessageBlock
```typescript
interface MessageBlock {
  sender: string;          // Ethereum address (0x...)
  encrypted: string;       // Base64 encoded ciphertext
  timestamp: string;       // ISO 8601 timestamp
  previousHash: string;    // SHA-256 hash (64 hex chars)
  hash: string;            // SHA-256 hash (64 hex chars)
  signature: string;       // Hex encoded signature (0x...)
}
```

### OrbitSystemObject
```typescript
interface OrbitSystemObject {
  ipfs: IPFSInstance;
  orbitdb: OrbitDBInstance;
  db: OrbitDBDatabase;
  sendMessage: (message: string, previousHash: string) => Promise<MessageBlock>;
  getMessages: () => MessageBlock[];
  getDBAddress: () => string;
  getPeerCount: () => Promise<number>;
}
```

---

## Error Handling

### Common Errors

**"MetaMask not installed"**
```javascript
try {
  await connectWallet();
} catch (error) {
  if (error.message.includes('MetaMask')) {
    alert('Please install MetaMask');
  }
}
```

**"User rejected request"**
```javascript
try {
  await signer.signMessage(hash);
} catch (error) {
  if (error.code === 4001) {
    console.log('User cancelled signature');
  }
}
```

**"Decryption failed"**
```javascript
try {
  const decrypted = decryptMessage(ciphertext, key);
  if (!decrypted) {
    console.error('Wrong decryption key');
  }
} catch (error) {
  console.error('Decryption error:', error);
}
```

---

## Best Practices

1. **Always validate blocks before displaying**
   ```javascript
   const validMessages = messages.filter(validateBlock);
   ```

2. **Check wallet connection before operations**
   ```javascript
   if (!window.ethereum) {
     throw new Error('MetaMask required');
   }
   ```

3. **Handle async operations properly**
   ```javascript
   async function sendMessage(text) {
     try {
       await system.sendMessage(text, previousHash);
     } catch (error) {
       console.error('Send failed:', error);
       // Show user-friendly error
     }
   }
   ```

4. **Clean up listeners on unmount**
   ```javascript
   useEffect(() => {
     const handler = () => { /* ... */ };
     db.events.on('replicated', handler);
     
     return () => {
       db.events.off('replicated', handler);
     };
   }, [db]);
   ```

---

**Last Updated**: October 27, 2025  
**API Version**: 1.0.0
