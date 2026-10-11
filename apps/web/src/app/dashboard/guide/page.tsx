'use client';
import Link from 'next/link';

export default function GuidePage() {
  return (
    <div className="space-y-8 pb-12 font-mono text-xs">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight text-white">
            📖 VyBot Entegrasyon & Kurulum Rehberi
          </h1>
          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
            Adım Adım Kılavuz
          </span>
        </div>
        <p className="text-zinc-400 mt-1 max-w-2xl leading-relaxed">
          Tek satır kod yazmadan Discord botu kurun, Telegram bağlayın ve ücretsiz yapay zekâ ile 7/24 otonom çalıştırın.
        </p>
      </div>

      {/* Guide Cards */}
      <div className="grid grid-cols-1 gap-6">
        {/* Section 1: Discord */}
        <div className="bg-[#0a0a0f] border border-white/[0.08] rounded-xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">🤖</span>
              <h2 className="text-sm font-bold text-white">1. Bölüm: Discord Botu Kurma & Token Alma</h2>
            </div>
            <a
              href="https://discord.com/developers/applications"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary self-start sm:self-auto text-[11px]"
            >
              Discord Developer Portal'ı Aç ↗
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-zinc-300">
            <div className="p-3.5 rounded bg-black/40 border border-white/[0.06] space-y-2">
              <div className="font-bold text-white text-[11px]">Adım 1.1: Yeni Bot Uygulaması Açın</div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                1. Yukarıdaki butona tıklayarak <strong>Discord Developer Portal</strong> sayfasına gidin.<br />
                2. Sağ üstteki <strong>"New Application"</strong> butonuna basın ve botunuza bir isim verin (Örn: <em>VyBot Destek</em>).<br />
                3. Şartları onaylayıp <strong>"Create"</strong> deyin.
              </p>
            </div>

            <div className="p-3.5 rounded bg-black/40 border border-white/[0.06] space-y-2">
              <div className="font-bold text-white text-[11px]">Adım 1.2: Bot Token'ını Alın & Kopyalayın</div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                1. Sol menüden <strong>"Bot"</strong> sekmesine tıklayın.<br />
                2. <strong>"Reset Token"</strong> butonuna basın ve şifrenizi girin.<br />
                3. Ekrana gelen uzun token kodunu (<code>MTM...</code>) <strong>Copy</strong> diyerek kopyalayın.<br />
                <em>(Not: Bu tokenı kimseyle paylaşmayın; şifreniz gibidir).</em>
              </p>
            </div>

            <div className="p-3.5 rounded bg-black/40 border border-white/[0.06] space-y-2">
              <div className="font-bold text-emerald-400 text-[11px]">⚠️ Adım 1.3: ÇOK ÖNEMLİ — Mesaj Okuma İzni</div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Aynı "Bot" sayfasında aşağı kaydırın ve <strong>"Privileged Gateway Intents"</strong> başlığı altındaki:
                <br /><strong className="text-white">• MESSAGE CONTENT INTENT</strong> seçeneğini mutlaka <strong>AÇIK (Mavi)</strong> yapın ve kaydedin.
                <br /><em>(Bunu açmazsanız bot sunucudaki mesajları okuyamaz).</em>
              </p>
            </div>

            <div className="p-3.5 rounded bg-black/40 border border-white/[0.06] space-y-2">
              <div className="font-bold text-white text-[11px]">Adım 1.4: Botu Sunucunuza Davet Edin</div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                1. Sol menüden <strong>OAuth2 &gt; URL Generator</strong> sekmesine gidin.<br />
                2. SCOPES kısmından <strong>"bot"</strong> kutucuğunu işaretleyin.<br />
                3. BOT PERMISSIONS kısmından <strong>"Administrator"</strong> (veya Mesaj Gönder/Oku) seçin.<br />
                4. En alttaki linki tarayıcınıza yapıştırıp botu kendi Discord sunucunuza ekleyin.
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Link href="/dashboard/connections" className="btn-primary text-xs">
              → Token'ı Aldım, Ağ Geçitlerine Ekle
            </Link>
          </div>
        </div>

        {/* Section 2: Telegram */}
        <div className="bg-[#0a0a0f] border border-white/[0.08] rounded-xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">✈️</span>
              <h2 className="text-sm font-bold text-white">2. Bölüm: Telegram Botu Kurma (1 Dakikada)</h2>
            </div>
            <a
              href="https://t.me/BotFather"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary self-start sm:self-auto text-[11px]"
            >
              Telegram @BotFather'ı Aç ↗
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-zinc-300">
            <div className="p-3.5 rounded bg-black/40 border border-white/[0.06] space-y-2">
              <div className="font-bold text-white text-[11px]">1. BotFather Sohbeti</div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Telegram uygulamasında resmi <strong>@BotFather</strong> botunu açın ve <strong>Başlat (Start)</strong> butonuna basın.
              </p>
            </div>

            <div className="p-3.5 rounded bg-black/40 border border-white/[0.06] space-y-2">
              <div className="font-bold text-white text-[11px]">2. /newbot Komutu</div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Sohbete <code>/newbot</code> yazıp gönderin. Botunuza bir isim (Örn: <em>Yardım Asistanı</em>) ve <code>bot</code> ile biten bir kullanıcı adı (Örn: <em>vy_yardim_bot</em>) verin.
              </p>
            </div>

            <div className="p-3.5 rounded bg-black/40 border border-white/[0.06] space-y-2">
              <div className="font-bold text-white text-[11px]">3. Token'ı Kopyalayın</div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                BotFather size <code>123456789:ABCdefGh...</code> şeklinde bir HTTP API Token verecektir. Bu tokenı kopyalayıp sistemimize ekleyin.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Tasks and Live Testing */}
        <div className="bg-[#0a0a0f] border border-white/[0.08] rounded-xl p-6 space-y-4">
          <div className="border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">⚡</span>
              <h2 className="text-sm font-bold text-white">3. Bölüm: Görev Tanımlama & Canlı Simülasyon</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 rounded bg-black/40 border border-white/[0.06] space-y-2">
              <div className="font-bold text-white text-[11px]">Doğal Dille Görev Vermek</div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Kod yazmanıza hiç gerek yok. <strong>Otonom Görevler (Tasks)</strong> sayfasına gidin ve ne istediğinizi Türkçe olarak yazın:
                <br /><em className="text-zinc-300">"Destek bileti açılınca kullanıcıya kibarca hoş geldin de ve sorunun ne olduğunu sor."</em>
                <br />Sistemimiz bu açıklamayı kurumsal ReAct talimatlarına otomatik çevirir.
              </p>
            </div>

            <div className="p-3.5 rounded bg-black/40 border border-white/[0.06] space-y-2">
              <div className="font-bold text-white text-[11px]">▶️ "Canlı Test Et" Özelliği</div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Görevinizi oluşturduktan sonra hemen yanındaki <strong>"Canlı Test Et"</strong> butonuna basın.
                Simüle edilen kullanıcı mesajını gönderin ve yapay zekânın olayı nasıl düşünüp işlediğini, hangi eylemi aldığını canlı ekranda izleyin.
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Link href="/dashboard/tasks" className="btn-primary text-xs">
              → Görevler Sayfasına Git & Test Et
            </Link>
          </div>
        </div>

        {/* Section 4: Free AI Tokens */}
        <div className="bg-[#0a0a0f] border border-white/[0.08] rounded-xl p-6 space-y-4">
          <div className="border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎁</span>
              <h2 className="text-sm font-bold text-white">4. Bölüm: Tamamen Ücretsiz AI Anahtarları Nereden Alınır?</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded bg-black/40 border border-white/[0.06]">
              <div className="font-bold text-white text-[11px]">1. Google AI Studio (Gemini)</div>
              <div className="text-[10px] text-zinc-400 mt-1">15 RPM, 1.500 istek/gün tamamen ücretsiz</div>
              <a
                href="https://aistudio.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 text-[11px] underline mt-2 block"
              >
                aistudio.google.com ↗
              </a>
            </div>

            <div className="p-3 rounded bg-black/40 border border-white/[0.06]">
              <div className="font-bold text-white text-[11px]">2. Groq Cloud (Llama 3.3)</div>
              <div className="text-[10px] text-zinc-400 mt-1">14.400 istek/gün, saniyede 500+ token</div>
              <a
                href="https://console.groq.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 text-[11px] underline mt-2 block"
              >
                console.groq.com ↗
              </a>
            </div>

            <div className="p-3 rounded bg-black/40 border border-white/[0.06]">
              <div className="font-bold text-white text-[11px]">3. Cerebras Cloud (Ultra Hızlı)</div>
              <div className="text-[10px] text-zinc-400 mt-1">1M token/gün ücretsiz çıkarım</div>
              <a
                href="https://cloud.cerebras.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 text-[11px] underline mt-2 block"
              >
                cloud.cerebras.ai ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
