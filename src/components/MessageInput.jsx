import { useState } from 'react';
import { motion } from 'framer-motion';

export default function MessageInput({ onSend, disabled, connected }) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || isSending || !connected) return;

    setIsSending(true);
    try {
      await onSend(message.trim());
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      style={styles.container}
      className="glass-dark"
    >
      <div style={styles.inputWrapper}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={connected ? "Type your encrypted message..." : "Connect wallet to send messages"}
          disabled={disabled || !connected || isSending}
          style={styles.textarea}
          rows={1}
          maxLength={500}
        />
        
        {message.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={styles.charCount}
          >
            {message.length}/500
          </motion.div>
        )}
      </div>

      <div style={styles.actions}>
        <div style={styles.features}>
          <motion.div
            whileHover={{ scale: 1.1 }}
            style={styles.feature}
            title="End-to-end encrypted"
          >
            🔒
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            style={styles.feature}
            title="Blockchain signed"
          >
            ⛓️
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            style={styles.feature}
            title="Decentralized"
          >
            🌐
          </motion.div>
        </div>

        <motion.button
          whileHover={{ scale: connected && !disabled && !isSending ? 1.05 : 1 }}
          whileTap={{ scale: connected && !disabled && !isSending ? 0.95 : 1 }}
          type="submit"
          disabled={disabled || !connected || isSending || !message.trim()}
          style={{
            ...styles.sendButton,
            opacity: disabled || !connected || isSending || !message.trim() ? 0.5 : 1,
          }}
          className={message.trim() && connected && !isSending ? "glow-pulse" : ""}
        >
          {isSending ? (
            <span style={styles.buttonContent}>
              <span className="shimmer">Sending...</span>
            </span>
          ) : (
            <span style={styles.buttonContent}>
              <span style={styles.icon}>✉️</span>
              Send
            </span>
          )}
        </motion.button>
      </div>
    </motion.form>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    padding: '1.5rem',
    borderRadius: '1rem',
    position: 'sticky',
    bottom: '1rem',
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
  },
  inputWrapper: {
    position: 'relative',
  },
  textarea: {
    width: '100%',
    padding: '1rem',
    fontSize: '1rem',
    fontFamily: "'Inter', sans-serif",
    lineHeight: 1.5,
    color: '#E5E5E5',
    background: 'rgba(28, 28, 28, 0.6)',
    border: '1px solid rgba(192, 192, 192, 0.2)',
    borderRadius: '0.75rem',
    resize: 'none',
    minHeight: '60px',
    maxHeight: '150px',
    transition: 'all 300ms ease-in-out',
  },
  charCount: {
    position: 'absolute',
    bottom: '0.5rem',
    right: '0.5rem',
    fontSize: '0.75rem',
    color: '#C0C0C0',
    fontFamily: "'Fira Code', monospace",
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  features: {
    display: 'flex',
    gap: '0.75rem',
  },
  feature: {
    fontSize: '1.25rem',
    cursor: 'pointer',
    transition: 'transform 300ms ease-in-out',
  },
  sendButton: {
    padding: '0.75rem 2rem',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#1C1C1C',
    background: 'linear-gradient(135deg, #D4AF37 0%, #F0E68C 100%)',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 300ms ease-in-out',
  },
  buttonContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  icon: {
    fontSize: '1.25rem',
  },
};
