# ChainText Directory Structure

```
chaintext/
│
├── 📦 Configuration & Setup
│   ├── package.json                    # Project dependencies and scripts
│   ├── package-lock.json               # Locked dependency versions
│   ├── next.config.js                  # Next.js configuration
│   ├── jsconfig.json                   # JavaScript compiler options
│   ├── .eslintrc.json                  # ESLint code quality rules
│   ├── .prettierrc                     # Prettier formatting rules
│   ├── .gitignore                      # Git ignore patterns
│   └── LICENSE                         # MIT License
│
├── 🌐 Pages (Next.js Routing)
│   ├── _app.js                         # Global app wrapper
│   │                                   # - Imports global styles
│   │                                   # - Loads Google Fonts
│   │                                   # - Wraps all pages
│   │
│   ├── _document.js                    # HTML document structure
│   │                                   # - Custom <html> and <body>
│   │                                   # - Meta tags
│   │
│   └── index.js                        # Main application page
│                                       # - Wallet connection
│                                       # - IPFS/OrbitDB initialization
│                                       # - Message timeline
│                                       # - Message input
│                                       # - Network status
│
├── 🧩 React Components
│   └── src/components/
│       │
│       ├── WalletConnect.jsx           # MetaMask Integration
│       │   ├── Connect/disconnect wallet
│       │   ├── Display wallet address
│       │   ├── Handle account changes
│       │   └── Error handling
│       │
│       ├── MessageInput.jsx            # Message Composition
│       │   ├── Text input field
│       │   ├── Character counter
│       │   ├── Encryption indicator
│       │   ├── Send button
│       │   └── Keyboard shortcuts
│       │
│       ├── ChatBubble.jsx              # Individual Message Display
│       │   ├── Decrypt message
│       │   ├── Show sender info
│       │   ├── Display timestamp
│       │   ├── Security indicators
│       │   └── Expandable block details
│       │
│       ├── MessageTimeline.jsx         # Message List
│       │   ├── Display all messages
│       │   ├── Genesis block indicator
│       │   ├── Chain visualization
│       │   ├── Auto-scroll
│       │   └── Empty state
│       │
│       └── OrbitStatus.jsx             # Network Dashboard
│           ├── Peer count
│           ├── Sync status
│           ├── Database address
│           ├── Node ID
│           └── Connection indicators
│
├── 🔧 Utility Functions
│   └── src/utils/
│       │
│       ├── encryption.js               # AES-256 Encryption
│       │   ├── encryptMessage()        # Encrypt with wallet key
│       │   └── decryptMessage()        # Decrypt with wallet key
│       │
│       ├── hashUtils.js                # SHA-256 Hashing
│       │   ├── generateHash()          # Create block hash
│       │   ├── validateBlock()         # Verify single block
│       │   └── validateChain()         # Verify entire chain
│       │
│       ├── blockchain.js               # Blockchain Logic
│       │   ├── createBlock()           # Create signed block
│       │   ├── verifySignature()       # Verify MetaMask signature
│       │   └── getGenesisBlock()       # Get chain origin
│       │
│       ├── ipfs.js                     # IPFS Management
│       │   ├── createIPFSNode()        # Initialize IPFS
│       │   ├── connectToPeer()         # Manual peer connection
│       │   └── getPeers()              # Get peer list
│       │
│       └── orbitdb.js                  # OrbitDB Setup
│           ├── setup()                 # Main initialization
│           ├── sendMessage()           # Add message to DB
│           ├── getMessages()           # Retrieve all messages
│           ├── getDBAddress()          # Get shareable address
│           ├── getPeerCount()          # Get peer count
│           └── shutdown()              # Clean shutdown
│
├── 🎨 Styling
│   └── src/styles/
│       │
│       ├── theme.js                    # Design System
│       │   ├── Colors (Aston Martin palette)
│       │   ├── Typography (Playfair, Inter, Fira)
│       │   ├── Spacing scale
│       │   ├── Border radius
│       │   ├── Shadows
│       │   ├── Transitions
│       │   └── Breakpoints
│       │
│       ├── globals.css                 # Global Styles
│       │   ├── CSS reset
│       │   ├── Body styles
│       │   ├── Scrollbar customization
│       │   ├── Selection color
│       │   └── Base element styles
│       │
│       └── animations.css              # Cinematic Animations
│           ├── @keyframes float
│           ├── @keyframes fadeInUp
│           ├── @keyframes slideIn
│           ├── @keyframes glowPulse
│           ├── @keyframes shimmer
│           ├── Utility classes
│           ├── Glassmorphism effects
│           └── Hover effects
│
├── 🌍 Public Assets
│   └── public/
│       └── favicon.ico                 # App icon
│
├── 📚 Documentation (Comprehensive!)
│   ├── README.md                       # 🌟 Main Documentation
│   │   ├── Features overview
│   │   ├── Installation guide
│   │   ├── Project structure
│   │   ├── How it works
│   │   ├── Configuration
│   │   ├── Deployment guide
│   │   ├── Development tips
│   │   └── Roadmap
│   │
│   ├── QUICKSTART.md                   # ⚡ Quick Setup
│   │   ├── Installation steps
│   │   ├── First time setup
│   │   ├── Testing guide
│   │   ├── Troubleshooting basics
│   │   └── Useful commands
│   │
│   ├── ARCHITECTURE.md                 # 🏗️ System Design
│   │   ├── Component overview
│   │   ├── Data flow diagrams
│   │   ├── Message block structure
│   │   ├── Security model
│   │   ├── Network architecture
│   │   ├── Performance notes
│   │   └── Future enhancements
│   │
│   ├── API.md                          # 📖 API Reference
│   │   ├── Utility functions
│   │   ├── Component props
│   │   ├── Event handlers
│   │   ├── Type definitions
│   │   ├── Error handling
│   │   └── Best practices
│   │
│   ├── CONTRIBUTING.md                 # 🤝 Contribution Guide
│   │   ├── Code of conduct
│   │   ├── Development setup
│   │   ├── Pull request process
│   │   ├── Code style guide
│   │   ├── Testing checklist
│   │   └── Recognition
│   │
│   ├── SECURITY.md                     # 🔒 Security Policy
│   │   ├── Security model
│   │   ├── Cryptographic details
│   │   ├── Threat model
│   │   ├── Vulnerability reporting
│   │   ├── Security best practices
│   │   └── Dependency security
│   │
│   ├── CHANGELOG.md                    # 📅 Version History
│   │   ├── Release notes
│   │   ├── Breaking changes
│   │   ├── Bug fixes
│   │   ├── Performance improvements
│   │   └── Contributors
│   │
│   ├── TROUBLESHOOTING.md              # 🔧 Problem Solving
│   │   ├── Installation issues
│   │   ├── IPFS problems
│   │   ├── OrbitDB issues
│   │   ├── MetaMask problems
│   │   ├── Build/deployment errors
│   │   └── Debug checklist
│   │
│   ├── PROJECT_SUMMARY.md              # 📊 Project Overview
│   │   ├── Complete file list
│   │   ├── Features implemented
│   │   ├── Getting started
│   │   ├── Design highlights
│   │   ├── Code statistics
│   │   └── Next steps
│   │
│   └── DIRECTORY.md                    # 📂 This file!
│       └── Visual project structure
│
└── 🔨 Generated Directories (after npm install)
    ├── .next/                          # Next.js build output
    │   ├── cache/                      # Build cache
    │   ├── server/                     # Server bundles
    │   └── static/                     # Static assets
    │
    └── node_modules/                   # Dependencies
        ├── ipfs-core/                  # IPFS library
        ├── orbit-db/                   # OrbitDB library
        ├── ethers/                     # Ethereum library
        ├── crypto-js/                  # Encryption library
        ├── framer-motion/              # Animation library
        ├── next/                       # Next.js framework
        ├── react/                      # React library
        └── ... (300+ packages)
```

## 📊 File Statistics

| Category | Count | Lines |
|----------|-------|-------|
| React Components | 5 | ~1,280 |
| Utility Functions | 5 | ~650 |
| Pages | 3 | ~1,150 |
| Styles | 3 | ~380 |
| Documentation | 9 | ~3,500+ |
| Configuration | 8 | ~150 |
| **Total** | **33** | **~7,110+** |

## 🎯 Key Files

### Most Important Files
1. `pages/index.js` - Main application (entry point)
2. `src/utils/orbitdb.js` - Core messaging logic
3. `src/utils/blockchain.js` - Signing and encryption
4. `next.config.js` - Critical webpack config

### Styling Entry Points
1. `src/styles/theme.js` - Design system
2. `src/styles/globals.css` - Base styles
3. `src/styles/animations.css` - Motion effects

### Documentation Entry Points
1. `README.md` - Start here!
2. `QUICKSTART.md` - Quick setup
3. `TROUBLESHOOTING.md` - Fix issues

## 🗂️ Folder Organization

### `/pages`
Next.js pages (routes)
- Each file = route
- `_app.js` = global wrapper
- `_document.js` = HTML template

### `/src/components`
Reusable React components
- Self-contained UI elements
- Props-based configuration
- Styled with inline styles

### `/src/utils`
Utility functions
- Pure functions
- No React dependencies
- Exported for reuse

### `/src/styles`
Global styling
- Theme configuration
- CSS animations
- Global styles

### `/public`
Static assets
- Served at `/`
- No processing
- Directly accessible

## 🔍 Finding Things

### Looking for...

**Encryption logic?**
→ `src/utils/encryption.js`

**Message signing?**
→ `src/utils/blockchain.js`

**IPFS setup?**
→ `src/utils/ipfs.js` or `src/utils/orbitdb.js`

**UI component?**
→ `src/components/[ComponentName].jsx`

**Color definitions?**
→ `src/styles/theme.js`

**Animations?**
→ `src/styles/animations.css`

**Main app?**
→ `pages/index.js`

**Dependencies?**
→ `package.json`

**Build config?**
→ `next.config.js`

**Setup guide?**
→ `README.md` or `QUICKSTART.md`

## 💡 Development Tips

### Working on UI
1. Edit components in `src/components/`
2. Modify colors in `src/styles/theme.js`
3. Add animations in `src/styles/animations.css`

### Working on Logic
1. Utility functions in `src/utils/`
2. Test in browser console
3. No server restart needed (hot reload)

### Working on Docs
1. Edit markdown files in root
2. Follow existing format
3. Update `CHANGELOG.md` for changes

## 🚀 Quick Navigation

```bash
# Install dependencies
npm install

# Start development
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

## 📖 Documentation Map

```
Getting Started → README.md → QUICKSTART.md
    ↓
Having Issues? → TROUBLESHOOTING.md
    ↓
Understanding System → ARCHITECTURE.md
    ↓
Using Functions → API.md
    ↓
Contributing → CONTRIBUTING.md → SECURITY.md
    ↓
Tracking Changes → CHANGELOG.md
```

---

**Last Updated:** October 27, 2025  
**Total Files:** 33+  
**Total Lines:** 7,000+  
**Status:** ✅ Production Ready

Navigate like a pro! 🗺️
