import { createDecipheriv, scryptSync } from 'node:crypto';
import type { EncryptedData } from './types';

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const SALT = 'vybot-credential-salt-v1';

function deriveKey(masterKey: string): Buffer {
  if (/^[0-9a-f]{64}$/i.test(masterKey)) {
    return Buffer.from(masterKey, 'hex');
  }
  return scryptSync(masterKey, SALT, KEY_LENGTH);
}

/**
 * Decrypt an AES-256-GCM encrypted payload.
 * Throws if the auth tag is invalid (tampered data).
 */
export function decrypt(data: EncryptedData, masterKey: string): string {
  const key = deriveKey(masterKey);
  const iv = Buffer.from(data.iv, 'base64');
  const authTag = Buffer.from(data.authTag, 'base64');
  const ciphertext = Buffer.from(data.ciphertext, 'base64');

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(ciphertext);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString('utf8');
}
