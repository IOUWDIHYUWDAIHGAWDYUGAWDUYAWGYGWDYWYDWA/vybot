import type { DetectionResult } from './types.js';

interface Pattern {
  platform: string;
  regex: RegExp;
  type: 'api_key' | 'webhook' | 'mcp' | 'oauth_token';
  adapter: string;
  details: string;
}

const PATTERNS: Pattern[] = [
  // Discord Bot Token
  {
    platform: 'discord',
    regex: /^[MN][A-Za-z0-9]{23,}\.[A-Za-z0-9_-]{6}\.[A-Za-z0-9_-]{27,}$/,
    type: 'api_key',
    adapter: 'discord',
    details: 'Discord Bot Token detected',
  },
  // Telegram Bot Token
  {
    platform: 'telegram',
    regex: /^\d{8,}:[A-Za-z0-9_-]{35}$/,
    type: 'api_key',
    adapter: 'telegram',
    details: 'Telegram Bot API Token detected',
  },
  // OpenAI API Key
  {
    platform: 'openai',
    regex: /^sk-[A-Za-z0-9]{20,}$/,
    type: 'api_key',
    adapter: 'webhook',
    details: 'OpenAI API Key detected',
  },
  // Slack Bot Token
  {
    platform: 'slack',
    regex: /^xoxb-[0-9]+-[0-9]+-[A-Za-z0-9]+$/,
    type: 'api_key',
    adapter: 'webhook',
    details: 'Slack Bot Token detected',
  },
  // GitHub Personal Access Token
  {
    platform: 'github',
    regex: /^gh[ps]_[A-Za-z0-9]{36,}$/,
    type: 'api_key',
    adapter: 'webhook',
    details: 'GitHub Token detected',
  },
  // Stripe API Key
  {
    platform: 'stripe',
    regex: /^sk_(live|test)_[A-Za-z0-9]{20,}$/,
    type: 'api_key',
    adapter: 'webhook',
    details: 'Stripe API Key detected',
  },
  // Twitch
  {
    platform: 'twitch',
    regex: /^[a-z0-9]{30}$/,
    type: 'api_key',
    adapter: 'webhook',
    details: 'Possible Twitch Client ID/Secret',
  },
];

const HINT_MAP: Record<string, string> = {
  discord: 'discord',
  telegram: 'telegram',
  slack: 'slack',
  github: 'github',
  stripe: 'stripe',
  openai: 'openai',
  twitch: 'twitch',
  whatsapp: 'whatsapp',
};

/**
 * Detect the type of an API key, token, or connection string.
 *
 * Uses regex pattern matching first; falls back to hint analysis and
 * URL detection for webhooks/MCP endpoints.
 */
export function detectKeyType(value: string, hint?: string): DetectionResult {
  const trimmed = value.trim();

  // 1) Check if it's a URL → webhook or MCP
  if (/^https?:\/\//i.test(trimmed)) {
    return {
      platform: hint ? (HINT_MAP[hint.toLowerCase()] ?? 'custom') : 'custom',
      type: 'webhook',
      confidence: 0.8,
      suggestedAdapter: 'webhook',
      details: 'URL detected — treating as webhook endpoint',
    };
  }

  // 2) Try regex patterns
  for (const p of PATTERNS) {
    if (p.regex.test(trimmed)) {
      return {
        platform: p.platform,
        type: p.type,
        confidence: 0.95,
        suggestedAdapter: p.adapter,
        details: p.details,
      };
    }
  }

  // 3) Use hint to make a best guess
  if (hint) {
    const normalized = hint.toLowerCase();
    for (const [key, platform] of Object.entries(HINT_MAP)) {
      if (normalized.includes(key)) {
        return {
          platform,
          type: 'api_key',
          confidence: 0.6,
          suggestedAdapter: platform === 'discord' || platform === 'telegram' ? platform : 'webhook',
          details: `Detected via user hint: "${hint}"`,
        };
      }
    }
  }

  // 4) Fallback: unknown
  return {
    platform: 'custom',
    type: 'api_key',
    confidence: 0.3,
    suggestedAdapter: 'webhook',
    details: 'Could not auto-detect key type. Will attempt generic API probing.',
  };
}
