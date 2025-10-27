import CryptoJS from 'crypto-js';

/**
 * Creates a SHA-256 hash from message data
 * @param {string} encrypted - Encrypted message content
 * @param {string} timestamp - ISO timestamp
 * @param {string} previousHash - Hash of the previous message block
 * @returns {string} SHA-256 hash
 */
export function generateHash(encrypted, timestamp, previousHash) {
  return CryptoJS.SHA256(encrypted + timestamp + previousHash).toString();
}

/**
 * Validates that a block's hash matches its contents
 * @param {object} block - Message block to validate
 * @returns {boolean} True if block is valid
 */
export function validateBlock(block) {
  if (!block || !block.hash) return false;
  
  const expectedHash = generateHash(
    block.encrypted,
    block.timestamp,
    block.previousHash || ''
  );
  
  return expectedHash === block.hash;
}

/**
 * Validates the entire chain of messages
 * @param {array} blocks - Array of message blocks
 * @returns {boolean} True if chain is valid
 */
export function validateChain(blocks) {
  if (!blocks || blocks.length === 0) return true;
  
  for (let i = 0; i < blocks.length; i++) {
    // Validate current block
    if (!validateBlock(blocks[i])) {
      console.error(`Block ${i} is invalid`);
      return false;
    }
    
    // Validate chain linkage
    if (i > 0) {
      if (blocks[i].previousHash !== blocks[i - 1].hash) {
        console.error(`Block ${i} chain link is broken`);
        return false;
      }
    }
  }
  
  return true;
}
