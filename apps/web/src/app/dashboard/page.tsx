'use client';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="space-y-8 pb-12">
      {/* Overview Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Sistem Genel Bakışı & Telemetri
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              7/24 Kesintisiz Aktif
            </span>
          </div>
          <p className="text-zinc-400 text-sm mt-1 max-w-2xl">
            VyBot otonom ağ geçitleri, model istekleri ve aktif görev döngülerinin anlık durumu.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/connections"
            className="bg-vybot-600 hover:bg-vybot-500 text-white font-medium py-2 px-4 rounded-lg transition-all shadow-lg shadow-vybot-600/20 text-xs inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Ağ Geçidi Ekle
          </Link>
          <Link
            href="/dashboard/tasks"
            className="bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 font-medium py-2 px-4 rounded-lg transition-all text-xs inline-flex items-center gap-2"
          >
            Görev Tanımla
          </Link>
        </div>
      </div>

      {/* Real Infrastructure Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111118] border border-white/5 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">Ağ Geçitleri</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <div className="mt-3 text-2xl font-bold text-white font-mono">0</div>
          <div className="mt-1 text-xs text-zinc-400">Aktif API & Bot Bağlantısı</div>
        </div>

        <div className="bg-[#111118] border border-white/5 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">Otonom Görevler</span>
            <span className="w-2 h-2 rounded-full bg-blue-400" />
          </div>
          <div className="mt-3 text-2xl font-bold text-white font-mono">0</div>
          <div className="mt-1 text-xs text-zinc-400">Çalışan Arka Plan Görevi</div>
        </div>

        <div className="bg-[#111118] border border-white/5 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">AI Kota Kullanımı</span>
            <span className="w-2 h-2 rounded-full bg-violet-400" />
          </div>
          <div className="mt-3 text-2xl font-bold text-white font-mono">0 <span className="text-sm font-normal text-zinc-500">/ 100</span></div>
          <div className="mt-1 text-xs text-zinc-400">Günlük Ücretsiz AI İstekleri</div>
        </div>

        <div className="bg-[#111118] border border-white/5 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">Tamamlanan Eylem</span>
            <span className="w-2 h-2 rounded-full bg-amber-400" />
          </div>
          <div className="mt-3 text-2xl font-bold text-white font-mono">0</div>
          <div className="mt-1 text-xs text-zinc-400">Başarılı Bot Aksiyonu</div>
        </div>
      </div>

      {/* Telemetry and Getting Started Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Setup Guide */}
        <div className="lg:col-span-2 bg-[#111118] border border-white/5 rounded-xl p-6">
          <h2 className="text-base font-semibold text-white tracking-tight mb-1">
            Entegrasyon & Başlangıç Akışı
          </h2>
          <p className="text-xs text-zinc-400 mb-6">
            VyBot yapay zeka ajanlarını 3 basit adımda otonom olarak devreye alın.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-vybot-600/20 border border-vybot-500/30 text-vybot-400 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                01
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-white">Ağ Geçidi Tanımlayın</h3>
                  <Link href="/dashboard/connections" className="text-xs text-vybot-400 hover:underline">
                    Kasaya Git →
                  </Link>
                </div>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Discord Bot Token, Telegram Key, Slack Webhook veya MCP endpoint&apos;inizi girin. Anahtar donanım kasasında AES-256-GCM ile şifrelenir.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-vybot-600/20 border border-vybot-500/30 text-vybot-400 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                02
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-white">Otonom Görev Atayın</h3>
                  <Link href="/dashboard/tasks" className="text-xs text-vybot-400 hover:underline">
                    Görev Oluştur →
                  </Link>
                </div>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Yapay zekanın ne yapacağını doğal Türkçe veya İngilizce ile anlatın. Model API&apos;leri keşfeder ve ilgili aksiyonları otomatik üretir.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-vybot-600/20 border border-vybot-500/30 text-vybot-400 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                03
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-white">7/24 Kesintisiz İzleyin</h3>
                  <Link href="/dashboard/logs" className="text-xs text-vybot-400 hover:underline">
                    Denetim Logları →
                  </Link>
                </div>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Ajanınız arka planda olayları dinler, soruları cevaplar ve kararlar alır. Tüm kararları denetim loglarından anlık inceleyin.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Security & Enclave Status Card */}
        <div className="bg-[#111118] border border-white/5 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight mb-1">
              Güvenlik & Donanım Durumu
            </h2>
            <p className="text-xs text-zinc-400 mb-5">
              Sıfır Güven (Zero-Trust) Donanım İzolasyonu
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/5">
                <span className="text-zinc-400">Şifreleme:</span>
                <span className="text-emerald-400 font-semibold">AES-256-GCM</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/5">
                <span className="text-zinc-400">Anahtar İzolasyonu:</span>
                <span className="text-emerald-400 font-semibold">Aktif (HSM)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/5">
                <span className="text-zinc-400">AI Yönlendirici:</span>
                <span className="text-white font-semibold">Groq / NVIDIA Failover</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/5">
                <span className="text-zinc-400">Edge Bölgesi:</span>
                <span className="text-white font-semibold">Frankfurt (fra01)</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 text-[11px] text-zinc-500">
            Sistem SOC-2 Type II gereksinimleriyle uyumlu olarak raw anahtarları bellekte tutmaz.
          </div>
        </div>
      </div>
    </div>
  );
}
