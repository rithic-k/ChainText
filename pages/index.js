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
  const [currentRoom, setCurrentRoom] = useState('chaintext-global');
  const [showRoomInput, setShowRoomInput] = useState(false);
  const [roomInputValue, setRoomInputValue] = useState('');
  const [showNodeConnect, setShowNodeConnect] = useState(false);
  const [nodeIdInput, setNodeIdInput] = useState('');
  const [myNodeId, setMyNodeId] = useState('');
  const [connectedPeers, setConnectedPeers] = useState(0);

  // Initialize IPFS and OrbitDB when wallet connects
  useEffect(() => {
    if (walletAddress && !orbitSystem && !isInitializing) {
      initializeOrbitDB();
    }
  }, [walletAddress]);

  const initializeOrbitDB = async (room = currentRoom) => {
    setIsInitializing(true);
    setInitError(null);

    try {
      console.log('Starting OrbitDB setup...');
      const system = await setup((newMessages) => {
        console.log('Messages updated:', newMessages.length);
        setMessages(newMessages);
      }, room);

      setOrbitSystem(system);
      setCurrentRoom(room);
      setMyNodeId(system.getNodeId());
      console.log('OrbitDB initialized successfully');
      
      // Update peer count periodically
      const updatePeers = async () => {
        const count = await system.getPeerCount();
        setConnectedPeers(count);
      };
      updatePeers();
      const peerInterval = setInterval(updatePeers, 3000);
      
      // Store interval for cleanup
      system._peerInterval = peerInterval;
      
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

  const handleSwitchRoom = async () => {
    if (!roomInputValue.trim() || !orbitSystem) return;
    
    try {
      setIsInitializing(true);
      if (orbitSystem._peerInterval) {
        clearInterval(orbitSystem._peerInterval);
      }
      const newSystem = await orbitSystem.switchRoom(roomInputValue.trim());
      setOrbitSystem(newSystem);
      setCurrentRoom(roomInputValue.trim());
      setMyNodeId(newSystem.getNodeId());
      setShowRoomInput(false);
      setRoomInputValue('');
      setMessages([]);
    } catch (error) {
      console.error('Failed to switch room:', error);
      alert('Failed to switch room: ' + error.message);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleConnectToNode = async () => {
    if (!nodeIdInput.trim() || !orbitSystem) return;
    
    try {
      await orbitSystem.connectToNode(nodeIdInput.trim());
      setShowNodeConnect(false);
      setNodeIdInput('');
      alert(`✅ Connected to node! Syncing messages...`);
    } catch (error) {
      console.error('Failed to connect to node:', error);
      alert('Failed to connect: ' + error.message);
    }
  };

  const copyNodeId = () => {
    navigator.clipboard.writeText(myNodeId);
    alert('📋 Node ID copied to clipboard!');
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
          {orbitSystem && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNodeConnect(!showNodeConnect)}
                style={styles.nodeButton}
                className="glass-gold"
                title="Connect to peer node"
              >
                <span style={styles.buttonIcon}>🔗</span>
                <span style={styles.buttonText}>Peers: {connectedPeers}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowRoomInput(!showRoomInput)}
                style={styles.roomButton}
                className="glass"
              >
                <span style={styles.buttonIcon}>🚪</span>
                <span style={styles.buttonText}>Room: {currentRoom}</span>
              </motion.button>
            </>
          )}
          
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
        {/* Room Input Modal */}
        <AnimatePresence>
          {showRoomInput && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={styles.modalOverlay}
              onClick={() => setShowRoomInput(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                style={styles.modalContent}
                className="glass-dark"
              >
                <h2 style={styles.modalTitle}>Join Chat Room</h2>
                <p style={styles.modalSubtitle}>
                  Enter a room ID to join a private chat. Anyone with the same ID can see messages.
                </p>
                <input
                  type="text"
                  value={roomInputValue}
                  onChange={(e) => setRoomInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSwitchRoom()}
                  placeholder="e.g., my-secret-room"
                  style={styles.roomInput}
                  className="glass"
                  autoFocus
                />
                <div style={styles.modalButtons}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowRoomInput(false)}
                    style={styles.modalButtonCancel}
                    className="glass"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSwitchRoom}
                    style={styles.modalButtonJoin}
                    className="glass-gold"
                    disabled={!roomInputValue.trim() || isInitializing}
                  >
                    {isInitializing ? 'Joining...' : 'Join Room'}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Node Connect Modal */}
        <AnimatePresence>
          {showNodeConnect && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={styles.modalOverlay}
              onClick={() => setShowNodeConnect(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                style={styles.modalContent}
                className="glass-dark"
              >
                <h2 style={styles.modalTitle}>Connect to Peer Node</h2>
                <p style={styles.modalSubtitle}>
                  Enter a peer's Node ID to establish direct P2P connection and sync messages.
                </p>
                
                {/* Your Node ID */}
                <div style={styles.nodeIdSection}>
                  <div style={styles.nodeIdLabel}>Your Node ID:</div>
                  <div style={styles.nodeIdDisplay}>
                    <code style={styles.nodeIdCode}>{myNodeId}</code>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={copyNodeId}
                      style={styles.copyButton}
                      className="glass"
                    >
                      📋 Copy
                    </motion.button>
                  </div>
                  <div style={styles.nodeIdHint}>
                    Share this ID with others to let them connect to you
                  </div>
                </div>

                {/* Connect to Peer */}
                <div style={styles.connectSection}>
                  <div style={styles.nodeIdLabel}>Connect to Peer:</div>
                  <input
                    type="text"
                    value={nodeIdInput}
                    onChange={(e) => setNodeIdInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleConnectToNode()}
                    placeholder="Paste peer's Node ID here"
                    style={styles.roomInput}
                    className="glass"
                    autoFocus
                  />
                </div>

                <div style={styles.modalButtons}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowNodeConnect(false)}
                    style={styles.modalButtonCancel}
                    className="glass"
                  >
                    Close
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleConnectToNode}
                    style={styles.modalButtonJoin}
                    className="glass-gold"
                    disabled={!nodeIdInput.trim()}
                  >
                    Connect
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
  roomButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.25rem',
    borderRadius: '0.75rem',
    border: 'none',
    background: 'rgba(212, 175, 55, 0.1)',
    color: '#D4AF37',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: "'Inter', sans-serif",
  },
  buttonIcon: {
    fontSize: '1.2rem',
  },
  buttonText: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '200px',
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
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(5px)',
  },
  modalContent: {
    maxWidth: '500px',
    width: '90%',
    padding: '2.5rem',
    borderRadius: '1.5rem',
    border: '1px solid rgba(212, 175, 55, 0.2)',
  },
  modalTitle: {
    fontSize: '1.75rem',
    fontWeight: 700,
    color: '#D4AF37',
    marginBottom: '0.5rem',
    fontFamily: "'Playfair Display', serif",
  },
  modalSubtitle: {
    fontSize: '0.95rem',
    color: '#C0C0C0',
    marginBottom: '1.5rem',
    lineHeight: 1.6,
    fontFamily: "'Inter', sans-serif",
  },
  roomInput: {
    width: '100%',
    padding: '1rem 1.25rem',
    fontSize: '1rem',
    borderRadius: '0.75rem',
    border: '1px solid rgba(212, 175, 55, 0.2)',
    background: 'rgba(28, 28, 28, 0.5)',
    color: '#FFF',
    marginBottom: '1.5rem',
    fontFamily: "'Inter', sans-serif",
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  modalButtons: {
    display: 'flex',
    gap: '1rem',
  },
  modalButtonCancel: {
    flex: 1,
    padding: '0.875rem 1.5rem',
    borderRadius: '0.75rem',
    border: 'none',
    background: 'rgba(192, 192, 192, 0.1)',
    color: '#C0C0C0',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
  },
  modalButtonJoin: {
    flex: 1,
    padding: '0.875rem 1.5rem',
    borderRadius: '0.75rem',
    border: 'none',
    background: 'linear-gradient(135deg, #D4AF37 0%, #F0E68C 100%)',
    color: '#1C1C1C',
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
  },
  nodeButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.25rem',
    borderRadius: '0.75rem',
    border: 'none',
    background: 'linear-gradient(135deg, #D4AF37 0%, #F0E68C 100%)',
    color: '#1C1C1C',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: "'Inter', sans-serif",
  },
  nodeIdSection: {
    marginBottom: '1.5rem',
    padding: '1rem',
    borderRadius: '0.75rem',
    background: 'rgba(212, 175, 55, 0.1)',
    border: '1px solid rgba(212, 175, 55, 0.2)',
  },
  nodeIdLabel: {
    fontSize: '0.875rem',
    color: '#C0C0C0',
    marginBottom: '0.5rem',
    fontWeight: 600,
    fontFamily: "'Inter', sans-serif",
  },
  nodeIdDisplay: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  nodeIdCode: {
    flex: 1,
    padding: '0.75rem',
    background: 'rgba(28, 28, 28, 0.8)',
    borderRadius: '0.5rem',
    color: '#D4AF37',
    fontSize: '0.75rem',
    fontFamily: "'Fira Code', monospace",
    wordBreak: 'break-all',
  },
  copyButton: {
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    border: 'none',
    background: 'rgba(192, 192, 192, 0.1)',
    color: '#C0C0C0',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    whiteSpace: 'nowrap',
  },
  nodeIdHint: {
    fontSize: '0.75rem',
    color: '#888',
    marginTop: '0.5rem',
    fontStyle: 'italic',
    fontFamily: "'Inter', sans-serif",
  },
  connectSection: {
    marginBottom: '1.5rem',
  },
};
