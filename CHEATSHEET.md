# ChainText Quick Reference & Cheat Sheet

## 🚀 Getting Started (3 Steps)

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser
# → http://localhost:3000
```

## 📋 Essential Commands

```bash
# Development
npm run dev              # Start dev server (hot reload)
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Check code quality

# Package Management
npm install              # Install all dependencies
npm install [package]    # Add new package
npm update              # Update dependencies
npm audit fix           # Fix security issues

# Git
git status              # Check status
git add .               # Stage all changes
git commit -m "msg"     # Commit changes
git push                # Push to remote

# Deployment (Vercel)
npm i -g vercel         # Install Vercel CLI
vercel                  # Deploy to Vercel
```

## 🔑 Key Files Quick Access

| File | Purpose | Edit For |
|------|---------|----------|
| `pages/index.js` | Main app | Core functionality |
| `src/utils/orbitdb.js` | Messaging | IPFS/OrbitDB config |
| `src/styles/theme.js` | Design | Colors, fonts |
| `src/components/*.jsx` | UI | Component changes |
| `next.config.js` | Build | Webpack settings |
| `package.json` | Dependencies | Add/remove packages |

## 🎨 Theme Quick Reference

### Colors
```javascript
// From src/styles/theme.js
deepCharcoal:  '#1C1C1C'  // Main background
brushedSilver: '#C0C0C0'  // Text
accentGold:    '#D4AF37'  // Highlights
richBlack:     '#0A0A0A'  // Deep bg
platinum:      '#E5E5E5'  // Light text
```

### Fonts
```css
/* Headings */
font-family: 'Playfair Display', serif;

/* Body */
font-family: 'Inter', sans-serif;

/* Code */
font-family: 'Fira Code', monospace;
```

### CSS Classes
```css
.glass             /* Light glass effect */
.glass-dark        /* Dark glass effect */
.glass-gold        /* Gold tinted glass */
.float             /* Floating animation */
.fade-in-up        /* Fade in from bottom */
.glow-pulse        /* Glowing pulse */
.text-gold-gradient /* Gold gradient text */
```

## 📦 Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| next | ^14.0.3 | React framework |
| react | ^18.2.0 | UI library |
| ipfs-core | ^0.18.1 | IPFS node |
| orbit-db | ^0.29.0 | Distributed DB |
| ethers | ^5.7.2 | Web3/MetaMask |
| crypto-js | ^4.2.0 | Encryption |
| framer-motion | ^10.16.4 | Animations |

## 🔧 Common Code Snippets

### Connect to MetaMask
```javascript
import { ethers } from 'ethers';

const provider = new ethers.providers.Web3Provider(window.ethereum);
await provider.send('eth_requestAccounts', []);
const signer = provider.getSigner();
const address = await signer.getAddress();
```

### Encrypt Message
```javascript
import { encryptMessage } from './utils/encryption';

const encrypted = encryptMessage(plainText, walletAddress);
```

### Create Message Block
```javascript
import { createBlock } from './utils/blockchain';

const block = await createBlock(message, previousHash, signer);
```

### Initialize OrbitDB
```javascript
import { setup } from './utils/orbitdb';

const system = await setup((messages) => {
  setMessages(messages);
});
```

### Send Message
```javascript
const previousHash = messages.length > 0 
  ? messages[messages.length - 1].hash 
  : '';

await system.sendMessage(messageText, previousHash);
```

## 🐛 Quick Troubleshooting

| Issue | Quick Fix |
|-------|-----------|
| Install fails | `npm install --legacy-peer-deps` |
| MetaMask not found | Install extension, refresh page |
| IPFS won't start | Clear browser data, try incognito |
| No peers connecting | Wait 30-60 seconds for discovery |
| Build fails | Delete `.next`, run `npm run build` |
| Messages won't decrypt | Check wallet address matches |

## 📊 Browser Console Commands

```javascript
// Check IPFS status
await ipfs.id()

// Get connected peers
await ipfs.swarm.peers()

// Get all messages
db.iterator({ limit: -1 }).collect()

// Get database address
db.address.toString()

// Clear IPFS data
indexedDB.deleteDatabase('chaintext-ipfs')

// Clear OrbitDB data
indexedDB.deleteDatabase('.orbitdb')
```

## 🎯 Component Props Cheat Sheet

### WalletConnect
```jsx
<WalletConnect
  onConnect={(address, signer) => {...}}
  connected={boolean}
  address={string}
/>
```

### MessageInput
```jsx
<MessageInput
  onSend={async (text) => {...}}
  disabled={boolean}
  connected={boolean}
/>
```

### ChatBubble
```jsx
<ChatBubble
  message={messageBlock}
  currentUser={walletAddress}
  index={number}
/>
```

### MessageTimeline
```jsx
<MessageTimeline
  messages={array}
  currentUser={walletAddress}
/>
```

### OrbitStatus
```jsx
<OrbitStatus
  ipfs={ipfsInstance}
  db={orbitDBInstance}
  isInitialized={boolean}
/>
```

## 🔐 Security Checklist

- [ ] Messages encrypted with AES-256
- [ ] Signatures verified with ethers.js
- [ ] Hash chain validated
- [ ] Client-side encryption only
- [ ] No private keys in code
- [ ] MetaMask for all signing
- [ ] Validate all user inputs
- [ ] Sanitize displayed content

## 📱 Responsive Breakpoints

```javascript
// From theme.js
xs:  '320px'   // Small phones
sm:  '640px'   // Phones
md:  '768px'   // Tablets
lg:  '1024px'  // Desktops
xl:  '1280px'  // Large desktops
2xl: '1536px'  // Extra large
```

## 🚢 Deployment Checklist

- [ ] Run `npm run build` successfully
- [ ] Test production build locally
- [ ] Update environment variables
- [ ] Check next.config.js settings
- [ ] Verify MetaMask integration works
- [ ] Test on multiple browsers
- [ ] Check mobile responsiveness
- [ ] Review console for errors
- [ ] Update README with live URL
- [ ] Tag release in git

## 📚 Documentation Quick Links

```
Getting Started:     README.md
Quick Setup:         QUICKSTART.md
System Design:       ARCHITECTURE.md
API Reference:       API.md
Troubleshooting:     TROUBLESHOOTING.md
Contributing:        CONTRIBUTING.md
Security:            SECURITY.md
Changes:             CHANGELOG.md
File Structure:      DIRECTORY.md
This File:           CHEATSHEET.md
```

## 💡 Pro Tips

1. **Fast Refresh**: Save files to see changes instantly
2. **Browser DevTools**: F12 for console and debugging
3. **React DevTools**: Install extension for component inspection
4. **IPFS Status**: Use OrbitStatus component to monitor
5. **Clear Cache**: When in doubt, clear browser cache
6. **Incognito Mode**: Test without extensions
7. **Two Windows**: Test P2P with different accounts
8. **Genesis Block**: First message has empty previousHash

## 🎨 Quick Style Guide

```jsx
// Inline styles (preferred in this project)
const styles = {
  container: {
    padding: '1rem',
    background: '#1C1C1C',
    borderRadius: '1rem',
  },
};

// Using theme
import { theme } from '../styles/theme';

style={{
  color: theme.colors.accentGold,
  fontSize: theme.typography.fontSize.lg,
}}

// Framer Motion
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
```

## ⚡ Performance Tips

1. Lazy load components with `dynamic()`
2. Optimize images (Next.js Image component)
3. Minimize IPFS repo size
4. Use OrbitDB query limits
5. Debounce user inputs
6. Memoize expensive calculations
7. Virtual scrolling for long lists

## 🔗 Useful Links

- **IPFS Docs**: https://docs.ipfs.io
- **OrbitDB Guide**: https://github.com/orbitdb/orbit-db
- **Next.js Docs**: https://nextjs.org/docs
- **MetaMask Docs**: https://docs.metamask.io
- **Ethers.js Docs**: https://docs.ethers.io
- **Framer Motion**: https://www.framer.com/motion

## 🎓 Learning Resources

- IPFS Basics: Understand distributed storage
- Web3 Fundamentals: Learn blockchain concepts
- React Hooks: Master useState, useEffect
- Async/Await: Handle promises properly
- Cryptography: Understand encryption basics

---

**Keep this cheat sheet handy!** 📌

Press `Ctrl+F` to search for specific topics.

Last Updated: October 27, 2025 | Version: 1.0.0
