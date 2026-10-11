import { describe, it, expect } from 'vitest';
import { EventBus } from '../index';
import type { VyEvent } from '../index';

describe('EventBus', () => {
  it('emits and receives events to matching subscribers', () => {
    const bus = new EventBus();
    const received: VyEvent[] = [];

    bus.onSpecific('discord', 'message', (evt: VyEvent) => {
      received.push(evt);
    });

    const event: VyEvent = {
      id: 'e1',
      source: 'discord',
      type: 'message',
      data: { text: 'Hello' },
      timestamp: new Date(),
    };

    bus.emitEvent(event);

    expect(received.length).toBe(1);
    expect(received[0]?.id).toBe('e1');
  });

  it('keeps event history within limit', () => {
    const bus = new EventBus({ historyLimit: 3 });

    for (let i = 0; i < 5; i++) {
      bus.emitEvent({
        id: `evt_${i}`,
        source: 'webhook',
        type: 'custom',
        data: { index: i },
        timestamp: new Date(),
      });
    }

    const history = bus.getRecentEvents(10);
    expect(history.length).toBe(3);
    expect(history[history.length - 1]?.id).toBe('evt_4');
  });
});
