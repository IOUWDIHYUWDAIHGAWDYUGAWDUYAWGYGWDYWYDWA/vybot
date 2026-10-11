import { BaseAdapter, type AdapterCapability, type AdapterConfig } from './base';
import type { VyEvent, VyAction, VyResult } from '@vybot/core';

export class MockAdapter extends BaseAdapter {
  readonly name = 'MockAdapter';
  readonly platform = 'mock';

  private executedActions: VyAction[] = [];

  constructor(
    config: AdapterConfig = {
      id: 'mock_adapter',
      name: 'Mock Adapter',
      platform: 'mock',
      credentials: { iv: '', ciphertext: '', authTag: '' },
    }
  ) {
    super(config);
  }

  async connect(): Promise<void> {
    this.connected = true;
    console.log(`[${this.name}] Connected (simulation mode)`);
  }

  async disconnect(): Promise<void> {
    this.connected = false;
    console.log(`[${this.name}] Disconnected`);
  }

  getCapabilities(): AdapterCapability[] {
    return [
      {
        action: 'send_message',
        description: 'Send a simulated text message to a channel or user',
        parameters: {
          channelId: { type: 'string', description: 'Target channel or user ID', required: true },
          content: { type: 'string', description: 'Message content to send', required: true },
        },
      },
      {
        action: 'log_event',
        description: 'Log an event or telemetry to the autonomous audit log',
        parameters: {
          level: { type: 'string', description: 'Log level: info, warn, error', required: true },
          message: { type: 'string', description: 'Log message', required: true },
        },
      },
      {
        action: 'trigger_webhook',
        description: 'Simulate dispatching a downstream webhook',
        parameters: {
          endpoint: { type: 'string', description: 'Target webhook URL', required: true },
          payload: { type: 'object', description: 'Payload object to dispatch', required: true },
        },
      },
    ];
  }

  async executeAction(action: VyAction): Promise<VyResult> {
    this.executedActions.push(action);
    const startMs = Date.now();

    console.log(`[${this.name}] Executing action ${action.type}:`, action.params);

    return {
      success: true,
      data: {
        actionId: action.id,
        type: action.type,
        params: action.params,
        timestamp: new Date().toISOString(),
      },
      latencyMs: Date.now() - startMs,
    };
  }

  /**
   * Helper method to simulate an incoming event for testing or autonomous cycles.
   */
  async simulateEvent(
    type: VyEvent['type'],
    data: Record<string, any>,
    source: VyEvent['source'] = 'custom'
  ): Promise<void> {
    const event: VyEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      source,
      type,
      data,
      timestamp: new Date(),
    };
    await this.emitEvent(event);
  }

  getExecutedActions(): VyAction[] {
    return [...this.executedActions];
  }

  clearExecutedActions(): void {
    this.executedActions = [];
  }
}
