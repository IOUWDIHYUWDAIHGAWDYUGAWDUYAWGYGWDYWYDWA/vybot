import { randomUUID } from 'node:crypto';
import type { VyAction, VyResult } from '@vybot/core';
import { CredentialProxy } from '@vybot/crypto';
import type { ProxiedFetch } from '@vybot/crypto';
import { BaseAdapter, type AdapterConfig, type AdapterCapability } from './base.js';

const DISCORD_API = 'https://discord.com/api/v10';
const GATEWAY_URL = 'wss://gateway.discord.gg/?v=10&encoding=json';

/**
 * Discord adapter using raw Discord API (no discord.js dependency).
 * Connects to the Discord Gateway via WebSocket for real-time events
 * and uses REST API for actions.
 */
export class DiscordAdapter extends BaseAdapter {
  readonly name = 'Discord';
  readonly platform = 'discord';

  private ws: WebSocket | null = null;
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  private lastSequence: number | null = null;
  private sessionId: string | null = null;
  private proxiedFetch: ProxiedFetch | null = null;
  private resumeGatewayUrl: string | null = null;

  async connect(): Promise<void> {
    const proxy = new CredentialProxy();
    this.proxiedFetch = proxy.createProxiedFetch(this.config.credentials, 'bot');

    // Verify the token works
    const me = await this.proxiedFetch(`${DISCORD_API}/users/@me`);
    if (!me.ok) {
      throw new Error(`Discord auth failed: ${me.status} ${await me.text()}`);
    }
    const botUser = await me.json() as any;
    console.log(`[Discord] Connected as ${botUser.username}#${botUser.discriminator}`);

    // Connect to Gateway
    await this.connectGateway();
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    if (this.ws) {
      this.ws.close(1000, 'VyBot disconnect');
      this.ws = null;
    }
    this.connected = false;
  }

  async executeAction(action: VyAction): Promise<VyResult> {
    if (!this.proxiedFetch) return { success: false, error: 'Not connected' };

    try {
      switch (action.type) {
        case 'send_message': {
          const res = await this.proxiedFetch(
            `${DISCORD_API}/channels/${action.params.channelId}/messages`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ content: action.params.content }),
            },
          );
          const data = await res.json();
          return { success: res.ok, data };
        }
        case 'add_reaction': {
          const emoji = encodeURIComponent(action.params.emoji);
          const res = await this.proxiedFetch(
            `${DISCORD_API}/channels/${action.params.channelId}/messages/${action.params.messageId}/reactions/${emoji}/@me`,
            { method: 'PUT' },
          );
          return { success: res.ok };
        }
        case 'delete_message': {
          const res = await this.proxiedFetch(
            `${DISCORD_API}/channels/${action.params.channelId}/messages/${action.params.messageId}`,
            { method: 'DELETE' },
          );
          return { success: res.ok };
        }
        case 'ban_member': {
          const res = await this.proxiedFetch(
            `${DISCORD_API}/guilds/${action.params.guildId}/bans/${action.params.userId}`,
            {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ delete_message_seconds: action.params.deleteMessageSeconds ?? 0 }),
            },
          );
          return { success: res.ok };
        }
        default:
          return { success: false, error: `Unknown action type: ${action.type}` };
      }
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }

  getCapabilities(): AdapterCapability[] {
    return [
      {
        action: 'send_message',
        description: 'Send a message to a Discord channel',
        parameters: {
          channelId: { type: 'string', description: 'Target channel ID', required: true },
          content: { type: 'string', description: 'Message content', required: true },
        },
      },
      {
        action: 'add_reaction',
        description: 'Add a reaction emoji to a message',
        parameters: {
          channelId: { type: 'string', description: 'Channel ID', required: true },
          messageId: { type: 'string', description: 'Message ID', required: true },
          emoji: { type: 'string', description: 'Emoji to react with', required: true },
        },
      },
      {
        action: 'delete_message',
        description: 'Delete a message',
        parameters: {
          channelId: { type: 'string', description: 'Channel ID', required: true },
          messageId: { type: 'string', description: 'Message ID', required: true },
        },
      },
      {
        action: 'ban_member',
        description: 'Ban a member from a guild',
        parameters: {
          guildId: { type: 'string', description: 'Guild ID', required: true },
          userId: { type: 'string', description: 'User ID to ban', required: true },
        },
      },
    ];
  }

  // ─── Gateway ────────────────────────────────────────────

  private connectGateway(): Promise<void> {
    return new Promise((resolve, reject) => {
      const url = this.resumeGatewayUrl ?? GATEWAY_URL;
      this.ws = new WebSocket(url);

      this.ws.addEventListener('message', (event) => {
        this.handleGatewayMessage(JSON.parse(String(event.data)));
      });

      this.ws.addEventListener('open', () => {
        console.log('[Discord] Gateway WebSocket opened');
        resolve();
      });

      this.ws.addEventListener('close', (event) => {
        console.log(`[Discord] Gateway closed: ${event.code} ${event.reason}`);
        this.connected = false;
        // Auto-reconnect after 5s
        setTimeout(() => {
          if (!this.connected) this.connectGateway().catch(console.error);
        }, 5_000);
      });

      this.ws.addEventListener('error', (err) => {
        console.error('[Discord] Gateway error:', err);
        reject(err);
      });
    });
  }

  private handleGatewayMessage(payload: any): void {
    const { op, d, s, t } = payload;

    // Track sequence for heartbeats
    if (s !== null) this.lastSequence = s;

    switch (op) {
      case 10: // HELLO — start heartbeat and identify
        this.startHeartbeat(d.heartbeat_interval);
        this.sendIdentify();
        break;
      case 0: // DISPATCH
        this.handleDispatch(t, d);
        break;
      case 1: // Heartbeat request
        this.sendHeartbeat();
        break;
      case 7: // RECONNECT
        this.ws?.close(4000, 'Reconnect requested');
        break;
      case 9: // INVALID SESSION
        this.sessionId = null;
        setTimeout(() => this.sendIdentify(), 3_000);
        break;
      case 11: // HEARTBEAT ACK
        break;
    }
  }

  private sendIdentify(): void {
    // We need to decrypt the token briefly for the IDENTIFY payload
    // The Gateway requires it in the payload, not in a header
    // This is the one place where the token must appear in a message
    // It's sent directly over the encrypted WSS connection
    this.ws?.send(JSON.stringify({
      op: 2,
      d: {
        token: '***', // Placeholder — real implementation uses decrypt()
        intents: 33281, // GUILDS | GUILD_MESSAGES | MESSAGE_CONTENT | DIRECT_MESSAGES
        properties: { os: 'linux', browser: 'vybot', device: 'vybot' },
      },
    }));
  }

  private startHeartbeat(intervalMs: number): void {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    this.heartbeatInterval = setInterval(() => this.sendHeartbeat(), intervalMs);
  }

  private sendHeartbeat(): void {
    this.ws?.send(JSON.stringify({ op: 1, d: this.lastSequence }));
  }

  private handleDispatch(eventName: string, data: any): void {
    switch (eventName) {
      case 'READY':
        this.sessionId = data.session_id;
        this.resumeGatewayUrl = data.resume_gateway_url;
        console.log(`[Discord] Ready! Session: ${this.sessionId}`);
        break;

      case 'MESSAGE_CREATE':
        // Don't emit events from the bot itself
        if (data.author?.bot) return;
        this.emitEvent({
          id: randomUUID(),
          source: 'discord',
          type: 'message',
          data: {
            messageId: data.id,
            content: data.content,
            authorId: data.author?.id,
            authorName: data.author?.username,
            channelId: data.channel_id,
            guildId: data.guild_id,
          },
          timestamp: new Date(),
          userId: data.author?.id,
          channelId: data.channel_id,
          guildId: data.guild_id,
        });
        break;

      case 'INTERACTION_CREATE':
        this.emitEvent({
          id: randomUUID(),
          source: 'discord',
          type: 'command',
          data,
          timestamp: new Date(),
          userId: data.user?.id ?? data.member?.user?.id,
          channelId: data.channel_id,
          guildId: data.guild_id,
        });
        break;
    }
  }
}
