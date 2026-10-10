import { randomUUID } from 'node:crypto';
import type { VyAction, VyResult } from '@vybot/core';
import { BaseAdapter, type AdapterConfig, type AdapterCapability } from './base';

/**
 * Generic webhook adapter — receives payloads from any external service
 * and can send outbound webhook requests.
 */
export class WebhookAdapter extends BaseAdapter {
  readonly name = 'Webhook';
  readonly platform = 'webhook';

  async connect(): Promise<void> {
    // Webhooks are passive — they receive HTTP requests from external services.
    // The actual HTTP server is set up in the API gateway (Cloudflare Worker).
    this.connected = true;
    console.log('[Webhook] Adapter ready — waiting for incoming payloads');
  }

  async disconnect(): Promise<void> {
    this.connected = false;
  }

  /**
   * Process an incoming webhook payload.
   * Called by the API gateway when it receives a POST to the webhook URL.
   */
  async processIncoming(payload: Record<string, any>, headers: Record<string, string> = {}): Promise<void> {
    await this.emitEvent({
      id: randomUUID(),
      source: 'webhook',
      type: 'custom',
      data: { payload, headers },
      timestamp: new Date(),
    });
  }

  async executeAction(action: VyAction): Promise<VyResult> {
    try {
      switch (action.type) {
        case 'send_webhook': {
          const res = await fetch(action.params.url, {
            method: action.params.method ?? 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(action.params.headers ?? {}),
            },
            body: JSON.stringify(action.params.body),
          });
          const data = await res.text();
          return { success: res.ok, data };
        }
        case 'api_call': {
          const res = await fetch(action.params.url, {
            method: action.params.method ?? 'GET',
            headers: action.params.headers ?? {},
            ...(action.params.body ? { body: JSON.stringify(action.params.body) } : {}),
          });
          const data = await res.json().catch(() => res.text());
          return { success: res.ok, data };
        }
        default:
          return { success: false, error: `Unknown action: ${action.type}` };
      }
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }

  getCapabilities(): AdapterCapability[] {
    return [
      {
        action: 'send_webhook',
        description: 'Send an outbound webhook request',
        parameters: {
          url: { type: 'string', description: 'Target URL', required: true },
          body: { type: 'object', description: 'JSON body to send' },
          method: { type: 'string', description: 'HTTP method (default: POST)' },
        },
      },
      {
        action: 'api_call',
        description: 'Make a generic API call',
        parameters: {
          url: { type: 'string', description: 'API endpoint URL', required: true },
          method: { type: 'string', description: 'HTTP method' },
          headers: { type: 'object', description: 'Request headers' },
          body: { type: 'object', description: 'Request body' },
        },
      },
    ];
  }
}
