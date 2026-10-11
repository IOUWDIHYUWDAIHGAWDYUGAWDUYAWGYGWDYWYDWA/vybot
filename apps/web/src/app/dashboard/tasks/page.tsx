'use client';
import { useState } from 'react';

interface AgentTask {
  id: string;
  name: string;
  description: string;
  triggerType: 'event' | 'cron' | 'manual';
  status: 'active' | 'paused' | 'error';
  actionsCompleted: number;
  model: string;
  lastRunAt: string;
}

export default function TasksPage() {
  const [showModal, setShowModal] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [selectedModel, setSelectedModel] = useState('llama-3.3-70b-versatile');
  const [triggerType, setTriggerType] = useState<'event' | 'cron' | 'manual'>('event');
  const [tasks, setTasks] = useState<AgentTask[]>([]);

  const handleCreateTask = () => {
    if (!taskName || !taskDesc) return;
    const newTask: AgentTask = {
      id: `task-${Date.now()}`,
      name: taskName,
      description: taskDesc,
      triggerType,
      status: 'active',
      actionsCompleted: 0,
      model: selectedModel,
      lastRunAt: 'Az önce başlatıldı',
    };
    setTasks([newTask, ...tasks]);
    setShowModal(false);
    setTaskName('');
    setTaskDesc('');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Otonom Ajan Görevleri
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-vybot-500/10 text-vybot-400 border border-vybot-500/20">
              Orchestrator v2.1
            </span>
          </div>
          <p className="text-zinc-400 text-sm mt-1 max-w-2xl">
            Doğal dil ile tanımlanan ve ağ geçitlerine (Discord, Telegram, Webhook) bağlı otonom döngüler. Arka planda 7/24 çalışır.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-vybot-600 hover:bg-vybot-500 text-white font-medium py-2 px-4 rounded-lg transition-all shadow-lg shadow-vybot-600/20 flex items-center gap-2 text-sm self-start md:self-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yeni Görev Tanımla
        </button>
      </div>

      {/* Tasks List or Clean Empty State */}
      {tasks.length === 0 ? (
        <div className="bg-[#111118] border border-white/5 rounded-2xl p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto text-zinc-400 mb-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-white">Tanımlanmış Görev Yok</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1 mb-6">
            Henüz yapay zekaya atanmış bir otonom görev bulunmuyor. Bir görev oluşturarak botlarınızı 7/24 çalışır hale getirin.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-vybot-600 hover:bg-vybot-500 text-white text-xs font-semibold py-2 px-4 rounded-lg transition-all inline-flex items-center gap-2 shadow-lg shadow-vybot-600/20"
          >
            + İlk Görevi Oluştur
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-[#111118] border border-white/5 hover:border-white/15 rounded-xl p-5 transition-all group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <span
                    className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${
                      task.status === 'active'
                        ? 'bg-emerald-400 ring-4 ring-emerald-400/20 animate-pulse'
                        : 'bg-amber-400'
                    }`}
                  />
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="font-semibold text-white text-base group-hover:text-vybot-400 transition-colors">
                        {task.name}
                      </h3>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/10">
                        {task.triggerType === 'event' ? 'Olay Tetiklemeli (Event)' : task.triggerType === 'cron' ? 'Zamanlı (Cron)' : 'Manuel'}
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-vybot-950 text-vybot-400 border border-vybot-800/40">
                        {task.model}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1 max-w-3xl leading-relaxed">
                      {task.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-[11px] font-mono text-zinc-500">
                      <span>Aksiyonlar: <strong className="text-zinc-300">{task.actionsCompleted}</strong></span>
                      <span>•</span>
                      <span>Son Çalışma: <strong className="text-zinc-300">{task.lastRunAt}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() =>
                      setTasks(
                        tasks.map((t) =>
                          t.id === task.id
                            ? { ...t, status: t.status === 'active' ? 'paused' : 'active' }
                            : t
                        )
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-zinc-300 hover:text-white border border-white/5 transition-colors"
                  >
                    {task.status === 'active' ? 'Duraklat' : 'Devam Ettir'}
                  </button>

                  <button
                    onClick={() => setTasks(tasks.filter((t) => t.id !== task.id))}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Görevi Sil"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#111118] border border-white/10 rounded-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Yeni Otonom Görev Tanımla</h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  AI modeli ağ geçitlerini kullanarak bu görevi 7/24 icra eder.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Görev Başlığı
                </label>
                <input
                  type="text"
                  className="input text-sm"
                  placeholder="Örn: Otonom Destek & Moderasyon Yöneticisi"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Yapay Zeka Modeli
                  </label>
                  <select
                    className="input text-xs font-mono bg-[#0d0d14]"
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                  >
                    <option value="llama-3.3-70b-versatile">LLaMA 3.3 70B (Groq • Ultra Hızlı)</option>
                    <option value="mixtral-8x22b-instruct">Mixtral 8x22B (NVIDIA Build)</option>
                    <option value="deepseek-r1-distill-70b">DeepSeek R1 (OpenRouter Free)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Tetikleme Türü
                  </label>
                  <select
                    className="input text-xs font-mono bg-[#0d0d14]"
                    value={triggerType}
                    onChange={(e) => setTriggerType(e.target.value as 'event' | 'cron' | 'manual')}
                  >
                    <option value="event">Olay Bazlı (Discord / Webhook Girdisi)</option>
                    <option value="cron">Periyodik (Zamanlanmış Döngü)</option>
                    <option value="manual">Yalnızca Manuel Çağrı</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Görevin Doğal Dil İle İcrası (System Prompt & Talimatlar)
                </label>
                <textarea
                  rows={4}
                  className="input text-xs leading-relaxed"
                  placeholder="Örnek: Discord veya Telegram üzerinden bir kullanıcı yardım talep ettiğinde veya ticket açtığında sorunu analiz et. Belgeleri oku, doğrudan çözümü yaz. Eğer çözemezsen yöneticiye bildirim gönder."
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                />
                <p className="text-[11px] text-zinc-500 mt-1.5">
                  AI Router bu açıklamayı derleyip ilgili gateway araçlarını (send_message, get_channel vb.) otomatik olarak çağırır.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleCreateTask}
                  disabled={!taskName || !taskDesc}
                  className="w-full bg-vybot-600 hover:bg-vybot-500 text-white font-medium py-2.5 rounded-lg transition-all shadow-lg shadow-vybot-600/20 disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Görevi Başlat & Otonom Döngüyü Çalıştır
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
