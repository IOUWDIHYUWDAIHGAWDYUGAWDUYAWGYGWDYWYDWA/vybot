export default function LogsPage() {
  const logs = [
    // Demo logs - will be populated from real data
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Agent Logları</h1>
          <p className="text-zinc-400 mt-1">AI agent&apos;ların her adımını takip et</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="input w-auto text-sm">
            <option>Tüm görevler</option>
          </select>
          <select className="input w-auto text-sm">
            <option>Son 24 saat</option>
            <option>Son 7 gün</option>
            <option>Son 30 gün</option>
          </select>
        </div>
      </div>

      {logs.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-5xl mb-4">📋</div>
          <h2 className="text-xl font-semibold mb-2">Henüz log yok</h2>
          <p className="text-zinc-500">Bir görev çalışmaya başlayınca loglar burada görünecek.</p>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr className="text-left text-sm text-zinc-400">
                  <th className="px-4 py-3 font-medium">Zaman</th>
                  <th className="px-4 py-3 font-medium">Görev</th>
                  <th className="px-4 py-3 font-medium">Event</th>
                  <th className="px-4 py-3 font-medium">AI Kararı</th>
                  <th className="px-4 py-3 font-medium">Sonuç</th>
                  <th className="px-4 py-3 font-medium">Provider</th>
                  <th className="px-4 py-3 font-medium">Token</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {/* Log rows will go here */}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
