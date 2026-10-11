'use client';
import { useState } from 'react';

export default function GuidePage() {
  const [activeTab, setActiveTab] = useState<'discord' | 'telegram' | 'simulator'>('simulator');
  const [simulatorRole, setSimulatorRole] = useState('destek');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: 'Merhaba! Ben VyBot yapay zeka asistanıyım. Sunucunuzda veya kanalınızda 7/24 çalışabilirim. Bana aklınıza gelen herhangi bir şeyi sorun, nasıl cevap verdiğimi test edin!',
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
      const lower = userText.toLowerCase();

      if (simulatorRole === 'destek') {
        if (lower.includes('fiyat') || lower.includes('ücret') || lower.includes('kaç para')) {
          botResponse = 'Paketlerimiz ayda $9 (Startup) ve $29 (Business) olarak ücretlendirilmektedir. İlk ay ücretsiz test edebilirsiniz! Size hangi konuda yardımcı olabilirim?';
        } else if (lower.includes('merhaba') || lower.includes('selam')) {
          botResponse = 'Harika bir gün dilerim! Müşteri destek kanalına hoş geldiniz. Size nasıl yardımcı olabilirim?';
        } else {
          botResponse = `Talebinizi aldım ("${userText}"). Otonom sistem olarak bu soruyu hemen çözebilir veya dilerseniz insan yöneticimize bildirebilirim.`;
        }
      } else if (simulatorRole === 'moderator') {
        if (lower.includes('küfür') || lower.includes('salak') || lower.includes('aptal')) {
          botResponse = '⚠️ UYARI: Sunucu kuralları gereği hakaret veya argo kullanımı yasaktır. Lütfen saygılı bir dil kullanın.';
        } else {
          botResponse = 'Mesajınız incelendi, sunucu kurallarına tamamen uygun. İyi sohbetler!';
        }
      } else {
        botResponse = `Harika bir soru! Otonom yapay zeka motoru olarak her türlü konuda üyelerinizle 7/24 kesintisiz iletişim kurabilirim.`;
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: botResponse, time: now }]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="space-y-8 pb-12 font-mono text-xs">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-5">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-semibold text-white tracking-tight">
            Görsel Kullanım Kılavuzu & Canlı Simülatör
          </h1>
          <span className="text-[10px] px-2 py-0.5 rounded bg-vybot-500/10 border border-vybot-500/20 text-vybot-400">
            Adım Adım Anlatım
          </span>
        </div>
        <p className="text-zinc-400 text-xs mt-1 max-w-2xl">
          Hiçbir teknik bilginiz olmasına gerek yok. Aşağıdaki görsel adımları izleyerek veya canlı simülatörü deneyerek sistemin nasıl çalıştığını hemen görün.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-3 py-1.5 rounded-md transition-all font-semibold ${
            activeTab === 'simulator'
              ? 'bg-white text-black shadow-sm'
              : 'text-zinc-400 hover:text-white bg-white/[0.02]'
          }`}
        >
          🎮 1. Canlı Bot Simülatörü (Hemen Dene)
        </button>
        <button
          onClick={() => setActiveTab('discord')}
          className={`px-3 py-1.5 rounded-md transition-all font-semibold ${
            activeTab === 'discord'
              ? 'bg-white text-black shadow-sm'
              : 'text-zinc-400 hover:text-white bg-white/[0.02]'
          }`}
        >
          👾 2. Discord Botu Nasıl Bağlanır?
        </button>
        <button
          onClick={() => setActiveTab('telegram')}
          className={`px-3 py-1.5 rounded-md transition-all font-semibold ${
            activeTab === 'telegram'
              ? 'bg-white text-black shadow-sm'
              : 'text-zinc-400 hover:text-white bg-white/[0.02]'
          }`}
        >
          ✈️ 3. Telegram Botu Nasıl Bağlanır?
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
                  <span className="font-semibold text-white">Canlı Bot Test Penceresi</span>
                  <span className="text-[10px] text-zinc-500">
                    ({simulatorRole === 'destek' ? 'Destek Asistanı' : simulatorRole === 'moderator' ? 'Moderatör Botu' : 'Sohbet Botu'})
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSimulatorRole('destek')}
                    className={`px-2 py-0.5 rounded text-[10px] ${simulatorRole === 'destek' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'}`}
                  >
                    Destek
                  </button>
                  <button
                    onClick={() => setSimulatorRole('moderator')}
                    className={`px-2 py-0.5 rounded text-[10px] ${simulatorRole === 'moderator' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'}`}
                  >
                    Moderatör
                  </button>
                  <button
                    onClick={() => setSimulatorRole('sohbet')}
                    className={`px-2 py-0.5 rounded text-[10px] ${simulatorRole === 'sohbet' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'}`}
                  >
                    Sohbet
                  </button>
                </div>
              </div>

              {/* Chat Message Window */}
              <div className="h-72 overflow-y-auto p-4 space-y-3 font-sans text-xs">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="text-[10px] font-mono text-zinc-500 mb-0.5">
                      {m.sender === 'user' ? 'Siz' : 'VyBot Yapay Zeka'} • {m.time}
                    </div>
                    <div
                      className={`max-w-md p-3 rounded-lg leading-relaxed ${
                        m.sender === 'user'
                          ? 'bg-vybot-600 text-white rounded-br-none'
                          : 'bg-zinc-800/80 border border-white/10 text-zinc-200 rounded-bl-none'
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
                  placeholder="Bota bir şey yazın (Örn: 'Ürün fiyatları nedir?' veya 'Merhaba')..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="input flex-1 text-xs"
                />
                <button
                  onClick={handleSendMessage}
                  className="btn-primary py-2 px-4 shrink-0"
                >
                  Gönder →
                </button>
              </div>
            </div>

            {/* Quick Prompts to Test */}
            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              <span className="text-zinc-500">Hızlıca Dene:</span>
              <button
                onClick={() => setInputMessage('Ürün fiyatlarınız ne kadar?')}
                className="px-2 py-1 rounded bg-white/[0.03] border border-white/10 hover:border-white/30 text-zinc-300"
              >
                "Ürün fiyatlarınız ne kadar?"
              </button>
              <button
                onClick={() => setInputMessage('Sunucuda küfür etmek yasak mı?')}
                className="px-2 py-1 rounded bg-white/[0.03] border border-white/10 hover:border-white/30 text-zinc-300"
              >
                "Sunucuda küfür etmek yasak mı?"
              </button>
              <button
                onClick={() => setInputMessage('Bana bu platformu özetler misin?')}
                className="px-2 py-1 rounded bg-white/[0.03] border border-white/10 hover:border-white/30 text-zinc-300"
              >
                "Bana bu platformu özetler misin?"
              </button>
            </div>
          </div>

          {/* Explanation Card */}
          <div className="p-5 rounded-lg bg-[#08080c] border border-white/[0.08] space-y-4">
            <h3 className="text-sm font-semibold text-white">Bu Sistem Nasıl Çalışıyor?</h3>
            <div className="space-y-3 text-zinc-400 text-[11px] leading-relaxed">
              <div className="p-3 rounded bg-black/40 border border-white/[0.06]">
                <strong className="text-white block mb-1">1. Gelen Mesajı Dinler:</strong>
                Kullanıcı Discord veya Telegram&apos;dan yazdığında mesaj anında yapay zekaya ulaşır.
              </div>
              <div className="p-3 rounded bg-black/40 border border-white/[0.06]">
                <strong className="text-white block mb-1">2. Kuralları Uygular:</strong>
                Sizin panelde belirlediğiniz talimatlara göre (Örn: "Kibar ol", "Fiyatı söyle") cevabı hazırlar.
              </div>
              <div className="p-3 rounded bg-black/40 border border-white/[0.06]">
                <strong className="text-white block mb-1">3. Anında Cevap Verir:</strong>
                Hiçbir insan müdahalesi olmadan bot saniyeler içinde kanala cevabı yazar.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DISCORD GUIDE */}
      {activeTab === 'discord' && (
        <div className="space-y-6">
          <div className="p-6 rounded-lg bg-[#08080c] border border-white/[0.08] space-y-6">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Discord Botunu 3 Adımda Sisteme Bağlama
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded bg-black/40 border border-white/[0.06] space-y-2">
                <div className="w-6 h-6 rounded bg-vybot-600 text-white font-bold flex items-center justify-center text-xs">
                  1
                </div>
                <h3 className="font-semibold text-white text-xs">Discord Developer Portal&apos;a Git</h3>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  <a href="https://discord.com/developers/applications" target="_blank" rel="noreferrer" className="text-vybot-400 underline">discord.com/developers</a> adresine girin ve <strong>"New Application"</strong> diyerek botunuza bir isim verin.
                </p>
              </div>

              <div className="p-4 rounded bg-black/40 border border-white/[0.06] space-y-2">
                <div className="w-6 h-6 rounded bg-vybot-600 text-white font-bold flex items-center justify-center text-xs">
                  2
                </div>
                <h3 className="font-semibold text-white text-xs">Bot Token&apos;ını Kopyala</h3>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  Soldaki <strong>"Bot"</strong> menüsüne tıklayın. <strong>"Reset Token"</strong> butonuna basıp çıkan gizli kodu kopyalayın.
                </p>
              </div>

              <div className="p-4 rounded bg-black/40 border border-white/[0.06] space-y-2">
                <div className="w-6 h-6 rounded bg-vybot-600 text-white font-bold flex items-center justify-center text-xs">
                  3
                </div>
                <h3 className="font-semibold text-white text-xs">Paneline Yapıştır & Başlat</h3>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  VyBot panelindeki <a href="/dashboard/connections" className="text-vybot-400 underline">Ağ Geçitleri</a> sayfasına gelip <strong>"Discord"</strong> seçin ve kodu yapıştırın. Botunuz artık canlı!
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
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Telegram Botunu 30 Saniyede Oluşturma
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded bg-black/40 border border-white/[0.06] space-y-2">
                <div className="w-6 h-6 rounded bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                  1
                </div>
                <h3 className="font-semibold text-white text-xs">@BotFather&apos;ı Açın</h3>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  Telegram arama çubuğuna <strong>@BotFather</strong> yazın ve resmi bota girip <strong>/start</strong> deyin.
                </p>
              </div>

              <div className="p-4 rounded bg-black/40 border border-white/[0.06] space-y-2">
                <div className="w-6 h-6 rounded bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                  2
                </div>
                <h3 className="font-semibold text-white text-xs">/newbot Komutunu Verin</h3>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  BotFather&apos;a <code>/newbot</code> yazın. Botunuza bir isim ve sonu <code>bot</code> ile biten bir kullanıcı adı verin.
                </p>
              </div>

              <div className="p-4 rounded bg-black/40 border border-white/[0.06] space-y-2">
                <div className="w-6 h-6 rounded bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                  3
                </div>
                <h3 className="font-semibold text-white text-xs">Token&apos;ı Yapıştırın</h3>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  BotFather&apos;ın verdiği kırmızı renkli API anahtarını kopyalayın ve VyBot&apos;taki <a href="/dashboard/connections" className="text-emerald-400 underline">Ağ Geçitleri</a> sayfasına yapıştırın!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
