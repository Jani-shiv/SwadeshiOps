import { Eye, EyeOff, KeyRound, Lock, Plus, Search, Shield, ShieldAlert, Sparkles } from 'lucide-react';

const groups = [
  {
    title: 'Production',
    count: 12,
    note: 'Payment, deployment, and notification credentials',
    safe: true,
  },
  {
    title: 'Staging',
    count: 9,
    note: 'Test tokens and preview environment values',
    safe: true,
  },
  {
    title: 'Shared',
    count: 5,
    note: 'Cross-environment API keys and webhook secrets',
    safe: false,
  },
];

const secrets = [
  { key: 'DATABASE_URL', value: 'postgres://**************', scope: 'Production', updated: '2h ago' },
  { key: 'JWT_SECRET', value: '**************', scope: 'Shared', updated: 'Yesterday' },
  { key: 'STRIPE_KEY', value: 'sk_live_************', scope: 'Production', updated: '4h ago' },
  { key: 'SENTRY_DSN', value: 'https://************', scope: 'Staging', updated: '8h ago' },
];

export default function SecretsPage() {
  return (
    <div className="page-shell">
      <section className="page-header animate-fade-in">
        <div>
          <div className="page-kicker" style={{ background: 'rgba(209,67,67,0.10)', color: 'var(--color-error)' }}>
            <ShieldAlert size={12} />
            Vault
          </div>
          <h1 className="page-title">Secrets</h1>
          <p className="page-subtitle">
            A tidy vault view for environment variables, tokens, and credentials with masking by default.
          </p>
        </div>

        <div className="page-actions">
          <div className="glass-card-flat flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-semibold text-slate-600">
            <Lock size={13} />
            Encrypted at rest
          </div>
          <button className="btn-primary flex items-center gap-2 rounded-2xl px-4 py-2.5 text-[13px] font-bold">
            <Plus size={15} />
            Add secret
          </button>
        </div>
      </section>

      <section className="stat-grid">
        {groups.map((group) => (
          <div key={group.title} className="glass-card rounded-[1.75rem] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{group.title}</p>
                <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">{group.count}</p>
                <p className="mt-2 text-sm text-slate-600">{group.note}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: group.safe ? 'rgba(27,139,90,0.12)' : 'rgba(214,138,31,0.12)' }}>
                <Shield size={18} style={{ color: group.safe ? 'var(--color-success)' : 'var(--color-warning)' }} />
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="split-grid">
        <div className="glass-card overflow-hidden rounded-[2rem]">
          <div className="flex flex-col gap-3 border-b border-[rgba(24,22,18,0.06)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-[14px] font-bold text-slate-900">Secret inventory</h2>
              <p className="text-[10px] font-medium text-slate-500">Masked values and update timestamps</p>
            </div>
            <div className="glass-card-flat flex items-center gap-2 rounded-2xl px-3 py-2 text-xs text-slate-600">
              <Search size={14} />
              Search secret
            </div>
          </div>

          <div className="divide-y divide-[rgba(24,22,18,0.06)]">
            {secrets.map((secret) => (
              <div key={secret.key} className="flex flex-col gap-4 px-5 py-5 transition hover:bg-black/5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[rgba(24,22,18,0.04)]">
                    <KeyRound size={18} className="text-slate-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-[14px] font-bold text-slate-900">{secret.key}</h3>
                      <span className="rounded-full bg-[rgba(47,110,229,0.10)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-blue)]">
                        {secret.scope}
                      </span>
                    </div>
                    <p className="mt-1 font-mono text-[12px] text-slate-500">{secret.value}</p>
                    <p className="mt-1 text-[11px] text-slate-400">Updated {secret.updated}</p>
                  </div>
                </div>

                <button className="flex items-center gap-2 rounded-2xl px-3 py-2 text-[12px] font-bold text-[color:var(--color-accent)] transition hover:bg-black/5">
                  Reveal
                  <Eye size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="glass-card rounded-[2rem] p-5">
            <div className="flex items-center gap-2">
              <Sparkles size={15} style={{ color: 'var(--color-accent)' }} />
              <h3 className="text-[13px] font-bold text-slate-900">Security rules</h3>
            </div>
            <div className="mt-4 space-y-3">
              {[
                'Secrets are masked in the UI by default.',
                'Rotation reminders are enabled for production values.',
                'Changes are logged and shown in the audit trail.',
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-[rgba(24,22,18,0.03)] px-4 py-3 text-sm leading-6 text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-[2rem] p-5">
            <div className="flex items-center gap-2">
              <EyeOff size={15} className="text-slate-500" />
              <h3 className="text-[13px] font-bold text-slate-900">Audit trail</h3>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Last secret update was performed by Shiv Jani and propagated to staging in under a minute.
            </p>
            <button className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-[rgba(209,67,67,0.10)] px-4 py-2.5 text-[12px] font-bold text-[var(--color-error)] transition hover:bg-[rgba(209,67,67,0.14)]">
              Rotate keys
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
