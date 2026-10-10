'use client';
import { useState } from 'react';

export default function TasksPage() {
  const [showModal, setShowModal] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [tasks, setTasks] = useState<Array<{ id: string; name: string; description: string; status: string; actions: number }>>([]);

  const handleAdd = () => {
    if (!taskName || !taskDesc) return;
    setTasks([...tasks, { id: crypto.randomUUID(), name: taskName, description: taskDesc, status: 'active', actions: 0 }]);
    setShowModal(false);
    setTaskName('');
    setTaskDesc('');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Görevler</h1>
          <p className="text-zinc-400 mt-1">AI agent&apos;lara verdiğin görevleri yönet</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">+ Görev Ekle</button>
      </div>

      {tasks.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-5xl mb-4">⚡</div>
          <h2 className="text-xl font-semibold mb-2">Henüz görev yok</h2>
          <p className="text-zinc-500 mb-6">Önce bir bağlantı ekle, sonra AI&apos;a görev ver!</p>
          <button onClick={() => setShowModal(true)} className="btn-primary">+ Görev Oluştur</button>
        </div>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <div key={task.id} className="card">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${task.status === 'active' ? 'bg-emerald-400 animate-pulse' : task.status === 'paused' ? 'bg-amber-400' : 'bg-red-400'}`} />
                  <h3 className="font-semibold">{task.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className={task.status === 'active' ? 'badge-success' : task.status === 'paused' ? 'badge-warning' : 'badge-danger'}>
                    {task.status === 'active' ? 'Çalışıyor' : task.status === 'paused' ? 'Duraklatıldı' : 'Hata'}
                  </span>
                  <button onClick={() => setTasks(tasks.map((t) => t.id === task.id ? { ...t, status: t.status === 'active' ? 'paused' : 'active' } : t))} className="btn-secondary text-xs py-1 px-2">
                    {task.status === 'active' ? '⏸️' : '▶️'}
                  </button>
                  <button onClick={() => setTasks(tasks.filter((t) => t.id !== task.id))} className="btn-danger text-xs py-1 px-2">🗑️</button>
                </div>
              </div>
              <p className="text-sm text-zinc-400">{task.description}</p>
              <div className="mt-3 text-xs text-zinc-600">{task.actions} aksiyon tamamlandı</div>
            </div>
          ))}
        </div>
      )}

      {/* Add Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111118] border border-white/10 rounded-2xl w-full max-w-lg">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Görev Oluştur</h2>
              <button onClick={() => setShowModal(false)} className="text-zinc-500 hover:text-white text-xl">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">Görev Adı</label>
                <input className="input" placeholder="Örn: Ticket Destek Botu" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">Ne yapması lazım? (Doğal dil ile anlat)</label>
                <textarea className="input min-h-[120px]" placeholder="Örn: Discord sunucumda ticket kanalı açılınca, müşteriye merhaba de ve ne yardım istediğini sor. Sorusunu anla ve yardımcı ol. Çözemezsen bana haber ver." value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)} />
                <p className="text-xs text-zinc-600 mt-2">💡 AI bu açıklamayı anlayıp otomatik olarak çalışır</p>
              </div>
              <button onClick={handleAdd} disabled={!taskName || !taskDesc} className="btn-primary w-full justify-center disabled:opacity-50">
                ⚡ Görevi Başlat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
