# VyBot — Universal AI Agent Integration Platform 🚀

> Her yere bağlanabilen, yapay zekayla çalışan, 7/24 otonom görev platformu.

## Ne yapar?

1. **API Key / Webhook / MCP ver** → AI otomatik tanır
2. **Görev tanımla** (doğal dil ile) → "Ticket açılınca kullanıcıya yardım et"
3. **7/24 çalışsın** → AI otonom olarak görevini yürütür

## Tech Stack

- **Dil:** TypeScript (strict mode)
- **Monorepo:** pnpm + Turborepo
- **AI:** Groq → NVIDIA → OpenRouter (ücretsiz, otomatik fallback)
- **DB:** Neon PostgreSQL + Upstash Redis + Turso SQLite
- **ORM:** Drizzle

## Proje Yapısı

```
vybot/
├── apps/
│   └── agent/          # 7/24 Agent Runtime
├── packages/
│   ├── core/           # AI Router, EventBus, State Manager
│   ├── crypto/         # AES-256-GCM credential encryption
│   ├── db/             # Drizzle schema, Neon, Redis, Turso
│   ├── adapters/       # Discord, Telegram, Webhook, MCP
│   └── discovery/      # Otomatik API keşif motoru
└── .github/workflows/  # CI + Watchdog
```

## Quickstart

```bash
corepack enable
pnpm install
pnpm typecheck
```

## Durum

🟡 Faz 0 — Temel altyapı kuruldu. Geliştirme devam ediyor.
