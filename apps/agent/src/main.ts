import { AIRouter, EventBus, StateManager } from '@vybot/core';
import { AdapterManager, MockAdapter } from '@vybot/adapters';
import { TaskExecutor } from './executor';

/**
 * VyBot Agent — 24/7 Autonomous Agent Runtime Main Entry Point.
 *
 * Initializes multi-provider AI Router, State Manager, Adapters, and the Self-Healing ReAct Loop.
 */
async function main() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  VyBot Agent v0.2.0 — 24/7 Autonomous AI Runtime     ');
  console.log('═══════════════════════════════════════════════════════');

  // ─── Initialize Core Systems ────────────────────────────
  const aiRouter = new AIRouter({ allowMockFallback: true });
  const eventBus = new EventBus({ historyLimit: 200 });
  const stateManager = new StateManager();
  const adapterManager = new AdapterManager();

  // Print configured AI Providers
  const activeProviders = aiRouter.getConfiguredProviders();
  console.log(`[VyBot] Active AI Providers (${activeProviders.length}): ${activeProviders.join(', ') || 'Mock/Dev Fallback'}`);

  // ─── Setup Adapters ─────────────────────────────────────
  // If no external adapter credentials configured, register autonomous Mock/Console adapter
  const mockAdapter = new MockAdapter({
    id: 'default_system_adapter',
    name: 'VyBot System Console Adapter',
    platform: 'mock',
    credentials: { iv: '', ciphertext: '', authTag: '' },
  });
  adapterManager.registerAdapter(mockAdapter);

  // ─── Create Task Executor ───────────────────────────────
  const executor = new TaskExecutor(aiRouter, stateManager, adapterManager, eventBus);

  // Register default 24/7 autonomous monitoring & event handler task
  executor.addTask({
    taskId: 'task_autonomous_system_watcher',
    connectionId: 'default_system_adapter',
    description: '7/24 Otonom sistem sağlık kontrolü, gelen olayları analiz etme ve proaktif bildirim üretme görevi.',
    triggerType: 'cron',
    cronIntervalMs: 30_000, // Every 30 seconds
  });

  // ─── Graceful Shutdown ──────────────────────────────────
  const shutdown = async (signal: string) => {
    console.log(`\n[VyBot] Received ${signal}, shutting down gracefully...`);
    await executor.stop();
    process.exit(0);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  // ─── Health Check Server (for watchdog / docker / cloud) ─
  const healthPort = parseInt(process.env.HEALTH_PORT ?? '3001', 10);

  const { createServer } = await import('node:http');
  createServer((_req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      uptime: process.uptime(),
      tasks: executor.taskCount,
      activeAdapters: adapterManager.getActiveAdapters().length,
      configuredAiProviders: activeProviders,
    }));
  }).listen(healthPort);

  console.log(`[VyBot] Health check running on port ${healthPort}`);

  // ─── Start Executor ─────────────────────────────────────
  await executor.start();

  console.log('═══════════════════════════════════════════════════════');
  console.log('  VyBot Agent is LIVE — 24/7 Autonomous Loop Active   ');
  console.log('═══════════════════════════════════════════════════════');

  // Keep the process alive
  await new Promise(() => {});
}

main().catch((err) => {
  console.error('[VyBot] Fatal error:', err);
  process.exit(1);
});
