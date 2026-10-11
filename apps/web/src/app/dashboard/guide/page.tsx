'use client';
import { useState } from 'react';

function normalizeTr(text: string): string {
  return text
    .toLocaleLowerCase('tr')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .trim();
}

export default function GuidePage() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'discord' | 'telegram'>('simulator');
  const [simulatorRole, setSimulatorRole] = useState<'destek' | 'moderator' | 'sohbet'>('destek');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: 'Merhaba. Ben VyBot Otonom Asistanıyım. Sunucunuzda veya kanallarınızda 7/24 arka planda çalışmak üzere tasarlandım. Aşağıdan bana soru sorarak sistemin yanıt hızını ve mantığını test edebilirsiniz.',
      time: '12:00',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [...prev, { sender: 'user', text: userText, time: now }]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = '';
      const norm = normalizeTr(userText);

      if (simulatorRole === 'destek') {
        if (
          norm.includes('kimsin') ||
          norm.includes('adin ne') ||
          norm.includes('sen kimsin') ||
          norm.includes('necisin')
        ) {
          botResponse =
            'Ben VyBot! Discord sunucularınıza, Telegram gruplarınıza ve web sitelerinize 7/24 kesintisiz yapay zeka zekâsı kazandıran otonom operasyon asistanıyım. Kullanıcılarınızın sorularını yanıtlar, destek biletlerini çözer ve operasyonlarınızı kod yazmanıza gerek kalmadan otomatikleştiririm.';
        } else if (
          norm.includes('ozet') ||
          norm.includes('platform') ||
          norm.includes('ne ise yarar') ||
          norm.includes('ne bu') ||
          norm.includes('anlat')
        ) {
          botResponse =
            'VyBot, teknik bilgiye veya kodlamaya ihtiyaç duymadan Discord ve Telegram botlarınıza üst düzey yapay zeka entegre etmenizi sağlayan bir yönetim platformudur. Siz yalnızca bot token\'ınızı ekler ve bota ne yapacağını Türkçe anlatırsınız; VyBot 7/24 arka planda LLaMA 3.3, DeepSeek ve Gemini modellerini kullanarak kullanıcılarınızla kesintisiz iletişim kurar.';
        } else if (
          norm.includes('nasil') ||
          norm.includes('kontrol') ||
          norm.includes('kullan') ||
          norm.includes('bilmiyorum') ||
          norm.includes('ogren') ||
          norm.includes('adim') ||
          norm.includes('basla')
        ) {
          botResponse =
            'Kontrol süreci tamamen 3 basit adımdan oluşmaktadır:\n\n1. Ağ Geçitleri (Connections): Sol menüden girip Discord veya Telegram bot token\'ınızı kaydedin.\n2. Otonom Görevler (Tasks): Bota ne yapacağını kendi cümlelerinizle yazın (Örn: "Müşterilerimin sorularına kibar ve net cevap ver").\n3. Başlat: Görevi aktifleştirdiğiniz an botunuz sunucunuzda aynen bu pencerede olduğu gibi 7/24 konuşmaya başlar. Hiçbir sunucu kurmanıza veya kod çalıştırmanıza gerek yoktur.';
        } else if (
          norm.includes('fiyat') ||
          norm.includes('ucret') ||
          norm.includes('para') ||
          norm.includes('bedava') ||
          norm.includes('paket') ||
          norm.includes('maliyet')
        ) {
          botResponse =
            'Başlangıç (Developer) planımız tamamen ücretsizdir. Testlerinizi ücretsiz olarak yapabilir ve botunuzu bağlayabilirsiniz. Yüksek hacimli topluluklar için aylık $9 (Startup) ve $29 (Business) planlarımız mevcuttur.';
        } else if (norm.includes('discord') || norm.includes('dc')) {
          botResponse =
            'Discord entegrasyonu için: discord.com/developers portalından bir bot oluşturup "Reset Token" diyerek aldığınız kodu sol menüdeki "Ağ Geçitleri" sayfasına yapıştırmanız yeterlidir. Yukarıdaki "Discord Entegrasyonu" sekmesinde resimli anlatımı bulabilirsiniz.';
        } else if (norm.includes('telegram') || norm.includes('tg')) {
          botResponse =
            'Telegram entegrasyonu için: Telegram uygulamasında @BotFather botuna gidip /newbot yazın. Verilen kırmızı renkli token kodunu "Ağ Geçitleri" sayfamıza yapıştırdığınızda bot anında aktif olur.';
        } else if (
          norm.includes('selam') ||
          norm.includes('merhaba') ||
          norm.includes('gunaydin') ||
          norm.includes('iyi gunler') ||
          norm.includes('slm')
        ) {
          botResponse =
            'Merhaba. VyBot otonom destek hattına hoş geldiniz. Sistemimiz çalışır durumda; merak ettiğiniz tüm özellikleri bana doğrudan sorabilirsiniz.';
        } else if (norm.includes('yardim') || norm.includes('destek') || norm.includes('problem')) {
          botResponse =
            'Talebiniz kaydedildi. Yapay zeka motorumuz sorununuzu analiz edip anında çözüm sağlayabilir veya sistem yöneticinize otomatik eskalasyon kaydı oluşturabilir.';
        } else {
          botResponse = `"${userText}" sorunuz kaydedildi. VyBot bu tür müşteri sorularını tanımlı iş kurallarınıza ve şirket hafızanıza göre saniyeler içinde otonom olarak yanıtlar.`;
        }
      } else if (simulatorRole === 'moderator') {
        if (
          norm.includes('kufur') ||
          norm.includes('salak') ||
          norm.includes('aptal') ||
          norm.includes('serefsiz') ||
          norm.includes('pic')
        ) {
          botResponse =
            '[GÜVENLİK SİSTEMİ] Hakaret veya kural dışı ifade tespit edildi. İleti arşive taşındı ve kullanıcı siciline uyarı kaydı işlendi.';
        } else if (
          norm.includes('reklam') ||
          norm.includes('link') ||
          norm.includes('http') ||
          norm.includes('.com') ||
          norm.includes('discord.gg')
        ) {
          botResponse =
            '[GÜVENLİK SİSTEMİ] İzin verilmeyen harici bağlantı veya reklam tespit edildi. Mesaj paylaşımı durduruldu.';
        } else if (norm.includes('kural')) {
          botResponse =
            '[SİSTEM BİLGİSİ] Kurallar: 1) Saygılı iletişim, 2) Reklam yasağı, 3) Doğru kanal kullanımı. VyBot 7/24 kuralları uygular.';
        } else {
          botResponse =
            '[GÜVENLİK SİSTEMİ] İleti denetlendi. Herhangi bir kural ihlali bulunamadı; içerik yayında.';
        }
      } else {
        if (norm.includes('nasil') || norm.includes('naber')) {
          botResponse =
            'Sistemler nominal düzeyde çalışıyor, teşekkürler. Sunucunuzdaki üyelerle 7/24 etkileşim kurmaya hazırım.';
        } else if (norm.includes('saka') || norm.includes('espri')) {
          botResponse =
            'Yapay zekaya "insanlar seni neden seviyor?" diye sormuşlar; "Çünkü ben hiç uyumam ve mola vermem" demiş.';
        } else {
          botResponse = `"${userText}" — Otonom sohbet modunda üyelerinizle doğal, akıcı ve tutarlı bir diyalog yürütülebilir.`;
        }
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: botResponse, time: now }]);
      setIsTyping(false);
    }, 500);
  };

  return (
    <div className="space-y-8 pb-12 font-mono text-xs">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-5">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-semibold text-white tracking-tight">
            Kullanım Kılavuzu & Canlı Simülatör
          </h1>
          <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.05] border border-white/10 text-zinc-300 font-mono">
            KONTROL MERKEZİ
          </span>
        </div>
        <p className="text-zinc-400 text-xs mt-1 max-w-2xl font-sans">
          Teknik kodlama bilgisine ihtiyaç yoktur. Aşağıdaki canlı test konsolundan botun yanıt mantığını inceleyebilir, ardından 3 adımda kendi botunuzu bağlayabilirsiniz.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-3 py-1.5 rounded-md transition-all font-semibold text-xs ${
            activeTab === 'simulator'
              ? 'bg-white text-black shadow-sm'
              : 'text-zinc-400 hover:text-white bg-white/[0.02]'
          }`}
        >
          [01] CANLI SİMÜLATÖR
        </button>
        <button
          onClick={() => setActiveTab('discord')}
          className={`px-3 py-1.5 rounded-md transition-all font-semibold text-xs ${
            activeTab === 'discord'
              ? 'bg-white text-black shadow-sm'
              : 'text-zinc-400 hover:text-white bg-white/[0.02]'
          }`}
        >
          [02] DISCORD ENTEGRASYONU
        </button>
        <button
          onClick={() => setActiveTab('telegram')}
          className={`px-3 py-1.5 rounded-md transition-all font-semibold text-xs ${
            activeTab === 'telegram'
              ? 'bg-white text-black shadow-sm'
              : 'text-zinc-400 hover:text-white bg-white/[0.02]'
          }`}
        >
          [03] TELEGRAM ENTEGRASYONU
        </button>
      </div>

      {/* TAB 1: SIMULATOR */}
      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="p-4 rounded-lg bg-[#08080c] border border-white/[0.08]">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-semibold text-white">Canlı Bot Test Konsolu</span>
                  <span className="text-[10px] text-zinc-500">
                    ({simulatorRole === 'destek' ? 'Destek Asistanı' : simulatorRole === 'moderator' ? 'Moderatör' : 'Sohbet'})
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSimulatorRole('destek')}
                    className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${
                      simulatorRole === 'destek'
                        ? 'bg-white text-black font-bold'
                        : 'text-zinc-400 hover:text-white bg-white/[0.02]'
                    }`}
                  >
                    Destek
                  </button>
                  <button
                    onClick={() => setSimulatorRole('moderator')}
                    className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${
                      simulatorRole === 'moderator'
                        ? 'bg-white text-black font-bold'
                        : 'text-zinc-400 hover:text-white bg-white/[0.02]'
                    }`}
                  >
                    Moderatör
                  </button>
                  <button
                    onClick={() => setSimulatorRole('sohbet')}
                    className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${
                      simulatorRole === 'sohbet'
                        ? 'bg-white text-black font-bold'
                        : 'text-zinc-400 hover:text-white bg-white/[0.02]'
                    }`}
                  >
                    Sohbet
                  </button>
                </div>
              </div>

              {/* Chat Message Window */}
              <div className="h-80 overflow-y-auto p-4 space-y-3 font-sans text-xs">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="text-[10px] font-mono text-zinc-500 mb-0.5">
                      {m.sender === 'user' ? 'Siz' : 'VyBot Asistanı'} • {m.time}
                    </div>
                    <div
                      className={`max-w-md p-3 rounded leading-relaxed whitespace-pre-wrap ${
                        m.sender === 'user'
                          ? 'bg-zinc-100 text-black font-medium'
                          : 'bg-zinc-900 border border-white/10 text-zinc-200'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="text-zinc-500 text-[11px] font-mono animate-pulse">
                    VyBot yanıt hazırlıyor...
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="pt-3 border-t border-white/[0.06] flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Bota bir soru sorun (Örn: 'kimsin', 'nasıl kontrol edeceğim', 'özetle')..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="input flex-1 text-xs bg-black/50 border-white/10 text-white placeholder-zinc-600"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-white text-black font-semibold rounded hover:bg-zinc-200 transition-colors text-xs shrink-0"
                >
                  Gönder
                </button>
              </div>
            </div>

            {/* Quick Test Chips */}
            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              <span className="text-zinc-500">Hazır Denemeler:</span>
              <button
                onClick={() => setInputMessage('kimsin')}
                className="px-2.5 py-1 rounded bg-white/[0.03] border border-white/10 hover:border-white/30 text-zinc-300"
              >
                "kimsin"
              </button>
              <button
                onClick={() => setInputMessage('Bana bu platformu özetler misin?')}
                className="px-2.5 py-1 rounded bg-white/[0.03] border border-white/10 hover:border-white/30 text-zinc-300"
              >
                "Bana bu platformu özetler misin?"
              </button>
              <button
                onClick={() => setInputMessage('Ben bu uygulamayı nasıl kullanacağım?')}
                className="px-2.5 py-1 rounded bg-white/[0.03] border border-white/10 hover:border-white/30 text-zinc-300"
              >
                "Ben bu uygulamayı nasıl kullanacağım?"
              </button>
            </div>
          </div>

          {/* Explanation Card */}
          <div className="p-5 rounded-lg bg-[#08080c] border border-white/[0.08] space-y-4">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
              Çalışma Mimarisi
            </h3>
            <div className="space-y-3 text-zinc-400 text-xs font-sans leading-relaxed">
              <div className="p-3 rounded bg-black/40 border border-white/[0.06]">
                <strong className="text-white block font-mono text-[11px] mb-1">01. ETKİLEŞİM DİNLEME</strong>
                Discord veya Telegram kanalına gelen mesajlar VyBot Ağ Geçidi tarafından gerçek zamanlı alınır.
              </div>
              <div className="p-3 rounded bg-black/40 border border-white/[0.06]">
                <strong className="text-white block font-mono text-[11px] mb-1">02. TALİMAT İŞLEME</strong>
                Tanımladığınız kurallar (Otonom Görevler) doğrultusunda LLaMA 3.3 ve Gemini modelleri çalıştırılır.
              </div>
              <div className="p-3 rounded bg-black/40 border border-white/[0.06]">
                <strong className="text-white block font-mono text-[11px] mb-1">03. OTONOM CEVAPLAMA</strong>
                İnsan operatör gerekmeksizin sistem milisaniyeler içinde kanala doğrudan yanıt iletir.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DISCORD GUIDE */}
      {activeTab === 'discord' && (
        <div className="space-y-6">
          <div className="p-6 rounded-lg bg-[#08080c] border border-white/[0.08] space-y-6">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Discord Botunu Sisteme Entegre Etme Rehberi
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-xs">
              <div className="p-4 rounded bg-black/40 border border-white/[0.06] space-y-2">
                <div className="w-5 h-5 rounded bg-white text-black font-bold font-mono flex items-center justify-center text-[10px]">
                  01
                </div>
                <h3 className="font-semibold text-white">Geliştirici Portalına Giriş</h3>
                <p className="text-zinc-400 leading-relaxed text-[11px]">
                  <a
                    href="https://discord.com/developers/applications"
                    target="_blank"
                    rel="noreferrer"
                    className="text-white underline"
                  >
                    discord.com/developers
                  </a>{' '}
                  adresine girin ve <strong>&quot;New Application&quot;</strong> butonuna basarak botunuza bir ad verin.
                </p>
              </div>

              <div className="p-4 rounded bg-black/40 border border-white/[0.06] space-y-2">
                <div className="w-5 h-5 rounded bg-white text-black font-bold font-mono flex items-center justify-center text-[10px]">
                  02
                </div>
                <h3 className="font-semibold text-white">Bot Anahtarını (Token) Alma</h3>
                <p className="text-zinc-400 leading-relaxed text-[11px]">
                  Soldaki <strong>&quot;Bot&quot;</strong> sekmesine geçin. <strong>&quot;Reset Token&quot;</strong> butonuna basıp üretilen gizli anahtarı kopyalayın.
                </p>
              </div>

              <div className="p-4 rounded bg-black/40 border border-white/[0.06] space-y-2">
                <div className="w-5 h-5 rounded bg-white text-black font-bold font-mono flex items-center justify-center text-[10px]">
                  03
                </div>
                <h3 className="font-semibold text-white">Panale Ekleme ve Aktivasyon</h3>
                <p className="text-zinc-400 leading-relaxed text-[11px]">
                  Sol menüdeki <a href="/dashboard/connections" className="text-white underline">Ağ Geçitleri</a> sayfasına gidin, <strong>&quot;Discord&quot;</strong> seçeneğine tıklayıp anahtarınızı yapıştırın. Botunuz anında çalışmaya başlar.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TELEGRAM GUIDE */}
      {activeTab === 'telegram' && (
        <div className="space-y-6">
          <div className="p-6 rounded-lg bg-[#08080c] border border-white/[0.08] space-y-6">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Telegram Botunu Sisteme Entegre Etme Rehberi
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-xs">
              <div className="p-4 rounded bg-black/40 border border-white/[0.06] space-y-2">
                <div className="w-5 h-5 rounded bg-white text-black font-bold font-mono flex items-center justify-center text-[10px]">
                  01
                </div>
                <h3 className="font-semibold text-white">@BotFather İletişimi</h3>
                <p className="text-zinc-400 leading-relaxed text-[11px]">
                  Telegram arama kutusuna <strong>@BotFather</strong> yazın ve resmi bota <strong>/start</strong> komutu verin.
                </p>
              </div>

              <div className="p-4 rounded bg-black/40 border border-white/[0.06] space-y-2">
                <div className="w-5 h-5 rounded bg-white text-black font-bold font-mono flex items-center justify-center text-[10px]">
                  02
                </div>
                <h3 className="font-semibold text-white">/newbot Komutu</h3>
                <p className="text-zinc-400 leading-relaxed text-[11px]">
                  BotFather&apos;a <code>/newbot</code> yazın. Botunuza bir isim ve sonu <code>bot</code> ile biten bir kullanıcı adı tanımlayın.
                </p>
              </div>

              <div className="p-4 rounded bg-black/40 border border-white/[0.06] space-y-2">
                <div className="w-5 h-5 rounded bg-white text-black font-bold font-mono flex items-center justify-center text-[10px]">
                  03
                </div>
                <h3 className="font-semibold text-white">Anahtarı Kaydetme</h3>
                <p className="text-zinc-400 leading-relaxed text-[11px]">
                  BotFather tarafından verilen API anahtarını kopyalayıp sol menüdeki <a href="/dashboard/connections" className="text-white underline">Ağ Geçitleri</a> sayfasına yapıştırın. Botunuz 7/24 aktif olacaktır.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
