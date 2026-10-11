'use client';
import { useState } from 'react';
import { PLAN_LIMITS, type UserPlan } from '@vybot/core/types';

export default function BillingPage() {
  const [currentPlan, setCurrentPlan] = useState<UserPlan>('free');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const PLAN_METADATA: Record<UserPlan, { name: string; price: number; desc: string; popular?: boolean }> = {
    free: {
      name: 'Developer Sandbox',
      price: 0,
      desc: 'Bireysel testler ve API entegrasyon prototipleri için temel geliştirici katmanı.',
    },
    starter: {
      name: 'Startup Pro',
      price: billingCycle === 'yearly' ? 7 : 9,
      desc: 'Küçük topluluklar, tekli Discord botları ve hafif webhook otomasyonları.',
    },
    pro: {
      name: 'Business Automation',
      price: billingCycle === 'yearly' ? 24 : 29,
      desc: 'Yüksek hacimli sunucular, çoklu kanal otonom ajanları ve 7/24 kesintisiz destek.',
      popular: true,
    },
    business: {
      name: 'Enterprise Fleet',
      price: billingCycle === 'yearly' ? 69 : 79,
      desc: 'Sınırsız ağ geçidi, özel donanım izolasyonu ve öncelikli AI router kuyruğu.',
    },
  };

  const handleCheckout = (plan: UserPlan) => {
    if (plan === currentPlan) return;
    // Redirect to LemonSqueezy / Stripe checkout
    const storeUrl = `https://vybot.lemonsqueezy.com/buy/${plan}?discount=${billingCycle === 'yearly' ? 'ANNUAL20' : ''}`;
    window.open(storeUrl, '_blank');
  };

  return (
    <div className="space-y-8 font-mono pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-semibold tracking-tight text-white">
              Plan, Kota & Faturalandırma
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              LemonSqueezy & Stripe Verified
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Kurumsal lisanslama ve otonom token kotalarınızı yönetin. Faturalarınız her ayın 1&apos;inde otomatik oluşturulur.
          </p>
        </div>

        {/* Monthly / Yearly Switch */}
        <div className="flex items-center gap-2 bg-black/60 p-1 rounded-md border border-white/[0.08] text-xs self-start sm:self-auto">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-3 py-1 rounded transition-colors ${
              billingCycle === 'monthly'
                ? 'bg-white text-black font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Aylık
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-3 py-1 rounded transition-colors flex items-center gap-1.5 ${
              billingCycle === 'yearly'
                ? 'bg-white text-black font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Yıllık
            <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold">
              %20 İndirim
            </span>
          </button>
        </div>
      </div>

      {/* Active Quota Usage Panel */}
      <div className="p-5 rounded-lg bg-[#08080c] border border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase text-zinc-500 tracking-wider">Mevcut Lisans Katmanı:</span>
            <span className="text-sm font-bold text-white uppercase px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.08]">
              {PLAN_METADATA[currentPlan].name}
            </span>
          </div>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Otomatik Yenileme Aktif
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Connection Quota */}
          <div className="p-3.5 rounded bg-black/40 border border-white/[0.06]">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>Bağlı Gateway Slotları</span>
              <span className="text-white font-semibold">
                0 / {PLAN_LIMITS[currentPlan].maxConnections}
              </span>
            </div>
            <div className="w-full bg-zinc-800/80 rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-emerald-400 h-1.5 rounded-full w-[0%]" />
            </div>
          </div>

          {/* Daily AI Requests */}
          <div className="p-3.5 rounded bg-black/40 border border-white/[0.06]">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>Günlük AI İstekleri</span>
              <span className="text-white font-semibold">
                0 / {PLAN_LIMITS[currentPlan].maxAiRequestsPerDay.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-zinc-800/80 rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-vybot-400 h-1.5 rounded-full w-[0%]" />
            </div>
          </div>

          {/* Daily Tokens */}
          <div className="p-3.5 rounded bg-black/40 border border-white/[0.06]">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>Günlük Token Kotası</span>
              <span className="text-white font-semibold">
                0 / {PLAN_LIMITS[currentPlan].maxTokensPerDay.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-zinc-800/80 rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-violet-400 h-1.5 rounded-full w-[0%]" />
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(Object.entries(PLAN_LIMITS) as [UserPlan, typeof PLAN_LIMITS[UserPlan]][]).map(([planKey, limits]) => {
          const meta = PLAN_METADATA[planKey];
          const isCurrent = planKey === currentPlan;

          return (
            <div
              key={planKey}
              className={`p-5 rounded-lg bg-[#08080c] border flex flex-col justify-between transition-all ${
                meta.popular
                  ? 'border-white/30 bg-[#0c0c14] shadow-xl'
                  : 'border-white/[0.08] hover:border-white/15'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xs uppercase tracking-wider font-bold text-zinc-200">
                    {meta.name}
                  </h3>
                  {meta.popular && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-white text-black font-black uppercase">
                      Popüler
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white">
                    ${meta.price}
                  </span>
                  <span className="text-xs text-zinc-500 font-normal">/ay</span>
                </div>

                <p className="text-[11px] text-zinc-400 mt-2 min-h-[38px] leading-relaxed">
                  {meta.desc}
                </p>

                <div className="my-4 border-t border-white/[0.06]" />

                <ul className="space-y-2 text-xs text-zinc-300">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>
                      {limits.maxConnections === 999 ? 'Sınırsız' : limits.maxConnections} Ağ Geçidi Slotu
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>{limits.maxAiRequestsPerDay.toLocaleString()} AI İstek/Gün</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>{limits.maxTokensPerDay.toLocaleString()} Token/Gün</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span className="text-zinc-400 text-[11px]">
                      {planKey === 'free'
                        ? 'Standart Routing'
                        : planKey === 'starter'
                        ? 'Öncelikli Groq/NVIDIA'
                        : 'Özel SLA & Enclave'}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-2">
                <button
                  onClick={() => handleCheckout(planKey)}
                  disabled={isCurrent}
                  className={`w-full text-xs font-semibold py-2 px-3 rounded-md transition-all ${
                    isCurrent
                      ? 'bg-white/[0.05] text-zinc-500 border border-white/[0.08] cursor-default'
                      : meta.popular
                      ? 'bg-white hover:bg-zinc-200 text-black shadow-md'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10'
                  }`}
                >
                  {isCurrent ? 'Aktif Planınız' : 'Bu Plana Yükselt →'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enterprise Invoices & Billing History */}
      <div className="p-5 rounded-lg bg-[#08080c] border border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Geçmiş Faturalar & Dekontlar</h2>
          <span className="text-[11px] text-zinc-500">Stripe Invoicing v2</span>
        </div>

        <div className="border border-white/[0.06] rounded overflow-hidden">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-white/[0.02] border-b border-white/[0.06] text-[10px] uppercase text-zinc-500">
              <tr>
                <th className="py-2 px-3">Fatura No</th>
                <th className="py-2 px-3">Tarih</th>
                <th className="py-2 px-3">Hizmet Kalemi</th>
                <th className="py-2 px-3">Tutar</th>
                <th className="py-2 px-3">Durum</th>
                <th className="py-2 px-3 text-right">PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              <tr className="hover:bg-white/[0.02] text-zinc-300">
                <td className="py-2.5 px-3 font-semibold text-white">INV-2026-001</td>
                <td className="py-2.5 px-3 text-zinc-400">10 Eki 2026</td>
                <td className="py-2.5 px-3">VyBot Developer Sandbox (Free)</td>
                <td className="py-2.5 px-3">$0.00</td>
                <td className="py-2.5 px-3">
                  <span className="text-emerald-400">Ödendi</span>
                </td>
                <td className="py-2.5 px-3 text-right">
                  <button className="text-zinc-500 hover:text-white underline text-[11px]">
                    İndir
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
