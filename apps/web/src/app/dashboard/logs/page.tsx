'use client';
import { useState, useEffect } from 'react';
import { getStoredLogs, type AgentLog } from '../../../lib/storage';

export default function LogsPage() {
  const [logs, setLogs] = useState<AgentLog[]>([]);

  useEffect(() => {
    setLogs(getStoredLogs());
  }, []);

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Ajan Karar & Denetim Logları
          </h1>
          <p className="text-zinc-400 text-xs mt-1">
            Yapay zekânın dinlediği her olay, ürettiği karar ve tetiklediği araç eylemleri.
          </p>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem('vybot_logs');
            setLogs([]);
          }}
          className="text-zinc-500 hover:text-red-400 transition-colors text-xs self-start sm:self-auto"
        >
          Logları Temizle
        </button>
      </div>

      {logs.length === 0 ? (
        <div className="bg-[#0a0a0f] border border-white/[0.08] rounded-xl text-center py-16">
          <div className="text-3xl mb-3">📋</div>
          <h2 className="text-sm font-semibold text-white mb-1">Henüz Denetim Kaydı Yok</h2>
          <p className="text-zinc-500 text-xs max-w-sm mx-auto">
            "Otonom Görevler" sayfasından bir görev çalıştırdığınızda yapay zekânın tüm kararları burada listelenir.
          </p>
        </div>
      ) : (
        <div className="border border-white/[0.08] rounded-xl overflow-x-auto bg-[#0a0a0f]">
          <table className="w-full text-left">
            <thead className="bg-[#08080c] border-b border-white/[0.08] text-[10px] text-zinc-400 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Zaman</th>
                <th className="px-4 py-3">Görev Adı</th>
                <th className="px-4 py-3">Tetikleyici</th>
                <th className="px-4 py-3">Giriş / Event</th>
                <th className="px-4 py-3">AI Çıktısı</th>
                <th className="px-4 py-3">Model</th>
                <th className="px-4 py-3 text-right">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 text-zinc-500">{log.timestamp}</td>
                  <td className="px-4 py-3 font-bold text-white">{log.taskName}</td>
                  <td className="px-4 py-3 text-zinc-400">{log.eventType}</td>
                  <td className="px-4 py-3 text-zinc-300 max-w-xs truncate">{log.input}</td>
                  <td className="px-4 py-3 text-emerald-400 max-w-xs truncate">{log.output}</td>
                  <td className="px-4 py-3 text-zinc-400">{log.provider}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Başarılı
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
