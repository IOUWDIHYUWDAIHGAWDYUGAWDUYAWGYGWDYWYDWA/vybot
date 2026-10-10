import { EventEmitter } from 'node:events';
import { VyEvent, VyEventSource, VyEventType } from './types.js';

export type VyEventHandler = (event: VyEvent) => void | Promise<void>;

export interface EventBusOptions {
  historyLimit?: number;
}

export class EventBus extends EventEmitter {
  private history: VyEvent[] = [];
  private readonly historyLimit: number;

  constructor(options: EventBusOptions = {}) {
    super();
    this.historyLimit = options.historyLimit ?? 100;
  }

  public emitEvent(event: VyEvent): boolean {
    this.history.push(event);
    if (this.history.length > this.historyLimit) {
      this.history.shift();
    }

    // Emit on wildcards and specific channels
    this.emit('*', event);
    this.emit(`source:${event.source}`, event);
    this.emit(`type:${event.type}`, event);
    this.emit(`${event.source}:${event.type}`, event);

    return true;
  }

  public onAny(handler: VyEventHandler): this {
    return this.on('*', handler);
  }

  public onSource(source: VyEventSource, handler: VyEventHandler): this {
    return this.on(`source:${source}`, handler);
  }

  public onType(type: VyEventType, handler: VyEventHandler): this {
    return this.on(`type:${type}`, handler);
  }

  public onSpecific(source: VyEventSource, type: VyEventType, handler: VyEventHandler): this {
    return this.on(`${source}:${type}`, handler);
  }

  public getRecentEvents(count: number = 10): VyEvent[] {
    return this.history.slice(-count);
  }

  public clearHistory(): void {
    this.history = [];
  }
}
