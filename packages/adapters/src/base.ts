import type { VyEvent, VyAction, VyResult } from '@vybot/core';
import type { EncryptedData } from '@vybot/crypto';

/** Configuration needed to create an adapter */
export interface AdapterConfig {
  id: string;
  name: string;
  platform: string;
  credentials: EncryptedData;
}

/** Describes a single capability of an adapter */
export interface AdapterCapability {
  action: string;
  description: string;
  parameters: Record<string, { type: string; description: string; required?: boolean }>;
}

/**
 * Base class for all platform adapters.
 * Each adapter converts platform-specific events to/from the universal VyEvent format.
 */
export abstract class BaseAdapter {
  abstract readonly name: string;
  abstract readonly platform: string;

  protected config: AdapterConfig;
  protected connected = false;
  private eventHandlers: Array<(event: VyEvent) => void | Promise<void>> = [];

  constructor(config: AdapterConfig) {
    this.config = config;
  }

  /** Establish connection to the platform */
  abstract connect(): Promise<void>;

  /** Gracefully disconnect */
  abstract disconnect(): Promise<void>;

  /** Execute an action on the platform */
  abstract executeAction(action: VyAction): Promise<VyResult>;

  /** Return the list of actions this adapter supports */
  abstract getCapabilities(): AdapterCapability[];

  /** Register an event handler */
  onEvent(handler: (event: VyEvent) => void | Promise<void>): void {
    this.eventHandlers.push(handler);
  }

  /** Emit a VyEvent to all registered handlers */
  protected async emitEvent(event: VyEvent): Promise<void> {
    for (const handler of this.eventHandlers) {
      try {
        await handler(event);
      } catch (err) {
        console.error(`[${this.name}] Event handler error:`, err);
      }
    }
  }

  isConnected(): boolean {
    return this.connected;
  }

  getId(): string {
    return this.config.id;
  }
}
