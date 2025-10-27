import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WalletConnect from '../src/components/WalletConnect';
import MessageInput from '../src/components/MessageInput';
import MessageTimeline from '../src/components/MessageTimeline';
import OrbitStatus from '../src/components/OrbitStatus';
import { setup } from '../src/utils/orbitdb';

export default function Home() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [signer, setSigner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [orbitSystem, setOrbitSystem] = useState(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [initError, setInitError] = useState(null);
  const [showStatus, setShowStatus] = useState(false);

  // Initialize IPFS and OrbitDB when wallet connects
  useEffect(() => {
    if (walletAddress && !orbitSystem && !isInitializing) {
      initializeOrbitDB();
    }
  }, [walletAddress]);

  const initializeOrbitDB = async () => {
    setIsInitializing(true);
    setInitError(null);

    try {
      console.log('Starting OrbitDB setup...');
      const system = await setup((newMessages) => {
        console.log('Messages updated:', newMessages.length);
        setMessages(newMessages);
      });

      setOrbitSystem(system);
      console.log('OrbitDB initialized successfully');
    } catch (error) {
      console.error('Failed to initialize OrbitDB:', error);
      setInitError(error.message);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleWalletConnect = (address, walletSigner) => {
    setWalletAddress(address);
    setSigner(walletSigner);
  };

  const handleSendMessage = async (messageText) => {
    if (!orbitSystem || !messageText.trim()) return;

    try {
      // Get the hash of the previous message
      const previousHash = messages.length > 0 ? messages[messages.length - 1].hash : '';
      
      // Send message through OrbitDB
      await orbitSystem.sendMessage(messageText, previousHash);
      console.log('Message sent successfully');
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  };

  return (
    <div style={styles.page}>
      {/* Background effects */}
      <div style={styles.backgroundGradient} />
      <div style={styles.backgroundGrid} />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={styles.header}
        className="glass-dark"
      >
        <div style={styles.headerContent}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={styles.logo}
          >
            ⛓️
          </motion.div>
          <div style={styles.headerText}>
            <h1 style={styles.title} className="text-gold-gradient">
              ChainText
            </h1>
            <p style={styles.subtitle}>
              Decentralized Encrypted Messaging
            </p>
          </div>
        </div>

        <div style={styles.headerActions}>
          <WalletConnect
            onConnect={handleWalletConnect}
            connected={!!walletAddress}
            address={walletAddress}
          />

          {orbitSystem && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowStatus(!showStatus)}
              style={styles.statusButton}
              className="glass"
            >
              <span style={styles.statusIcon}>📊</span>
              {showStatus ? 'Hide' : 'Show'} Status
            </motion.button>
          )}
        </div>
      </motion.header>

      {/* Main content */}
      <div style={styles.mainContainer}>
        {/* Sidebar - OrbitDB Status */}
        <AnimatePresence>
          {showStatus && orbitSystem && (
            <motion.aside
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              style={styles.sidebar}
            >
              <OrbitStatus
                ipfs={orbitSystem.ipfs}
                db={orbitSystem.db}
                isInitialized={!!orbitSystem}
              />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main chat area */}
        <main style={styles.main}>
          {!walletAddress ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              style={styles.welcomeScreen}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={styles.welcomeIcon}
              >
                🔐
              </motion.div>
              <h2 style={styles.welcomeTitle} className="text-gold-gradient">
                Welcome to ChainText
              </h2>
              <p style={styles.welcomeText}>
                Connect your MetaMask wallet to start sending encrypted,
                blockchain-verified messages stored on IPFS.
              </p>
              <div style={styles.welcomeFeatures}>
                <div style={styles.welcomeFeature} className="glass">
                  <span style={styles.welcomeFeatureIcon}>🔒</span>
                  <div style={styles.welcomeFeatureText}>
                    <strong>AES-256 Encryption</strong>
                    <p>End-to-end encrypted messages</p>
                  </div>
                </div>
                <div style={styles.welcomeFeature} className="glass">
                  <span style={styles.welcomeFeatureIcon}>⛓️</span>
                  <div style={styles.welcomeFeatureText}>
                    <strong>Blockchain Signed</strong>
                    <p>Every message is cryptographically signed</p>
                  </div>
                </div>
                <div style={styles.welcomeFeature} className="glass">
                  <span style={styles.welcomeFeatureIcon}>🌐</span>
                  <div style={styles.welcomeFeatureText}>
                    <strong>Fully Decentralized</strong>
                    <p>Stored on IPFS with peer-to-peer sync</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : isInitializing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={styles.loadingScreen}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                style={styles.loadingIcon}
              >
                ⚙️
              </motion.div>
              <h2 style={styles.loadingTitle} className="shimmer">
                Initializing IPFS & OrbitDB...
              </h2>
              <p style={styles.loadingText}>
                Setting up your decentralized messaging node
              </p>
            </motion.div>
          ) : initError ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={styles.errorScreen}
            >
              <div style={styles.errorIcon}>⚠️</div>
              <h2 style={styles.errorTitle}>Initialization Failed</h2>
              <p style={styles.errorText}>{initError}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={initializeOrbitDB}
                style={styles.retryButton}
                className="glass-gold"
              >
                Retry
              </motion.button>
            </motion.div>
          ) : (
            <div style={styles.chatContainer}>
              <MessageTimeline
                messages={messages}
                currentUser={walletAddress}
              />
              <MessageInput
                onSend={handleSendMessage}
                disabled={!orbitSystem}
                connected={!!walletAddress}
              />
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        style={styles.footer}
      >
        <p style={styles.footerText}>
          Built with IPFS, OrbitDB, and MetaMask • Fully decentralized • No servers required
        </p>
        <div style={styles.footerLinks}>
          <a href="#" style={styles.footerLink}>Documentation</a>
          <span style={styles.footerDivider}>•</span>
          <a href="#" style={styles.footerLink}>GitHub</a>
          <span style={styles.footerDivider}>•</span>
          <a href="#" style={styles.footerLink}>Support</a>
        </div>
      </motion.footer>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundGradient: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(192, 192, 192, 0.05) 0%, transparent 50%)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  backgroundGrid: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'linear-gradient(rgba(192, 192, 192, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(192, 192, 192, 0.03) 1px, transparent 1px)',
    backgroundSize: '50px 50px',
    pointerEvents: 'none',
    zIndex: 0,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 2rem',
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    flexWrap: 'wrap',
    gap: '1rem',
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  logo: {
    fontSize: '2.5rem',
  },
  headerText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 900,
    margin: 0,
    letterSpacing: '0.05em',
  },
  subtitle: {
    fontSize: '0.875rem',
    color: '#C0C0C0',
    margin: 0,
    fontFamily: "'Inter', sans-serif",
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  statusButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.25rem',
    borderRadius: '0.75rem',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#E5E5E5',
    background: 'transparent',
    cursor: 'pointer',
    transition: 'all 300ms ease-in-out',
    fontFamily: "'Inter', sans-serif",
  },
  statusIcon: {
    fontSize: '1.25rem',
  },
  mainContainer: {
    display: 'flex',
    flex: 1,
    position: 'relative',
    zIndex: 1,
  },
  sidebar: {
    width: '300px',
    padding: '2rem 1rem',
    borderRight: '1px solid rgba(192, 192, 192, 0.1)',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
  },
  welcomeScreen: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 2rem',
    textAlign: 'center',
    flex: 1,
  },
  welcomeIcon: {
    fontSize: '5rem',
    marginBottom: '2rem',
  },
  welcomeTitle: {
    fontSize: '2.5rem',
    fontWeight: 900,
    marginBottom: '1rem',
  },
  welcomeText: {
    fontSize: '1.125rem',
    color: '#C0C0C0',
    maxWidth: '600px',
    lineHeight: 1.75,
    marginBottom: '3rem',
    fontFamily: "'Inter', sans-serif",
  },
  welcomeFeatures: {
    display: 'flex',
    gap: '2rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: '900px',
  },
  welcomeFeature: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    padding: '1.5rem',
    borderRadius: '1rem',
    maxWidth: '250px',
    textAlign: 'left',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  },
  welcomeFeatureIcon: {
    fontSize: '2rem',
  },
  welcomeFeatureText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    fontFamily: "'Inter', sans-serif",
  },
  loadingScreen: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: '4rem 2rem',
  },
  loadingIcon: {
    fontSize: '4rem',
    marginBottom: '2rem',
  },
  loadingTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '1rem',
    color: '#E5E5E5',
  },
  loadingText: {
    fontSize: '1rem',
    color: '#C0C0C0',
    fontFamily: "'Inter', sans-serif",
  },
  errorScreen: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: '4rem 2rem',
    textAlign: 'center',
  },
  errorIcon: {
    fontSize: '4rem',
    marginBottom: '2rem',
  },
  errorTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#E74C3C',
    marginBottom: '1rem',
  },
  errorText: {
    fontSize: '1rem',
    color: '#C0C0C0',
    marginBottom: '2rem',
    fontFamily: "'Inter', sans-serif",
  },
  retryButton: {
    padding: '0.75rem 2rem',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#1C1C1C',
    background: 'linear-gradient(135deg, #D4AF37 0%, #F0E68C 100%)',
    border: 'none',
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
  },
  chatContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minHeight: 0,
  },
  footer: {
    padding: '2rem',
    textAlign: 'center',
    borderTop: '1px solid rgba(192, 192, 192, 0.1)',
    zIndex: 1,
  },
  footerText: {
    fontSize: '0.875rem',
    color: '#C0C0C0',
    marginBottom: '0.5rem',
    fontFamily: "'Inter', sans-serif",
  },
  footerLinks: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '0.875rem',
  },
  footerLink: {
    color: '#D4AF37',
    textDecoration: 'none',
    transition: 'color 300ms ease-in-out',
    fontFamily: "'Inter', sans-serif",
  },
  footerDivider: {
    color: '#C0C0C0',
  },
};
