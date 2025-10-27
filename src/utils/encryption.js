import CryptoJS from 'crypto-js';

/**
 * Encrypts a message using AES-256 encryption
 * @param {string} message - The message to encrypt
 * @param {string} key - The encryption key (wallet address)
 * @returns {string} Encrypted ciphertext
 */
export function encryptMessage(message, key) {
  return CryptoJS.AES.encrypt(message, key).toString();
}

/**
 * Decrypts a message using AES-256 decryption
 * @param {string} ciphertext - The encrypted message
 * @param {string} key - The decryption key (wallet address)
 * @returns {string} Decrypted plaintext message
 */
export function decryptMessage(ciphertext, key) {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption failed:', error);
    return '';
  }
}
