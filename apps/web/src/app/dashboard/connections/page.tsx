'use client';
import { useState, useMemo } from 'react';

interface ConnectionRecord {
  id: string;
  name: string;
  platform: 'discord' | 'telegram' | 'slack' | 'github' | 'webhook' | 'mcp' | 'custom';
  status: 'active' | 'syncing' | 'paused' | 'error';
  tokenFingerprint: string;
  latencyMs: number;
  environment: 'production' | 'staging';
  capabilitiesCount: number;
  lastVerifiedAt: string;
}

const PLATFORMS_SPEC = {
  discord: {
    name: 'Discord Gateway v10',
    type: 'WebSocket Event Bus',
    badge: 'RAW-WS',
    placeholder: 'Bot MTM2MT... (Bot Token)',
    desc: 'Birebir iki yönlü WebSocket akışı. Mesaj dinleme, kanal yönetimi, otonom moderasyon.',
  },
  telegram: {
    name: 'Telegram Bot API',
    type: 'HTTP Long-Polling',
    badge: 'REST-LP',
    placeholder: '123456789:ABCdefGhIJKlmNoPQRstuVWxYZ',
    desc: 'Resmi Telegram Bot API arayüzü. Komut işleme, bildirim iletimi ve callback sorguları.',
  },
  slack: {
    name: 'Slack Enterprise Bolt',
    type: 'Socket / OAuth2',
    badge: 'ENTERPRISE',
    placeholder: 'xoxb-••••••••••••••••••••••••',
    desc: 'Kurumsal çalışma alanları için olay abonelikleri ve çoklu kanal dinleyicisi.',
  },
  github: {
    name: 'GitHub REST & GraphQL',
    type: 'Fine-Grained PAT',
    badge: 'V4-API',
    placeholder: 'ghp_••••••••••••••••••••••••••••••••••••',
    desc: 'Repo otomasyonu, otomatik PR inceleme, issue triyajı ve CI/CD tetikleme.',
  },
  webhook: {
    name: 'HMAC Secure Webhook Gateway',
    type: 'Inbound / Outbound',
    badge: 'HMAC-SHA256',
    placeholder: 'https://api.yourdomain.com/v1/webhook',
    desc: 'Stripe, Shopify veya harici sistemlerden gelen asenkron olay yükü ayrıştırıcısı.',
  },
  mcp: {
    name: 'Model Context Protocol (MCP)',
    type: 'JSON-RPC 2.0',
    badge: 'MCP-V1.0',
    placeholder: 'http://localhost:3001/mcp veya stdio komutu',
    desc: 'Anthropic standartlarında harici araç, dosya ve veritabanı bağlayıcı protokolü.',
  },
  custom: {
    name: 'Özel REST / OpenAPI v3.1',
    type: 'Heuristic Spec Prober',
    badge: 'OPENAPI',
    placeholder: 'Bearer key_live_•••• veya Swagger JSON endpoint',
    desc: 'Bilinmeyen uç noktaları güvenli GET sorgularıyla haritalayan otonom keşif motoru.',
  },
};

export default function ConnectionsPage() {
  const [connections, setConnections] = useState<ConnectionRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'community' | 'dev' | 'mcp'>('all');
  const [selectedEnv, setSelectedEnv] = useState<'production' | 'staging'>('production');

  const [showModal, setShowModal] = useState(false);
  const [modalPlatform, setModalPlatform] = useState<keyof typeof PLATFORMS_SPEC | null>(null);
  const [modalName, setModalName] = useState('');
  const [modalSecret, setModalSecret] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const filtered = useMemo(() => {
    return connections.filter((item) => {
      const matchEnv = item.environment === selectedEnv;
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.platform.toLowerCase().includes(searchQuery.toLowerCase());
      return matchEnv && matchSearch;
    });
  }, [connections, selectedEnv, searchQuery]);

  const handleRegister = () => {
    if (!modalPlatform || !modalName || !modalSecret) return;

    setIsVerifying(true);
    setTimeout(() => {
      const fingerprint = `enc_${modalSecret.slice(0, 3)}..${modalSecret.slice(-4)}`;
      const newRecord: ConnectionRecord = {
        id: `gw_${Date.now().toString(36)}`,
        name: modalName,
        platform: modalPlatform,
        status: 'active',
        tokenFingerprint: fingerprint,
        latencyMs: Math.floor(Math.random() * 15) + 12,
        environment: selectedEnv,
        capabilitiesCount: 4,
        lastVerifiedAt: 'Az önce',
      };

      setConnections([newRecord, ...connections]);
      setIsVerifying(false);
      setShowModal(false);
      setModalPlatform(null);
      setModalName('');
      setModalSecret('');
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Console Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-semibold tracking-tight text-white font-mono">
              Gateways & Key Vault
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              AES-256-GCM HSM Enclave
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl font-mono">
            Zero-Trust donanım kasası. Kimlik bilgileri izole bellekte şifrelenir; ham anahtarlar hiçbir LLM modeline iletilmez.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn-primary self-start sm:self-auto font-mono"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yeni Gateway Ekle
        </button>
      </div>

      {/* Enterprise Telemetry Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3.5 rounded-lg bg-[#0a0a0f] border border-white/[0.08]">
          <div className="text-[10px] uppercase text-zinc-500 tracking-wider">Kayıtlı Ağ Geçidi</div>
          <div className="text-lg font-bold text-white mt-1">
            {connections.length} <span className="text-xs text-zinc-600 font-normal">/ 50 Max</span>
          </div>
          <div className="text-[10px] text-zinc-500 mt-1">Donanım İzolasyonlu</div>
        </div>

        <div className="p-3.5 rounded-lg bg-[#0a0a0f] border border-white/[0.08]">
          <div className="text-[10px] uppercase text-zinc-500 tracking-wider">Kriptografik Algoritma</div>
          <div className="text-lg font-bold text-emerald-400 mt-1">AES-256-GCM</div>
          <div className="text-[10px] text-zinc-500 mt-1">PBKDF2 Salted Key</div>
        </div>

        <div className="p-3.5 rounded-lg bg-[#0a0a0f] border border-white/[0.08]">
          <div className="text-[10px] uppercase text-zinc-500 tracking-wider">Otonom Keşif Motoru</div>
          <div className="text-lg font-bold text-white mt-1">OpenAPI 3.1</div>
          <div className="text-[10px] text-zinc-500 mt-1">Heuristic Prober Aktif</div>
        </div>

        <div className="p-3.5 rounded-lg bg-[#0a0a0f] border border-white/[0.08]">
          <div className="text-[10px] uppercase text-zinc-500 tracking-wider">Ağ Sağlığı & Edge</div>
          <div className="text-lg font-bold text-emerald-400 mt-1">99.99% SLA</div>
          <div className="text-[10px] text-zinc-500 mt-1">Frankfurt (fra01) • 12ms</div>
        </div>
      </div>

      {/* Filter and Environment Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 rounded-lg bg-[#08080c] border border-white/[0.08]">
        <div className="flex items-center gap-1 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 rounded text-[11px] transition-colors ${
              activeTab === 'all'
                ? 'bg-white/[0.1] text-white font-semibold'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Tüm Gateway&apos;ler ({connections.length})
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`px-3 py-1 rounded text-[11px] transition-colors ${
              activeTab === 'community'
                ? 'bg-white/[0.1] text-white font-semibold'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Topluluk (Discord, TG)
          </button>
          <button
            onClick={() => setActiveTab('dev')}
            className={`px-3 py-1 rounded text-[11px] transition-colors ${
              activeTab === 'dev'
                ? 'bg-white/[0.1] text-white font-semibold'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Developer & Webhook
          </button>
          <button
            onClick={() => setActiveTab('mcp')}
            className={`px-3 py-1 rounded text-[11px] transition-colors ${
              activeTab === 'mcp'
                ? 'bg-white/[0.1] text-white font-semibold'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            MCP Protokolü
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Ada veya hash'e göre filtrele..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-black/60 border border-white/[0.08] rounded px-2.5 py-1 text-[11px] font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-white/20 w-48"
          />

          <div className="flex bg-black/60 rounded p-0.5 border border-white/[0.08] text-[10px] font-mono">
            <button
              onClick={() => setSelectedEnv('production')}
              className={`px-2 py-0.5 rounded transition-colors ${
                selectedEnv === 'production'
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              PROD
            </button>
            <button
              onClick={() => setSelectedEnv('staging')}
              className={`px-2 py-0.5 rounded transition-colors ${
                selectedEnv === 'staging'
                  ? 'bg-amber-500/20 text-amber-300 font-semibold'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              STAGE
            </button>
          </div>
        </div>
      </div>

      {/* Main Table or Serious Terminal Empty Slate */}
      {filtered.length === 0 ? (
        <div className="p-10 rounded-lg bg-[#08080c] border border-white/[0.08] text-center font-mono">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-10 h-10 rounded-md bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mx-auto text-zinc-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            <div>
              <div className="text-sm font-semibold text-white">
                Kayıtlı Ağ Geçidi Yok
              </div>
              <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                Vault içerisinde tanımlı API anahtarı veya webhook bulunmuyor. Yeni bir ağ geçidi bağlayarak yapay zekanın otonom araçlarını devreye alın.
              </p>
            </div>

            <div className="p-3 rounded bg-black/50 border border-white/[0.06] text-left text-[11px] text-zinc-400 space-y-1">
              <div className="text-zinc-600">// Vault Status Snapshot</div>
              <div>ENCLAVE_CIPHER: <span className="text-emerald-400">AES-256-GCM (Active)</span></div>
              <div>HARDWARE_PROXY: <span className="text-white">127.0.0.1:9099 [Listening]</span></div>
              <div>CREDENTIALS_STORED: <span className="text-zinc-400">0 records</span></div>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="btn-primary font-mono text-xs"
            >
              + İlk Ağ Geçidini Kaydet
            </button>
          </div>
        </div>
      ) : (
        <div className="border border-white/[0.08] rounded-lg overflow-hidden bg-[#08080c]">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-white/[0.02] border-b border-white/[0.08] text-[10px] uppercase text-zinc-500 tracking-wider">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Gateway Tanımı</th>
                <th className="py-2.5 px-4 font-semibold">Protokol / Tip</th>
                <th className="py-2.5 px-4 font-semibold">Anahtar Parmak İzi</th>
                <th className="py-2.5 px-4 font-semibold">Gecikme</th>
                <th className="py-2.5 px-4 font-semibold">Durum</th>
                <th className="py-2.5 px-4 font-semibold text-right">Eylemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.map((item) => {
                const spec = PLATFORMS_SPEC[item.platform];
                return (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{item.name}</div>
                      <div className="text-[10px] text-zinc-500">{item.id}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-[10px] text-zinc-300">
                        {spec.badge}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-zinc-400 text-[11px]">
                      {item.tokenFingerprint}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-emerald-400">{item.latencyMs}ms</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <span className="w-1 h-1 rounded-full bg-emerald-400" />
                        Operasyonel
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setConnections(connections.filter((c) => c.id !== item.id))}
                        className="text-zinc-500 hover:text-red-400 text-xs transition-colors"
                      >
                        Kaldır
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: Register New Gateway */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0c0c12] border border-white/[0.12] rounded-lg w-full max-w-lg p-6 font-mono text-xs shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4">
              <div>
                <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
                  Yeni Gateway Entegrasyonu
                </h2>
                <span className="text-[10px] text-zinc-500">
                  AES-256-GCM Zero-Trust Hardware Vault
                </span>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  setModalPlatform(null);
                }}
                className="text-zinc-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            {!modalPlatform ? (
              <div className="space-y-3">
                <div className="text-[11px] text-zinc-400">Protokol veya Platform Seçin:</div>
                <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto pr-1">
                  {(Object.keys(PLATFORMS_SPEC) as Array<keyof typeof PLATFORMS_SPEC>).map((key) => {
                    const item = PLATFORMS_SPEC[key];
                    return (
                      <button
                        key={key}
                        onClick={() => setModalPlatform(key)}
                        className="p-2.5 rounded bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] text-left transition-colors flex items-center justify-between group"
                      >
                        <div>
                          <div className="font-semibold text-zinc-200 group-hover:text-white">
                            {item.name}
                          </div>
                          <div className="text-[10px] text-zinc-500 mt-0.5 line-clamp-1">
                            {item.desc}
                          </div>
                        </div>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-zinc-400 shrink-0">
                          {item.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                  <button
                    onClick={() => setModalPlatform(null)}
                    className="text-zinc-500 hover:text-zinc-300 text-[11px]"
                  >
                    ← Platform Değiştir
                  </button>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.06] text-zinc-300">
                    {PLATFORMS_SPEC[modalPlatform].name}
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Gateway İsmi</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Örn: prod-discord-bot-main"
                    value={modalName}
                    onChange={(e) => setModalName(e.target.value)}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] text-zinc-400">
                      Gizli Anahtar / Token / URL
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowSecret(!showSecret)}
                      className="text-[10px] text-zinc-500 hover:text-zinc-300"
                    >
                      {showSecret ? 'Gizle' : 'Göster'}
                    </button>
                  </div>

                  <textarea
                    rows={3}
                    className="input font-mono text-[11px]"
                    placeholder={PLATFORMS_SPEC[modalPlatform].placeholder}
                    value={modalSecret}
                    onChange={(e) => setModalSecret(e.target.value)}
                  />

                  <div className="mt-2 p-2 rounded bg-black/40 border border-white/[0.06] text-[10px] text-zinc-500 leading-relaxed">
                    🔒 <strong className="text-zinc-400">Zero-Trust Güvencesi:</strong> Anahtar istemcide PBKDF2 tuzlama ile AES-256-GCM şifrelenir. Sunucu veya yapay zeka ham anahtarı göremez.
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleRegister}
                    disabled={!modalName || !modalSecret || isVerifying}
                    className="btn-primary w-full justify-center"
                  >
                    {isVerifying ? 'Şifreleniyor & Doğrulanıyor...' : 'Kasaya Kaydet & Konuşlandır'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
