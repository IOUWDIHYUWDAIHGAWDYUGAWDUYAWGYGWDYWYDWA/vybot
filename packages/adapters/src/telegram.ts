import { randomUUID } from 'node:crypto';
import type { VyAction, VyResult } from '@vybot/core';
import { CredentialProxy } from '@vybot/crypto';
import type { ProxiedFetch } from '@vybot/crypto';
import { BaseAdapter, type AdapterConfig, type AdapterCapability } from './base';

/**
 * Telegram adapter using the Telegram Bot API.
 * Uses long-polling (getUpdates) for receiving events.
 */
export class TelegramAdapter extends BaseAdapter {
  readonly name = 'Telegram';
  readonly platform = 'telegram';

  private proxiedFetch: ProxiedFetch | null = null;
  private baseUrl = '';
  private pollingActive = false;
  private lastOffset = 0;

  async connect(): Promise<void> {
    const proxy = new CredentialProxy();
    // Telegram uses token in the URL, so we build it manually
    this.proxiedFetch = proxy.createProxiedFetch(this.config.credentials, 'bearer');

    // For Telegram, we need the raw token to build the URL
    // We'll use a bearer proxy for now and construct URLs ourselves
    // The base URL pattern is: https://api.telegram.org/bot{TOKEN}/
    // We'll use a query-based approach with the proxy
    this.baseUrl = 'https://api.telegram.org';

    // Verify the token
    const res = await fetch(`${this.baseUrl}/bot${'***'}/getMe`);
    // Note: Real implementation decrypts the token to build the URL

    this.connected = true;
    console.log('[Telegram] Connected');

    // Start long-polling
    this.startPolling();
  }

  async disconnect(): Promise<void> {
    this.pollingActive = false;
    this.connected = false;
  }

  async executeAction(action: VyAction): Promise<VyResult> {
    try {
      switch (action.type) {
        case 'send_message': {
          const res = await this.callAPI('sendMessage', {
            chat_id: action.params.chatId,
            text: action.params.content ?? action.params.text,
            parse_mode: action.params.parseMode ?? 'HTML',
          });
          return { success: true, data: res };
        }
        case 'edit_message': {
          const res = await this.callAPI('editMessageText', {
            chat_id: action.params.chatId,
            message_id: action.params.messageId,
            text: action.params.text,
          });
          return { success: true, data: res };
        }
        case 'delete_message': {
          const res = await this.callAPI('deleteMessage', {
            chat_id: action.params.chatId,
            message_id: action.params.messageId,
          });
          return { success: true, data: res };
        }
        case 'send_photo': {
          const res = await this.callAPI('sendPhoto', {
            chat_id: action.params.chatId,
            photo: action.params.photoUrl,
            caption: action.params.caption,
          });
          return { success: true, data: res };
        }
        case 'answer_callback': {
          const res = await this.callAPI('answerCallbackQuery', {
            callback_query_id: action.params.callbackQueryId,
            text: action.params.text,
          });
          return { success: true, data: res };
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
        action: 'send_message',
        description: 'Send a text message to a Telegram chat',
        parameters: {
          chatId: { type: 'string', description: 'Chat ID or @username', required: true },
          text: { type: 'string', description: 'Message text', required: true },
        },
      },
      {
        action: 'edit_message',
        description: 'Edit an existing message',
        parameters: {
          chatId: { type: 'string', description: 'Chat ID', required: true },
          messageId: { type: 'string', description: 'Message ID', required: true },
          text: { type: 'string', description: 'New text', required: true },
        },
      },
      {
        action: 'delete_message',
        description: 'Delete a message',
        parameters: {
          chatId: { type: 'string', description: 'Chat ID', required: true },
          messageId: { type: 'string', description: 'Message ID', required: true },
        },
      },
    ];
  }

  // ─── Internals ──────────────────────────────────────────

  private async callAPI(method: string, params: Record<string, any>): Promise<any> {
    // Placeholder: real impl would decrypt token and build URL
    const res = await fetch(`${this.baseUrl}/bot${'TOKEN'}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const json = await res.json() as any;
    if (!json.ok) throw new Error(`Telegram API error: ${json.description}`);
    return json.result;
  }

  private startPolling(): void {
    this.pollingActive = true;
    this.poll().catch(console.error);
  }

  private async poll(): Promise<void> {
    while (this.pollingActive) {
      try {
        const updates = await this.callAPI('getUpdates', {
          offset: this.lastOffset + 1,
          timeout: 30,
        });

        for (const update of updates ?? []) {
          this.lastOffset = update.update_id;
          this.processUpdate(update);
        }
      } catch {
        // Wait before retrying on error
        await new Promise((r) => setTimeout(r, 5_000));
      }
    }
  }

  private processUpdate(update: any): void {
    if (update.message) {
      const msg = update.message;
      this.emitEvent({
        id: randomUUID(),
        source: 'telegram',
        type: 'message',
        data: {
          messageId: msg.message_id,
          content: msg.text ?? '',
          chatId: msg.chat.id,
          chatType: msg.chat.type,
          authorId: msg.from?.id,
          authorName: msg.from?.first_name,
        },
        timestamp: new Date(msg.date * 1000),
        userId: String(msg.from?.id),
      });
    }

    if (update.callback_query) {
      this.emitEvent({
        id: randomUUID(),
        source: 'telegram',
        type: 'command',
        data: {
          callbackQueryId: update.callback_query.id,
          data: update.callback_query.data,
          chatId: update.callback_query.message?.chat?.id,
          authorId: update.callback_query.from?.id,
        },
        timestamp: new Date(),
        userId: String(update.callback_query.from?.id),
      });
    }
  }
}
