# ChainText Architecture Documentation

## System Overview

ChainText is a fully decentralized messaging application that combines multiple Web3 technologies to create a secure, censorship-resistant communication platform.

## Core Components

### 1. Frontend Layer (Next.js + React)

**Pages**:
- `pages/index.js` - Main application interface
- `pages/_app.js` - Global configuration and providers
- `pages/_document.js` - HTML document structure

**Components**:
- `WalletConnect.jsx` - MetaMask wallet integration
- `MessageInput.jsx` - Message composition interface
- `ChatBubble.jsx` - Individual message display
- `MessageTimeline.jsx` - Message list and chain visualization
- `OrbitStatus.jsx` - Network status dashboard

### 2. Blockchain Layer

**Technology**: Ethereum + MetaMask

**Functions**:
- Wallet authentication and identity
- Message signing (cryptographic proof)
- Signature verification
- Address-based encryption keys

**Implementation** (`src/utils/blockchain.js`):
```javascript
- createBlock(): Creates signed message blocks
- verifySignature(): Validates message authenticity
- getGenesisBlock(): Returns chain origin
```

### 3. Storage Layer

**Technology**: IPFS (InterPlanetary File System)

**Functions**:
- Decentralized content storage
- Content addressing (CID-based)
- Peer discovery and connection
- Data replication across network

**Implementation** (`src/utils/ipfs.js`):
```javascript
- createIPFSNode(): Initializes local IPFS node
- connectToPeer(): Manual peer connection
- getPeers(): Returns connected peers list
```

### 4. Database Layer

**Technology**: OrbitDB (Distributed Database on IPFS)

**Database Type**: Event Log (append-only)

**Functions**:
- Distributed data structure
- Automatic peer-to-peer replication
- Event-driven updates
- Conflict-free data sync

**Implementation** (`src/utils/orbitdb.js`):
```javascript
- setup(): Initializes IPFS + OrbitDB
- sendMessage(): Adds encrypted block to chain
- getMessages(): Retrieves message history
- getDBAddress(): Returns shareable DB address
```

### 5. Cryptography Layer

**Encryption**: AES-256 (Symmetric)

**Key Derivation**: Wallet address as encryption key

**Hashing**: SHA-256 for block integrity

**Implementation**:
- `src/utils/encryption.js` - AES encryption/decryption
- `src/utils/hashUtils.js` - Hash generation and validation

## Data Flow

### Sending a Message

```
User Input
    ↓
[1] Encrypt with AES-256 (key: wallet address)
    ↓
[2] Generate hash (encrypted + timestamp + previousHash)
    ↓
[3] Sign hash with MetaMask (wallet signature)
    ↓
[4] Create message block {
      sender: address,
      encrypted: ciphertext,
      timestamp: ISO string,
      previousHash: string,
      hash: SHA-256,
      signature: hex string
    }
    ↓
[5] Add to OrbitDB log database
    ↓
[6] IPFS stores block content (CID generated)
    ↓
[7] IPFS PubSub broadcasts to peers
    ↓
[8] OrbitDB replicates to connected nodes
```

### Receiving a Message

```
IPFS PubSub receives message
    ↓
OrbitDB 'replicated' event fires
    ↓
[1] Retrieve all messages from DB
    ↓
[2] Validate each block's hash
    ↓
[3] Verify chain linkage (previousHash)
    ↓
[4] Decrypt with wallet address
    ↓
[5] Update UI with decrypted messages
```

## Message Block Structure

```javascript
{
  sender: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  encrypted: "U2FsdGVkX1+vupppZksvRf5pq5g5XjFRIipRkwB0K1Y=",
  timestamp: "2025-10-27T12:34:56.789Z",
  previousHash: "a1b2c3d4e5f6...",
  hash: "e5f6a7b8c9d0...",
  signature: "0x8f3c2a1b9e7d..."
}
```

## Security Model

### Encryption Strategy

1. **End-to-End Encryption**
   - Messages encrypted client-side before transmission
   - Only sender's wallet can decrypt (symmetric key)
   - No plaintext ever leaves browser

2. **Key Management**
   - Encryption key = wallet address (deterministic)
   - No key exchange protocol needed
   - Keys never stored or transmitted

3. **Signature Authentication**
   - Each message signed with MetaMask
   - Signature proves message authorship
   - Cannot be forged without private key

### Integrity Protection

1. **Hash Chaining**
   - Each block references previous block's hash
   - Forms immutable chain structure
   - Tampering breaks chain validation

2. **Content Addressing (IPFS)**
   - Content identified by cryptographic hash (CID)
   - Changes to content change CID
   - Ensures data integrity

### Threat Model

**Protected Against**:
- ✅ Message tampering (hash chain validation)
- ✅ Impersonation (signature verification)
- ✅ Eavesdropping (AES-256 encryption)
- ✅ Censorship (decentralized storage)
- ✅ Single point of failure (P2P replication)

**Not Protected Against**:
- ❌ Wallet compromise (private key theft)
- ❌ Client-side malware (browser compromise)
- ❌ Weak encryption keys (predictable addresses)
- ❌ Metadata analysis (sender/timestamp visible)

## Network Architecture

### Peer Discovery

```
Browser Client
    ↓
IPFS Node (js-ipfs)
    ↓
WebRTC-STAR Signaling Servers
    ↓
Bootstrap Nodes
    ↓
DHT (Distributed Hash Table)
    ↓
Connected Peers
```

### Data Replication

```
OrbitDB Database
    ↓
IPFS Log (CRDT)
    ↓
IPFS PubSub Topic
    ↓
All Subscribed Peers
    ↓
Local Database Sync
```

## Performance Considerations

### Initialization Time
- IPFS node startup: ~10-30 seconds
- OrbitDB creation: ~2-5 seconds
- Peer discovery: ~10-60 seconds (variable)

### Message Latency
- Local write: <100ms
- P2P propagation: 1-10 seconds (depends on peers)
- UI update: <50ms

### Storage
- Browser IndexedDB for OrbitDB
- IPFS repo in browser storage
- Garbage collection for old content

## Scalability

### Current Limitations
- Browser-based IPFS (limited resources)
- WebRTC connection limits (~100 peers)
- OrbitDB log grows infinitely
- No message pagination

### Future Improvements
- Message pruning/archival
- Sharded databases (multiple logs)
- Hybrid storage (browser + gateway)
- Optimistic UI updates

## Development Guidelines

### Adding New Features

1. **Maintain Decentralization**
   - No central servers
   - No API keys or auth tokens
   - Client-side only logic

2. **Preserve Security**
   - Encrypt sensitive data
   - Validate all inputs
   - Verify signatures

3. **Follow Design System**
   - Use theme.js for colors
   - Use animations.css for effects
   - Maintain Aston Martin aesthetic

### Testing Strategy

1. **Unit Tests**: Cryptography functions
2. **Integration Tests**: OrbitDB + IPFS
3. **E2E Tests**: Full message flow
4. **Security Audits**: Encryption implementation

## Deployment Considerations

### Static Hosting (Recommended)
- Vercel, Netlify, GitHub Pages
- No backend required
- Automatic HTTPS
- CDN distribution

### Environment Variables
- Optional IPFS gateway configuration
- Custom OrbitDB database names
- Bootstrap node addresses

### Browser Compatibility
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ⚠️ Limited (WebRTC issues)
- Mobile browsers: ⚠️ Resource constraints

## Monitoring & Debugging

### Browser Console Logs
- IPFS initialization status
- OrbitDB replication events
- Message encryption/decryption
- Peer connection changes

### DevTools Network Tab
- WebRTC connections
- IPFS HTTP API calls (if gateway used)
- WebSocket connections (signaling)

### Status Panel
- Connected peer count
- Sync status (writing/synced/idle)
- Database address
- Node ID

## Future Architecture

### Planned Enhancements
1. **Hybrid Storage**: Browser + IPFS gateway
2. **Message Search**: Full-text indexing
3. **File Attachments**: IPFS CID references
4. **Group Chat**: Shared encryption keys
5. **Voice/Video**: WebRTC P2P calls
6. **Mobile Apps**: React Native + IPFS mobile

### Potential Integrations
- ENS (Ethereum Name Service) for usernames
- IPNS (Inter-Planetary Name System) for updates
- libp2p direct for improved P2P
- Gun.js for additional sync layer
- Ceramic for user profiles

---

**Last Updated**: October 27, 2025
**Version**: 1.0.0
**Authors**: ChainText Team
