import { describe, it, expect } from 'vitest';
import { MockAdapter, AdapterManager } from '../index';

describe('Adapters & AdapterManager', () => {
  it('connects, executes actions, and reports capabilities on MockAdapter', async () => {
    const adapter = new MockAdapter();
    await adapter.connect();

    expect(adapter.isConnected()).toBe(true);

    const capabilities = adapter.getCapabilities();
    expect(capabilities.length).toBeGreaterThan(0);
    expect(capabilities.some((c) => c.action === 'send_message')).toBe(true);

    const result = await adapter.executeAction({
      id: 'act_1',
      type: 'send_message',
      params: { channelId: 'general', content: 'Testing message' },
    });

    expect(result.success).toBe(true);
    expect(adapter.getExecutedActions().length).toBe(1);

    await adapter.disconnect();
    expect(adapter.isConnected()).toBe(false);
  });

  it('manages adapter lifecycle via AdapterManager', async () => {
    const manager = new AdapterManager();
    const adapter = new MockAdapter({
      id: 'mock_test_conn',
      name: 'Test Mock Adapter',
      platform: 'mock',
      credentials: { iv: '', ciphertext: '', authTag: '' },
    });

    manager.registerAdapter(adapter);
    expect(manager.getAdapter('mock_test_conn')).toBe(adapter);

    await manager.connectAll();
    expect(manager.getActiveAdapters().length).toBe(1);

    await manager.disconnectAll();
    expect(manager.getActiveAdapters().length).toBe(0);
  });
});
