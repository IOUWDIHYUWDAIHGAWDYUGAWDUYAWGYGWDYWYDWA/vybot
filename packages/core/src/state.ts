import type { VyEvent, VyAction, TaskStatus } from './types.js';

/** Persistent state snapshot for a running agent task */
export interface AgentState {
  taskId: string;
  status: TaskStatus;
  lastEvent: VyEvent | null;
  lastAction: VyAction | null;
  /** Key-value memory the agent can read/write across runs */
  memory: Record<string, unknown>;
  /** Summarized context of recent activity (kept small for the prompt) */
  contextSummary: string;
  errorCount: number;
  totalActionsExecuted: number;
  lastRunAt: Date | null;
  createdAt: Date;
}

/** Hook interface – the DB package will provide the real implementation */
export interface StatePersistence {
  save(taskId: string, state: AgentState): Promise<void>;
  load(taskId: string): Promise<AgentState | null>;
  delete(taskId: string): Promise<void>;
}

/** In-memory fallback when no DB persistence is configured */
class InMemoryPersistence implements StatePersistence {
  private store = new Map<string, AgentState>();
  async save(taskId: string, state: AgentState) { this.store.set(taskId, structuredClone(state)); }
  async load(taskId: string) { return this.store.get(taskId) ?? null; }
  async delete(taskId: string) { this.store.delete(taskId); }
}

export class StateManager {
  private states = new Map<string, AgentState>();
  private persistence: StatePersistence;

  constructor(persistence?: StatePersistence) {
    this.persistence = persistence ?? new InMemoryPersistence();
  }

  /** Get or create state for a task */
  async getState(taskId: string): Promise<AgentState> {
    let state = this.states.get(taskId);
    if (!state) {
      state = await this.persistence.load(taskId) ?? this.createDefault(taskId);
      this.states.set(taskId, state);
    }
    return state;
  }

  /** Partially update an existing state */
  async updateState(taskId: string, partial: Partial<AgentState>): Promise<AgentState> {
    const state = await this.getState(taskId);
    Object.assign(state, partial);
    state.lastRunAt = new Date();
    this.states.set(taskId, state);
    return state;
  }

  /** Persist current in-memory state to the backing store */
  async persistState(taskId: string): Promise<void> {
    const state = this.states.get(taskId);
    if (state) {
      await this.persistence.save(taskId, state);
    }
  }

  /** Persist all dirty states */
  async persistAll(): Promise<void> {
    const promises = Array.from(this.states.keys()).map((id) => this.persistState(id));
    await Promise.all(promises);
  }

  /** Remove a task's state completely */
  async removeState(taskId: string): Promise<void> {
    this.states.delete(taskId);
    await this.persistence.delete(taskId);
  }

  private createDefault(taskId: string): AgentState {
    return {
      taskId,
      status: 'active',
      lastEvent: null,
      lastAction: null,
      memory: {},
      contextSummary: '',
      errorCount: 0,
      totalActionsExecuted: 0,
      lastRunAt: null,
      createdAt: new Date(),
    };
  }
}
