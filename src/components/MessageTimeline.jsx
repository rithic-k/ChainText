import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatBubble from './ChatBubble';

export default function MessageTimeline({ messages, currentUser }) {
  const timelineRef = useRef(null);
  const prevMessagesLength = useRef(messages.length);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (timelineRef.current && messages.length > prevMessagesLength.current) {
      timelineRef.current.scrollTo({
        top: timelineRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
    prevMessagesLength.current = messages.length;
  }, [messages]);

  return (
    <div style={styles.container}>
      <div ref={timelineRef} style={styles.timeline}>
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={styles.emptyState}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              style={styles.emptyIcon}
            >
              ⛓️
            </motion.div>
            <h3 style={styles.emptyTitle} className="text-gold-gradient">
              No Messages Yet
            </h3>
            <p style={styles.emptyText}>
              Start a conversation and your encrypted messages will appear here.
              <br />
              All messages are stored on IPFS and replicated peer-to-peer.
            </p>
            <div style={styles.features}>
              <div style={styles.featureItem} className="glass">
                <span style={styles.featureIcon}>🔐</span>
                <span style={styles.featureText}>End-to-end Encrypted</span>
              </div>
              <div style={styles.featureItem} className="glass">
                <span style={styles.featureIcon}>⛓️</span>
                <span style={styles.featureText}>Blockchain Verified</span>
              </div>
              <div style={styles.featureItem} className="glass">
                <span style={styles.featureIcon}>🌐</span>
                <span style={styles.featureText}>Fully Decentralized</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence>
            <div style={styles.messageList}>
              {/* Genesis block indicator */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                style={styles.genesisBlock}
                className="glass-gold"
              >
                <div style={styles.genesisIcon}>⚡</div>
                <div style={styles.genesisText}>
                  <div style={styles.genesisTitle}>Genesis Block</div>
                  <div style={styles.genesisSubtitle}>ChainText Message Chain Started</div>
                </div>
              </motion.div>

              {/* Chain connector line */}
              <div style={styles.chainLine} />

              {/* Messages */}
              {messages.map((message, index) => (
                <div key={message.hash || index} style={styles.messageWrapper}>
                  <ChatBubble
                    message={message}
                    currentUser={currentUser}
                    index={index}
                  />
                  {index < messages.length - 1 && (
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      style={styles.blockConnector}
                    >
                      <div style={styles.connectorLine} />
                      <div style={styles.connectorNode} className="glow-pulse" />
                    </motion.div>
                  )}
                </div>
              ))}

              {/* Message count */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={styles.messageCount}
                className="glass-dark"
              >
                <span style={styles.countIcon}>📊</span>
                <span style={styles.countText}>
                  {messages.length} {messages.length === 1 ? 'Block' : 'Blocks'} in Chain
                </span>
              </motion.div>
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'relative',
  },
  timeline: {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    textAlign: 'center',
    padding: '2rem',
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '1.5rem',
  },
  emptyTitle: {
    fontSize: '2rem',
    marginBottom: '1rem',
    fontWeight: 700,
  },
  emptyText: {
    fontSize: '1rem',
    color: '#C0C0C0',
    lineHeight: 1.75,
    maxWidth: '500px',
    marginBottom: '2rem',
    fontFamily: "'Inter', sans-serif",
  },
  features: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.25rem',
    borderRadius: '0.75rem',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  },
  featureIcon: {
    fontSize: '1.5rem',
  },
  featureText: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#E5E5E5',
    fontFamily: "'Inter', sans-serif",
  },
  messageList: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  genesisBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem 1.5rem',
    borderRadius: '1rem',
    marginBottom: '2rem',
    alignSelf: 'center',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  },
  genesisIcon: {
    fontSize: '2rem',
  },
  genesisText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  genesisTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#D4AF37',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontFamily: "'Inter', sans-serif",
  },
  genesisSubtitle: {
    fontSize: '0.75rem',
    color: '#C0C0C0',
    fontFamily: "'Inter', sans-serif",
  },
  chainLine: {
    position: 'absolute',
    left: '50%',
    top: '100px',
    bottom: '60px',
    width: '2px',
    background: 'linear-gradient(180deg, rgba(212, 175, 55, 0.5) 0%, rgba(212, 175, 55, 0.1) 100%)',
    transform: 'translateX(-50%)',
    zIndex: 0,
  },
  messageWrapper: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    zIndex: 1,
  },
  blockConnector: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '0.5rem 0',
  },
  connectorLine: {
    width: '2px',
    height: '20px',
    background: 'rgba(212, 175, 55, 0.3)',
  },
  connectorNode: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#D4AF37',
  },
  messageCount: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.25rem',
    borderRadius: '0.75rem',
    alignSelf: 'center',
    marginTop: '2rem',
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
  },
  countIcon: {
    fontSize: '1.25rem',
  },
  countText: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#D4AF37',
    fontFamily: "'Inter', sans-serif",
  },
};
