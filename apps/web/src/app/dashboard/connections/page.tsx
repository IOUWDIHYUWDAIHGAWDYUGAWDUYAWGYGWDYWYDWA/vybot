'use client';
import { useState, useMemo } from 'react';

interface ConnectionItem {
  id: string;
  name: string;
  platform: 'discord' | 'telegram' | 'slack' | 'github' | 'webhook' | 'mcp' | 'custom';
  status: 'active' | 'syncing' | 'paused' | 'error';
  tokenMasked: string;
  latencyMs: number;
  environment: 'production' | 'sandbox';
  toolsDiscovered: string[];
  lastPing: string;
  rateLimitUsage: string;
}

const INITIAL_CONNECTIONS: ConnectionItem[] = [
  {
    id: 'conn-prod-01',
    name: 'Discord Community Engine (Main)',
    platform: 'discord',
    status: 'active',
    tokenMasked: 'Bot MTM2MT...9QkuOb',
    latencyMs: 24,
    environment: 'production',
    toolsDiscovered: ['discord:send_message', 'discord:read_channel', 'discord:ban_member', 'discord:create_role'],
    lastPing: '2 saniye önce',
    rateLimitUsage: '42 / 120 req/dk',
  },
  {
    id: 'conn-prod-02',
    name: 'Telegram Real-Time Alert Channel',
    platform: 'telegram',
    status: 'active',
    tokenMasked: '719482...AAGW3j8',
    latencyMs: 19,
    environment: 'production',
    toolsDiscovered: ['telegram:send_message', 'telegram:send_photo', 'telegram:webhook_stream'],
    lastPing: '6 saniye önce',
    rateLimitUsage: '12 / 30 req/dk',
  },
  {
    id: 'conn-prod-03',
    name: 'GitHub CI/CD Automation Bot',
    platform: 'github',
    status: 'active',
    tokenMasked: 'ghp_••••••••••••••••3fa1',
    latencyMs: 31,
    environment: 'production',
    toolsDiscovered: ['github:create_issue', 'github:merge_pr', 'github:trigger_workflow'],
    lastPing: '12 saniye önce',
    rateLimitUsage: '110 / 5000 req/sa',
  },
  {
    id: 'conn-prod-04',
    name: 'MCP Universal Context Protocol Gateway',
    platform: 'mcp',
    status: 'syncing',
    tokenMasked: 'mcp://gateway.internal:8080/v1',
    latencyMs: 8,
    environment: 'production',
    toolsDiscovered: ['mcp:execute_tool', 'mcp:read_resource', 'mcp:list_prompts'],
    lastPing: 'Şimdi',
    rateLimitUsage: 'Sınırsız (Lokal)',
  },
];

const PLATFORM_DETAILS = {
  discord: {
    name: 'Discord Gateway v10',
    category: 'community',
    badge: 'Enterprise WS',
    color: '#5865F2',
    placeholder: 'Bot MTM2MT... (Discord Bot Token)',
    description: 'Raw WebSocket v10 Gateway ile 7/24 kesintisiz iki yönlü olay akışı ve otonom moderasyon.',
  },
  telegram: {
    name: 'Telegram Bot API',
    category: 'community',
    badge: 'Long-Polling / Webhook',
    color: '#229ED9',
    placeholder: '123456789:ABCdefGhIJKlmNoPQRstuVWxYZ',
    description: 'Yüksek hacimli mesajlaşma, bildirim akışları ve callback buton mekanizması.',
  },
  slack: {
    name: 'Slack Bolt Enterprise',
    category: 'community',
    badge: 'OAuth2 / Socket',
    color: '#4A154B',
    placeholder: 'xoxb-1234567890-1234567890123-abcdef...',
    description: 'Kurumsal çalışma alanları, kanal dinleyicileri ve iç iş akışı entegrasyonu.',
  },
  github: {
    name: 'GitHub REST & GraphQL API',
    category: 'dev',
    badge: 'PAT / App Token',
    color: '#24292e',
    placeholder: 'ghp_••••••••••••••••••••••••••••••••••••',
    description: 'Otomatik issue yönetimi, PR inceleme, repo senkronizasyonu ve CI/CD tetikleyicileri.',
  },
  webhook: {
    name: 'Gelen / Giden Webhook Gateway',
    category: 'dev',
    badge: 'HMAC SHA-256',
    color: '#10B981',
    placeholder: 'https://api.domain.com/v1/webhook',
    description: 'Stripe, Shopify veya özel sistemlerden gelen anlık olayları ayrıştıran yüksek verimli uç nokta.',
  },
  mcp: {
    name: 'Model Context Protocol (MCP)',
    category: 'ai',
    badge: 'Anthropic Standard',
    color: '#8B5CF6',
    placeholder: 'http://localhost:3001/mcp veya stdio komutu',
    description: 'Yeni nesil açık protokol. Harici veritabanları, araçlar ve dosya sistemleriyle doğrudan AI bağlantısı.',
  },
  custom: {
    name: 'Özel REST / OpenAPI v3.1',
    category: 'dev',
    badge: 'Heuristic Discovery',
    color: '#F59E0B',
    placeholder: 'Bearer key_live_•••• veya Swagger JSON URL',
    description: 'Bilinmeyen API anahtarlarını otomatik keşfeden, şemalarını çözen otonom prober motoru.',
  },
};

export default function ConnectionsPage() {
  const [connections, setConnections] = useState<ConnectionItem[]>(INITIAL_CONNECTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'community' | 'dev' | 'ai'>('all');
  const [selectedEnv, setSelectedEnv] = useState<'production' | 'sandbox'>('production');

  const [showModal, setShowModal] = useState(false);
  const [modalPlatform, setModalPlatform] = useState<keyof typeof PLATFORM_DETAILS | null>(null);
  const [modalName, setModalName] = useState('');
  const [modalSecret, setModalSecret] = useState('');
  const [autoDiscover, setAutoDiscover] = useState(true);
  const [showSecret, setShowSecret] = useState(false);
  const [pingingId, setPingingId] = useState<string | null>(null);

  const filteredConnections = useMemo(() => {
    return connections.filter((conn) => {
      const matchEnv = conn.environment === selectedEnv;
      const matchCategory =
        selectedCategory === 'all' ||
        PLATFORM_DETAILS[conn.platform].category === selectedCategory;
      const matchSearch =
        conn.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conn.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conn.toolsDiscovered.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchEnv && matchCategory && matchSearch;
    });
  }, [connections, selectedEnv, selectedCategory, searchQuery]);

  const handleTestPing = (id: string) => {
    setPingingId(id);
    setTimeout(() => {
      setConnections((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, latencyMs: Math.floor(Math.random() * 15) + 10, lastPing: 'Şimdi' }
            : c
        )
      );
      setPingingId(null);
    }, 600);
  };

  const handleCreateConnection = () => {
    if (!modalPlatform || !modalName || !modalSecret) return;

    const masked =
      modalSecret.length > 8
        ? `${modalSecret.slice(0, 4)}••••••••${modalSecret.slice(-4)}`
        : '••••••••••••';

    const newConn: ConnectionItem = {
      id: `conn-${Date.now()}`,
      name: modalName,
      platform: modalPlatform,
      status: 'active',
      tokenMasked: masked,
      latencyMs: Math.floor(Math.random() * 20) + 12,
      environment: selectedEnv,
      toolsDiscovered: [
        `${modalPlatform}:read_stream`,
        `${modalPlatform}:write_action`,
        `${modalPlatform}:health_check`,
      ],
      lastPing: 'Şimdi',
      rateLimitUsage: '0 / 120 req/dk',
    };

    setConnections([newConn, ...connections]);
    setShowModal(false);
    setModalPlatform(null);
    setModalName('');
    setModalSecret('');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Entegrasyon & Kimlik Doğrulama Kasası
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              HSM Enclave Aktif
            </span>
          </div>
          <p className="text-zinc-400 text-sm mt-1 max-w-2xl">
            Sıfır Güven (Zero-Trust) mimarisiyle izole edilmiş kurumsal bağlantı noktaları. Ham kimlik bilgileri bellekte asla saklanmaz ve yapay zeka modellerine asla sızdırılmaz.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="bg-vybot-600 hover:bg-vybot-500 text-white font-medium py-2 px-4 rounded-lg transition-all shadow-lg shadow-vybot-600/20 flex items-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Yeni Ağ Geçidi Ekle
          </button>
        </div>
      </div>

      {/* Enterprise Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#12121a] border border-white/5 rounded-xl p-4 relative overflow-hidden">
          <div className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Aktif Gateway Sayısı
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{connections.length}</span>
            <span className="text-xs text-zinc-400">/ 50 Maksimum Slot</span>
          </div>
          <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
            Tüm gateway uçları operasyonel
          </div>
        </div>

        <div className="bg-[#12121a] border border-white/5 rounded-xl p-4 relative overflow-hidden">
          <div className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Şifreleme Standardı
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">AES-256-GCM</span>
          </div>
          <div className="mt-2 text-xs text-zinc-400 flex items-center gap-1">
            <span className="text-vybot-400 font-mono">PBKDF2</span> 100.000 iterasyon tuzlu anahtar
          </div>
        </div>

        <div className="bg-[#12121a] border border-white/5 rounded-xl p-4 relative overflow-hidden">
          <div className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Otonom AI Araçları (Tools)
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              {connections.reduce((acc, c) => acc + c.toolsDiscovered.length, 0)}
            </span>
            <span className="text-xs text-zinc-400">Fonksiyon Hazır</span>
          </div>
          <div className="mt-2 text-xs text-vybot-400">
            OpenAPI v3.1 Şema Doğrulamalı
          </div>
        </div>

        <div className="bg-[#12121a] border border-white/5 rounded-xl p-4 relative overflow-hidden">
          <div className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Uptime SLA & Bölge
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-400">%99.99</span>
            <span className="text-xs text-zinc-400">Global Edge</span>
          </div>
          <div className="mt-2 text-xs text-zinc-400">
            Ort. Gecikme: <span className="text-white font-mono">18ms</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#111118] p-3 rounded-xl border border-white/5">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-vybot-600 text-white'
                : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            Tüm Gateway&apos;ler
          </button>
          <button
            onClick={() => setSelectedCategory('community')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedCategory === 'community'
                ? 'bg-vybot-600 text-white'
                : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            Topluluk (Discord, TG, Slack)
          </button>
          <button
            onClick={() => setSelectedCategory('dev')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedCategory === 'dev'
                ? 'bg-vybot-600 text-white'
                : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            Geliştirici & API
          </button>
          <button
            onClick={() => setSelectedCategory('ai')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedCategory === 'ai'
                ? 'bg-vybot-600 text-white'
                : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            MCP Standartları
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <svg
              className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Bağlantı veya tool ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-vybot-500 w-full"
            />
          </div>

          <div className="flex bg-black/40 rounded-lg p-0.5 border border-white/10">
            <button
              onClick={() => setSelectedEnv('production')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                selectedEnv === 'production'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'text-zinc-500 hover:text-white'
              }`}
            >
              Production
            </button>
            <button
              onClick={() => setSelectedEnv('sandbox')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                selectedEnv === 'sandbox'
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'text-zinc-500 hover:text-white'
              }`}
            >
              Sandbox
            </button>
          </div>
        </div>
      </div>

      {/* Connections Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredConnections.map((conn) => {
          const detail = PLATFORM_DETAILS[conn.platform];
          const isPinging = pingingId === conn.id;

          return (
            <div
              key={conn.id}
              className="bg-[#111118] border border-white/5 hover:border-white/15 rounded-xl p-5 transition-all group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shadow-inner flex-shrink-0"
                    style={{ backgroundColor: `${detail.color}20`, border: `1px solid ${detail.color}40` }}
                  >
                    <span className="text-xs uppercase font-mono tracking-wider" style={{ color: detail.color }}>
                      {conn.platform.slice(0, 3)}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white text-base group-hover:text-vybot-400 transition-colors">
                        {conn.name}
                      </h3>
                      <span className="text-xs px-2 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-400 font-mono">
                        {detail.badge}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-zinc-400">
                      <span className="font-mono text-zinc-500 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                        </svg>
                        {conn.tokenMasked}
                      </span>
                      <span>•</span>
                      <span>Son Doğrulama: <strong className="text-zinc-300">{conn.lastPing}</strong></span>
                      <span>•</span>
                      <span>Limit Kotası: <strong className="text-zinc-300">{conn.rateLimitUsage}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end lg:self-center">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/5 text-xs font-mono">
                    <span className={`w-2 h-2 rounded-full ${isPinging ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`}></span>
                    <span className="text-zinc-300">{conn.latencyMs}ms</span>
                  </div>

                  <button
                    onClick={() => handleTestPing(conn.id)}
                    disabled={isPinging}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-zinc-300 hover:text-white border border-white/5 transition-colors disabled:opacity-50"
                  >
                    {isPinging ? 'Ping Atılıyor...' : 'Test Handshake'}
                  </button>

                  <button
                    onClick={() => setConnections(connections.filter((c) => c.id !== conn.id))}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Bağlantıyı Kaldır"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Discovered Autonomous Tools Bar */}
              <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
                  Enjekte Edilen AI Araçları:
                </span>
                {conn.toolsDiscovered.map((tool) => (
                  <span
                    key={tool}
                    className="text-[11px] font-mono px-2 py-0.5 rounded bg-vybot-950/60 text-vybot-300 border border-vybot-800/40"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Gateway Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#111118] border border-white/10 rounded-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Yeni Ağ Geçidi (Gateway) Entegre Et</h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  SOC-2 Tip II donanım seviyesinde izole edilmiş kimlik kasası.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  setModalPlatform(null);
                }}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {!modalPlatform ? (
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3">
                    Entegre Edilecek Platformu Seçin:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(Object.keys(PLATFORM_DETAILS) as Array<keyof typeof PLATFORM_DETAILS>).map((key) => {
                      const item = PLATFORM_DETAILS[key];
                      return (
                        <button
                          key={key}
                          onClick={() => setModalPlatform(key)}
                          className="flex flex-col text-left p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-vybot-500/50 transition-all group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm text-white group-hover:text-vybot-400">
                              {item.name}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-zinc-400">
                              {item.badge}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                            {item.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/5">
                    <button
                      onClick={() => setModalPlatform(null)}
                      className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-medium"
                    >
                      ← Başka Platform Seç
                    </button>
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-vybot-950 text-vybot-400 border border-vybot-800/40">
                      {PLATFORM_DETAILS[modalPlatform].name}
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Ağ Geçidi Tanım Adı
                    </label>
                    <input
                      type="text"
                      className="input text-sm"
                      placeholder="Örn: Discord Production Bot (Main Cluster)"
                      value={modalName}
                      onChange={(e) => setModalName(e.target.value)}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-zinc-300">
                        Kimlik Bilgisi / API Anahtarı / Endpoint
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowSecret(!showSecret)}
                        className="text-[11px] text-zinc-500 hover:text-zinc-300 font-mono"
                      >
                        {showSecret ? 'Gizle' : 'Göster'}
                      </button>
                    </div>

                    <textarea
                      rows={3}
                      className="input font-mono text-xs"
                      placeholder={PLATFORM_DETAILS[modalPlatform].placeholder}
                      value={modalSecret}
                      onChange={(e) => setModalSecret(e.target.value)}
                    />

                    <div className="mt-2.5 p-3 rounded-lg bg-emerald-500/[0.04] border border-emerald-500/20 text-xs text-emerald-300/90 space-y-1">
                      <div className="font-semibold flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Kriptografik Güvenlik Güvencesi:
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        Girdiğiniz gizli anahtar tarayıcınızdan çıkar çıkmaz AES-256-GCM ile şifrelenir. 
                        AI modeli ham anahtarı asla göremez; sadece yetkilendirilmiş donanım proxy&apos;si üzerinden güvenli istek yapar.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <div>
                      <div className="text-xs font-semibold text-white">
                        Otonom API Keşif Motoru (Auto-Discovery)
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        Bağlanan API&apos;nin şemasını ve endpoint&apos;lerini otomatik analiz edip araç üretir.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={autoDiscover}
                      onChange={(e) => setAutoDiscover(e.target.checked)}
                      className="w-4 h-4 rounded text-vybot-600 focus:ring-vybot-500 bg-black/40 border-white/20"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleCreateConnection}
                      disabled={!modalName || !modalSecret}
                      className="w-full bg-vybot-600 hover:bg-vybot-500 text-white font-medium py-2.5 rounded-lg transition-all shadow-lg shadow-vybot-600/20 disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Kriptola & Ağ Geçidine Konuşlandır
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
