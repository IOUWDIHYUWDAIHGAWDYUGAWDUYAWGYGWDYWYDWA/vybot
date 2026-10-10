import type { APIInfo } from './types.js';

/** Static registry of well-known API platforms */
const REGISTRY: APIInfo[] = [
  {
    platform: 'discord',
    displayName: 'Discord',
    baseUrl: 'https://discord.com/api/v10',
    authType: 'bot',
    docsUrl: 'https://discord.com/developers/docs',
    capabilities: ['messaging', 'moderation', 'voice', 'webhooks', 'slash_commands', 'reactions'],
    commonEndpoints: [
      { method: 'GET', path: '/users/@me', description: 'Get current bot user info' },
      { method: 'GET', path: '/guilds/{guildId}', description: 'Get guild info' },
      { method: 'GET', path: '/channels/{channelId}', description: 'Get channel info' },
      { method: 'POST', path: '/channels/{channelId}/messages', description: 'Send a message' },
      { method: 'PUT', path: '/channels/{channelId}/messages/{messageId}/reactions/{emoji}/@me', description: 'Add reaction' },
      { method: 'DELETE', path: '/channels/{channelId}/messages/{messageId}', description: 'Delete a message' },
      { method: 'PATCH', path: '/guilds/{guildId}/members/{userId}', description: 'Modify guild member' },
      { method: 'PUT', path: '/guilds/{guildId}/bans/{userId}', description: 'Ban user' },
    ],
  },
  {
    platform: 'telegram',
    displayName: 'Telegram',
    baseUrl: 'https://api.telegram.org/bot{token}',
    authType: 'query',
    docsUrl: 'https://core.telegram.org/bots/api',
    capabilities: ['messaging', 'media', 'inline_keyboards', 'groups', 'channels', 'payments'],
    commonEndpoints: [
      { method: 'GET', path: '/getMe', description: 'Get bot info' },
      { method: 'POST', path: '/sendMessage', description: 'Send a text message' },
      { method: 'POST', path: '/sendPhoto', description: 'Send a photo' },
      { method: 'GET', path: '/getUpdates', description: 'Long-poll for updates' },
      { method: 'POST', path: '/editMessageText', description: 'Edit a message' },
      { method: 'POST', path: '/deleteMessage', description: 'Delete a message' },
      { method: 'POST', path: '/answerCallbackQuery', description: 'Answer inline keyboard callback' },
    ],
  },
  {
    platform: 'slack',
    displayName: 'Slack',
    baseUrl: 'https://slack.com/api',
    authType: 'bearer',
    docsUrl: 'https://api.slack.com/methods',
    capabilities: ['messaging', 'channels', 'files', 'reactions', 'threads'],
    commonEndpoints: [
      { method: 'POST', path: '/chat.postMessage', description: 'Send a message' },
      { method: 'POST', path: '/chat.update', description: 'Update a message' },
      { method: 'GET', path: '/conversations.list', description: 'List channels' },
      { method: 'POST', path: '/reactions.add', description: 'Add reaction' },
    ],
  },
  {
    platform: 'github',
    displayName: 'GitHub',
    baseUrl: 'https://api.github.com',
    authType: 'bearer',
    docsUrl: 'https://docs.github.com/en/rest',
    capabilities: ['repos', 'issues', 'pull_requests', 'actions', 'users', 'organizations'],
    commonEndpoints: [
      { method: 'GET', path: '/user', description: 'Get authenticated user' },
      { method: 'GET', path: '/repos/{owner}/{repo}', description: 'Get repository info' },
      { method: 'GET', path: '/repos/{owner}/{repo}/issues', description: 'List issues' },
      { method: 'POST', path: '/repos/{owner}/{repo}/issues', description: 'Create an issue' },
    ],
  },
  {
    platform: 'openai',
    displayName: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    authType: 'bearer',
    docsUrl: 'https://platform.openai.com/docs/api-reference',
    capabilities: ['chat_completions', 'embeddings', 'images', 'audio', 'moderation'],
    commonEndpoints: [
      { method: 'POST', path: '/chat/completions', description: 'Create chat completion' },
      { method: 'POST', path: '/embeddings', description: 'Create embeddings' },
      { method: 'GET', path: '/models', description: 'List models' },
    ],
  },
  {
    platform: 'stripe',
    displayName: 'Stripe',
    baseUrl: 'https://api.stripe.com/v1',
    authType: 'bearer',
    docsUrl: 'https://stripe.com/docs/api',
    capabilities: ['payments', 'customers', 'subscriptions', 'invoices', 'products'],
    commonEndpoints: [
      { method: 'GET', path: '/customers', description: 'List customers' },
      { method: 'POST', path: '/customers', description: 'Create customer' },
      { method: 'GET', path: '/charges', description: 'List charges' },
      { method: 'GET', path: '/subscriptions', description: 'List subscriptions' },
    ],
  },
];

export class APIRegistry {
  private entries: Map<string, APIInfo>;

  constructor() {
    this.entries = new Map();
    for (const info of REGISTRY) {
      this.entries.set(info.platform, info);
    }
  }

  getByPlatform(platform: string): APIInfo | null {
    return this.entries.get(platform) ?? null;
  }

  getAllPlatforms(): string[] {
    return Array.from(this.entries.keys());
  }

  /** Register a custom platform at runtime */
  register(info: APIInfo): void {
    this.entries.set(info.platform, info);
  }
}
