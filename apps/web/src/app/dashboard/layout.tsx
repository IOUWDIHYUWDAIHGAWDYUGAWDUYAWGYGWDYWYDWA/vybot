'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  {
    label: 'Overview',
    href: '/dashboard',
    badge: null,
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: 'Gateways & Key Vault',
    href: '/dashboard/connections',
    badge: 'HSM',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  {
    label: 'Agent Workflows',
    href: '/dashboard/tasks',
    badge: null,
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
  },
  {
    label: 'Audit & Telemetry Logs',
    href: '/dashboard/logs',
    badge: 'LIVE',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: 'Usage & Quotas',
    href: '/dashboard/billing',
    badge: null,
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-[#050508] text-zinc-200">
      {/* Top Global Command Bar */}
      <header className="h-13 border-b border-white/[0.08] bg-[#08080c] px-4 lg:px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-white text-black font-mono font-black text-xs flex items-center justify-center">
              V
            </div>
            <span className="font-semibold text-xs tracking-wider uppercase text-white font-mono">
              VyBot Platform
            </span>
          </Link>

          <span className="text-zinc-600 text-xs">/</span>

          {/* Org & Project Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] font-mono text-[11px] text-zinc-300">
              org_enterprise_primary
            </span>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              PROD-FRA-01
            </span>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded bg-black/60 border border-white/[0.08] text-xs text-zinc-500 font-mono w-64">
            <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-[11px]">Command Palette...</span>
            <span className="ml-auto text-[10px] bg-white/[0.08] px-1 py-0.5 rounded text-zinc-400">Ctrl K</span>
          </div>

          <div className="flex items-center gap-2 border-l border-white/[0.08] pl-3 text-xs font-mono text-zinc-400">
            <span className="text-emerald-400 text-[11px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              12ms SLA
            </span>
          </div>
        </div>
      </header>

      {/* Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sleek Minimalist Sidebar */}
        <aside className="w-60 bg-[#08080c] border-r border-white/[0.08] flex flex-col justify-between shrink-0 p-3">
          <div>
            <div className="px-2 py-1.5 text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-semibold">
              Platform Architecture
            </div>

            <nav className="space-y-0.5 mt-1">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-white/[0.08] text-white font-semibold border border-white/[0.12]'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? 'text-white' : 'text-zinc-500'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded bg-white/[0.06] text-zinc-400 border border-white/[0.08]">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Security Vault Indicator */}
          <div className="p-3 rounded-lg bg-black/40 border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              <span>Security Enclave</span>
              <span className="text-emerald-400">SOC-2 Type II</span>
            </div>
            <div className="text-[11px] font-mono text-zinc-400 leading-tight">
              Hardware Isolated AES-256-GCM. Raw credentials never leave enclave memory.
            </div>
          </div>
        </aside>

        {/* Workspace Content Viewport */}
        <main className="flex-1 overflow-y-auto bg-[#050508] p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
