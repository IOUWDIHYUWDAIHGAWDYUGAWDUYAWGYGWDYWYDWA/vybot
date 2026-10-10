export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
      <p className="text-zinc-400 mb-8">VyBot agent&apos;larının genel durumu</p>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Aktif Bağlantılar', value: '0', icon: '🔌', color: 'text-blue-400' },
          { label: 'Çalışan Görevler', value: '0', icon: '⚡', color: 'text-emerald-400' },
          { label: 'Bugünkü AI İstekleri', value: '0 / 100', icon: '🧠', color: 'text-violet-400' },
          { label: 'Toplam Aksiyon', value: '0', icon: '🎯', color: 'text-amber-400' },
        ].map((stat) => (
          <div key={stat.label} className="card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-zinc-500 text-sm">{stat.label}</span>
              <span className="text-xl">{stat.icon}</span>
            </div>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">🚀 Hızlı Başlangıç</h2>
          <div className="space-y-3">
            <a href="/dashboard/connections" className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <span className="text-2xl">1️⃣</span>
              <div>
                <div className="font-medium">Bağlantı Ekle</div>
                <div className="text-sm text-zinc-500">API key, webhook veya MCP endpoint ekle</div>
              </div>
            </a>
            <a href="/dashboard/tasks" className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <span className="text-2xl">2️⃣</span>
              <div>
                <div className="font-medium">Görev Tanımla</div>
                <div className="text-sm text-zinc-500">AI&apos;a ne yapması gerektiğini söyle</div>
              </div>
            </a>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 opacity-50">
              <span className="text-2xl">3️⃣</span>
              <div>
                <div className="font-medium">İzle & Kontrol Et</div>
                <div className="text-sm text-zinc-500">AI 7/24 çalışırken loglarını takip et</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">📊 Son Aktivite</h2>
          <div className="text-center py-8 text-zinc-600">
            <div className="text-4xl mb-3">🤖</div>
            <p>Henüz aktivite yok.</p>
            <p className="text-sm mt-1">İlk bağlantını ekleyerek başla!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
