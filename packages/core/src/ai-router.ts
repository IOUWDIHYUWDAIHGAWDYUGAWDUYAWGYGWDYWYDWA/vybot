import type { AIMessage, AITool, AIResponse, AIProvider } from './types.js';
import { RateLimitExhaustedError, ProviderError } from './errors.js';

/** Per-provider rate limit tracking */
interface ProviderLimits {
  requestsThisMinute: number;
  requestsToday: number;
  tokensToday: number;
  minuteResetAt: number;
  dayResetAt: number;
}

interface ProviderConfig {
  name: AIProvider;
  priority: number;
  baseUrl: string;
  apiKeyEnv: string;
  defaultModel: string;
  maxRPM: number;
  maxRPD: number;
  maxTPD: number;
}

const PROVIDER_CONFIGS: ProviderConfig[] = [
  {
    name: 'groq',
    priority: 1,
    baseUrl: 'https://api.groq.com/openai/v1',
    apiKeyEnv: 'GROQ_API_KEY',
    defaultModel: 'llama-3.1-8b-instant',
    maxRPM: 30,
    maxRPD: 14_400,
    maxTPD: 500_000,
  },
  {
    name: 'nvidia',
    priority: 2,
    baseUrl: 'https://integrate.api.nvidia.com/v1',
    apiKeyEnv: 'NVIDIA_API_KEY',
    defaultModel: 'meta/llama-3.1-8b-instruct',
    maxRPM: 40,
    maxRPD: 5_000,
    maxTPD: 500_000,
  },
  {
    name: 'openrouter',
    priority: 3,
    baseUrl: 'https://openrouter.ai/api/v1',
    apiKeyEnv: 'OPENROUTER_API_KEY',
    defaultModel: 'meta-llama/llama-3.1-8b-instruct:free',
    maxRPM: 20,
    maxRPD: 50,
    maxTPD: 200_000,
  },
];

export interface AIRouterOptions {
  /** Override provider configs */
  providers?: Partial<ProviderConfig>[];
  /** Preferred model override per provider */
  modelOverrides?: Partial<Record<AIProvider, string>>;
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

  constructor(options: AIRouterOptions = {}) {
    this.configs = PROVIDER_CONFIGS.map((def) => {
      const override = options.providers?.find((p) => p.name === def.name);
      return { ...def, ...override } as ProviderConfig;
    }).sort((a, b) => a.priority - b.priority);

    this.modelOverrides = options.modelOverrides ?? {};

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
    // If a specific provider is forced, try only that one
    const providers = options.provider
      ? this.configs.filter((c) => c.name === options.provider)
      : this.configs;

    for (const cfg of providers) {
      const apiKey = process.env[cfg.apiKeyEnv];
      if (!apiKey) continue;

      if (!this.isAvailable(cfg.name)) continue;

      try {
        return await this.callProvider(cfg, apiKey, messages, tools, options);
      } catch (err) {
        if (err instanceof ProviderError && err.providerStatusCode === 429) {
          // Mark this minute as exhausted and try next provider
          const lim = this.limits.get(cfg.name)!;
          lim.requestsThisMinute = cfg.maxRPM;
          continue;
        }
        throw err;
      }
    }

    // All providers exhausted
    const soonest = this.getEarliestReset();
    throw new RateLimitExhaustedError(soonest);
  }

  /** Check if a provider is below its rate limits */
  isAvailable(provider: AIProvider): boolean {
    const lim = this.limits.get(provider);
    if (!lim) return false;
    this.maybeResetCounters(provider);
    const cfg = this.configs.find((c) => c.name === provider)!;
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
      rpm: cfg.maxRPM - lim.requestsThisMinute,
      rpd: cfg.maxRPD - lim.requestsToday,
      tpd: cfg.maxTPD - lim.tokensToday,
    };
  }

  // ─── Internal ──────────────────────────────────────────────

  private async callProvider(
    cfg: ProviderConfig,
    apiKey: string,
    messages: AIMessage[],
    tools: AITool[] | undefined,
    options: ChatOptions,
  ): Promise<AIResponse> {
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

    // OpenRouter requires extra headers
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
    const lim = this.limits.get(cfg.name)!;
    lim.requestsThisMinute++;
    lim.requestsToday++;
    lim.tokensToday += tokensUsed.total;

    return {
      content: choice?.message?.content ?? '',
      toolCalls: choice?.message?.tool_calls,
      provider: cfg.name,
      model,
      tokensUsed,
      latencyMs,
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
