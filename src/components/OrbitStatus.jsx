import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function OrbitStatus({ ipfs, db, isInitialized }) {
  const [peerCount, setPeerCount] = useState(0);
  const [dbAddress, setDbAddress] = useState('');
  const [syncStatus, setSyncStatus] = useState('idle');
  const [ipfsId, setIpfsId] = useState('');

  useEffect(() => {
    if (!ipfs || !db || !isInitialized) return;

    // Get IPFS ID
    ipfs.id().then((id) => {
      setIpfsId(id.id);
    }).catch(console.error);

    // Get DB address
    setDbAddress(db.address.toString());

    // Update peer count periodically
    const updatePeers = async () => {
      try {
        const peers = await ipfs.swarm.peers();
        setPeerCount(peers.length);
      } catch (error) {
        console.error('Failed to get peers:', error);
      }
    };

    updatePeers();
    const peerInterval = setInterval(updatePeers, 5000);

    // Listen for sync events
    const handleReplicated = () => {
      setSyncStatus('synced');
      setTimeout(() => setSyncStatus('idle'), 2000);
    };

    const handleWrite = () => {
      setSyncStatus('writing');
      setTimeout(() => setSyncStatus('idle'), 1000);
    };

    if (db.events) {
      db.events.on('replicated', handleReplicated);
      db.events.on('write', handleWrite);
    }

    return () => {
      clearInterval(peerInterval);
      // Cleanup is handled by component unmount
    };
  }, [ipfs, db, isInitialized]);

  const shortenHash = (hash) => {
    if (!hash) return '';
    if (hash.length < 20) return hash;
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
  };

  const getSyncStatusColor = () => {
    switch (syncStatus) {
      case 'synced':
        return '#2ECC71';
      case 'writing':
        return '#F39C12';
      default:
        return '#3498DB';
    }
  };

  const getSyncStatusText = () => {
    switch (syncStatus) {
      case 'synced':
        return 'Synced';
      case 'writing':
        return 'Writing';
      default:
        return 'Ready';
    }
  };

  if (!isInitialized) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={styles.container}
        className="glass-dark"
      >
        <div style={styles.loadingState}>
          <div className="shimmer" style={styles.loadingText}>
            Initializing IPFS & OrbitDB...
          </div>
          <div style={styles.loadingSpinner}>⚙️</div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      style={styles.container}
      className="glass-dark"
    >
      <div style={styles.header}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          style={styles.headerIcon}
        >
          🌐
        </motion.div>
        <h3 style={styles.title}>Network Status</h3>
      </div>

      <div style={styles.stats}>
        {/* Peer count */}
        <div style={styles.statItem}>
          <div style={styles.statLabel}>
            <span style={styles.statIcon}>👥</span>
            Peers
          </div>
          <motion.div
            key={peerCount}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            style={styles.statValue}
            className="text-gold-gradient"
          >
            {peerCount}
          </motion.div>
        </div>

        {/* Sync status */}
        <div style={styles.statItem}>
          <div style={styles.statLabel}>
            <motion.span
              animate={{
                rotate: syncStatus !== 'idle' ? 360 : 0,
              }}
              transition={{
                duration: 1,
                repeat: syncStatus !== 'idle' ? Infinity : 0,
                ease: 'linear',
              }}
              style={styles.statIcon}
            >
              🔄
            </motion.span>
            Sync Status
          </div>
          <div
            style={{
              ...styles.statValue,
              color: getSyncStatusColor(),
            }}
          >
            {getSyncStatusText()}
          </div>
        </div>
      </div>

      {/* Database info */}
      <div style={styles.infoSection}>
        <div style={styles.infoItem}>
          <div style={styles.infoLabel}>
            <span style={styles.infoIcon}>🗄️</span>
            Database
          </div>
          <div style={styles.infoValue}>
            {shortenHash(dbAddress)}
          </div>
        </div>

        <div style={styles.infoItem}>
          <div style={styles.infoLabel}>
            <span style={styles.infoIcon}>🆔</span>
            Node ID
          </div>
          <div style={styles.infoValue}>
            {shortenHash(ipfsId)}
          </div>
        </div>
      </div>

      {/* Status indicators */}
      <div style={styles.indicators}>
        <motion.div
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={styles.indicator}
        >
          <div style={{ ...styles.indicatorDot, background: '#2ECC71' }} />
          <span style={styles.indicatorText}>IPFS Online</span>
        </motion.div>
        <motion.div
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          style={styles.indicator}
        >
          <div style={{ ...styles.indicatorDot, background: '#D4AF37' }} />
          <span style={styles.indicatorText}>OrbitDB Ready</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

const styles = {
  container: {
    padding: '1.5rem',
    borderRadius: '1rem',
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  headerIcon: {
    fontSize: '1.5rem',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#E5E5E5',
    margin: 0,
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    padding: '1rem',
    borderRadius: '0.75rem',
    background: 'rgba(192, 192, 192, 0.05)',
    border: '1px solid rgba(192, 192, 192, 0.1)',
  },
  statLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.75rem',
    color: '#C0C0C0',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontFamily: "'Inter', sans-serif",
  },
  statIcon: {
    fontSize: '1rem',
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: 700,
    fontFamily: "'Fira Code', monospace",
  },
  infoSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  infoLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.75rem',
    color: '#C0C0C0',
    fontFamily: "'Inter', sans-serif",
  },
  infoIcon: {
    fontSize: '0.875rem',
  },
  infoValue: {
    fontSize: '0.75rem',
    fontFamily: "'Fira Code', monospace",
    color: '#D4AF37',
    fontWeight: 600,
  },
  indicators: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    paddingTop: '1rem',
    borderTop: '1px solid rgba(192, 192, 192, 0.1)',
  },
  indicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  indicatorDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    boxShadow: '0 0 10px currentColor',
  },
  indicatorText: {
    fontSize: '0.75rem',
    color: '#E5E5E5',
    fontFamily: "'Inter', sans-serif",
  },
  loadingState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem',
  },
  loadingText: {
    fontSize: '0.875rem',
    color: '#C0C0C0',
    fontFamily: "'Inter', sans-serif",
  },
  loadingSpinner: {
    fontSize: '1.5rem',
  },
};
