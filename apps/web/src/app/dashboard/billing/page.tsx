import { PLAN_LIMITS, type UserPlan } from '@vybot/core';

export default function BillingPage() {
  const currentPlan: UserPlan = 'free';

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Fatura & Plan</h1>
      <p className="text-zinc-400 mb-8">Aboneliğini ve kullanımını yönet</p>

      {/* Current Plan */}
      <div className="card mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-zinc-500">Mevcut Plan</div>
            <div className="text-2xl font-bold mt-1 capitalize">{currentPlan}</div>
          </div>
          <div className="badge-info text-sm">Aktif</div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-xs text-zinc-500">Bağlantılar</div>
            <div className="font-semibold mt-1">0 / {PLAN_LIMITS[currentPlan].maxConnections}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-xs text-zinc-500">AI İstek (Bugün)</div>
            <div className="font-semibold mt-1">0 / {PLAN_LIMITS[currentPlan].maxAiRequestsPerDay.toLocaleString()}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-xs text-zinc-500">Token (Bugün)</div>
            <div className="font-semibold mt-1">0 / {PLAN_LIMITS[currentPlan].maxTokensPerDay.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Plans */}
      <h2 className="text-lg font-semibold mb-4">Plan Yükselt</h2>
      <div className="grid md:grid-cols-4 gap-4">
        {(Object.entries(PLAN_LIMITS) as [UserPlan, typeof PLAN_LIMITS[UserPlan]][]).map(([plan, limits]) => {
          const prices: Record<UserPlan, string> = { free: '$0', starter: '$9', pro: '$29', business: '$79' };
          const isCurrent = plan === currentPlan;
          return (
            <div key={plan} className={`card ${isCurrent ? 'border-vybot-500' : ''}`}>
              <h3 className="font-semibold capitalize">{plan}</h3>
              <div className="text-2xl font-bold mt-1 mb-3">{prices[plan]}<span className="text-sm text-zinc-500 font-normal">/ay</span></div>
              <ul className="space-y-1.5 text-sm text-zinc-400 mb-4">
                <li>✓ {limits.maxConnections === 999 ? 'Sınırsız' : limits.maxConnections} bağlantı</li>
                <li>✓ {limits.maxAiRequestsPerDay.toLocaleString()} AI istek/gün</li>
                <li>✓ {limits.maxTokensPerDay.toLocaleString()} token/gün</li>
              </ul>
              <button className={isCurrent ? 'btn-secondary w-full justify-center opacity-50' : 'btn-primary w-full justify-center'} disabled={isCurrent}>
                {isCurrent ? 'Mevcut' : 'Yükselt'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
