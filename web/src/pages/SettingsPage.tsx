import { Bell, Database, KeyRound, MonitorCog, Save, Shield, Sparkles, Webhook } from 'lucide-react';

const sections = [
  {
    title: 'Workspace',
    description: 'Basic branding and project defaults',
    icon: MonitorCog,
    items: ['Workspace name', 'Default branch', 'Build timeout'],
  },
  {
    title: 'Notifications',
    description: 'What should reach your inbox',
    icon: Bell,
    items: ['Build failures', 'Deployment success', 'Security alerts'],
  },
  {
    title: 'Integrations',
    description: 'External systems connected to the platform',
    icon: Webhook,
    items: ['Slack', 'Git provider', 'Issue tracker'],
  },
  {
    title: 'Security',
    description: 'Access and credential controls',
    icon: Shield,
    items: ['Session timeout', 'Two-factor auth', 'Secret rotation'],
  },
];

export default function SettingsPage() {
  return (
    <div className="page-shell">
      <section className="page-header animate-fade-in">
        <div>
          <div className="page-kicker" style={{ background: 'rgba(27,139,90,0.10)', color: 'var(--color-success)' }}>
            <Sparkles size={12} />
            Preferences
          </div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">
            Keep the workspace configured, secure, and easy for the team to understand.
          </p>
        </div>

        <button className="btn-primary flex items-center gap-2 rounded-xl px-4 py-2.5 text-[14px] font-semibold tracking-tight">
          <Save size={15} />
          Save changes
        </button>
      </section>

      <section className="split-grid-balanced">
        <div className="space-y-5">
          {sections.map((section) => (
            <div key={section.title} className="glass-card rounded-2xl p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: 'var(--color-accent-soft)' }}>
                  <section.icon size={18} style={{ color: 'var(--color-accent)' }} />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-[15px] font-semibold tracking-tight text-slate-50">{section.title}</h2>
                  <p className="mt-1 text-sm text-slate-400">{section.description}</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {section.items.map((item) => (
                      <div key={item} className="rounded-xl bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm font-medium text-slate-300">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-5">
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2">
              <KeyRound size={15} className="text-slate-500" />
              <h3 className="text-[14px] font-semibold tracking-tight text-slate-50">Access policy</h3>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Limit session duration, require trusted devices, and keep the admin surface small.
            </p>
            <div className="mt-4 space-y-3">
              {[
                'Session expires after 12 hours of inactivity.',
                'Admin access is restricted to workspace owners.',
                'Webhook signatures are verified for every request.',
              ].map((item) => (
                <div key={item} className="rounded-xl bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm leading-6 text-slate-300">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2">
              <Database size={15} className="text-slate-500" />
              <h3 className="text-[14px] font-semibold tracking-tight text-slate-50">Workspace status</h3>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              The platform is connected, monitored, and ready for deployment activity.
            </p>
            <div className="mt-4 rounded-xl bg-[rgba(27,139,90,0.10)] px-4 py-3 text-[12px] font-semibold text-[var(--color-success)]">
              All services are reachable and configuration is in sync.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}




