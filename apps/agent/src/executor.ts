import {
  AIRouter,
  EventBus,
  StateManager,
  PromptEngineer,
  type VyEvent,
  type AIMessage,
  type AITool,
} from '@vybot/core';
import { AdapterManager } from '@vybot/adapters';

export interface TaskConfig {
  taskId: string;
  connectionId: string;
  description: string;
  systemPrompt?: string;
  triggerType: 'event' | 'cron' | 'manual';
  cronIntervalMs?: number;
}

/**
 * Task Executor — 24/7 Autonomous Event-Driven Agent Loop with Self-Healing ReAct.
 *
 * 1. Listens for events from adapters (Discord, Telegram, Webhook, MCP, Cron, Mock)
 * 2. Dynamically crafts/optimizes the system prompt with context & history
 * 3. Consults the multi-provider AIRouter (Gemini, Groq, Cerebras, NVIDIA, Mistral, etc.)
 * 4. Executes requested tool actions with automatic self-healing error recovery
 * 5. Persists state after every execution cycle
 */
export class TaskExecutor {
  private aiRouter: AIRouter;
  private stateManager: StateManager;
  private adapterManager: AdapterManager;
  private eventBus: EventBus;
  private tasks: Map<string, TaskConfig> = new Map();
  private cronTimers: Map<string, NodeJS.Timeout> = new Map();
  private running = false;
  private maxRetries = 2;

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

    // If running and task has cron/interval, setup schedule
    if (this.running && config.triggerType === 'cron') {
      this.scheduleCronTask(config);
    }
  }

  /** Start the executor — listen for events and schedule cron tasks */
  async start(): Promise<void> {
    this.running = true;
    console.log(`[Executor] Starting with ${this.tasks.size} task(s)`);

    // Wire up adapter events to our event handler
    this.adapterManager.onEvent(async (event) => {
      this.eventBus.emitEvent(event);
      await this.handleEvent(event);
    });

    // Connect all adapters
    await this.adapterManager.connectAll();

    // Schedule any cron tasks
    for (const [, config] of this.tasks) {
      if (config.triggerType === 'cron') {
        this.scheduleCronTask(config);
      }
    }

    console.log('[Executor] All adapters connected and task schedules active. Listening for events...');
  }

  /** Stop the executor gracefully */
  async stop(): Promise<void> {
    this.running = false;

    // Clear cron timers
    for (const [, timer] of this.cronTimers) {
      clearInterval(timer);
    }
    this.cronTimers.clear();

    await this.adapterManager.disconnectAll();
    await this.stateManager.persistAll();
    console.log('[Executor] Stopped and all states persisted');
  }

  /** Manually trigger event processing (e.g. for testing or manual triggers) */
  async handleEvent(event: VyEvent): Promise<void> {
    for (const [taskId, config] of this.tasks) {
      if (!this.running) break;
      await this.processTaskForEvent(taskId, config, event);
    }
  }

  /** Get registered tasks count */
  get taskCount(): number {
    return this.tasks.size;
  }

  getTask(taskId: string): TaskConfig | undefined {
    return this.tasks.get(taskId);
  }

  private scheduleCronTask(config: TaskConfig): void {
    const intervalMs = config.cronIntervalMs ?? 60_000;
    console.log(`[Executor] Scheduling cron task ${config.taskId} every ${intervalMs}ms`);

    const timer = setInterval(async () => {
      if (!this.running) return;
      const cronEvent: VyEvent = {
        id: `cron_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        source: 'cron',
        type: 'command',
        data: {
          action: 'scheduled_heartbeat',
          timestamp: new Date().toISOString(),
        },
        timestamp: new Date(),
      };
      this.eventBus.emitEvent(cronEvent);
      await this.processTaskForEvent(config.taskId, config, cronEvent);
    }, intervalMs);

    this.cronTimers.set(config.taskId, timer);
  }

  private async processTaskForEvent(taskId: string, config: TaskConfig, event: VyEvent): Promise<void> {
    try {
      const state = await this.stateManager.getState(taskId);
      const adapter = this.adapterManager.getAdapter(config.connectionId);

      // Build tool definitions
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

      // Generate dynamic high-performance system prompt
      const systemPrompt = config.systemPrompt
        ? `${config.systemPrompt}\n\nTask: ${config.description}`
        : PromptEngineer.generateSystemPrompt({
            taskId,
            taskDescription: config.description,
            availableTools: tools,
            totalActionsExecuted: state.totalActionsExecuted,
            previousErrors: state.errorCount > 0 ? [`Son hata sayısı: ${state.errorCount}`] : undefined,
          });

      const messages: AIMessage[] = [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `New incoming event:\n${JSON.stringify(event.data, null, 2)}\n\nMetadata: Source=${event.source}, Type=${event.type}, Timestamp=${event.timestamp}`,
        },
      ];

      // ReAct Loop with Self-Healing Retries
      let retryCount = 0;
      let totalExecutedInCycle = 0;
      let lastExecutedAction: any = null;

      while (retryCount <= this.maxRetries) {
        const startMs = Date.now();
        const response = await this.aiRouter.chat(messages, tools.length > 0 ? tools : undefined);

        // Record assistant response
        messages.push({
          role: 'assistant',
          content: response.content,
          toolCalls: response.toolCalls,
        });

        // If no tool calls, task cycle finished normally
        if (!response.toolCalls || response.toolCalls.length === 0) {
          console.log(`[Executor] Completed cycle for task ${taskId} without tools in ${Date.now() - startMs}ms (${response.provider})`);
          break;
        }

        // Execute tool calls
        let hasToolError = false;
        for (const tc of response.toolCalls) {
          if (!adapter) break;

          let args: Record<string, any> = {};
          try {
            args = JSON.parse(tc.function.arguments);
          } catch {
            args = {};
          }

          const actionPayload = {
            id: tc.id,
            type: tc.function.name,
            params: args,
          };

          const result = await adapter.executeAction(actionPayload);
          totalExecutedInCycle++;
          lastExecutedAction = actionPayload;

          if (result.success) {
            console.log(`[Executor] Tool ${tc.function.name} => OK (${result.latencyMs ?? 0}ms)`);
            messages.push({
              role: 'tool',
              name: tc.function.name,
              toolCallId: tc.id,
              content: JSON.stringify({ status: 'success', data: result.data }),
            });
          } else {
            console.warn(`[Executor] Tool ${tc.function.name} => ERROR: ${result.error}`);
            hasToolError = true;
            messages.push({
              role: 'tool',
              name: tc.function.name,
              toolCallId: tc.id,
              content: JSON.stringify({ status: 'error', error: result.error }),
            });
          }
        }

        // If any tool failed, let the AI attempt self-correction in next loop iteration
        if (hasToolError) {
          retryCount++;
          if (retryCount <= this.maxRetries) {
            console.log(`[Executor] Triggering self-healing recovery loop (attempt ${retryCount}/${this.maxRetries})`);
            continue;
          }
        }

        break;
      }

      // Persist updated state
      await this.stateManager.updateState(taskId, {
        lastEvent: event,
        lastAction: lastExecutedAction,
        totalActionsExecuted: state.totalActionsExecuted + totalExecutedInCycle,
      });
      await this.stateManager.persistState(taskId);
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
