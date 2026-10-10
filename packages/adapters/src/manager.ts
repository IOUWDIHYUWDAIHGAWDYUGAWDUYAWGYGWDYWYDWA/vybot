import type { VyEvent } from '@vybot/core';
import { BaseAdapter } from './base';

/**
 * Manages the lifecycle of all platform adapters.
 * Routes events from any adapter to a central handler.
 */
export class AdapterManager {
  private adapters = new Map<string, BaseAdapter>();
  private centralHandler: ((event: VyEvent) => void | Promise<void>) | null = null;

  /** Register a new adapter */
  registerAdapter(adapter: BaseAdapter): void {
    this.adapters.set(adapter.getId(), adapter);

    // Wire up events to the central handler
    adapter.onEvent(async (event) => {
      if (this.centralHandler) {
        await this.centralHandler(event);
      }
    });
  }

  /** Set the central event handler that receives events from ALL adapters */
  onEvent(handler: (event: VyEvent) => void | Promise<void>): void {
    this.centralHandler = handler;
  }

  /** Get a specific adapter by ID */
  getAdapter(id: string): BaseAdapter | undefined {
    return this.adapters.get(id);
  }

  /** Get all registered adapters */
  getAllAdapters(): BaseAdapter[] {
    return Array.from(this.adapters.values());
  }

  /** Get only connected adapters */
  getActiveAdapters(): BaseAdapter[] {
    return this.getAllAdapters().filter((a) => a.isConnected());
  }

  /** Connect all registered adapters */
  async connectAll(): Promise<void> {
    const results = await Promise.allSettled(
      this.getAllAdapters().map((a) => a.connect()),
    );
    for (const [i, result] of results.entries()) {
      if (result.status === 'rejected') {
        const adapter = this.getAllAdapters()[i]!;
        console.error(`[AdapterManager] Failed to connect ${adapter.name}:`, result.reason);
      }
    }
  }

  /** Disconnect all adapters gracefully */
  async disconnectAll(): Promise<void> {
    await Promise.allSettled(
      this.getActiveAdapters().map((a) => a.disconnect()),
    );
  }

  /** Remove an adapter by ID */
  async removeAdapter(id: string): Promise<void> {
    const adapter = this.adapters.get(id);
    if (adapter?.isConnected()) {
      await adapter.disconnect();
    }
    this.adapters.delete(id);
  }
}
