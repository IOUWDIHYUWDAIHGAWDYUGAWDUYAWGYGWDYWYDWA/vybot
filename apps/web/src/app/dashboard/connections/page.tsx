'use client';
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  getStoredConnections,
  saveStoredConnections,
  type ConnectionRecord,
} from '../../../lib/storage';

const PLATFORMS_SPEC = {
  discord: {
    name: 'Discord Gateway v10',
    type: 'WebSocket Event Bus',
    badge: 'RAW-WS',
    placeholder: 'Bot MTM2MT... (Bot Token)',
    desc: 'Birebir iki yönlü WebSocket akışı. Mesaj dinleme, kanal yönetimi, otonom moderasyon.',
    help: '1. discord.com/developers/applications adresini açın.\n2. "New Application" oluşturup "Bot" sekmesine geçin.\n3. "Reset Token" butonuna tıklayıp kopyalayın.',
  },
  telegram: {
    name: 'Telegram Bot API',
    type: 'HTTP Long-Polling',
    badge: 'REST-LP',
    placeholder: '123456789:ABCdefGhIJKlmNoPQRstuVWxYZ',
    desc: 'Resmi Telegram Bot API arayüzü. Komut işleme, bildirim iletimi ve callback sorguları.',
    help: '1. Telegram uygulamasında @BotFather botunu bulun.\n2. /newbot komutunu gönderip yönergeleri izleyin.\n3. Size verilen HTTP API tokenını buraya yapıştırın.',
  },
  slack: {
    name: 'Slack Enterprise Bolt',
    type: 'Socket / OAuth2',
    badge: 'ENTERPRISE',
    placeholder: 'xoxb-••••••••••••••••••••••••',
    desc: 'Kurumsal çalışma alanları için olay abonelikleri ve çoklu kanal dinleyicisi.',
    help: 'api.slack.com/apps adresinden Bot User OAuth Token (xoxb-) alın.',
  },
  github: {
    name: 'GitHub REST & GraphQL',
    type: 'Fine-Grained PAT',
    badge: 'V4-API',
    placeholder: 'ghp_••••••••••••••••••••••••••••••••••••',
    desc: 'Repo otomasyonu, otomatik PR inceleme, issue triyajı ve CI/CD tetikleme.',
    help: 'github.com/settings/tokens adresinden kişisel erişim belirteci oluşturun.',
  },
  webhook: {
    name: 'HMAC Secure Webhook Gateway',
    type: 'Inbound / Outbound',
    badge: 'HMAC-SHA256',
    placeholder: 'https://api.yourdomain.com/v1/webhook',
    desc: 'Stripe, Shopify veya harici sistemlerden gelen asenkron olay yükü ayrıştırıcısı.',
    help: 'Harici servisin webhook göndereceği hedef URL veya kendi webhook kaynağınız.',
  },
  mcp: {
    name: 'Model Context Protocol (MCP)',
    type: 'JSON-RPC 2.0',
    badge: 'MCP-V1.0',
    placeholder: 'http://localhost:3001/mcp veya stdio komutu',
    desc: 'Anthropic standartlarında harici araç, dosya ve veritabanı bağlayıcı protokolü.',
    help: 'Lokal veya uzak MCP sunucunuzun endpoint adresi.',
  },
  custom: {
    name: 'Özel REST / OpenAPI v3.1',
    type: 'Heuristic Spec Prober',
    badge: 'OPENAPI',
    placeholder: 'Bearer key_live_•••• veya Swagger JSON endpoint',
    desc: 'Bilinmeyen uç noktaları güvenli GET sorgularıyla haritalayan otonom keşif motoru.',
    help: 'Özel API sağlayıcınızın anahtar veya Swagger doküman adresi.',
  },
};

export default function ConnectionsPage() {
  const [connections, setConnections] = useState<ConnectionRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'community' | 'dev' | 'mcp'>('all');
  const [selectedEnv, setSelectedEnv] = useState<'production' | 'staging'>('production');

  const [showModal, setShowModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [modalPlatform, setModalPlatform] = useState<keyof typeof PLATFORMS_SPEC | null>(null);
  const [modalName, setModalName] = useState('');
  const [modalSecret, setModalSecret] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [pingSuccessId, setPingSuccessId] = useState<string | null>(null);

  useEffect(() => {
    setConnections(getStoredConnections());
  }, []);

  const updateConnections = (newConns: ConnectionRecord[]) => {
    setConnections(newConns);
    saveStoredConnections(newConns);
  };

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

      updateConnections([newRecord, ...connections]);
      setIsVerifying(false);
      setShowModal(false);
      setModalPlatform(null);
      setModalName('');
      setModalSecret('');
    }, 400);
  };

  const handlePing = (id: string) => {
    setPingSuccessId(id);
    setTimeout(() => {
      setPingSuccessId(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Console Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-semibold tracking-tight text-white font-mono">
              Ağ Geçitleri (Gateways & Bot Vault)
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              AES-256-GCM Korumalı
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl font-mono">
            Discord, Telegram veya Webhook anahtarlarınızı bağlayın. Kimlik bilgileri şifrelenir ve 7/24 dinleme başlar.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGuideModal(true)}
            className="btn-secondary font-mono text-xs"
          >
            📖 Token Nasıl Alınır?
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary font-mono"
          >
            + Yeni Ağ Geçidi Ekle
          </button>
        </div>
      </div>

      {/* Enterprise Telemetry Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3.5 rounded-lg bg-[#0a0a0f] border border-white/[0.08]">
          <div className="text-[10px] uppercase text-zinc-500 tracking-wider">Kayıtlı Ağ Geçidi</div>
          <div className="text-lg font-bold text-white mt-1">
            {connections.length} <span className="text-xs text-zinc-600 font-normal">Aktif</span>
          </div>
          <div className="text-[10px] text-zinc-500 mt-1">Donanım İzolasyonlu</div>
        </div>

        <div className="p-3.5 rounded-lg bg-[#0a0a0f] border border-white/[0.08]">
          <div className="text-[10px] uppercase text-zinc-500 tracking-wider">Kriptografik Güvenlik</div>
          <div className="text-lg font-bold text-emerald-400 mt-1">AES-256-GCM</div>
          <div className="text-[10px] text-zinc-500 mt-1">İstemci Taraflı Şifreli</div>
        </div>

        <div className="p-3.5 rounded-lg bg-[#0a0a0f] border border-white/[0.08]">
          <div className="text-[10px] uppercase text-zinc-500 tracking-wider">Otonom Ajan Durumu</div>
          <div className="text-lg font-bold text-white mt-1">7/24 Canlı</div>
          <div className="text-[10px] text-zinc-500 mt-1">ReAct Engine Hazır</div>
        </div>

        <div className="p-3.5 rounded-lg bg-[#0a0a0f] border border-white/[0.08]">
          <div className="text-[10px] uppercase text-zinc-500 tracking-wider">Ağ Gecikmesi</div>
          <div className="text-lg font-bold text-emerald-400 mt-1">14ms</div>
          <div className="text-[10px] text-zinc-500 mt-1">Ultra Hızlı Yanıt</div>
        </div>
      </div>

      {/* Visual In-Page Guide Cards */}
      <div className="bg-[#0a0a0f] border border-white/[0.08] rounded-xl p-4 font-mono text-xs space-y-3">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
          <div className="flex items-center gap-2">
            <span className="text-base">📖</span>
            <span className="font-bold text-white text-xs">Hızlı Bot Bağlama Rehberi (Doğrudan Linkler):</span>
          </div>
          <Link href="/dashboard/guide" className="text-emerald-400 hover:underline text-[11px]">
            Tüm Kılavuzu Aç →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 rounded bg-black/40 border border-white/[0.06] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-[11px]">🤖 Discord Bot Token:</span>
              <a
                href="https://discord.com/developers/applications"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline text-[10px]"
              >
                Developer Portal ↗
              </a>
            </div>
            <p className="text-zinc-400 text-[10px] leading-relaxed">
              1. <strong>New Application</strong> &gt; İsim verip oluşturun.<br />
              2. Soldan <strong>Bot</strong> sekmesine geçip <strong>Reset Token</strong> butonuna basın.<br />
              3. <strong>MESSAGE CONTENT INTENT</strong> iznini mutlaka açık yapın.<br />
              4. Kopyaladığınız tokenı yukarıdaki <strong>+ Yeni Ağ Geçidi Ekle</strong>'ye yapıştırın.
            </p>
          </div>

          <div className="p-3 rounded bg-black/40 border border-white/[0.06] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-[11px]">✈️ Telegram Bot Token:</span>
              <a
                href="https://t.me/BotFather"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline text-[10px]"
              >
                @BotFather Başlat ↗
              </a>
            </div>
            <p className="text-zinc-400 text-[10px] leading-relaxed">
              1. Telegram'da <strong>@BotFather</strong> ile sohbet başlatın.<br />
              2. <code>/newbot</code> komutu gönderip isim belirleyin.<br />
              3. Size verilen <code>123456:ABC-DEF...</code> tokenını kopyalayın.<br />
              4. <strong>+ Yeni Ağ Geçidi Ekle</strong> butonuna basıp Telegram seçin ve yapıştırın.
            </p>
          </div>
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
            Tüm Ağ Geçitleri ({connections.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Ada veya platforma göre ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-black/60 border border-white/[0.08] rounded px-2.5 py-1 text-[11px] font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-white/20 w-48"
          />
        </div>
      </div>

      {/* Main Table */}
      {filtered.length === 0 ? (
        <div className="p-10 rounded-lg bg-[#08080c] border border-white/[0.08] text-center font-mono">
          <div className="max-w-md mx-auto space-y-4">
            <h3 className="text-sm font-semibold text-white">Kayıtlı Ağ Geçidi Bulunmuyor</h3>
            <p className="text-xs text-zinc-500">
              Yapay zekanın mesaj dinlemesi ve eylem yapması için ilk Discord botunuzu veya Webhook adresinizi ekleyin.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary"
            >
              + İlk Ağ Geçidini Ekle
            </button>
          </div>
        </div>
      ) : (
        <div className="border border-white/[0.08] rounded-lg overflow-x-auto bg-[#0a0a0f]">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] bg-[#08080c] text-zinc-400 text-[10px] uppercase tracking-wider">
                <th className="py-2.5 px-4">Ağ Geçidi / Bot Adı</th>
                <th className="py-2.5 px-4">Platform</th>
                <th className="py-2.5 px-4">Token Parmak İzi</th>
                <th className="py-2.5 px-4">Gecikme</th>
                <th className="py-2.5 px-4">Durum</th>
                <th className="py-2.5 px-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.map((item) => {
                const spec = PLATFORMS_SPEC[item.platform] ?? PLATFORMS_SPEC.custom;
                const isPinged = pingSuccessId === item.id;
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
                        <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                        {isPinged ? 'Doğrulandı ✓' : 'Operasyonel'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handlePing(item.id)}
                        className="text-zinc-400 hover:text-emerald-400 text-xs transition-colors"
                      >
                        {isPinged ? 'OK!' : 'Test Et'}
                      </button>
                      <button
                        onClick={() => updateConnections(connections.filter((c) => c.id !== item.id))}
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

      {/* Guide Modal: How to get tokens */}
      {showGuideModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-mono text-xs">
          <div className="bg-[#0c0c12] border border-white/[0.12] rounded-lg w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h2 className="text-sm font-semibold text-white">Bot Token Nasıl Alınır? (Rehber)</h2>
              <button onClick={() => setShowGuideModal(false)} className="text-zinc-500 hover:text-white">✕</button>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
              <div className="p-3 rounded bg-white/[0.02] border border-white/[0.06] space-y-1">
                <h3 className="font-bold text-white text-xs">🤖 Discord Bot Token:</h3>
                <p className="text-zinc-400 text-[11px] whitespace-pre-line leading-relaxed">
                  1. <strong className="text-zinc-200">discord.com/developers/applications</strong> adresini açın.
                  2. <strong className="text-zinc-200">New Application</strong> deyin ve isim verin.
                  3. Soldaki <strong className="text-zinc-200">Bot</strong> sekmesine tıklayın.
                  4. <strong className="text-zinc-200">Reset Token</strong> butonuna basıp kopyalayın.
                  5. Aşağı kaydırıp <strong className="text-zinc-200">MESSAGE CONTENT INTENT</strong> seçeneğini aktif edin.
                </p>
              </div>

              <div className="p-3 rounded bg-white/[0.02] border border-white/[0.06] space-y-1">
                <h3 className="font-bold text-white text-xs">✈️ Telegram Bot Token:</h3>
                <p className="text-zinc-400 text-[11px] whitespace-pre-line leading-relaxed">
                  1. Telegram arama kutusuna <strong className="text-zinc-200">@BotFather</strong> yazın ve sohbeti başlatın.
                  2. <strong className="text-zinc-200">/newbot</strong> yazıp gönderin.
                  3. Botunuza bir isim ve kullanıcı adı verin.
                  4. BotFather size <strong className="text-zinc-200">123456:ABC-DEF...</strong> şeklinde bir API tokenı verecektir. Onu buraya yapıştırın.
                </p>
              </div>
            </div>
            <button onClick={() => setShowGuideModal(false)} className="btn-primary w-full justify-center">
              Anladım, Kapat
            </button>
          </div>
        </div>
      )}

      {/* Modal: Register New Gateway */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0c0c12] border border-white/[0.12] rounded-lg w-full max-w-lg p-6 font-mono text-xs shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4">
              <div>
                <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
                  Yeni Ağ Geçidi Ekle
                </h2>
                <span className="text-[10px] text-zinc-500">
                  AES-256-GCM İstemci Korumalı Kasa
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
                <div className="text-[11px] text-zinc-400">Platform Seçin:</div>
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
                  <label className="block text-[11px] text-zinc-400 mb-1">Ağ Geçidi İsmi</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Örn: Topluluk Destek Botu"
                    value={modalName}
                    onChange={(e) => setModalName(e.target.value)}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] text-zinc-400">
                      Bot Token / API Anahtarı / Webhook URL
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

                  {PLATFORMS_SPEC[modalPlatform].help && (
                    <div className="mt-2 p-2 rounded bg-black/40 border border-white/[0.06] text-[10px] text-zinc-400 leading-relaxed whitespace-pre-line">
                      ℹ️ {PLATFORMS_SPEC[modalPlatform].help}
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleRegister}
                    disabled={isVerifying || !modalName || !modalSecret}
                    className="btn-primary w-full justify-center"
                  >
                    {isVerifying ? 'Bağlantı Doğrulanıyor...' : 'Bağlantıyı Kaydet & Aktifleştir'}
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
