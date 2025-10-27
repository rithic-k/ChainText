import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ethers } from 'ethers';

export default function WalletConnect({ onConnect, connected, address }) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not installed. Please install MetaMask to continue.');
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();

      onConnect(userAddress, signer);
    } catch (err) {
      console.error('Wallet connection error:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    onConnect(null, null);
  };

  const shortenAddress = (addr) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  useEffect(() => {
    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          connectWallet();
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={styles.container}
    >
      {!connected ? (
        <div style={styles.disconnectedState}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={connectWallet}
            disabled={isConnecting}
            style={styles.connectButton}
            className="glass-gold glow-pulse"
          >
            {isConnecting ? (
              <span style={styles.buttonContent}>
                <span className="shimmer">Connecting...</span>
              </span>
            ) : (
              <span style={styles.buttonContent}>
                <span style={styles.icon}>🔐</span>
                Connect MetaMask
              </span>
            )}
          </motion.button>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={styles.error}
            >
              {error}
            </motion.div>
          )}
        </div>
      ) : (
        <div style={styles.connectedState}>
          <div style={styles.walletInfo} className="glass-dark">
            <div style={styles.statusIndicator} className="glow-pulse" />
            <div style={styles.addressContainer}>
              <span style={styles.label}>Connected</span>
              <span style={styles.address} className="text-gold-gradient">
                {shortenAddress(address)}
              </span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={disconnectWallet}
            style={styles.disconnectButton}
          >
            Disconnect
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
  },
  disconnectedState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
  connectedState: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  connectButton: {
    padding: '1rem 2rem',
    borderRadius: '1rem',
    fontSize: '1.125rem',
    fontWeight: 600,
    color: '#1C1C1C',
    background: 'linear-gradient(135deg, #D4AF37 0%, #F0E68C 100%)',
    cursor: 'pointer',
    border: 'none',
    transition: 'all 300ms ease-in-out',
  },
  buttonContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  icon: {
    fontSize: '1.5rem',
  },
  walletInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1.5rem',
    borderRadius: '1rem',
  },
  statusIndicator: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: '#2ECC71',
  },
  addressContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  label: {
    fontSize: '0.75rem',
    color: '#C0C0C0',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontFamily: "'Inter', sans-serif",
  },
  address: {
    fontSize: '1rem',
    fontWeight: 600,
    fontFamily: "'Fira Code', monospace",
  },
  disconnectButton: {
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#E5E5E5',
    background: 'rgba(192, 192, 192, 0.1)',
    border: '1px solid rgba(192, 192, 192, 0.2)',
    cursor: 'pointer',
    transition: 'all 300ms ease-in-out',
  },
  error: {
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    background: 'rgba(231, 76, 60, 0.2)',
    border: '1px solid rgba(231, 76, 60, 0.4)',
    color: '#E74C3C',
    fontSize: '0.875rem',
    textAlign: 'center',
  },
};
