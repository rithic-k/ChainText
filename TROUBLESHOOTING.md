# ChainText Troubleshooting Guide

Common issues and solutions for ChainText development and deployment.

## 🔧 Installation Issues

### Issue: `npm install` fails

**Symptoms:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solutions:**

1. **Use legacy peer deps:**
   ```powershell
   npm install --legacy-peer-deps
   ```

2. **Clear npm cache:**
   ```powershell
   npm cache clean --force
   npm install
   ```

3. **Delete node_modules and retry:**
   ```powershell
   Remove-Item -Recurse -Force node_modules
   Remove-Item package-lock.json
   npm install
   ```

4. **Update Node.js:**
   - Download latest LTS from nodejs.org
   - Minimum required: Node.js 16.x

---

### Issue: Module not found errors

**Symptoms:**
```
Module not found: Can't resolve 'ipfs-core'
```

**Solutions:**

1. **Verify installation:**
   ```powershell
   npm list ipfs-core orbit-db ethers crypto-js
   ```

2. **Reinstall specific package:**
   ```powershell
   npm install ipfs-core@0.18.1
   ```

3. **Check next.config.js:**
   - Ensure webpack fallbacks are configured
   - See `next.config.js` for required settings

---

## 🌐 IPFS Issues

### Issue: IPFS node fails to start

**Symptoms:**
```
Error: IPFS initialization failed
Failed to create IPFS node
```

**Solutions:**

1. **Check browser console:**
   - Open DevTools (F12)
   - Look for specific error messages

2. **Clear IPFS repo:**
   ```javascript
   // In browser console
   indexedDB.deleteDatabase('chaintext-ipfs')
   // Then refresh page
   ```

3. **Try different IPFS repo name:**
   ```javascript
   // In src/utils/ipfs.js, change:
   repo: 'chaintext-ipfs-v2'
   ```

4. **Disable browser extensions:**
   - Some privacy extensions block WebRTC
   - Try in incognito mode

---

### Issue: No peers connecting

**Symptoms:**
- Peer count stays at 0
- Messages don't sync

**Solutions:**

1. **Wait for peer discovery:**
   - Can take 30-60 seconds initially
   - Check "Show Status" panel

2. **Check bootstrap nodes:**
   ```javascript
   // In browser console
   const peers = await ipfs.swarm.peers()
   console.log(peers)
   ```

3. **Manually connect to peer:**
   ```javascript
   await ipfs.swarm.connect('/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star')
   ```

4. **Check firewall:**
   - Ensure WebRTC isn't blocked
   - Check browser WebRTC settings

---

## 🗄️ OrbitDB Issues

### Issue: Database doesn't load

**Symptoms:**
```
Error: Cannot open database
OrbitDB initialization failed
```

**Solutions:**

1. **Clear OrbitDB data:**
   ```javascript
   // In browser console
   indexedDB.deleteDatabase('.orbitdb')
   ```

2. **Check IPFS node:**
   - Ensure IPFS is initialized first
   - OrbitDB requires working IPFS node

3. **Verify database access:**
   ```javascript
   // Check database address
   console.log(db.address.toString())
   ```

---

### Issue: Messages not replicating

**Symptoms:**
- Messages send but don't appear for others
- "replicated" event never fires

**Solutions:**

1. **Check peer connections:**
   ```javascript
   const peers = await ipfs.swarm.peers()
   console.log('Connected peers:', peers.length)
   ```

2. **Verify OrbitDB events:**
   ```javascript
   db.events.on('replicated', () => {
     console.log('Replication working!')
   })
   ```

3. **Use same database address:**
   - Both peers must use same DB name
   - Share database address: `db.address.toString()`

4. **Check network connectivity:**
   - Both peers need internet
   - WebRTC may require TURN server for some networks

---

## 🦊 MetaMask Issues

### Issue: "MetaMask not detected"

**Solutions:**

1. **Install MetaMask:**
   - Download from metamask.io
   - Restart browser after installation

2. **Check window.ethereum:**
   ```javascript
   console.log(window.ethereum)
   // Should return object, not undefined
   ```

3. **Try different browser:**
   - MetaMask works best on Chrome/Firefox
   - Some browsers don't support extensions

---

### Issue: "User rejected request"

**Symptoms:**
- Connection fails
- Signature fails

**Solutions:**

1. **User must approve:**
   - Check MetaMask popup (may be hidden)
   - Click "Connect" or "Sign"

2. **Check MetaMask locked:**
   - Unlock MetaMask wallet
   - Enter password if prompted

3. **Network issues:**
   - Switch to different Ethereum network
   - Try Mainnet, Sepolia, or Polygon

---

### Issue: Can't decrypt messages

**Symptoms:**
- Messages show "[Unable to decrypt]"
- Decryption error in console

**Solutions:**

1. **Wrong wallet:**
   - Must use same wallet that sent message
   - Encryption key = wallet address

2. **Check wallet address:**
   ```javascript
   console.log('Current:', walletAddress)
   console.log('Message sender:', message.sender)
   ```

3. **Message corrupted:**
   - Check message.encrypted exists
   - Verify not empty string

---

## 🎨 UI/Styling Issues

### Issue: Styles not loading

**Symptoms:**
- No colors
- Plain text appearance
- Missing animations

**Solutions:**

1. **Check CSS imports in _app.js:**
   ```javascript
   import '../src/styles/globals.css';
   import '../src/styles/animations.css';
   ```

2. **Clear Next.js cache:**
   ```powershell
   Remove-Item -Recurse -Force .next
   npm run dev
   ```

3. **Check Google Fonts:**
   - Fonts load from Google Fonts CDN
   - Check internet connection

---

### Issue: Animations not working

**Solutions:**

1. **Check Framer Motion:**
   ```powershell
   npm list framer-motion
   ```

2. **Verify CSS classes:**
   - Animations use CSS classes
   - Check animations.css is loaded

3. **Browser compatibility:**
   - Some older browsers don't support animations
   - Update browser to latest version

---

## 🚀 Build/Deployment Issues

### Issue: Build fails

**Symptoms:**
```
Error: Build failed
next build failing
```

**Solutions:**

1. **Check for errors:**
   ```powershell
   npm run lint
   ```

2. **Clear cache and rebuild:**
   ```powershell
   Remove-Item -Recurse -Force .next
   npm run build
   ```

3. **Check Node version:**
   ```powershell
   node --version
   # Should be 16.x or higher
   ```

---

### Issue: Vercel deployment fails

**Solutions:**

1. **Check build logs:**
   - Review Vercel deployment logs
   - Look for specific errors

2. **Verify next.config.js:**
   - Ensure webpack config is correct
   - Check fallbacks for IPFS modules

3. **Environment variables:**
   - Add any needed env vars in Vercel dashboard
   - Check .env.local is in .gitignore

4. **Build settings:**
   - Build command: `npm run build`
   - Output directory: `.next`
   - Install command: `npm install`

---

## 🔐 Security Issues

### Issue: Signature verification fails

**Solutions:**

1. **Check signature format:**
   ```javascript
   console.log('Signature:', message.signature)
   // Should start with 0x
   ```

2. **Verify message hash:**
   ```javascript
   const expectedHash = generateHash(
     message.encrypted,
     message.timestamp,
     message.previousHash
   )
   console.log('Expected:', expectedHash)
   console.log('Actual:', message.hash)
   ```

3. **Check ethers.js version:**
   - Must be v5.7.2 or compatible
   - Signature format changed in v6

---

### Issue: Hash chain validation fails

**Solutions:**

1. **Check chain order:**
   - Messages must be in chronological order
   - Each previousHash must match previous message

2. **Validate individual blocks:**
   ```javascript
   messages.forEach((msg, i) => {
     const valid = validateBlock(msg)
     console.log(`Block ${i} valid:`, valid)
   })
   ```

3. **Check for corrupted data:**
   - Clear OrbitDB and restart
   - Rebuild message chain

---

## 📱 Mobile Issues

### Issue: App not responsive on mobile

**Solutions:**

1. **Check viewport meta tag:**
   - Should be in _app.js or _document.js
   - Verify: `<meta name="viewport" content="width=device-width, initial-scale=1">`

2. **Test responsive styles:**
   - Use browser DevTools
   - Toggle device emulation

3. **Check CSS media queries:**
   - Styles should adapt to small screens
   - Test different viewport sizes

---

### Issue: MetaMask mobile issues

**Solutions:**

1. **Use MetaMask browser:**
   - Open site in MetaMask app's browser
   - Don't use external mobile browser

2. **Check mobile wallet support:**
   - WalletConnect integration (coming soon)
   - For now, desktop recommended

---

## 🐛 General Debugging

### Enable verbose logging

Add to top of any file:
```javascript
const DEBUG = true;
const log = (...args) => DEBUG && console.log('[ChainText]', ...args);
```

### Check browser console

1. Open DevTools (F12)
2. Go to Console tab
3. Look for errors (red text)
4. Check warnings (yellow text)

### Network tab

1. Open DevTools → Network
2. Filter by WS (WebSocket)
3. Check WebRTC connections
4. Look for failed requests

### React DevTools

1. Install React DevTools extension
2. Inspect component props/state
3. Check component hierarchy

---

## 🆘 Still Having Issues?

### Get Help

1. **Check documentation:**
   - README.md
   - ARCHITECTURE.md
   - API.md

2. **Search existing issues:**
   - GitHub Issues
   - Discussions

3. **Create new issue:**
   - Describe problem clearly
   - Include error messages
   - Share browser/OS info
   - Provide reproduction steps

4. **Community support:**
   - Discord (coming soon)
   - Twitter: @ChainTextApp

---

## 📋 Debug Checklist

Before asking for help, verify:

- [ ] Node.js 16+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] MetaMask installed and unlocked
- [ ] Browser console checked for errors
- [ ] Network tab checked for failed requests
- [ ] IPFS node initialized successfully
- [ ] OrbitDB database opened
- [ ] Wallet connected properly
- [ ] Internet connection working
- [ ] No firewall blocking WebRTC
- [ ] Tried in incognito mode
- [ ] Cleared browser cache
- [ ] Restarted dev server

---

## 🔄 Common Fixes

### The "Turn It Off and On Again" Approach

1. **Restart dev server:**
   ```powershell
   # Press Ctrl+C to stop
   npm run dev
   ```

2. **Restart browser:**
   - Close all tabs
   - Reopen browser
   - Try again

3. **Clear all data:**
   ```powershell
   Remove-Item -Recurse -Force .next
   Remove-Item -Recurse -Force node_modules
   npm install
   npm run dev
   ```

4. **Fresh start:**
   ```javascript
   // In browser console:
   indexedDB.deleteDatabase('chaintext-ipfs')
   indexedDB.deleteDatabase('.orbitdb')
   // Refresh page
   ```

---

**Last Updated:** October 27, 2025  
**Version:** 1.0.0

Need more help? Open an issue on GitHub! 🚀
