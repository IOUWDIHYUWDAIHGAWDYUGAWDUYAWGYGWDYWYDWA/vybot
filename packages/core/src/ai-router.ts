import type { AIMessage, AITool, AIResponse, AIProvider } from './types';
import { RateLimitExhaustedError, ProviderError, NoConfiguredProviderError } from './errors';

/** Per-provider rate limit tracking */
interface ProviderLimits {
  requestsThisMinute: number;
  requestsToday: number;
  tokensToday: number;
  minuteResetAt: number;
  dayResetAt: number;
}

export interface ProviderConfig {
  name: AIProvider;
  priority: number;
  baseUrl: string;
  apiKeyEnv: string;
  defaultModel: string;
  maxRPM: number;
  maxRPD: number;
  maxTPD: number;
}

export const PROVIDER_CONFIGS: ProviderConfig[] = [
  {
    name: 'gemini',
    priority: 1,
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    apiKeyEnv: 'GEMINI_API_KEY',
    defaultModel: 'gemini-2.0-flash',
    maxRPM: 15,
    maxRPD: 1_500,
    maxTPD: 1_000_000,
  },
  {
    name: 'groq',
    priority: 2,
    baseUrl: 'https://api.groq.com/openai/v1',
    apiKeyEnv: 'GROQ_API_KEY',
    defaultModel: 'llama-3.3-70b-versatile',
    maxRPM: 30,
    maxRPD: 14_400,
    maxTPD: 500_000,
  },
  {
    name: 'cerebras',
    priority: 3,
    baseUrl: 'https://api.cerebras.ai/v1',
    apiKeyEnv: 'CEREBRAS_API_KEY',
    defaultModel: 'llama-3.3-70b',
    maxRPM: 30,
    maxRPD: 14_400,
    maxTPD: 1_000_000,
  },
  {
    name: 'nvidia',
    priority: 4,
    baseUrl: 'https://integrate.api.nvidia.com/v1',
    apiKeyEnv: 'NVIDIA_API_KEY',
    defaultModel: 'meta/llama-3.1-8b-instruct',
    maxRPM: 40,
    maxRPD: 5_000,
    maxTPD: 500_000,
  },
  {
    name: 'mistral',
    priority: 5,
    baseUrl: 'https://api.mistral.ai/v1',
    apiKeyEnv: 'MISTRAL_API_KEY',
    defaultModel: 'mistral-small-latest',
    maxRPM: 30,
    maxRPD: 5_000,
    maxTPD: 500_000,
  },
  {
    name: 'openrouter',
    priority: 6,
    baseUrl: 'https://openrouter.ai/api/v1',
    apiKeyEnv: 'OPENROUTER_API_KEY',
    defaultModel: 'deepseek/deepseek-r1:free',
    maxRPM: 20,
    maxRPD: 500,
    maxTPD: 500_000,
  },
  {
    name: 'cloudflare',
    priority: 7,
    baseUrl: `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID || 'fcac9bf573dfa18554d89e2205093653'}/ai/v1`,
    apiKeyEnv: 'CLOUDFLARE_API_TOKEN',
    defaultModel: '@cf/meta/llama-3.3-70b-instruct',
    maxRPM: 60,
    maxRPD: 10_000,
    maxTPD: 1_000_000,
  },
  {
    name: 'together',
    priority: 8,
    baseUrl: 'https://api.together.xyz/v1',
    apiKeyEnv: 'TOGETHER_API_KEY',
    defaultModel: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
    maxRPM: 30,
    maxRPD: 1_000,
    maxTPD: 500_000,
  },
  {
    name: 'cohere',
    priority: 9,
    baseUrl: 'https://api.cohere.ai/v1',
    apiKeyEnv: 'COHERE_API_KEY',
    defaultModel: 'command-r',
    maxRPM: 20,
    maxRPD: 1_000,
    maxTPD: 200_000,
  },
  {
    name: 'github',
    priority: 10,
    baseUrl: 'https://models.inference.ai.azure.com',
    apiKeyEnv: 'GITHUB_TOKEN',
    defaultModel: 'gpt-4o-mini',
    maxRPM: 15,
    maxRPD: 150,
    maxTPD: 150_000,
  },
  {
    name: 'huggingface',
    priority: 11,
    baseUrl: 'https://api-inference.huggingface.co/v1',
    apiKeyEnv: 'HUGGINGFACE_API_KEY',
    defaultModel: 'meta-llama/Llama-3.2-3B-Instruct',
    maxRPM: 30,
    maxRPD: 1_000,
    maxTPD: 300_000,
  },
  {
    name: 'mock',
    priority: 99,
    baseUrl: 'local://mock',
    apiKeyEnv: 'ALLOW_MOCK_AI',
    defaultModel: 'mock-agent-v1',
    maxRPM: 10_000,
    maxRPD: 100_000,
    maxTPD: 10_000_000,
  },
];

export interface AIRouterOptions {
  /** Override provider configs */
  providers?: Partial<ProviderConfig>[];
  /** Preferred model override per provider */
  modelOverrides?: Partial<Record<AIProvider, string>>;
  /** Automatically fall back to mock provider if no API keys are configured */
  allowMockFallback?: boolean;
}

export interface ChatOptions {
  /** Force a specific provider */
  provider?: AIProvider;
  /** Model override for this request */
  model?: string;
  /** Temperature (0-2) */
  temperature?: number;
  /** Max tokens for the completion */
  maxTokens?: number;
}

export class AIRouter {
  private configs: ProviderConfig[];
  private limits: Map<AIProvider, ProviderLimits> = new Map();
  private modelOverrides: Partial<Record<AIProvider, string>>;
  private allowMockFallback: boolean;

  constructor(options: AIRouterOptions = {}) {
    this.configs = PROVIDER_CONFIGS.map((def) => {
      const override = options.providers?.find((p) => p.name === def.name);
      return { ...def, ...override } as ProviderConfig;
    }).sort((a, b) => a.priority - b.priority);

    this.modelOverrides = options.modelOverrides ?? {};
    this.allowMockFallback = options.allowMockFallback ?? process.env.ALLOW_MOCK_AI === 'true';

    // Initialize limits
    for (const cfg of this.configs) {
      this.limits.set(cfg.name, {
        requestsThisMinute: 0,
        requestsToday: 0,
        tokensToday: 0,
        minuteResetAt: Date.now() + 60_000,
        dayResetAt: this.getNextMidnight(),
      });
    }
  }

  /** Send a chat request with automatic provider fallback */
  async chat(messages: AIMessage[], tools?: AITool[], options: ChatOptions = {}): Promise<AIResponse> {
    const candidateProviders = options.provider
      ? this.configs.filter((c) => c.name === options.provider)
      : this.configs;

    let attemptedAny = false;

    for (const cfg of candidateProviders) {
      const isMock = cfg.name === 'mock';
      const apiKey = process.env[cfg.apiKeyEnv];

      // If mock is disabled and no env set, skip mock
      if (isMock && !this.allowMockFallback && process.env.ALLOW_MOCK_AI !== 'true') {
        continue;
      }

      if (!isMock && !apiKey) {
        continue;
      }

      if (!this.isAvailable(cfg.name)) {
        continue;
      }

      attemptedAny = true;

      try {
        return await this.callProvider(cfg, apiKey ?? 'mock-key', messages, tools, options);
      } catch (err) {
        if (err instanceof ProviderError && (err.providerStatusCode === 429 || err.providerStatusCode >= 500)) {
          // Exhausted or provider error: mark minute limit and proceed to next provider
          const lim = this.limits.get(cfg.name);
          if (lim) {
            lim.requestsThisMinute = cfg.maxRPM;
          }
          console.warn(`[AIRouter] Provider ${cfg.name} failed with ${err.providerStatusCode}. Falling back to next provider.`);
          continue;
        }
        throw err;
      }
    }

    if (!attemptedAny) {
      // If user enabled mock fallback, run mock
      if (this.allowMockFallback || process.env.ALLOW_MOCK_AI === 'true') {
        const mockCfg = this.configs.find((c) => c.name === 'mock')!;
        return this.callMockProvider(mockCfg, messages, tools, options);
      }
      throw new NoConfiguredProviderError();
    }

    // All available providers exhausted their limits
    const soonest = this.getEarliestReset();
    throw new RateLimitExhaustedError(soonest);
  }

  /** Check if a provider is below its rate limits */
  isAvailable(provider: AIProvider): boolean {
    const lim = this.limits.get(provider);
    if (!lim) return false;
    this.maybeResetCounters(provider);
    const cfg = this.configs.find((c) => c.name === provider);
    if (!cfg) return false;
    return (
      lim.requestsThisMinute < cfg.maxRPM &&
      lim.requestsToday < cfg.maxRPD &&
      lim.tokensToday < cfg.maxTPD
    );
  }

  /** Get remaining capacity info for a provider */
  getRemainingCapacity(provider: AIProvider): { rpm: number; rpd: number; tpd: number } {
    const lim = this.limits.get(provider);
    const cfg = this.configs.find((c) => c.name === provider);
    if (!lim || !cfg) return { rpm: 0, rpd: 0, tpd: 0 };
    this.maybeResetCounters(provider);
    return {
      rpm: Math.max(0, cfg.maxRPM - lim.requestsThisMinute),
      rpd: Math.max(0, cfg.maxRPD - lim.requestsToday),
      tpd: Math.max(0, cfg.maxTPD - lim.tokensToday),
    };
  }

  /** Get list of currently configured providers with active keys */
  getConfiguredProviders(): AIProvider[] {
    return this.configs
      .filter((c) => {
        if (c.name === 'mock') return this.allowMockFallback || process.env.ALLOW_MOCK_AI === 'true';
        return !!process.env[c.apiKeyEnv];
      })
      .map((c) => c.name);
  }

  // ─── Internal ──────────────────────────────────────────────

  private async callProvider(
    cfg: ProviderConfig,
    apiKey: string,
    messages: AIMessage[],
    tools: AITool[] | undefined,
    options: ChatOptions,
  ): Promise<AIResponse> {
    if (cfg.name === 'mock') {
      return this.callMockProvider(cfg, messages, tools, options);
    }

    const model = options.model ?? this.modelOverrides[cfg.name] ?? cfg.defaultModel;
    const startMs = Date.now();

    const body: Record<string, unknown> = {
      model,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
        ...(m.name && { name: m.name }),
        ...(m.toolCallId && { tool_call_id: m.toolCallId }),
        ...(m.toolCalls && { tool_calls: m.toolCalls }),
      })),
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 2048,
    };

    if (tools && tools.length > 0) {
      body.tools = tools.map((t) => ({
        type: 'function' as const,
        function: { name: t.name, description: t.description, parameters: t.parameters },
      }));
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    };

    if (cfg.name === 'openrouter') {
      headers['HTTP-Referer'] = 'https://vybot.app';
      headers['X-Title'] = 'VyBot';
    }

    const res = await fetch(`${cfg.baseUrl}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => '');
      throw new ProviderError(cfg.name, res.status, errorBody);
    }

    const json = (await res.json()) as any;
    const choice = json.choices?.[0];
    const latencyMs = Date.now() - startMs;

    const tokensUsed = {
      prompt: json.usage?.prompt_tokens ?? 0,
      completion: json.usage?.completion_tokens ?? 0,
      total: json.usage?.total_tokens ?? 0,
    };

    // Track usage
    const lim = this.limits.get(cfg.name);
    if (lim) {
      lim.requestsThisMinute++;
      lim.requestsToday++;
      lim.tokensToday += tokensUsed.total;
    }

    return {
      content: choice?.message?.content ?? '',
      toolCalls: choice?.message?.tool_calls,
      provider: cfg.name,
      model,
      tokensUsed,
      latencyMs,
    };
  }

  private callMockProvider(
    cfg: ProviderConfig,
    messages: AIMessage[],
    tools: AITool[] | undefined,
    options: ChatOptions,
  ): AIResponse {
    const lastMsg = messages[messages.length - 1]?.content ?? '';
    const hasTools = tools && tools.length > 0;
    let toolCalls = undefined;
    let content = `[Mock AI] Analysis completed for request: "${lastMsg.slice(0, 80)}"`;

    if (hasTools && tools && tools[0]) {
      const chosenTool = tools[0];
      toolCalls = [
        {
          id: `mock_call_${Date.now()}`,
          type: 'function' as const,
          function: {
            name: chosenTool.name,
            arguments: JSON.stringify({
              action: chosenTool.name,
              reason: 'Simulated autonomous action',
              simulated: true,
            }),
          },
        },
      ];
      content = `[Mock AI] Autonomous execution plan decided. Invoking ${chosenTool.name}.`;
    }

    const lim = this.limits.get('mock');
    if (lim) {
      lim.requestsThisMinute++;
      lim.requestsToday++;
      lim.tokensToday += 50;
    }

    return {
      content,
      toolCalls,
      provider: 'mock',
      model: options.model ?? cfg.defaultModel,
      tokensUsed: { prompt: 25, completion: 25, total: 50 },
      latencyMs: 12,
    };
  }

  private maybeResetCounters(provider: AIProvider): void {
    const lim = this.limits.get(provider);
    if (!lim) return;
    const now = Date.now();
    if (now >= lim.minuteResetAt) {
      lim.requestsThisMinute = 0;
      lim.minuteResetAt = now + 60_000;
    }
    if (now >= lim.dayResetAt) {
      lim.requestsToday = 0;
      lim.tokensToday = 0;
      lim.dayResetAt = this.getNextMidnight();
    }
  }

  private getNextMidnight(): number {
    const d = new Date();
    d.setHours(24, 0, 0, 0);
    return d.getTime();
  }

  private getEarliestReset(): Date {
    let earliest = Infinity;
    for (const [, lim] of this.limits) {
      earliest = Math.min(earliest, lim.minuteResetAt);
    }
    return new Date(earliest);
  }
}
