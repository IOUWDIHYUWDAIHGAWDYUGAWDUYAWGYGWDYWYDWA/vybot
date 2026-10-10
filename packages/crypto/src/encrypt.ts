import { randomBytes, createCipheriv, scryptSync } from 'node:crypto';
import type { EncryptedData } from './types';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const KEY_LENGTH = 32;
const SALT = 'vybot-credential-salt-v1';

/**
 * Derive a 256-bit encryption key from a master passphrase.
 * If the masterKey is already 32 bytes hex (64 chars), use it directly.
 */
function deriveKey(masterKey: string): Buffer {
  if (/^[0-9a-f]{64}$/i.test(masterKey)) {
    return Buffer.from(masterKey, 'hex');
  }
  return scryptSync(masterKey, SALT, KEY_LENGTH);
}

/**
 * Encrypt a plaintext string using AES-256-GCM.
 * Returns base64-encoded ciphertext, iv, and auth tag.
 */
export function encrypt(plaintext: string, masterKey: string): EncryptedData {
  const key = deriveKey(masterKey);
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  const authTag = cipher.getAuthTag();

  return {
    ciphertext: encrypted.toString('base64'),
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64'),
  };
}
