import { decrypt } from './decrypt.js';
import type { EncryptedData, AuthType, ProxiedFetch } from './types.js';

/**
 * Credential Proxy — the AI agent NEVER sees the raw API key.
 * The proxy decrypts the key only at HTTP-request time, injects it
 * into the appropriate header, and immediately discards it.
 */
export class CredentialProxy {
  private masterKey: string;

  constructor(masterKey?: string) {
    this.masterKey = masterKey ?? process.env.VYBOT_MASTER_KEY ?? '';
    if (!this.masterKey) {
      throw new Error('VYBOT_MASTER_KEY is required for CredentialProxy');
    }
  }

  /**
   * Create a fetch wrapper that auto-injects credentials.
   * 
   * @param encrypted - The AES-256-GCM encrypted credential
   * @param authType  - How to inject: bearer, bot (Discord), header, query
   * @param headerName - Custom header name when authType='header'
   * @param queryParam - Custom query param name when authType='query'
   */
  createProxiedFetch(
    encrypted: EncryptedData,
    authType: AuthType,
    headerName?: string,
    queryParam?: string,
  ): ProxiedFetch {
    const masterKey = this.masterKey;

    return async (url: string, init?: RequestInit): Promise<Response> => {
      // Decrypt at request time — held in memory only briefly
      const rawKey = decrypt(encrypted, masterKey);

      let finalUrl = url;
      const headers = new Headers(init?.headers);

      switch (authType) {
        case 'bearer':
          headers.set('Authorization', `Bearer ${rawKey}`);
          break;
        case 'bot':
          headers.set('Authorization', `Bot ${rawKey}`);
          break;
        case 'header':
          headers.set(headerName ?? 'X-API-Key', rawKey);
          break;
        case 'query': {
          const separator = url.includes('?') ? '&' : '?';
          finalUrl = `${url}${separator}${queryParam ?? 'api_key'}=${encodeURIComponent(rawKey)}`;
          break;
        }
      }

      return fetch(finalUrl, { ...init, headers });
    };
  }
}
