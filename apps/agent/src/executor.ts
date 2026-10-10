import { AIRouter, EventBus, StateManager, type VyEvent, type AIMessage, type AITool } from '@vybot/core';
import { AdapterManager } from '@vybot/adapters';

export interface TaskConfig {
  taskId: string;
  connectionId: string;
  description: string;
  systemPrompt: string;
  triggerType: 'event' | 'cron' | 'manual';
}

/**
 * Task Executor — the 7/24 event-driven agent loop.
 *
 * 1. Listens for events from adapters
 * 2. Sends them to the AI with context
 * 3. Executes the AI's decided actions via adapters
 * 4. Persists state after each cycle
 */
export class TaskExecutor {
  private aiRouter: AIRouter;
  private stateManager: StateManager;
  private adapterManager: AdapterManager;
  private eventBus: EventBus;
  private tasks: Map<string, TaskConfig> = new Map();
  private running = false;

  constructor(
    aiRouter: AIRouter,
    stateManager: StateManager,
    adapterManager: AdapterManager,
    eventBus: EventBus,
  ) {
    this.aiRouter = aiRouter;
    this.stateManager = stateManager;
    this.adapterManager = adapterManager;
    this.eventBus = eventBus;
  }

  /** Register a task for execution */
  addTask(config: TaskConfig): void {
    this.tasks.set(config.taskId, config);
    console.log(`[Executor] Task registered: ${config.taskId} — "${config.description}"`);
  }

  /** Start the executor — listen for events and process them */
  async start(): Promise<void> {
    this.running = true;
    console.log(`[Executor] Starting with ${this.tasks.size} task(s)`);

    // Wire up the adapter manager events to our handler
    this.adapterManager.onEvent(async (event) => {
      this.eventBus.emitEvent(event);
      await this.handleEvent(event);
    });

    // Connect all adapters
    await this.adapterManager.connectAll();
    console.log('[Executor] All adapters connected. Listening for events...');
  }

  /** Stop the executor gracefully */
  async stop(): Promise<void> {
    this.running = false;
    await this.adapterManager.disconnectAll();
    await this.stateManager.persistAll();
    console.log('[Executor] Stopped and state persisted');
  }

  /** Handle an incoming event from any adapter */
  private async handleEvent(event: VyEvent): Promise<void> {
    for (const [taskId, config] of this.tasks) {
      if (!this.running) break;

      try {
        const state = await this.stateManager.getState(taskId);

        // Build the AI messages
        const messages: AIMessage[] = [
          {
            role: 'system',
            content: this.buildSystemMessage(config, state),
          },
          {
            role: 'user',
            content: `New event received:\n${JSON.stringify(event.data, null, 2)}\n\nSource: ${event.source}, Type: ${event.type}`,
          },
        ];

        // Build available tools from adapter capabilities
        const adapter = this.adapterManager.getAdapter(config.connectionId);
        const tools: AITool[] = adapter
          ? adapter.getCapabilities().map((cap) => ({
              name: cap.action,
              description: cap.description,
              parameters: {
                type: 'object',
                properties: cap.parameters,
                required: Object.entries(cap.parameters)
                  .filter(([, v]) => (v as any).required)
                  .map(([k]) => k),
              },
            }))
          : [];

        // Ask the AI what to do
        const startMs = Date.now();
        const response = await this.aiRouter.chat(messages, tools.length > 0 ? tools : undefined);

        // If the AI wants to call tools, execute them
        if (response.toolCalls && response.toolCalls.length > 0 && adapter) {
          for (const tc of response.toolCalls) {
            const args = JSON.parse(tc.function.arguments);
            const result = await adapter.executeAction({
              id: tc.id,
              type: tc.function.name,
              params: args,
            });
            console.log(`[Executor] Tool ${tc.function.name} => ${result.success ? 'OK' : result.error}`);
          }
        }

        // Update state
        await this.stateManager.updateState(taskId, {
          lastEvent: event,
          lastAction: response.toolCalls?.[0]
            ? { id: response.toolCalls[0].id, type: response.toolCalls[0].function.name, params: JSON.parse(response.toolCalls[0].function.arguments) }
            : null,
          totalActionsExecuted: state.totalActionsExecuted + (response.toolCalls?.length ?? 0),
        });
        await this.stateManager.persistState(taskId);

        console.log(`[Executor] Event processed for task ${taskId} in ${Date.now() - startMs}ms (${response.provider})`);
      } catch (err) {
        console.error(`[Executor] Error processing task ${taskId}:`, err);
        const state = await this.stateManager.getState(taskId);
        await this.stateManager.updateState(taskId, {
          errorCount: state.errorCount + 1,
          status: state.errorCount >= 10 ? 'error' : 'active',
        });
      }
    }
  }

  private buildSystemMessage(config: TaskConfig, state: any): string {
    return `${config.systemPrompt}\n\n--- TASK ---\n${config.description}\n\n--- CONTEXT ---\nTotal actions executed so far: ${state.totalActionsExecuted}\nErrors: ${state.errorCount}\n\nInstructions: Analyze the incoming event and decide what action to take based on the task description. Use the available tools to perform actions. If no action is needed, respond with a brief explanation.`;
  }
}
