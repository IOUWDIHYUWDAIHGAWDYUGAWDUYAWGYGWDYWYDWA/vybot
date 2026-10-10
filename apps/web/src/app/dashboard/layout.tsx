import Link from 'next/link';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  { label: 'Bağlantılar', href: '/dashboard/connections', icon: '🔌' },
  { label: 'Görevler', href: '/dashboard/tasks', icon: '⚡' },
  { label: 'Loglar', href: '/dashboard/logs', icon: '📋' },
  { label: 'Fatura', href: '/dashboard/billing', icon: '💳' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0d0d14] border-r border-white/5 flex flex-col">
        <div className="p-5 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-vybot-600 flex items-center justify-center font-bold text-sm">V</div>
            <span className="text-lg font-bold">VyBot</span>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-vybot-700 flex items-center justify-center text-sm font-medium">U</div>
            <div>
              <div className="text-sm font-medium">Kullanıcı</div>
              <div className="text-xs text-zinc-500">Free Plan</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
