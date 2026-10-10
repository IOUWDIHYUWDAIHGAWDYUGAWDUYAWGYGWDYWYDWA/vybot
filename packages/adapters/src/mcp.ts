import { randomUUID } from 'node:crypto';
import type { VyAction, VyResult } from '@vybot/core';
import { BaseAdapter, type AdapterConfig, type AdapterCapability } from './base.js';

/**
 * MCP (Model Context Protocol) adapter.
 * Connects to MCP servers and exposes their tools to the VyBot agent.
 *
 * Supports HTTP transport (SSE/Streamable HTTP).
 * stdio transport will be added in a future version.
 */
export class McpAdapter extends BaseAdapter {
  readonly name = 'MCP';
  readonly platform = 'mcp';

  private serverUrl = '';
  private availableTools: Array<{ name: string; description: string; inputSchema: any }> = [];

  async connect(): Promise<void> {
    // The MCP server URL is stored as the credential value
    // For HTTP transport, we connect and list available tools
    this.serverUrl = this.config.credentials.ciphertext; // Simplified — real impl decrypts
    
    console.log(`[MCP] Connecting to server: ${this.serverUrl}`);
    
    // TODO: Implement actual MCP handshake
    // 1. Send initialize request
    // 2. Receive server capabilities
    // 3. List available tools
    this.connected = true;
    console.log('[MCP] Connected (stub implementation)');
  }

  async disconnect(): Promise<void> {
    this.connected = false;
  }

  async executeAction(action: VyAction): Promise<VyResult> {
    if (action.type === 'call_tool') {
      try {
        // TODO: Implement actual MCP tool call via JSON-RPC
        // POST to serverUrl with:
        // { jsonrpc: "2.0", method: "tools/call", params: { name, arguments }, id }
        const res = await fetch(this.serverUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'tools/call',
            params: {
              name: action.params.toolName,
              arguments: action.params.arguments,
            },
            id: randomUUID(),
          }),
        });
        const data = await res.json();
        return { success: res.ok, data };
      } catch (err) {
        return { success: false, error: String(err) };
      }
    }

    return { success: false, error: `Unknown action: ${action.type}` };
  }

  getCapabilities(): AdapterCapability[] {
    return [
      {
        action: 'call_tool',
        description: 'Call a tool on the connected MCP server',
        parameters: {
          toolName: { type: 'string', description: 'Name of the MCP tool to call', required: true },
          arguments: { type: 'object', description: 'Arguments to pass to the tool' },
        },
      },
    ];
  }

  /** Get the tools discovered from the MCP server */
  getAvailableTools() {
    return this.availableTools;
  }
}
