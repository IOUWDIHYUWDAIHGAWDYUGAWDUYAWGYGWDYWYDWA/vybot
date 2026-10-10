import { createClient, type Client } from '@libsql/client';

/**
 * Create a Turso (libSQL) client for agent long-term memory.
 * Uses TURSO_URL and TURSO_AUTH_TOKEN from environment by default.
 */
export function createTursoClient(url?: string, authToken?: string): Client {
  const tursoUrl = url ?? process.env.TURSO_URL;
  const tursoToken = authToken ?? process.env.TURSO_AUTH_TOKEN;
  if (!tursoUrl) {
    throw new Error('TURSO_URL is required.');
  }
  return createClient({
    url: tursoUrl,
    authToken: tursoToken,
  });
}

/**
 * Initialize the memory tables if they don't exist.
 */
export async function initMemoryTables(client: Client): Promise<void> {
  await client.batch([
    `CREATE TABLE IF NOT EXISTS agent_memory (
      task_id TEXT NOT NULL,
      key TEXT NOT NULL,
      value TEXT NOT NULL,
      updated_at TEXT DEFAULT (datetime('now')),
      PRIMARY KEY (task_id, key)
    )`,
    `CREATE TABLE IF NOT EXISTS conversation_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE INDEX IF NOT EXISTS idx_conv_task ON conversation_history(task_id, id DESC)`,
  ]);
}

/** Save a key-value pair to agent memory */
export async function saveMemory(client: Client, taskId: string, key: string, value: string): Promise<void> {
  await client.execute({
    sql: `INSERT INTO agent_memory (task_id, key, value, updated_at) VALUES (?, ?, ?, datetime('now'))
          ON CONFLICT (task_id, key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
    args: [taskId, key, value],
  });
}

/** Get a memory value for a task */
export async function getMemory(client: Client, taskId: string, key: string): Promise<string | null> {
  const result = await client.execute({ sql: 'SELECT value FROM agent_memory WHERE task_id = ? AND key = ?', args: [taskId, key] });
  return (result.rows[0]?.value as string) ?? null;
}

/** Get all memory entries for a task */
export async function getAllMemory(client: Client, taskId: string): Promise<Record<string, string>> {
  const result = await client.execute({ sql: 'SELECT key, value FROM agent_memory WHERE task_id = ?', args: [taskId] });
  const memory: Record<string, string> = {};
  for (const row of result.rows) {
    memory[row.key as string] = row.value as string;
  }
  return memory;
}

/** Append a message to conversation history */
export async function appendConversation(client: Client, taskId: string, role: string, content: string): Promise<void> {
  await client.execute({ sql: 'INSERT INTO conversation_history (task_id, role, content) VALUES (?, ?, ?)', args: [taskId, role, content] });
}

/** Get recent conversation history for context */
export async function getConversationHistory(
  client: Client,
  taskId: string,
  limit: number = 20,
): Promise<Array<{ role: string; content: string }>> {
  const result = await client.execute({
    sql: 'SELECT role, content FROM conversation_history WHERE task_id = ? ORDER BY id DESC LIMIT ?',
    args: [taskId, limit],
  });
  return result.rows.reverse().map((r) => ({ role: r.role as string, content: r.content as string }));
}
