'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getStoredConnections,
  getStoredTasks,
  type ConnectionRecord,
  type AgentTask,
} from '../../lib/storage';

export default function DashboardPage() {
  const [connections, setConnections] = useState<ConnectionRecord[]>([]);
  const [tasks, setTasks] = useState<AgentTask[]>([]);

  useEffect(() => {
    setConnections(getStoredConnections());
    setTasks(getStoredTasks());
  }, []);

  const totalActions = tasks.reduce((acc, t) => acc + (t.actionsCompleted || 0), 0);

  return (
    <div className="space-y-8 pb-12 font-mono">
      {/* Overview Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight text-white">
              Sistem Genel Bakışı & Canlı Telemetri
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              7/24 Kesintisiz Aktif
            </span>
          </div>
          <p className="text-zinc-400 text-xs mt-1 max-w-2xl">
            VyBot otonom ağ geçitleri, model istekleri ve aktif görev döngülerinin anlık durumu.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/connections"
            className="btn-primary text-xs"
          >
            + Ağ Geçidi Ekle
          </Link>
          <Link
            href="/dashboard/tasks"
            className="btn-secondary text-xs"
          >
            ⚡ Görev Tanımla
          </Link>
        </div>
      </div>

      {/* Real Infrastructure Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0a0a0f] border border-white/[0.08] rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-zinc-500">Ağ Geçitleri</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <div className="mt-3 text-2xl font-bold text-white">{connections.length}</div>
          <div className="mt-1 text-xs text-zinc-400">Aktif API & Bot Bağlantısı</div>
        </div>

        <div className="bg-[#0a0a0f] border border-white/[0.08] rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-zinc-500">Otonom Görevler</span>
            <span className="w-2 h-2 rounded-full bg-blue-400" />
          </div>
          <div className="mt-3 text-2xl font-bold text-white">{tasks.length}</div>
          <div className="mt-1 text-xs text-zinc-400">Çalışan Arka Plan Görevi</div>
        </div>

        <div className="bg-[#0a0a0f] border border-white/[0.08] rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-zinc-500">AI Kota & Maliyet</span>
            <span className="w-2 h-2 rounded-full bg-violet-400" />
          </div>
          <div className="mt-3 text-2xl font-bold text-emerald-400">$0.00</div>
          <div className="mt-1 text-xs text-zinc-400">Tamamen Ücretsiz Token Havuzu</div>
        </div>

        <div className="bg-[#0a0a0f] border border-white/[0.08] rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-zinc-500">Tamamlanan Eylem</span>
            <span className="w-2 h-2 rounded-full bg-amber-400" />
          </div>
          <div className="mt-3 text-2xl font-bold text-white">{totalActions}</div>
          <div className="mt-1 text-xs text-zinc-400">Başarılı Bot Aksiyonu</div>
        </div>
      </div>

      {/* Telemetry and Getting Started Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Setup Guide */}
        <div className="lg:col-span-2 bg-[#0a0a0f] border border-white/[0.08] rounded-xl p-6">
          <h2 className="text-sm font-semibold text-white tracking-tight mb-1">
            Nasıl Çalışır? (3 Adımda Canlıya Alın)
          </h2>
          <p className="text-xs text-zinc-400 mb-6">
            Yapay zekâ ajanınızı sıfırdan kurup çalıştırmanın en kolay yolu:
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/10 transition-colors">
              <div className="w-7 h-7 rounded bg-white/10 text-white flex items-center justify-center font-bold text-xs shrink-0">
                01
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white">1. Ağ Geçidi (Bot Token) Ekleyin</h3>
                  <Link href="/dashboard/connections" className="text-xs text-emerald-400 hover:underline">
                    Ağ Geçitlerine Git →
                  </Link>
                </div>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Discord Bot Token'ınızı veya Telegram Bot API anahtarınızı yapıştırın. Sistem bağlantıyı anında doğrular.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/10 transition-colors">
              <div className="w-7 h-7 rounded bg-white/10 text-white flex items-center justify-center font-bold text-xs shrink-0">
                02
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white">2. Görev Tanımlayın (Türkçe veya İngilizce)</h3>
                  <Link href="/dashboard/tasks" className="text-xs text-emerald-400 hover:underline">
                    Görevlere Git →
                  </Link>
                </div>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  "Discord'da destek bileti açılınca kullanıcıya yardım et" gibi amacınızı yazın veya tek tıkla hazır şablon seçin.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/10 transition-colors">
              <div className="w-7 h-7 rounded bg-white/10 text-white flex items-center justify-center font-bold text-xs shrink-0">
                03
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white">3. "Canlı Test Et" ile İzleyin</h3>
                  <Link href="/dashboard/tasks" className="text-xs text-emerald-400 hover:underline">
                    Simülatörü Aç →
                  </Link>
                </div>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Görev sayfasındaki "Canlı Test Et" butonuna basarak yapay zekânın olayı nasıl düşünüp işlediğini gözünüzle görün.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Security & Enclave Status Card */}
        <div className="bg-[#0a0a0f] border border-white/[0.08] rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white tracking-tight mb-1">
              Sistem Durumu & Güvenlik
            </h2>
            <p className="text-xs text-zinc-400 mb-5">
              İstemci & Donanım Korumalı Katman
            </p>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/[0.06]">
                <span className="text-zinc-400">Şifreleme:</span>
                <span className="text-emerald-400 font-semibold">AES-256-GCM</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/[0.06]">
                <span className="text-zinc-400">Yapay Zekâ Havuzu:</span>
                <span className="text-white font-semibold">Gemini / Groq / Cerebras</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/[0.06]">
                <span className="text-zinc-400">ReAct Döngüsü:</span>
                <span className="text-emerald-400 font-semibold">Öz-Düzeltmeli (Canlı)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/[0.06]">
                <span className="text-zinc-400">Sunucu Durumu:</span>
                <span className="text-emerald-400 font-semibold">99.9% Operasyonel</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.06] text-[11px] text-zinc-500">
            Zero-Trust güvenlik mimarisi ile ham tokenlar asla üçüncü taraf modellere açık iletilmez.
          </div>
        </div>
      </div>
    </div>
  );
}
