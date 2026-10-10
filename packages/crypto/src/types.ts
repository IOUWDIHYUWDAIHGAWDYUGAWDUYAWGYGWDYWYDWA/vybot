/** Encrypted credential payload */
export interface EncryptedData {
  /** Base64-encoded ciphertext */
  ciphertext: string;
  /** Base64-encoded initialization vector */
  iv: string;
  /** Base64-encoded GCM authentication tag */
  authTag: string;
}

/** How the credential is injected into HTTP requests */
export type AuthType = 'bearer' | 'bot' | 'header' | 'query';

/** A fetch-like function that auto-injects credentials */
export type ProxiedFetch = (url: string, init?: RequestInit) => Promise<Response>;
