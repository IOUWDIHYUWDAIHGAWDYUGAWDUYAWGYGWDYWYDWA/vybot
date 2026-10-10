'use client';
import { useState } from 'react';

const PLATFORMS = [
  { id: 'discord', name: 'Discord', icon: '🎮', hint: 'Bot token (Bot MTk...)' },
  { id: 'telegram', name: 'Telegram', icon: '✈️', hint: 'Bot token (123456:ABC...)' },
  { id: 'slack', name: 'Slack', icon: '💬', hint: 'Bot token (xoxb-...)' },
  { id: 'github', name: 'GitHub', icon: '🐙', hint: 'Personal access token (ghp_...)' },
  { id: 'webhook', name: 'Webhook', icon: '🔗', hint: 'Webhook URL (https://...)' },
  { id: 'mcp', name: 'MCP Server', icon: '🔌', hint: 'MCP endpoint URL' },
  { id: 'custom', name: 'Özel API', icon: '⚙️', hint: 'Herhangi bir API key' },
];

export default function ConnectionsPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [connName, setConnName] = useState('');
  const [connValue, setConnValue] = useState('');
  const [connections, setConnections] = useState<Array<{ id: string; name: string; platform: string; status: string }>>([]);

  const handleAdd = () => {
    if (!selectedPlatform || !connName || !connValue) return;
    setConnections([...connections, {
      id: crypto.randomUUID(),
      name: connName,
      platform: selectedPlatform,
      status: 'pending',
    }]);
    setShowModal(false);
    setSelectedPlatform(null);
    setConnName('');
    setConnValue('');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Bağlantılar</h1>
          <p className="text-zinc-400 mt-1">API key, webhook ve MCP bağlantılarını yönet</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">+ Bağlantı Ekle</button>
      </div>

      {connections.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-5xl mb-4">🔌</div>
          <h2 className="text-xl font-semibold mb-2">Henüz bağlantı yok</h2>
          <p className="text-zinc-500 mb-6">İlk bağlantını ekle ve AI&apos;ın otomatik keşfetmesini izle!</p>
          <button onClick={() => setShowModal(true)} className="btn-primary">+ İlk Bağlantını Ekle</button>
        </div>
      ) : (
        <div className="grid gap-4">
          {connections.map((conn) => {
            const platform = PLATFORMS.find((p) => p.id === conn.platform);
            return (
              <div key={conn.id} className="card flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{platform?.icon}</span>
                  <div>
                    <div className="font-medium">{conn.name}</div>
                    <div className="text-sm text-zinc-500">{platform?.name}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={conn.status === 'active' ? 'badge-success' : conn.status === 'error' ? 'badge-danger' : 'badge-warning'}>
                    {conn.status === 'active' ? '● Aktif' : conn.status === 'error' ? '● Hata' : '● Keşfediliyor...'}
                  </span>
                  <button className="btn-danger text-xs py-1.5 px-3" onClick={() => setConnections(connections.filter((c) => c.id !== conn.id))}>Sil</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Connection Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111118] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Bağlantı Ekle</h2>
              <button onClick={() => { setShowModal(false); setSelectedPlatform(null); }} className="text-zinc-500 hover:text-white text-xl">✕</button>
            </div>

            <div className="p-6">
              {!selectedPlatform ? (
                <div>
                  <p className="text-zinc-400 mb-4">Platform seç:</p>
                  <div className="grid grid-cols-2 gap-3">
                    {PLATFORMS.map((p) => (
                      <button key={p.id} onClick={() => setSelectedPlatform(p.id)} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-vybot-500/50 transition-all text-left">
                        <span className="text-2xl">{p.icon}</span>
                        <div>
                          <div className="font-medium">{p.name}</div>
                          <div className="text-xs text-zinc-500">{p.hint}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <button onClick={() => setSelectedPlatform(null)} className="text-sm text-zinc-400 hover:text-white">← Geri</button>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1.5">Bağlantı Adı</label>
                    <input className="input" placeholder="Örn: Discord Bot'um" value={connName} onChange={(e) => setConnName(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1.5">API Key / Token / URL</label>
                    <textarea className="input min-h-[100px] font-mono text-sm" placeholder={PLATFORMS.find((p) => p.id === selectedPlatform)?.hint} value={connValue} onChange={(e) => setConnValue(e.target.value)} />
                    <p className="text-xs text-zinc-600 mt-2">🔒 AES-256-GCM ile şifrelenir. AI bu key&apos;i asla görmez.</p>
                  </div>
                  <button onClick={handleAdd} disabled={!connName || !connValue} className="btn-primary w-full justify-center disabled:opacity-50">
                    🔍 Bağla & Otomatik Keşfet
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
