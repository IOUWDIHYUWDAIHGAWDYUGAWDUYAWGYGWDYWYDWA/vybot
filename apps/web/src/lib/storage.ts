export interface ConnectionRecord {
  id: string;
  name: string;
  platform: 'discord' | 'telegram' | 'slack' | 'github' | 'webhook' | 'mcp' | 'custom';
  status: 'active' | 'syncing' | 'paused' | 'error';
  tokenFingerprint: string;
  latencyMs: number;
  environment: 'production' | 'staging';
  capabilitiesCount: number;
  lastVerifiedAt: string;
}

export interface AgentTask {
  id: string;
  name: string;
  connectionId?: string;
  description: string;
  triggerType: 'event' | 'cron' | 'manual';
  status: 'active' | 'paused' | 'error';
  actionsCompleted: number;
  model: string;
  lastRunAt: string;
}

export interface AgentLog {
  id: string;
  taskId: string;
  taskName: string;
  eventType: string;
  input: string;
  output: string;
  provider: string;
  timestamp: string;
  status: 'success' | 'error';
}

const DEFAULT_CONNECTIONS: ConnectionRecord[] = [
  {
    id: 'conn-discord-demo',
    name: 'Topluluk Destek Botu',
    platform: 'discord',
    status: 'active',
    tokenFingerprint: 'enc_MTM..4k9a',
    latencyMs: 14,
    environment: 'production',
    capabilitiesCount: 5,
    lastVerifiedAt: 'Az önce',
  },
  {
    id: 'conn-webhook-demo',
    name: 'Sistem Webhook Ağ Geçidi',
    platform: 'webhook',
    status: 'active',
    tokenFingerprint: 'enc_https://..v1/wh',
    latencyMs: 9,
    environment: 'production',
    capabilitiesCount: 3,
    lastVerifiedAt: '1 dk önce',
  },
];

const DEFAULT_TASKS: AgentTask[] = [
  {
    id: 'task-support-demo',
    name: '7/24 Discord Destek Asistanı',
    connectionId: 'conn-discord-demo',
    description: 'Discord kanalında soru sorulduğunda veya destek talebi açıldığında nazikçe yanıt ver ve çözüm sun.',
    triggerType: 'event',
    status: 'active',
    actionsCompleted: 14,
    model: 'Gemini 2.0 Flash / Groq (Llama 3.3)',
    lastRunAt: '2 dk önce',
  },
  {
    id: 'task-webhook-demo',
    name: 'Hata & Alarm Nöbetçisi',
    connectionId: 'conn-webhook-demo',
    description: 'Sistem webhookundan 500 hatası geldiğinde olayı analiz et ve yetkililere anında uyarı ilet.',
    triggerType: 'event',
    status: 'active',
    actionsCompleted: 6,
    model: 'Groq (Llama 3.3 70B)',
    lastRunAt: '12 dk önce',
  },
];

export function getStoredConnections(): ConnectionRecord[] {
  if (typeof window === 'undefined') return DEFAULT_CONNECTIONS;
  try {
    const raw = localStorage.getItem('vybot_connections');
    if (!raw) {
      localStorage.setItem('vybot_connections', JSON.stringify(DEFAULT_CONNECTIONS));
      return DEFAULT_CONNECTIONS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_CONNECTIONS;
  }
}

export function saveStoredConnections(connections: ConnectionRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('vybot_connections', JSON.stringify(connections));
  } catch (err) {
    console.error('Failed to save connections:', err);
  }
}

export function getStoredTasks(): AgentTask[] {
  if (typeof window === 'undefined') return DEFAULT_TASKS;
  try {
    const raw = localStorage.getItem('vybot_tasks');
    if (!raw) {
      localStorage.setItem('vybot_tasks', JSON.stringify(DEFAULT_TASKS));
      return DEFAULT_TASKS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_TASKS;
  }
}

export function saveStoredTasks(tasks: AgentTask[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('vybot_tasks', JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to save tasks:', err);
  }
}

export function getStoredLogs(): AgentLog[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('vybot_logs');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addStoredLog(log: AgentLog): void {
  if (typeof window === 'undefined') return;
  try {
    const logs = getStoredLogs();
    const updated = [log, ...logs].slice(0, 50);
    localStorage.setItem('vybot_logs', JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to add log:', err);
  }
}
