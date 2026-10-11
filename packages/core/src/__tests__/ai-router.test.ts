import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AIRouter, NoConfiguredProviderError } from '../index';

describe('AIRouter', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.GEMINI_API_KEY;
    delete process.env.GROQ_API_KEY;
    delete process.env.CEREBRAS_API_KEY;
    delete process.env.NVIDIA_API_KEY;
    delete process.env.OPENROUTER_API_KEY;
    delete process.env.MISTRAL_API_KEY;
    delete process.env.GITHUB_TOKEN;
    delete process.env.HUGGINGFACE_API_KEY;
    delete process.env.ALLOW_MOCK_AI;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('throws NoConfiguredProviderError when no keys are provided and mock is disabled', async () => {
    const router = new AIRouter({ allowMockFallback: false });
    await expect(
      router.chat([{ role: 'user', content: 'Merhaba' }])
    ).rejects.toThrow(NoConfiguredProviderError);
  });

  it('executes chat successfully with mock fallback', async () => {
    const router = new AIRouter({ allowMockFallback: true });
    const response = await router.chat([{ role: 'user', content: 'Test request' }]);

    expect(response.provider).toBe('mock');
    expect(response.content).toContain('[Mock AI]');
    expect(response.tokensUsed.total).toBeGreaterThan(0);
  });

  it('generates simulated tool calls in mock mode when tools are provided', async () => {
    const router = new AIRouter({ allowMockFallback: true });
    const response = await router.chat(
      [{ role: 'user', content: 'Send alert' }],
      [
        {
          name: 'send_alert',
          description: 'Send critical alert',
          parameters: { type: 'object', properties: {} },
        },
      ]
    );

    expect(response.toolCalls).toBeDefined();
    expect(response.toolCalls?.[0]?.function.name).toBe('send_alert');
  });

  it('correctly tracks provider rate limits and remaining capacity', () => {
    const router = new AIRouter({ allowMockFallback: true });
    const cap = router.getRemainingCapacity('gemini');

    expect(cap.rpm).toBe(15);
    expect(cap.rpd).toBe(1500);
    expect(cap.tpd).toBe(1000000);
    expect(router.isAvailable('gemini')).toBe(true);
  });
});
