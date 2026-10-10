import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  date,
  timestamp,
  jsonb,
  unique,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ─── Users ────────────────────────────────────────────────

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  name: varchar('name', { length: 255 }),
  passwordHash: text('password_hash'),
  plan: varchar('plan', { length: 20 }).default('free').notNull(),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  connections: many(connections),
  tasks: many(tasks),
  usage: many(usage),
}));

// ─── Connections ──────────────────────────────────────────

export const connections = pgTable('connections', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 20 }).notNull(), // api_key, webhook, mcp, oauth
  platform: varchar('platform', { length: 50 }), // discord, telegram, slack, custom
  encryptedCredentials: text('encrypted_credentials').notNull(),
  credentialsIv: text('credentials_iv').notNull(),
  credentialsAuthTag: text('credentials_auth_tag').notNull(),
  status: varchar('status', { length: 20 }).default('pending').notNull(),
  discoveredTools: jsonb('discovered_tools'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const connectionsRelations = relations(connections, ({ one, many }) => ({
  user: one(users, { fields: [connections.userId], references: [users.id] }),
  tasks: many(tasks),
}));

// ─── Tasks ────────────────────────────────────────────────

export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  connectionId: uuid('connection_id').notNull().references(() => connections.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  systemPrompt: text('system_prompt'),
  status: varchar('status', { length: 20 }).default('active').notNull(),
  triggerType: varchar('trigger_type', { length: 20 }), // event, cron, manual
  triggerConfig: jsonb('trigger_config'),
  lastRunAt: timestamp('last_run_at', { withTimezone: true }),
  errorCount: integer('error_count').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  user: one(users, { fields: [tasks.userId], references: [users.id] }),
  connection: one(connections, { fields: [tasks.connectionId], references: [connections.id] }),
  logs: many(agentLogs),
}));

// ─── Agent Logs ───────────────────────────────────────────

export const agentLogs = pgTable('agent_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  taskId: uuid('task_id').notNull().references(() => tasks.id, { onDelete: 'cascade' }),
  eventType: varchar('event_type', { length: 50 }),
  eventData: jsonb('event_data'),
  aiResponse: jsonb('ai_response'),
  actionResult: jsonb('action_result'),
  tokensUsed: integer('tokens_used'),
  provider: varchar('provider', { length: 20 }),
  durationMs: integer('duration_ms'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const agentLogsRelations = relations(agentLogs, ({ one }) => ({
  task: one(tasks, { fields: [agentLogs.taskId], references: [tasks.id] }),
}));

// ─── Usage Tracking ───────────────────────────────────────

export const usage = pgTable(
  'usage',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    date: date('date').notNull(),
    aiRequests: integer('ai_requests').default(0).notNull(),
    tokensUsed: integer('tokens_used').default(0).notNull(),
    connectionsCount: integer('connections_count').default(0).notNull(),
  },
  (table) => [unique('usage_user_date').on(table.userId, table.date)],
);

export const usageRelations = relations(usage, ({ one }) => ({
  user: one(users, { fields: [usage.userId], references: [users.id] }),
}));
