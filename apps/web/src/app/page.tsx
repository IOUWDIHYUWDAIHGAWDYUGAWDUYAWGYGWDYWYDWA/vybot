import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] via-[#0d0d1a] to-[#0a0a0f]">
      {/* Navbar */}
      <nav className="border-b border-white/5 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-vybot-600 flex items-center justify-center font-bold text-sm">V</div>
            <span className="text-xl font-bold">VyBot</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-zinc-400 hover:text-white transition-colors">Giriş Yap</Link>
            <Link href="/register" className="btn-primary text-sm">Ücretsiz Başla</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="badge-info mb-6 mx-auto w-fit">🚀 Beta — Ücretsiz erken erişim</div>
        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
          Her API&apos;ye Bağlan.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-vybot-400 to-vybot-600">
            AI Çalışsın.
          </span>
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
          API Key, Webhook veya MCP ver — yapay zeka otomatik anlasın. 
          Görev tanımla — 7/24 otonom çalışsın.
        </p>
        <div className="flex items-center gap-4 justify-center">
          <Link href="/register" className="btn-primary text-lg px-8 py-3">
            Ücretsiz Başla →
          </Link>
          <Link href="#features" className="btn-secondary text-lg px-8 py-3">
            Nasıl Çalışır?
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-20 max-w-lg mx-auto">
          <div>
            <div className="text-3xl font-bold text-vybot-400">$0</div>
            <div className="text-sm text-zinc-500 mt-1">Başlangıç maliyeti</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-emerald-400">7/24</div>
            <div className="text-sm text-zinc-500 mt-1">Otonom çalışma</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-amber-400">∞</div>
            <div className="text-sm text-zinc-500 mt-1">Platform desteği</div>
          </div>
        </div>
      </main>

      {/* Features */}
      <section id="features" className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Nasıl Çalışır?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: '🔑', title: '1. Bağlan', desc: 'Discord bot token, Telegram key, webhook URL veya MCP endpoint — ne varsa ver.' },
            { icon: '🧠', title: '2. AI Anlasın', desc: 'Yapay zeka API\'ni otomatik keşfeder, tool\'ları oluşturur, hazır hale getirir.' },
            { icon: '⚡', title: '3. Çalışsın', desc: 'Görev tanımla, unut. AI 7/24 otonom olarak görevini yürütür.' },
          ].map((f) => (
            <div key={f.title} className="card text-center">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-zinc-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-4">Fiyatlandırma</h2>
        <p className="text-zinc-400 text-center mb-12">Başla, büyüdükçe yükselt.</p>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { name: 'Free', price: '$0', features: ['1 bağlantı', '100 AI istek/gün', 'Temel görevler'] },
            { name: 'Starter', price: '$9', features: ['3 bağlantı', '1,000 AI istek/gün', 'Email destek'], popular: false },
            { name: 'Pro', price: '$29', features: ['10 bağlantı', '5,000 AI istek/gün', 'Öncelikli AI'], popular: true },
            { name: 'Business', price: '$79', features: ['Sınırsız bağlantı', '20,000 AI istek/gün', 'Özel adaptörler'] },
          ].map((plan) => (
            <div key={plan.name} className={`card relative ${plan.popular ? 'border-vybot-500 ring-1 ring-vybot-500/20' : ''}`}>
              {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 badge bg-vybot-600 text-white">En Popüler</div>}
              <h3 className="font-semibold text-lg">{plan.name}</h3>
              <div className="text-3xl font-bold mt-2 mb-4">{plan.price}<span className="text-sm text-zinc-500 font-normal">/ay</span></div>
              <ul className="space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="text-sm text-zinc-400 flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full mt-6 ${plan.popular ? 'btn-primary' : 'btn-secondary'} justify-center`}>
                Seç
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-8 text-center text-zinc-500 text-sm">
        © 2026 VyBot. Tüm hakları saklıdır.
      </footer>
    </div>
  );
}
