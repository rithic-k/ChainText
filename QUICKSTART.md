# ChainText - Quick Start Guide

## 🚀 Installation & Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Open Browser
Navigate to `http://localhost:3000`

## 🔐 First Time Setup

1. **Install MetaMask**
   - Download from [metamask.io](https://metamask.io)
   - Create or import a wallet
   - Make sure you're on any Ethereum network (Mainnet, Sepolia, etc.)

2. **Connect Wallet**
   - Click "Connect MetaMask" in ChainText
   - Approve the connection request
   - Your wallet address will appear in the header

3. **Wait for Initialization**
   - IPFS node will start (takes ~10-30 seconds)
   - OrbitDB database will initialize
   - Status indicator will show "Ready"

4. **Start Messaging**
   - Type your message in the input field
   - Click "Send" or press Enter
   - Message will be encrypted, signed, and stored on IPFS

## 🧪 Testing

### Local Testing
1. Open two browser windows/tabs
2. Connect different MetaMask accounts in each
3. Send messages between accounts
4. Messages will sync automatically via IPFS

### Network Testing
1. Share your IPFS node ID with friends
2. Connect using `ipfs.swarm.connect()`
3. Messages will replicate across peers

## 🐛 Troubleshooting

### "MetaMask not installed"
- Install MetaMask browser extension
- Reload the page

### "Failed to initialize OrbitDB"
- Check browser console for errors
- Try clearing browser cache
- Ensure port 3000 is available

### "Messages not syncing"
- Check network status (click "Show Status")
- Verify peer connections
- IPFS may take time to discover peers

### "Cannot decrypt message"
- Ensure you're using the same wallet that encrypted the message
- Messages are encrypted with sender's wallet address

## 📦 Building for Production

```bash
npm run build
npm run start
```

## 🌐 Deployment

### Vercel (Recommended)
```bash
vercel
```

### Netlify
```bash
npm run build
netlify deploy --prod
```

## 💡 Tips

- **Keep MetaMask Connected**: App works best with persistent wallet connection
- **Wait for Sync**: Initial IPFS connection may take 30 seconds
- **Check Status Panel**: Monitor peer count and sync status
- **Message Persistence**: Messages are stored in OrbitDB and persist across sessions
- **Security**: Never share your MetaMask seed phrase

## 🔗 Useful Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint code
npm run lint

# Format code
npm run format
```

## 📚 Learn More

- [IPFS Documentation](https://docs.ipfs.io)
- [OrbitDB Guide](https://github.com/orbitdb/orbit-db)
- [MetaMask Docs](https://docs.metamask.io)
- [Ethers.js Documentation](https://docs.ethers.io)

---

Need help? Check our [full README](./README.md) or open an issue on GitHub!
