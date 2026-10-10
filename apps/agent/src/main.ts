import { AIRouter, EventBus, StateManager } from '@vybot/core';
import { AdapterManager, DiscordAdapter } from '@vybot/adapters';
import { TaskExecutor } from './executor';

/**
 * VyBot Agent — Main entry point.
 *
 * Initializes all systems and starts the event-driven agent loop.
 */
async function main() {
  console.log('═══════════════════════════════════════════');
  console.log('  VyBot Agent v0.1.0 — Starting up...     ');
  console.log('═══════════════════════════════════════════');

  // ─── Initialize Core Systems ────────────────────────────
  const aiRouter = new AIRouter();
  const eventBus = new EventBus({ historyLimit: 200 });
  const stateManager = new StateManager();
  const adapterManager = new AdapterManager();

  // ─── Create Task Executor ───────────────────────────────
  const executor = new TaskExecutor(aiRouter, stateManager, adapterManager, eventBus);

  // ─── Graceful Shutdown ──────────────────────────────────
  const shutdown = async (signal: string) => {
    console.log(`\n[VyBot] Received ${signal}, shutting down gracefully...`);
    await executor.stop();
    process.exit(0);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  // ─── Health Check Server (for watchdog) ─────────────────
  const healthPort = parseInt(process.env.HEALTH_PORT ?? '3001', 10);

  const { createServer } = await import('node:http');
  createServer((_req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      uptime: process.uptime(),
      tasks: executor['tasks'].size,
      adapters: adapterManager.getActiveAdapters().length,
    }));
  }).listen(healthPort);

  console.log(`[VyBot] Health check on port ${healthPort}`);

  // ─── Start Executor ─────────────────────────────────────
  await executor.start();

  console.log('═══════════════════════════════════════════');
  console.log('  VyBot Agent is LIVE — waiting for events ');
  console.log('═══════════════════════════════════════════');

  // Keep the process alive
  await new Promise(() => {});
}

main().catch((err) => {
  console.error('[VyBot] Fatal error:', err);
  process.exit(1);
});
