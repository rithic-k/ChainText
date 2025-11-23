# ⛓️ ChainText

**Decentralized Encrypted Messaging on IPFS**

ChainText is a fully decentralized messaging application that combines blockchain technology, end-to-end encryption, and peer-to-peer networking to create a secure, censorship-resistant communication platform.

![ChainText Banner](https://img.shields.io/badge/Web3-Decentralized-gold?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

## ✨ Features

### 🔐 Security First
- **AES-256 Encryption**: All messages are encrypted end-to-end using industry-standard encryption
- **Blockchain Signed**: Every message is cryptographically signed with MetaMask
- **Hash Chaining**: Messages form a tamper-proof blockchain with hash verification
- **Client-Side Only**: All encryption and signing happens in your browser

### 🌐 Fully Decentralized
- **IPFS Storage**: Messages stored on the InterPlanetary File System
- **OrbitDB**: Distributed database with automatic peer-to-peer replication
- **No Backend**: Zero centralized servers required
- **Peer-to-Peer Sync**: Real-time message synchronization using IPFS PubSub

### 🎨 Luxury Design
- **Aston Martin Aesthetic**: Cinematic retro design with elegant typography
- **Glassmorphism UI**: Modern frosted glass effects with smooth animations
- **Framer Motion**: Buttery smooth transitions and micro-interactions
- **Responsive Layout**: Works beautifully on desktop and mobile

## 🚀 Getting Started

### Prerequisites

- **Node.js** 16.x or higher
- **MetaMask** browser extension
- **Modern browser** with Web3 support

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/chaintext.git
   cd chaintext
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

5. **Connect MetaMask**
   - Click "Connect MetaMask" button
   - Approve the connection request
   - Start messaging!

## 📦 Project Structure

```
chaintext/
├── pages/
│   ├── _app.js              # Global app configuration
│   ├── _document.js         # HTML document structure
│   └── index.js             # Main app page
├── src/
│   ├── components/
│   │   ├── ChatBubble.jsx       # Message bubble component
│   │   ├── MessageInput.jsx     # Message input field
│   │   ├── MessageTimeline.jsx  # Message display area
│   │   ├── OrbitStatus.jsx      # Network status panel
│   │   └── WalletConnect.jsx    # MetaMask connection
│   ├── styles/
│   │   ├── animations.css       # Cinematic animations
│   │   ├── globals.css          # Global styles
│   │   └── theme.js             # Design system
│   └── utils/
│       ├── blockchain.js        # Block creation & verification
│       ├── encryption.js        # AES-256 encryption
│       ├── hashUtils.js         # SHA-256 hashing
│       ├── ipfs.js              # IPFS node management
│       └── orbitdb.js           # OrbitDB setup & messaging
├── next.config.js           # Next.js configuration
├── package.json             # Dependencies
└── README.md               # This file
```

## 🧠 How It Works

### Message Flow

1. **User writes a message** in the input field
2. **Message is encrypted** using AES-256 with user's wallet address as key
3. **Hash is generated** from encrypted content + timestamp + previous message hash
4. **Message is signed** with MetaMask (wallet signature of the hash)
5. **Block is created** with sender, encrypted content, timestamp, hash, and signature
6. **Block is stored** in OrbitDB (IPFS-based distributed database)
7. **Message replicates** to all connected peers via IPFS PubSub
8. **Recipients decrypt** messages using their wallet address

### Architecture

```
┌─────────────┐
│   Browser   │
│   Client    │
└──────┬──────┘
       │
       ├─── MetaMask (Wallet & Signing)
       │
       ├─── IPFS Node (Local)
       │     └─── PubSub (P2P Communication)
       │
       └─── OrbitDB (Distributed Database)
             └─── Message Log (Blockchain-like Chain)
```

## 🔧 Configuration

### Environment Variables (Optional)

Create a `.env.local` file for custom configuration:

```env
# IPFS Configuration
NEXT_PUBLIC_IPFS_GATEWAY=https://ipfs.io
NEXT_PUBLIC_IPFS_REPO=chaintext-ipfs

# OrbitDB Configuration
NEXT_PUBLIC_ORBITDB_NAME=chaintext-messages
```

## 🎨 Design System

### Color Palette

- **Deep Charcoal**: `#1C1C1C` - Primary background
- **Brushed Silver**: `#C0C0C0` - Secondary text
- **Accent Gold**: `#D4AF37` - Interactive elements
- **Rich Black**: `#0A0A0A` - Deep backgrounds
- **Platinum**: `#E5E5E5` - Primary text

### Typography

- **Headings**: Playfair Display / Cormorant Garamond
- **Body**: Inter / Helvetica Neue
- **Code**: Fira Code / Courier New

## 📱 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/chaintext)

1. Push your code to GitHub
2. Import project in Vercel
3. Deploy with default settings
4. Your app is live!

### Deploy to Netlify

```bash
npm run build
netlify deploy --prod --dir=.next
```

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Tech Stack

- **Framework**: Next.js 14
- **Language**: JavaScript (React)
- **Styling**: CSS-in-JS
- **Animations**: Framer Motion
- **Blockchain**: Ethers.js + MetaMask
- **Storage**: IPFS (ipfs-core)
- **Database**: OrbitDB
- **Encryption**: crypto-js (AES-256)

## 🔒 Security Considerations

- **Encryption keys** are derived from wallet addresses and never leave your device
- **Private keys** remain in MetaMask and are never exposed
- **Messages** are encrypted client-side before being sent to IPFS
- **Signatures** prove message authenticity without revealing private keys
- **Hash chain** ensures message integrity and prevents tampering

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **IPFS** for decentralized storage
- **OrbitDB** for distributed databases
- **MetaMask** for wallet integration
- **Ethers.js** for Web3 functionality
- **Framer Motion** for smooth animations

## 🗺️ Roadmap

- [ ] Group messaging with shared encryption keys
- [ ] Message reactions and threading
- [ ] File attachments (images, documents)
- [ ] Voice messages
- [ ] Video calls (WebRTC)
- [ ] Mobile app (React Native)
- [ ] Desktop app (Electron)
- [ ] Message search and filtering
- [ ] Custom encryption key management
- [ ] Multi-wallet support



⛓️ **ChainText** - Because your conversations belong to you.
