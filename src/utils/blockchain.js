import { generateHash } from './hashUtils';
import { encryptMessage } from './encryption';

/**
 * Creates a signed message block
 * @param {string} rawMessage - Plain text message
 * @param {string} previousHash - Hash of previous block
 * @param {object} signer - Ethers.js signer instance
 * @returns {object} Signed message block
 */
export async function createBlock(rawMessage, previousHash, signer) {
  const address = await signer.getAddress();
  const encrypted = encryptMessage(rawMessage, address);
  const timestamp = new Date().toISOString();
  const hash = generateHash(encrypted, timestamp, previousHash || '');
  const signature = await signer.signMessage(hash);

  return {
    sender: address,
    encrypted,
    timestamp,
    previousHash: previousHash || '',
    hash,
    signature,
  };
}

/**
 * Verifies a message signature
 * @param {object} block - Message block to verify
 * @returns {boolean} True if signature is valid
 */
export async function verifySignature(block) {
  try {
    const { ethers } = await import('ethers');
    const recoveredAddress = ethers.utils.verifyMessage(block.hash, block.signature);
    return recoveredAddress.toLowerCase() === block.sender.toLowerCase();
  } catch (error) {
    console.error('Signature verification failed:', error);
    return false;
  }
}

/**
 * Gets the genesis block (first message placeholder)
 * @returns {object} Genesis block
 */
export function getGenesisBlock() {
  return {
    sender: '0x0000000000000000000000000000000000000000',
    encrypted: '',
    timestamp: new Date(0).toISOString(),
    previousHash: '',
    hash: '0',
    signature: '',
  };
}
