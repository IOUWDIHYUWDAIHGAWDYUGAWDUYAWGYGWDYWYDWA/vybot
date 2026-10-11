# VyBot — Universal AI Agent Integration Platform 🚀

> Her platforma bağlanabilen, ücretsiz yapay zekâ sağlayıcılarıyla kesintisiz çalışan, kendi promptunu sentezleyen 7/24 otonom görev platformu.

---

## 🌟 Öne Çıkan Özellikler

1. **8+ Ücretsiz AI Token Sağlayıcısı (Sıfır Maliyet, Otomatik Fallback):**
   - Tek bir sağlayıcıya bağımlı kalmadan; limit dolduğunda veya hata aldığında anında bir sonrakine geçer.
   - **Google Gemini** (15 RPM, 1500 İstek/Gün, 1M Context — Tamamen ücretsiz)
   - **Groq** (Llama 3.3 70B & 3.1 8B — 14.400 İstek/Gün, ultra hızlı)
   - **Cerebras Cloud** (Dünyanın en hızlı LLM çıkarımı, 30 RPM, 1M Token/Gün)
   - **NVIDIA NIM** (1.000 ücretsiz kredi)
   - **Mistral AI** (La Plateforme ücretsiz katmanı)
   - **OpenRouter Free** (`:free` açık kaynak modeller)
   - **GitHub Models** (Kişisel GitHub Token ile GPT-4o-mini & Llama 3.3)
   - **Hugging Face Serverless Inference** (Açık kaynak modeller)
   - **Mock/Dev Provider** (API anahtarsız çevrimdışı geliştirme ve simülasyon)

2. **Otonom Prompt Mühendisi (`PromptEngineer`):**
   - Doğal dilde yazılmış tek satırlık görevi (örn. *"Destek bileti açılınca kullanıcıya yardımcı ol"* veya *"Sunucu çökerse Discord kanalına uyarı at"*) analiz eder.
   - ReAct protokolüne uygun, araç tanımları içeren, Türkçe/İngilizce otomatik algılamalı ve hata önleyici kurallarla donatılmış kurumsal düzeyde sistem promptunu dinamik olarak üretir.

3. **Öz-Düzeltmeli 7/24 ReAct Döngüsü (`TaskExecutor`):**
   - Olay dinleme $\rightarrow$ Akıl yürütme $\rightarrow$ Eylem çağrısı $\rightarrow$ Doğrulama.
   - Bir araç (tool) hata verdiğinde görevi yarıda kesmez; hatayı AI'a geri besleyerek parametreleri ve adımları otomatik düzeltir (Self-Healing).
   - Zamanlanmış (Cron) ve anlık olay (Event) bazlı görevleri eşzamanlı olarak yürütür.

4. **Universal Platform Adaptörleri:**
   - Discord, Telegram, Webhooks, MCP (Model Context Protocol) ve simülasyon Mock adaptörü.

5. **Kurumsal Düzeyde Güvenlik:**
   - AES-256-GCM ile kimlik bilgisi şifreleme ve donanım seviyesinde yetkilendirme etiketleri (`authTag`).

---

## 🏗️ Proje Mimarisi

```
vybot/
├── apps/
│   ├── agent/          # 7/24 Otonom Agent Runtime (Self-Healing Loop + Cron)
│   └── web/            # Next.js 15 Web Yönetim Paneli & Dashboard
├── packages/
│   ├── core/           # AIRouter (8 Provider), PromptEngineer, EventBus, StateManager
│   ├── adapters/       # Discord, Telegram, Webhook, MCP, MockAdapter
│   ├── crypto/         # AES-256-GCM kimlik şifreleme motoru
│   ├── db/             # Drizzle ORM, Neon PostgreSQL, Upstash Redis, Turso
│   └── discovery/      # Otomatik API tipi tespit ve OpenAPI araç üretici
└── .github/workflows/  # CI/CD & Watchdog
```

---

## ⚡ Hızlı Başlangıç

### 1. Bağımlılıkları Yükle
```bash
pnpm install
```

### 2. Çevre Değişkenlerini Ayarla
`.env.example` dosyasını `.env.local` olarak kopyalayın:
```bash
cp .env.example .env.local
```
> En az bir ücretsiz sağlayıcı anahtarı (örn. `GEMINI_API_KEY` veya `GROQ_API_KEY`) girmeniz yeterlidir. Anahtar yoksa `ALLOW_MOCK_AI=true` ile simülasyon modunda çalışabilirsiniz.

### 3. Testleri ve Tip Kontrollerini Çalıştır
```bash
pnpm build      # Tüm monorepo derlemesi
pnpm test       # Kapsamlı Vitest testleri
pnpm typecheck  # TypeScript strict typecheck
```

### 4. Ajanı Başlat
```bash
pnpm --filter @vybot/agent dev
```

---

## 🛡️ Sağlık Kontrolü (Healthcheck)
Ajan çalıştığında varsayılan olarak `http://localhost:3001` üzerinde JSON sağlık durumunu yayınlar:
```json
{
  "status": "healthy",
  "uptime": 120.4,
  "tasks": 1,
  "activeAdapters": 1,
  "configuredAiProviders": ["gemini", "groq"]
}
```

---

## 🟢 Durum
Tüm testler ve tip kontrolleri **%100 yeşil** durumda derlenmiş ve kullanıma hazırdır.
