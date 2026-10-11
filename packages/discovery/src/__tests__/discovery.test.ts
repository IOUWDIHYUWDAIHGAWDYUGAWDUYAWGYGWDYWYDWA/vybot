import { describe, it, expect } from 'vitest';
import { detectKeyType, APIRegistry } from '../index';

describe('Discovery Package', () => {
  it('detects Telegram Bot Token pattern', () => {
    const telegramToken = '12345678:ABCDefghIJKLmnopQRSTuvwxYZ123456789';
    const result = detectKeyType(telegramToken);

    expect(result.platform).toBe('telegram');
    expect(result.suggestedAdapter).toBe('telegram');
    expect(result.confidence).toBeGreaterThanOrEqual(0.9);
  });

  it('detects Webhook URL pattern', () => {
    const url = 'https://discord.com/api/webhooks/123/xyz';
    const result = detectKeyType(url, 'discord');

    expect(result.type).toBe('webhook');
    expect(result.suggestedAdapter).toBe('webhook');
  });

  it('detects GitHub token pattern', () => {
    const ghToken = 'ghp_123456789012345678901234567890123456';
    const result = detectKeyType(ghToken);

    expect(result.platform).toBe('github');
  });

  it('registers and looks up known APIs in APIRegistry', () => {
    const registry = new APIRegistry();
    const discordEntry = registry.getByPlatform('discord');
    expect(discordEntry).toBeDefined();
    expect(discordEntry?.displayName.toLowerCase()).toContain('discord');
  });
});
