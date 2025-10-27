import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { decryptMessage } from '../utils/encryption';

export default function ChatBubble({ message, currentUser, index }) {
  const [decrypted, setDecrypted] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  const isOwnMessage = message.sender.toLowerCase() === currentUser?.toLowerCase();

  useEffect(() => {
    const decrypt = async () => {
      try {
        if (currentUser && message.encrypted) {
          const decryptedText = decryptMessage(message.encrypted, currentUser);
          setDecrypted(decryptedText || '[Unable to decrypt]');
        }
      } catch (error) {
        console.error('Decryption error:', error);
        setDecrypted('[Decryption failed]');
      } finally {
        setIsDecrypting(false);
      }
    };

    decrypt();
  }, [message, currentUser]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const shortenAddress = (addr) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const shortenHash = (hash) => {
    if (!hash) return '';
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        type: 'spring',
        stiffness: 100,
      }}
      style={{
        ...styles.container,
        alignSelf: isOwnMessage ? 'flex-end' : 'flex-start',
      }}
      className="float-subtle"
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        onClick={() => setShowDetails(!showDetails)}
        style={{
          ...styles.bubble,
          ...(isOwnMessage ? styles.ownBubble : styles.otherBubble),
        }}
        className={isOwnMessage ? 'glass-gold' : 'glass'}
      >
        {/* Sender info */}
        {!isOwnMessage && (
          <div style={styles.sender}>
            <span style={styles.senderIcon}>👤</span>
            <span style={styles.senderAddress}>{shortenAddress(message.sender)}</span>
          </div>
        )}

        {/* Message content */}
        <div style={styles.content}>
          {isDecrypting ? (
            <div style={styles.loading} className="shimmer">
              Decrypting...
            </div>
          ) : (
            <p style={styles.text}>{decrypted}</p>
          )}
        </div>

        {/* Timestamp and security indicator */}
        <div style={styles.footer}>
          <div style={styles.time}>
            {formatTime(message.timestamp)}
          </div>
          <div style={styles.security}>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              style={styles.securityIcon}
            >
              🔐
            </motion.span>
            <span style={styles.verified}>Verified</span>
          </div>
        </div>

        {/* Block details */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              style={styles.details}
              className="glass-dark"
            >
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Block Hash:</span>
                <span style={styles.detailValue}>{shortenHash(message.hash)}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Previous:</span>
                <span style={styles.detailValue}>
                  {message.previousHash ? shortenHash(message.previousHash) : 'Genesis'}
                </span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Date:</span>
                <span style={styles.detailValue}>{formatDate(message.timestamp)}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Signature:</span>
                <span style={styles.detailValue}>{shortenHash(message.signature)}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '70%',
    margin: '0.5rem 0',
  },
  bubble: {
    padding: '1rem',
    borderRadius: '1rem',
    cursor: 'pointer',
    transition: 'all 300ms ease-in-out',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  },
  ownBubble: {
    borderTopRightRadius: '0.25rem',
  },
  otherBubble: {
    borderTopLeftRadius: '0.25rem',
  },
  sender: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid rgba(192, 192, 192, 0.2)',
  },
  senderIcon: {
    fontSize: '1rem',
  },
  senderAddress: {
    fontSize: '0.75rem',
    fontFamily: "'Fira Code', monospace",
    color: '#D4AF37',
    fontWeight: 600,
  },
  content: {
    marginBottom: '0.75rem',
  },
  text: {
    fontSize: '1rem',
    lineHeight: 1.5,
    color: '#E5E5E5',
    fontFamily: "'Inter', sans-serif",
    margin: 0,
    wordBreak: 'break-word',
  },
  loading: {
    fontSize: '0.875rem',
    color: '#C0C0C0',
    fontStyle: 'italic',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
  },
  time: {
    fontSize: '0.75rem',
    color: '#C0C0C0',
    fontFamily: "'Fira Code', monospace",
  },
  security: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
  securityIcon: {
    fontSize: '0.875rem',
    display: 'inline-block',
  },
  verified: {
    fontSize: '0.75rem',
    color: '#2ECC71',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontFamily: "'Inter', sans-serif",
  },
  details: {
    marginTop: '0.75rem',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
    fontSize: '0.75rem',
  },
  detailLabel: {
    color: '#C0C0C0',
    fontFamily: "'Inter', sans-serif",
    fontWeight: 500,
  },
  detailValue: {
    color: '#D4AF37',
    fontFamily: "'Fira Code', monospace",
    fontWeight: 600,
  },
};
