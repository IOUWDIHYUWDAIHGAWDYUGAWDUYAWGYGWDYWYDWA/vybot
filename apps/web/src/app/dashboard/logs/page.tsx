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
        <div className="bg-[#08080c] border border-white/[0.08] rounded-lg text-center py-16 p-6">
          <div className="w-10 h-10 rounded-md bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mx-auto text-zinc-400 mb-3">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-sm font-semibold text-white mb-1">Henüz Denetim Kaydı Yok</h2>
          <p className="text-zinc-500 text-xs max-w-sm mx-auto mb-4">
            Ajanlar bir olayı dinleyip eyleme geçtiğinde tüm telemetri ve karar akışları burada listelenir.
          </p>
          <div className="max-w-md mx-auto p-2.5 rounded bg-black/50 border border-white/[0.06] text-left text-[11px] text-zinc-400 font-mono">
            <div>TELEMETRY_DAEMON: <span className="text-emerald-400">Idle / Ready</span></div>
            <div>BUFFER_POOL: <span className="text-zinc-500">0 / 10,000 events</span></div>
          </div>
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
