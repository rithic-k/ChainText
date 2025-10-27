# Contributing to ChainText

Thank you for your interest in contributing to ChainText! We welcome contributions from the community.

## 🤝 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and encourage diverse perspectives
- Focus on constructive feedback
- Respect differing viewpoints and experiences

## 🚀 Getting Started

### Prerequisites

- Node.js 16.x or higher
- Git
- MetaMask browser extension
- Basic understanding of React, IPFS, and Web3

### Setting Up Development Environment

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/chaintext.git
   cd chaintext
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   ```
   http://localhost:3000
   ```

## 📝 How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported
2. Use the issue template
3. Include:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - Browser and OS information
   - Console errors

### Suggesting Features

1. Check existing feature requests
2. Describe the feature clearly
3. Explain the use case
4. Discuss alternatives considered
5. Keep it aligned with decentralization principles

### Submitting Pull Requests

1. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make your changes**
   - Follow the code style
   - Add comments where needed
   - Update documentation
   - Test thoroughly

3. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
   
   Use conventional commits:
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation
   - `style:` Formatting
   - `refactor:` Code restructuring
   - `test:` Adding tests
   - `chore:` Maintenance

4. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

5. **Open a Pull Request**
   - Use the PR template
   - Link related issues
   - Describe changes clearly
   - Add screenshots for UI changes

## 💻 Development Guidelines

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons
- Use descriptive variable names
- Comment complex logic

**Example:**
```javascript
// Good
const encryptedMessage = encryptMessage(text, userAddress);

// Bad
const e = encrypt(t, a);
```

### Component Structure

```jsx
// 1. Imports
import { useState } from 'react';
import { motion } from 'framer-motion';

// 2. Component
export default function MyComponent({ prop1, prop2 }) {
  // 3. State
  const [state, setState] = useState(null);
  
  // 4. Effects
  useEffect(() => {
    // ...
  }, []);
  
  // 5. Handlers
  const handleClick = () => {
    // ...
  };
  
  // 6. Render
  return (
    <div style={styles.container}>
      {/* JSX */}
    </div>
  );
}

// 7. Styles
const styles = {
  container: {
    // ...
  },
};
```

### Utility Functions

```javascript
/**
 * Brief description of what the function does
 * @param {type} paramName - Parameter description
 * @returns {type} Return value description
 */
export function myFunction(paramName) {
  // Implementation
}
```

### Git Workflow

```
main (stable)
  └── develop (active development)
       ├── feature/new-feature
       ├── fix/bug-fix
       └── docs/update-readme
```

## 🎨 Design Guidelines

### Colors

Use the theme from `src/styles/theme.js`:
- Deep Charcoal: `#1C1C1C`
- Brushed Silver: `#C0C0C0`
- Accent Gold: `#D4AF37`

### Typography

- Headings: Playfair Display
- Body: Inter
- Code: Fira Code

### Animations

Use classes from `src/styles/animations.css`:
- `float` - Floating animation
- `fade-in-up` - Fade in from bottom
- `glow-pulse` - Glowing pulse effect

### Glassmorphism

Use predefined classes:
- `glass` - Light glass effect
- `glass-dark` - Dark glass effect
- `glass-gold` - Gold tinted glass

## 🧪 Testing

### Manual Testing

1. Test on multiple browsers (Chrome, Firefox, Safari)
2. Test wallet connection/disconnection
3. Test message sending/receiving
4. Test with multiple peers
5. Test error cases

### Testing Checklist

- [ ] Wallet connects successfully
- [ ] Messages encrypt correctly
- [ ] Messages decrypt correctly
- [ ] Signatures verify
- [ ] Hash chain validates
- [ ] IPFS node initializes
- [ ] OrbitDB replicates
- [ ] UI updates on new messages
- [ ] Animations work smoothly
- [ ] Responsive on mobile
- [ ] No console errors

## 🔒 Security

### Security Guidelines

1. **Never expose private keys**
   - Keep all crypto operations client-side
   - Use MetaMask for signing
   - Don't log sensitive data

2. **Validate all inputs**
   ```javascript
   if (!message || typeof message !== 'string') {
     throw new Error('Invalid message');
   }
   ```

3. **Verify signatures**
   ```javascript
   const isValid = await verifySignature(block);
   if (!isValid) {
     console.error('Invalid signature');
     return;
   }
   ```

4. **Sanitize user content**
   - Escape HTML in messages
   - Validate file uploads
   - Check message length

### Reporting Security Issues

**DO NOT open public issues for security vulnerabilities.**

Email: security@chaintext.app

Include:
- Description of vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## 📚 Documentation

### What to Document

- New features
- API changes
- Breaking changes
- Configuration options
- Known issues

### Where to Document

- Code comments for complex logic
- `README.md` for user-facing features
- `API.md` for function signatures
- `ARCHITECTURE.md` for system design
- Inline JSDoc for utilities

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project website (coming soon)

## 💬 Communication

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Discord**: Real-time chat (coming soon)
- **Twitter**: Updates and announcements

## 📋 Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Code follows style guidelines
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] Tested manually
- [ ] No console errors or warnings
- [ ] Commit messages are clear
- [ ] Branch is up to date with main
- [ ] PR description is complete

## 🎯 Good First Issues

Look for issues labeled:
- `good first issue` - Easy to get started
- `help wanted` - Community input needed
- `documentation` - Improve docs

## ⚡ Quick Contribution Ideas

- Fix typos in documentation
- Improve error messages
- Add code comments
- Create examples
- Write tutorials
- Improve UI/UX
- Add tests
- Optimize performance

## 🙏 Thank You

Every contribution, no matter how small, is valuable and appreciated!

---

**Questions?** Open a discussion or reach out to maintainers.

**Happy coding! ⛓️**
