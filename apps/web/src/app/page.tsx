import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#050508] text-zinc-100 font-sans selection:bg-white selection:text-black">
      {/* Top Enterprise Header */}
      <nav className="border-b border-white/[0.08] bg-[#08080c]/80 backdrop-blur-md px-6 py-3.5 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-white text-black font-mono font-bold text-xs flex items-center justify-center">
              V
            </div>
            <span className="font-semibold text-sm tracking-tight text-white font-mono">
              VyBot Platform
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] text-zinc-400">
              Enterprise v1.0
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <Link href="/dashboard" className="text-zinc-400 hover:text-white transition-colors">
              Konsol
            </Link>
            <Link href="/login" className="text-zinc-400 hover:text-white transition-colors">
              Giriş
            </Link>
            <Link href="/register" className="btn-primary">
              Konsolu Aç →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-zinc-300 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Zero-Trust Donanım Kasası & Universal AI Gateway</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.08] mb-6">
          Tüm API&apos;leri Bağlayın.{' '}
          <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-600">
            Yapay Zeka 7/24 Yönetsin.
          </span>
        </h1>

        <p className="text-base md:text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Discord botları, Telegram kanalları, webhooklar ve MCP protokolleri için evrensel otonom ajan altyapısı.
          Ham anahtarlarınız donanım seviyesinde izole edilir; modeller API&apos;lerinizi otomatik keşfeder.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 font-mono text-xs">
          <Link href="/dashboard" className="btn-primary text-sm py-2.5 px-6 w-full sm:w-auto">
            Hemen Başlayın (Ücretsiz) →
          </Link>
          <Link href="#architecture" className="btn-secondary text-sm py-2.5 px-6 w-full sm:w-auto">
            Mimarisi Nasıl Çalışır?
          </Link>
        </div>

        {/* Real Code Architecture Snapshot */}
        <div className="mt-16 text-left max-w-3xl mx-auto rounded-lg bg-[#08080c] border border-white/[0.08] p-4 shadow-2xl font-mono text-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06] text-[11px] text-zinc-500">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              <span className="ml-2 text-zinc-400">gateway_execution_loop.ts</span>
            </div>
            <span className="text-emerald-400">AES-256-GCM Hardware Proxy</span>
          </div>
          <div className="text-zinc-400 space-y-1">
            <p><span className="text-purple-400">const</span> router = <span className="text-blue-400">new</span> <span className="text-yellow-400">AIRouter</span>(&#123; failover: <span className="text-green-400">[&apos;groq&apos;, &apos;cerebras&apos;, &apos;gemini&apos;, &apos;nvidia&apos;]</span> &#125;);</p>
            <p><span className="text-purple-400">const</span> vault = <span className="text-blue-400">await</span> HardwareEnclave.<span className="text-blue-400">decryptTransient</span>(tokenFingerprint);</p>
            <p><span className="text-purple-400">const</span> tools = <span className="text-blue-400">await</span> DiscoveryEngine.<span className="text-blue-400">synthesizeOpenApiTools</span>(vault);</p>
            <p><span className="text-zinc-500">// AI executes autonomously 24/7 without raw token exposure</span></p>
            <p><span className="text-purple-400">await</span> TaskExecutor.<span className="text-blue-400">runEventLoop</span>(&#123; router, tools, state &#125;);</p>
          </div>
        </div>
      </main>

      {/* How it Works / 3 Pillars */}
      <section id="architecture" className="max-w-5xl mx-auto px-6 py-20 border-t border-white/[0.06]">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Üç Katmanlı Güvenli Ajan Mimarisi
          </h2>
          <p className="text-xs text-zinc-400 mt-2 font-mono">
            Zero-Trust Credential Proxy • Heuristic Discovery • Self-Healing ReAct
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 font-mono text-xs">
          <div className="p-6 rounded-lg bg-[#08080c] border border-white/[0.08]">
            <div className="w-8 h-8 rounded bg-white/[0.04] border border-white/10 flex items-center justify-center font-bold text-zinc-200 mb-4">
              01
            </div>
            <h3 className="text-sm font-semibold text-white mb-2">Donanım İzolasyonu</h3>
            <p className="text-zinc-400 leading-relaxed">
              API anahtarınız tarayıcınızdan çıkar çıkmaz AES-256-GCM ile şifrelenir. LLM modelleri ham anahtarı asla göremez.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-[#08080c] border border-white/[0.08]">
            <div className="w-8 h-8 rounded bg-white/[0.04] border border-white/10 flex items-center justify-center font-bold text-zinc-200 mb-4">
              02
            </div>
            <h3 className="text-sm font-semibold text-white mb-2">Otonom Keşif Motoru</h3>
            <p className="text-zinc-400 leading-relaxed">
              Bağlanan servisin OpenAPI şeması ve uç noktaları otomatik taranarak yapay zekanın çağırabileceği typed tool&apos;lara dönüştürülür.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-[#08080c] border border-white/[0.08]">
            <div className="w-8 h-8 rounded bg-white/[0.04] border border-white/10 flex items-center justify-center font-bold text-zinc-200 mb-4">
              03
            </div>
            <h3 className="text-sm font-semibold text-white mb-2">7/24 Kesintisiz Döngü</h3>
            <p className="text-zinc-400 leading-relaxed">
              Gelen mesajlar ve olaylar anlık dinlenir, ReAct protokolü ile karara bağlanır ve otomatik aksiyonlar icra edilir.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing / Monetization */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-t border-white/[0.06]">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Şeffaf Lisanslama & Fiyatlandırma
          </h2>
          <p className="text-xs text-zinc-400 mt-2 font-mono">
            Geliştirici katmanıyla ücretsiz başlayın, işiniz büyüdükçe yükseltin.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 font-mono text-xs">
          {[
            { name: 'Developer', price: '$0', desc: 'Test ve prototipleme', conns: '1 Bağlantı', tokens: '50K Token/Gün' },
            { name: 'Starter', price: '$9', desc: 'Tekil bot ve küçük topluluk', conns: '3 Bağlantı', tokens: '200K Token/Gün' },
            { name: 'Business', price: '$29', desc: 'Büyüyen şirketler ve sunucular', conns: '10 Bağlantı', tokens: '1M Token/Gün', popular: true },
            { name: 'Enterprise', price: '$79', desc: 'Sınırsız otonom filo', conns: 'Sınırsız Bağlantı', tokens: '5M Token/Gün' },
          ].map((tier) => (
            <div
              key={tier.name}
              className={`p-5 rounded-lg bg-[#08080c] border flex flex-col justify-between ${
                tier.popular ? 'border-white/30 bg-[#0c0c14]' : 'border-white/[0.08]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white uppercase text-[11px]">{tier.name}</h3>
                  {tier.popular && <span className="text-[9px] px-1 py-0.2 rounded bg-white text-black font-black">POPÜLER</span>}
                </div>
                <div className="text-2xl font-bold text-white mt-3">{tier.price}<span className="text-xs text-zinc-500 font-normal">/ay</span></div>
                <p className="text-zinc-500 text-[11px] mt-1">{tier.desc}</p>
                <div className="my-4 border-t border-white/[0.06]" />
                <ul className="space-y-1.5 text-zinc-300">
                  <li>✓ {tier.conns}</li>
                  <li>✓ {tier.tokens}</li>
                  <li>✓ 7/24 Kesintisiz SLA</li>
                </ul>
              </div>
              <Link href="/register" className={`mt-6 w-full text-center py-2 rounded-md ${tier.popular ? 'btn-primary' : 'btn-secondary'}`}>
                Başla →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] px-6 py-8 text-center text-zinc-600 font-mono text-xs">
        © 2026 VyBot Platform Inc. Tüm hakları saklıdır. Zero-Trust Hardware AI Enclave.
      </footer>
    </div>
  );
}
