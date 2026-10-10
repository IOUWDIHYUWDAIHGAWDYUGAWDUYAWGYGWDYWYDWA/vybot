import { z } from 'zod';

// ==========================================
// Event Types
// ==========================================
export const VyEventSourceSchema = z.enum([
  'discord',
  'telegram',
  'webhook',
  'mcp',
  'cron',
  'custom',
]);
export type VyEventSource = z.infer<typeof VyEventSourceSchema>;

export const VyEventTypeSchema = z.enum([
  'message',
  'reaction',
  'member_join',
  'ticket_open',
  'ticket_close',
  'command',
  'custom',
]);
export type VyEventType = z.infer<typeof VyEventTypeSchema>;

export const VyEventSchema = z.object({
  id: z.string().uuid(),
  source: VyEventSourceSchema,
  type: VyEventTypeSchema,
  data: z.record(z.any()),
  timestamp: z.date(),
  userId: z.string().optional(),
  channelId: z.string().optional(),
  guildId: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});
export type VyEvent = z.infer<typeof VyEventSchema>;

// ==========================================
// Action & Result Types
// ==========================================
export const VyActionSchema = z.object({
  id: z.string().uuid(),
  type: z.string(),
  target: z.string().optional(),
  params: z.record(z.any()),
  metadata: z.record(z.any()).optional(),
});
export type VyAction = z.infer<typeof VyActionSchema>;

export const VyResultSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  latencyMs: z.number().optional(),
});
export type VyResult = z.infer<typeof VyResultSchema>;

// ==========================================
// AI & LLM Types
// ==========================================
export const AIProviderSchema = z.enum(['groq', 'nvidia', 'openrouter']);
export type AIProvider = z.infer<typeof AIProviderSchema>;

export interface AIMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  name?: string;
  toolCalls?: AIToolCall[];
  toolCallId?: string;
}

export interface AIToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string; // JSON string
  };
}

export interface AITool {
  name: string;
  description: string;
  parameters: Record<string, any>; // JSON Schema format
}

export interface AIResponse {
  content: string;
  toolCalls?: AIToolCall[];
  provider: AIProvider;
  model: string;
  tokensUsed: {
    prompt: number;
    completion: number;
    total: number;
  };
  latencyMs: number;
}

// ==========================================
// User, Plan & Billing Types
// ==========================================
export const UserPlanSchema = z.enum(['free', 'starter', 'pro', 'business']);
export type UserPlan = z.infer<typeof UserPlanSchema>;

export interface PlanLimits {
  maxConnections: number;
  maxAiRequestsPerDay: number;
  maxTokensPerDay: number;
  features: string[];
}

export const PLAN_LIMITS: Record<UserPlan, PlanLimits> = {
  free: {
    maxConnections: 1,
    maxAiRequestsPerDay: 100,
    maxTokensPerDay: 50_000,
    features: ['basic_adapters', 'single_task'],
  },
  starter: {
    maxConnections: 3,
    maxAiRequestsPerDay: 1_000,
    maxTokensPerDay: 200_000,
    features: ['basic_adapters', 'multi_task', 'email_support'],
  },
  pro: {
    maxConnections: 10,
    maxAiRequestsPerDay: 5_000,
    maxTokensPerDay: 1_000_000,
    features: ['all_adapters', 'unlimited_tasks', 'priority_ai', 'webhook_outbound'],
  },
  business: {
    maxConnections: 999,
    maxAiRequestsPerDay: 20_000,
    maxTokensPerDay: 5_000_000,
    features: ['all_adapters', 'custom_mcp', 'dedicated_support', 'audit_logs', 'sla_guarantee'],
  },
};

// ==========================================
// Connection & Task Management Types
// ==========================================
export const ConnectionTypeSchema = z.enum(['api_key', 'webhook', 'mcp', 'oauth_token']);
export type ConnectionType = z.infer<typeof ConnectionTypeSchema>;

export const ConnectionStatusSchema = z.enum(['pending', 'active', 'error', 'disabled']);
export type ConnectionStatus = z.infer<typeof ConnectionStatusSchema>;

export const TaskStatusSchema = z.enum(['active', 'paused', 'error', 'completed']);
export type TaskStatus = z.infer<typeof TaskStatusSchema>;
