import type { AITool } from '@vybot/core';

/** User-provided connection input */
export interface ConnectionInput {
  type: 'api_key' | 'webhook' | 'mcp' | 'oauth_token';
  value: string;
  hint?: string; // e.g., "Discord bot token"
}

/** Result of key/token type detection */
export interface DetectionResult {
  platform: string; // discord, telegram, openai, stripe, etc.
  type: 'api_key' | 'webhook' | 'mcp' | 'oauth_token';
  confidence: number; // 0–1
  suggestedAdapter: string; // discord, telegram, webhook, mcp
  details: string;
}

/** Metadata about a known API platform */
export interface APIInfo {
  platform: string;
  displayName: string;
  baseUrl: string;
  authType: 'bearer' | 'bot' | 'header' | 'query';
  headerName?: string;
  docsUrl: string;
  capabilities: string[];
  commonEndpoints: Array<{ method: string; path: string; description: string }>;
}

/** Result of probing an unknown API */
export interface ProbeResult {
  baseUrl: string;
  respondedEndpoints: Array<{
    path: string;
    status: number;
    contentType: string;
    bodyPreview: string;
  }>;
  detectedAuth: string; // e.g., "Bearer required", "API key in header"
  rateLimitInfo: { remaining?: number; resetAt?: string } | null;
  apiHints: string[]; // e.g., "REST API", "JSON responses", "pagination via ?page="
}

/** Parsed OpenAPI specification */
export interface ParsedAPI {
  title: string;
  version: string;
  baseUrl: string;
  endpoints: ParsedEndpoint[];
}

export interface ParsedEndpoint {
  method: string;
  path: string;
  operationId?: string;
  summary: string;
  parameters: Array<{
    name: string;
    in: 'query' | 'path' | 'header' | 'body';
    required: boolean;
    type: string;
    description: string;
  }>;
  requestBody?: Record<string, unknown>;
  responseSchema?: Record<string, unknown>;
}

/** Tool generated from API discovery */
export interface GeneratedTool extends AITool {
  method: string;
  path: string;
  source: 'registry' | 'openapi' | 'probe' | 'ai';
}

/** Complete discovery result */
export interface DiscoveryResult {
  detection: DetectionResult;
  apiInfo: APIInfo | null;
  probeResult: ProbeResult | null;
  tools: GeneratedTool[];
  confidence: number;
  suggestedSystemPrompt: string;
}
