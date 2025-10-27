# Security Policy

## 🔒 Security Overview

ChainText takes security seriously. This document outlines our security practices and how to report vulnerabilities.

## 🛡️ Security Model

### What ChainText Protects

✅ **Message Confidentiality**
- AES-256 encryption for all messages
- Client-side encryption only
- No plaintext transmission

✅ **Message Authenticity**
- Cryptographic signatures via MetaMask
- Signature verification on all messages
- Sender identity proof

✅ **Message Integrity**
- SHA-256 hash chaining
- Tamper-proof blockchain structure
- Content-addressed storage (IPFS)

✅ **Decentralization**
- No central servers
- Peer-to-peer architecture
- Censorship resistance

### What ChainText Does NOT Protect

❌ **Metadata Privacy**
- Sender addresses are visible
- Timestamps are visible
- Message count is visible

❌ **Client-Side Compromise**
- Browser malware
- Browser extensions
- Physical access to device

❌ **Wallet Security**
- Private key theft
- Phishing attacks
- Social engineering

❌ **Network Analysis**
- Traffic correlation
- Peer connection mapping
- Timing attacks

## 🔐 Cryptographic Implementation

### Encryption

**Algorithm**: AES-256 (Advanced Encryption Standard)
**Mode**: CBC (Cipher Block Chaining)
**Library**: crypto-js v4.2.0
**Key Derivation**: Wallet address (Ethereum address)

**Known Limitations**:
- Key is deterministic (same wallet = same key)
- No forward secrecy
- Single shared key (symmetric encryption)

### Hashing

**Algorithm**: SHA-256 (Secure Hash Algorithm)
**Library**: crypto-js v4.2.0
**Purpose**: Block integrity and chain linkage

### Signatures

**Algorithm**: ECDSA (Elliptic Curve Digital Signature Algorithm)
**Curve**: secp256k1
**Library**: ethers.js v5.7.2 (via MetaMask)
**Purpose**: Message authentication and non-repudiation

## 🚨 Reporting Security Vulnerabilities

### What to Report

- Encryption bypass
- Signature forgery
- Authentication bypass
- Message tampering
- XSS (Cross-Site Scripting)
- Dependency vulnerabilities
- Logic flaws

### How to Report

**DO NOT** open public GitHub issues for security vulnerabilities.

**Email**: security@chaintext.app

**PGP Key**: [Coming Soon]

### What to Include

1. **Description**: Clear explanation of the vulnerability
2. **Impact**: Potential damage or exploit scenario
3. **Steps to Reproduce**: Detailed reproduction steps
4. **Proof of Concept**: Code or screenshots (if applicable)
5. **Suggested Fix**: Your recommendations (optional)
6. **Disclosure Timeline**: Your preferred disclosure schedule

### Response Timeline

- **24 hours**: Initial acknowledgment
- **7 days**: Preliminary assessment
- **30 days**: Fix development and testing
- **90 days**: Public disclosure (coordinated)

## 🏆 Security Acknowledgments

We recognize security researchers who help improve ChainText:

### Hall of Fame

*No vulnerabilities reported yet*

### Bug Bounty Program

Currently, ChainText does not offer a formal bug bounty program. However, we deeply appreciate security reports and will publicly acknowledge contributors (with permission).

## 🔍 Security Best Practices for Users

### Wallet Security

1. **Use Hardware Wallets**
   - Ledger or Trezor for private key storage
   - Connect through MetaMask

2. **Verify Signatures**
   - Always review MetaMask signature requests
   - Ensure message hash matches expected content

3. **Protect Seed Phrases**
   - Never share your 12/24 word seed phrase
   - Store offline in secure location
   - Use metal backup for fire/water protection

### Browser Security

1. **Use Updated Browsers**
   - Chrome, Firefox, or Edge
   - Enable automatic updates

2. **Limit Extensions**
   - Only install trusted extensions
   - Review extension permissions

3. **Clear Cache Regularly**
   - Browser data stores OrbitDB
   - Clear sensitive data when needed

### Operational Security

1. **Use Separate Wallets**
   - Don't use main wallet for messaging
   - Create dedicated communication wallet

2. **Verify Peers**
   - Only connect to trusted peers
   - Be cautious with unknown peer multiaddresses

3. **Monitor Transactions**
   - MetaMask only signs messages (no gas)
   - Reject unexpected transaction requests

## 🛠️ Dependency Security

### Automated Scanning

- **npm audit**: Run weekly
- **Dependabot**: Enabled for GitHub
- **Snyk**: Planned integration

### Critical Dependencies

| Package | Version | Security Status |
|---------|---------|-----------------|
| next | 14.0.3 | ✅ No known vulnerabilities |
| ethers | 5.7.2 | ✅ No known vulnerabilities |
| crypto-js | 4.2.0 | ✅ No known vulnerabilities |
| ipfs-core | 0.18.1 | ✅ No known vulnerabilities |
| orbit-db | 0.29.0 | ⚠️ Legacy package |

### Update Policy

- **Critical**: Patch within 24 hours
- **High**: Patch within 7 days
- **Medium**: Patch within 30 days
- **Low**: Patch in next release

## 🔬 Security Testing

### Current Testing

- ✅ Manual code review
- ✅ Dependency scanning
- ✅ Browser security headers
- ⏳ Automated security tests (planned)
- ⏳ Penetration testing (planned)
- ⏳ Cryptographic audit (planned)

### Testing Checklist

- [ ] Input validation
- [ ] XSS prevention
- [ ] CSRF protection (N/A - no backend)
- [ ] Authentication bypass
- [ ] Authorization bypass
- [ ] Encryption strength
- [ ] Signature verification
- [ ] Hash collision resistance
- [ ] Dependency vulnerabilities

## 📜 Security Disclosures

### Published CVEs

*None yet*

### Security Advisories

*None yet*

## 🔄 Security Updates

Security updates will be released as:
- **Patch versions** (1.0.x) for security fixes
- **Minor versions** (1.x.0) for security improvements
- Released on GitHub and npm

Subscribe to:
- GitHub Security Advisories
- Release notifications
- Twitter: @ChainTextApp

## 🎓 Security Resources

### Learn More

- [OWASP Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)
- [Web3 Security Best Practices](https://ethereum.org/en/developers/docs/security/)
- [IPFS Security Notes](https://docs.ipfs.io/concepts/security-notes/)
- [MetaMask Security](https://metamask.zendesk.com/hc/en-us/articles/360015489591)

### Recommended Reading

- "Mastering Ethereum" by Andreas M. Antonopoulos
- "Serious Cryptography" by Jean-Philippe Aumasson
- "The Tangled Web" by Michal Zalewski

## 📞 Contact

**General Security Questions**: security@chaintext.app  
**Emergency Contact**: [PGP-encrypted email only]  
**Twitter**: [@ChainTextApp](https://twitter.com/chaintextapp)

## 📅 Last Updated

**Date**: October 27, 2025  
**Version**: 1.0.0  
**Next Review**: January 27, 2026

---

**Security is a community effort. Thank you for helping keep ChainText safe! 🛡️**
