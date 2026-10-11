'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  {
    label: 'Genel Bakış',
    href: '/dashboard',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    label: 'Ağ Geçitleri & Kasalar',
    href: '/dashboard/connections',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  {
    label: 'Otonom Görevler',
    href: '/dashboard/tasks',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: 'Denetim Logları',
    href: '/dashboard/logs',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: 'Plan & Faturalandırma',
    href: '/dashboard/billing',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-[#09090d] text-zinc-100 font-sans selection:bg-vybot-600/30">
      {/* Sleek Enterprise Sidebar */}
      <aside className="w-64 bg-[#0d0d14] border-r border-white/5 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand Header */}
          <div className="h-16 px-5 border-b border-white/5 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-vybot-500 to-vybot-700 flex items-center justify-center font-bold text-sm text-white shadow-lg shadow-vybot-600/20 group-hover:scale-105 transition-transform">
                V
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-white leading-none">VyBot Core</span>
                <span className="text-[10px] font-mono text-zinc-500 mt-0.5">Enterprise v1.0</span>
              </div>
            </Link>
            <span className="w-2 h-2 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" title="Sistem Aktif" />
          </div>

          {/* Navigation Links */}
          <div className="p-3">
            <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">
              Platform Yönetimi
            </div>
            <nav className="space-y-1 mt-1">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-vybot-600/15 text-vybot-400 border border-vybot-500/30 shadow-sm'
                        : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <span className={isActive ? 'text-vybot-400' : 'text-zinc-500'}>
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* User & Infrastructure Status Footer */}
        <div className="p-3 border-t border-white/5 bg-black/20">
          <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-md bg-zinc-800 border border-white/10 flex items-center justify-center text-xs font-semibold text-zinc-200">
                A
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium text-white truncate">Yönetici Hesabı</div>
                <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-emerald-400" />
                  Kurumsal Plan
                </div>
              </div>
            </div>
            <Link
              href="/dashboard/billing"
              className="text-[10px] font-mono text-zinc-400 hover:text-white hover:underline"
            >
              Yükselt
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
