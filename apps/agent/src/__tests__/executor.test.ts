import { describe, it, expect, beforeEach } from 'vitest';
import { AIRouter, EventBus, StateManager } from '@vybot/core';
import { AdapterManager, MockAdapter } from '@vybot/adapters';
import { TaskExecutor } from '../executor';

describe('TaskExecutor (Autonomous 24/7 Agent Loop)', () => {
  let aiRouter: AIRouter;
  let eventBus: EventBus;
  let stateManager: StateManager;
  let adapterManager: AdapterManager;
  let mockAdapter: MockAdapter;
  let executor: TaskExecutor;

  beforeEach(() => {
    aiRouter = new AIRouter({ allowMockFallback: true });
    eventBus = new EventBus();
    stateManager = new StateManager();
    adapterManager = new AdapterManager();

    mockAdapter = new MockAdapter({
      id: 'conn_test_1',
      name: 'Test Mock Adapter',
      platform: 'mock',
      credentials: { iv: '', ciphertext: '', authTag: '' },
    });

    adapterManager.registerAdapter(mockAdapter);
    executor = new TaskExecutor(aiRouter, stateManager, adapterManager, eventBus);
  });

  it('registers tasks and tracks task count', () => {
    executor.addTask({
      taskId: 'task_1',
      connectionId: 'conn_test_1',
      description: 'Otonom Discord moderatörü',
      triggerType: 'event',
    });

    expect(executor.taskCount).toBe(1);
    expect(executor.getTask('task_1')?.description).toBe('Otonom Discord moderatörü');
  });

  it('processes incoming events end-to-end and updates task state', async () => {
    executor.addTask({
      taskId: 'task_autonomous_responder',
      connectionId: 'conn_test_1',
      description: 'Gelen sorulara yardım et ve mesaj gönder',
      triggerType: 'event',
    });

    await executor.start();

    // Trigger an incoming event on the adapter
    await mockAdapter.simulateEvent('message', {
      user: 'alice',
      content: 'Sunucuya nasıl kayıt olurum?',
    });

    // Check state updated
    const state = await stateManager.getState('task_autonomous_responder');
    expect(state.totalActionsExecuted).toBeGreaterThanOrEqual(1);
    expect(mockAdapter.getExecutedActions().length).toBeGreaterThanOrEqual(1);

    await executor.stop();
  });
});
