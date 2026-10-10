import { detectKeyType } from './detector';
import { APIRegistry } from './registry';
import { APIProber } from './prober';
import { ToolGenerator } from './tool-gen';
import type { ConnectionInput, DiscoveryResult } from './types';

/**
 * Main Discovery Engine — orchestrates the entire API discovery flow.
 *
 * Flow:
 *  1. Detect key type (regex + hint)
 *  2. Look up in known API registry
 *  3. If unknown, probe the API safely
 *  4. Generate AI-callable tools
 *  5. Return complete discovery result
 */
export class DiscoveryEngine {
  private registry = new APIRegistry();
  private prober = new APIProber();
  private toolGen = new ToolGenerator();

  /**
   * Discover what an API key / webhook / MCP endpoint can do.
   */
  async discover(input: ConnectionInput, proxiedFetch?: typeof fetch): Promise<DiscoveryResult> {
    // Step 1: Detect what kind of key/token this is
    const detection = detectKeyType(input.value, input.hint);

    // Step 2: Check the known API registry
    const apiInfo = this.registry.getByPlatform(detection.platform);

    // Step 3: If we don't recognize it, probe the API
    let probeResult = null;
    if (!apiInfo && detection.type === 'webhook') {
      probeResult = await this.prober.probe(input.value, proxiedFetch);
    }

    // Step 4: Generate tools
    const tools = this.toolGen.generateTools(detection, apiInfo, undefined, probeResult ?? undefined);

    // Step 5: Build a suggested system prompt for the AI agent
    const suggestedSystemPrompt = this.buildSystemPrompt(detection, apiInfo, tools);

    // Overall confidence
    const confidence = apiInfo ? Math.max(detection.confidence, 0.9) : detection.confidence;

    return {
      detection,
      apiInfo,
      probeResult,
      tools,
      confidence,
      suggestedSystemPrompt,
    };
  }

  /** Access the registry for custom platform registration */
  getRegistry(): APIRegistry {
    return this.registry;
  }

  private buildSystemPrompt(
    detection: ReturnType<typeof detectKeyType>,
    apiInfo: ReturnType<APIRegistry['getByPlatform']>,
    tools: DiscoveryResult['tools'],
  ): string {
    const lines: string[] = [];
    lines.push(`You are a VyBot AI agent connected to the ${detection.platform} platform.`);

    if (apiInfo) {
      lines.push(`Platform: ${apiInfo.displayName}`);
      lines.push(`Base URL: ${apiInfo.baseUrl}`);
      lines.push(`Capabilities: ${apiInfo.capabilities.join(', ')}`);
      lines.push(`Documentation: ${apiInfo.docsUrl}`);
    }

    lines.push(`\nYou have ${tools.length} available tools to interact with this API.`);
    lines.push('Always use the appropriate tool to perform actions. Never fabricate API responses.');
    lines.push('If you encounter an error, report it clearly to the user.');
    lines.push('Be helpful, concise, and follow the user\'s task instructions precisely.');

    return lines.join('\n');
  }
}
