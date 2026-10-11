import { describe, it, expect } from 'vitest';
import { users, connections, tasks, agentLogs, usage } from '../schema';

describe('Database Schema Definitions', () => {
  it('defines the core tables with expected column definitions', () => {
    expect(users).toBeDefined();
    expect(connections).toBeDefined();
    expect(tasks).toBeDefined();
    expect(agentLogs).toBeDefined();
    expect(usage).toBeDefined();

    expect(users.id).toBeDefined();
    expect(users.email).toBeDefined();
    expect(connections.encryptedCredentials).toBeDefined();
    expect(tasks.triggerType).toBeDefined();
  });
});
