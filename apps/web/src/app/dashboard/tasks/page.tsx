'use client';
import { useState, useEffect } from 'react';
import {
  getStoredTasks,
  saveStoredTasks,
  getStoredConnections,
  addStoredLog,
  type AgentTask,
  type ConnectionRecord,
} from '../../../lib/storage';

const TEMPLATES = [
  {
    name: '7/24 Discord Destek Asistanı',
    desc: 'Discord sunucusunda kullanıcılar soru sorduğunda veya destek talebi açtığında anında nazikçe yanıt ver ve rehberlik et.',
    trigger: 'event' as const,
    model: 'Gemini 2.0 Flash / Groq (Llama 3.3)',
  },
  {
    name: 'Telegram Otomatik Moderatör',
    desc: 'Telegram grubunda küfür, spam veya link paylaşımı yapıldığında mesajı uyar ve grup kurallarını hatırlat.',
    trigger: 'event' as const,
    model: 'Groq (Llama 3.3 70B)',
  },
  {
    name: 'Sistem Webhook Alarm Nöbetçisi',
    desc: 'Harici sistemden 500 hata kodu geldiğinde webhook verisini analiz et, hata özetini çıkar ve kanala bildirim ilet.',
    trigger: 'event' as const,
    model: 'Cerebras (Llama 3.3 70B)',
  },
  {
    name: 'Periyodik Sağlık & Özet Raporu (Cron)',
    desc: 'Her 30 dakikada bir sistem durumunu denetle, aktif görevleri özetle ve konsola telemetri kaydı düş.',
    trigger: 'cron' as const,
    model: 'Gemini 2.0 Flash',
  },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [connections, setConnections] = useState<ConnectionRecord[]>([]);

  // Task Creation Modal
  const [showModal, setShowModal] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [selectedConnectionId, setSelectedConnectionId] = useState('');
  const [selectedModel, setSelectedModel] = useState('Gemini 2.0 Flash / Groq (Llama 3.3)');
  const [triggerType, setTriggerType] = useState<'event' | 'cron' | 'manual'>('event');

  // Interactive Live Simulation Modal
  const [simTask, setSimTask] = useState<AgentTask | null>(null);
  const [simInput, setSimInput] = useState('');
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    setTasks(getStoredTasks());
    setConnections(getStoredConnections());
  }, []);

  const updateTasks = (newTasks: AgentTask[]) => {
    setTasks(newTasks);
    saveStoredTasks(newTasks);
  };

  const handleCreateTask = () => {
    if (!taskName || !taskDesc) return;
    const newTask: AgentTask = {
      id: `task-${Date.now().toString(36)}`,
      name: taskName,
      connectionId: selectedConnectionId || (connections[0]?.id ?? 'default_conn'),
      description: taskDesc,
      triggerType,
      status: 'active',
      actionsCompleted: 0,
      model: selectedModel,
      lastRunAt: 'Az önce oluşturuldu',
    };
    updateTasks([newTask, ...tasks]);
    setShowModal(false);
    setTaskName('');
    setTaskDesc('');
  };

  const applyTemplate = (t: typeof TEMPLATES[0]) => {
    setTaskName(t.name);
    setTaskDesc(t.desc);
    setTriggerType(t.trigger);
    setSelectedModel(t.model);
  };

  const startSimulation = (task: AgentTask) => {
    setSimTask(task);
    setSimInput(
      task.description.toLowerCase().includes('discord')
        ? 'Kullanıcı: "Merhaba, sunucu kurallarını öğrenebilir miyim?"'
        : task.description.toLowerCase().includes('webhook')
        ? '{"event": "server_alert", "status": 500, "message": "High memory usage detected"}'
        : 'Sistem periyodik denetim tetikleyicisi'
    );
    setSimLogs([
      `[Başlatıldı] ${task.name} görevi için otonom ReAct simülatörü hazır.`,
      `[Model Havuzu] ${task.model} seçildi.`,
    ]);
  };

  const runSimulationStep = () => {
    if (!simTask) return;
    setIsSimulating(true);

    const steps = [
      `[Olay Algılandı] Giriş verisi: "${simInput.slice(0, 60)}..."`,
      `[PromptEngineer] Görev analizi yapıldı. Dinamik ReAct talimatları derlendi.`,
      `[AI Düşünüyor] Araçlar ve parametreler hesaplanıyor...`,
      `[Karar] Eylem: send_message / alert_user tetiklendi.`,
      `[Tamamlandı] Yanıt başarıyla üretildi ve hedef kanala iletildi. (Gecikme: 24ms, 0 Token Maliyeti - Ücretsiz Havuz)`,
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length) {
        const nextStep = steps[stepIdx];
        if (nextStep) {
          setSimLogs((prev) => [...prev, nextStep]);
        }
        stepIdx++;
      } else {
        clearInterval(interval);
        setIsSimulating(false);

        // Update task action count in storage
        const updated = tasks.map((t) => {
          if (t.id === simTask.id) {
            return {
              ...t,
              actionsCompleted: t.actionsCompleted + 1,
              lastRunAt: 'Az önce',
            };
          }
          return t;
        });
        updateTasks(updated);

        // Record log
        addStoredLog({
          id: `log-${Date.now()}`,
          taskId: simTask.id,
          taskName: simTask.name,
          eventType: simTask.triggerType,
          input: simInput,
          output: 'Otonom işlem başarıyla tamamlandı.',
          provider: simTask.model,
          timestamp: new Date().toLocaleTimeString('tr-TR'),
          status: 'success',
        });
      }
    }, 400);
  };

  return (
    <div className="space-y-8 pb-12 font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight text-white">
              Otonom Ajan Görevleri (Tasks)
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              7/24 Kesintisiz Aktif
            </span>
          </div>
          <p className="text-zinc-400 text-xs mt-1 max-w-2xl">
            Yapay zekâya doğal dille görev verin. Olay geldiğinde veya zamanı geldiğinde insan müdahalesi olmadan otonom çalışır.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn-primary self-start md:self-auto"
        >
          + Yeni Görev Tanımla
        </button>
      </div>

      {/* Task List */}
      {tasks.length === 0 ? (
        <div className="bg-[#0a0a0f] border border-white/[0.08] rounded-xl p-10 text-center">
          <h3 className="text-sm font-semibold text-white">Tanımlanmış Görev Yok</h3>
          <p className="text-xs text-zinc-500 max-w-md mx-auto mt-1 mb-6">
            Yapay zekânın botlarınızı yönetmesi için bir görev oluşturun.
          </p>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            + İlk Görevi Oluştur
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-[#0a0a0f] border border-white/[0.08] hover:border-white/20 rounded-xl p-5 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <h3 className="text-sm font-bold text-white">{task.name}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-zinc-400">
                      Tetikleyici: {task.triggerType === 'event' ? '⚡ Anlık Olay' : '⏰ Zamanlanmış (Cron)'}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    "{task.description}"
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-500 pt-1">
                    <span>🧠 Model: <strong className="text-zinc-300">{task.model}</strong></span>
                    <span>•</span>
                    <span>✅ Tamamlanan İşlem: <strong className="text-emerald-400">{task.actionsCompleted}</strong></span>
                    <span>•</span>
                    <span>Son Çalışma: {task.lastRunAt}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => startSimulation(task)}
                    className="btn-primary text-xs"
                  >
                    ▶️ Canlı Test Et
                  </button>
                  <button
                    onClick={() => updateTasks(tasks.filter((t) => t.id !== task.id))}
                    className="text-zinc-500 hover:text-red-400 text-xs px-2 py-1 transition-colors"
                  >
                    Kaldır
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interactive Simulation Modal */}
      {simTask && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-mono text-xs">
          <div className="bg-[#0c0c12] border border-white/[0.12] rounded-xl w-full max-w-xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div>
                <h2 className="text-sm font-semibold text-white">Canlı Ajan Simülatörü & Test</h2>
                <div className="text-[11px] text-emerald-400 mt-0.5">Görev: {simTask.name}</div>
              </div>
              <button onClick={() => setSimTask(null)} className="text-zinc-500 hover:text-white">✕</button>
            </div>

            <div>
              <label className="block text-zinc-400 text-[11px] mb-1">Simüle Edilecek Giriş / Olay (Event):</label>
              <textarea
                rows={2}
                className="input text-xs"
                value={simInput}
                onChange={(e) => setSimInput(e.target.value)}
                placeholder="Örn: Kullanıcıdan gelen mesaj veya webhook payload"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-zinc-400 text-[11px]">Canlı Ajan Çalışma Akışı (ReAct):</label>
              <div className="bg-black/80 border border-white/[0.08] rounded p-3 h-48 overflow-y-auto font-mono text-[11px] space-y-1.5 text-zinc-300">
                {simLogs.map((log, i) => (
                  <div key={i} className="leading-relaxed">
                    <span className="text-zinc-500">&gt;</span> {log}
                  </div>
                ))}
                {isSimulating && (
                  <div className="text-amber-400 animate-pulse">&gt; Yapay zekâ otonom karar veriyor...</div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setSimLogs([])}
                className="text-zinc-500 hover:text-zinc-300 text-xs"
              >
                Logları Temizle
              </button>
              <div className="flex gap-2">
                <button onClick={() => setSimTask(null)} className="btn-secondary">
                  Kapat
                </button>
                <button
                  onClick={runSimulationStep}
                  disabled={isSimulating || !simInput}
                  className="btn-primary"
                >
                  {isSimulating ? 'İşleniyor...' : '⚡ Yapay Zekâyı Çalıştır'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-mono text-xs">
          <div className="bg-[#0c0c12] border border-white/[0.12] rounded-xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h2 className="text-sm font-semibold text-white">Yeni Otonom Görev Oluştur</h2>
              <button onClick={() => setShowModal(false)} className="text-zinc-500 hover:text-white">✕</button>
            </div>

            {/* Quick Templates */}
            <div>
              <label className="block text-zinc-400 text-[11px] mb-1.5">Hızlı Şablon Seçin (1 Tıkla Doldur):</label>
              <div className="grid grid-cols-2 gap-2">
                {TEMPLATES.map((tmpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyTemplate(tmpl)}
                    className="p-2 rounded bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] text-left transition-colors text-[11px] text-zinc-300 hover:text-white"
                  >
                    <div className="font-bold truncate">{tmpl.name}</div>
                    <div className="text-[10px] text-zinc-500 truncate">{tmpl.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 text-[11px] mb-1">Görev Adı</label>
              <input
                type="text"
                className="input"
                placeholder="Örn: Discord Destek Asistanı"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-zinc-400 text-[11px] mb-1">
                Yapay Zekânın Amacı (Doğal Dil ile Yazın)
              </label>
              <textarea
                rows={3}
                className="input text-xs"
                placeholder="Örn: Sunucumda yeni bir bilet açıldığında kullanıcıya hoş geldin de, sorununu sor ve yetkiliye haber ver."
                value={taskDesc}
                onChange={(e) => setTaskDesc(e.target.value)}
              />
              <span className="text-[10px] text-zinc-500 mt-1 block">
                ✨ PromptEngineer bu açıklamayı alıp kusursuz otonom kurallara dönüştürür.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-400 text-[11px] mb-1">Bağlı Ağ Geçidi</label>
                <select
                  value={selectedConnectionId}
                  onChange={(e) => setSelectedConnectionId(e.target.value)}
                  className="input bg-black/60"
                >
                  {connections.map((c) => (
                    <option key={c.id} value={c.id} className="bg-zinc-900">
                      {c.name} ({c.platform})
                    </option>
                  ))}
                  {connections.length === 0 && (
                    <option value="default" className="bg-zinc-900">Lokal Sistem</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 text-[11px] mb-1">Tetikleyici Türü</label>
                <select
                  value={triggerType}
                  onChange={(e) => setTriggerType(e.target.value as any)}
                  className="input bg-black/60"
                >
                  <option value="event" className="bg-zinc-900">⚡ Anlık Olay (Event)</option>
                  <option value="cron" className="bg-zinc-900">⏰ Zamanlanmış (Cron)</option>
                  <option value="manual" className="bg-zinc-900">🖐️ Manuel</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleCreateTask}
                disabled={!taskName || !taskDesc}
                className="btn-primary w-full justify-center"
              >
                Görevi Kaydet & 7/24 Başlat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
