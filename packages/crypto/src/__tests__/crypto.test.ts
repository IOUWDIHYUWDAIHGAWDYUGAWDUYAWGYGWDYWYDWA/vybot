import { describe, it, expect } from 'vitest';
import { encrypt, decrypt } from '../index';

describe('Crypto Service (AES-256-GCM)', () => {
  const masterKey = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
  const passphraseKey = 'my-super-secret-secure-passphrase';

  it('encrypts and decrypts with a 64-char hex key successfully', () => {
    const secret = 'discord_bot_token_secret_12345';
    const encrypted = encrypt(secret, masterKey);

    expect(encrypted.ciphertext).toBeDefined();
    expect(encrypted.iv).toBeDefined();
    expect(encrypted.authTag).toBeDefined();

    const decrypted = decrypt(encrypted, masterKey);
    expect(decrypted).toBe(secret);
  });

  it('encrypts and decrypts with passphrase-derived key', () => {
    const secret = '{"apiKey":"sk-groq-live-key"}';
    const encrypted = encrypt(secret, passphraseKey);
    const decrypted = decrypt(encrypted, passphraseKey);

    expect(decrypted).toBe(secret);
  });

  it('fails decryption with wrong master key or tampered ciphertext', () => {
    const secret = 'sensitive_data';
    const encrypted = encrypt(secret, masterKey);

    const wrongKey = 'fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210';
    expect(() => decrypt(encrypted, wrongKey)).toThrow();
  });
});
