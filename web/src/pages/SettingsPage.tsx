import { Bell, Database, KeyRound, MonitorCog, Save, Shield, Sparkles, Webhook } from 'lucide-react';
import { useWorkspaceData } from '../hooks/useWorkspaceData';
import { useAuth } from '../store/useAuth';

export default function SettingsPage() {
  const { data } = useWorkspaceData();
  const { user } = useAuth();
  const activeOrg = data?.activeOrg;

  const sections = [
    {
      title: 'Workspace',
      description: activeOrg ? `${activeOrg.name} on the ${activeOrg.plan} plan` : 'Create a workspace to configure project defaults',
      icon: MonitorCog,
      items: [`Org slug: ${activeOrg?.slug ?? 'not set'}`, `${data?.projects.length ?? 0} projects`, `${data?.pipelines.length ?? 0} pipelines`],
    },
    {
      title: 'Notifications',
      description: 'Runtime signals from pipeline and deployment activity',
      icon: Bell,
      items: [`${data?.runs.filter((run) => run.status === 'failed').length ?? 0} failed runs`, `${data?.deployments.length ?? 0} deployments`, 'Email channels ready'],
    },
    {
      title: 'Integrations',
      description: 'External systems connected to the platform',
      icon: Webhook,
      items: Array.from(new Set((data?.projects ?? []).map((project) => project.repo_provider || 'manual'))).slice(0, 3),
    },
    {
      title: 'Security',
      description: 'Access and credential controls',
      icon: Shield,
      items: [`Signed in as ${user?.role ?? 'member'}`, `${data?.secrets.length ?? 0} secrets`, `${data?.envVars.filter((item) => item.is_secret).length ?? 0} masked env vars`],
    },
  ];

  return (
    <div className="page-shell">
      <section className="page-header animate-fade-in">
        <div>
          <div className="page-kicker" style={{ background: 'rgba(27,139,90,0.10)', color: 'var(--color-success)' }}>
            <Sparkles size={12} />
            Preferences
          </div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Workspace configuration summarized from live account, project, and security data.</p>
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
                  <h2 className="text-[15px] font-semibold tracking-tight text-slate-950">{section.title}</h2>
                  <p className="mt-1 text-sm text-slate-600">{section.description}</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {section.items.map((item) => (
                      <div key={item} className="rounded-xl bg-slate-50/80 px-4 py-3 text-sm font-medium text-slate-700">{item}</div>
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
              <h3 className="text-[14px] font-semibold tracking-tight text-slate-950">Access policy</h3>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">JWT access is enforced on every workspace API route and the frontend now redirects unauthenticated users.</p>
            <div className="mt-4 space-y-3">
              {['Access tokens are required for protected APIs.', 'Refresh tokens are rejected by API middleware.', 'Project records are scoped through organization membership.'].map((item) => (
                <div key={item} className="rounded-xl bg-slate-50/80 px-4 py-3 text-sm leading-6 text-slate-700">{item}</div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2">
              <Database size={15} className="text-slate-500" />
              <h3 className="text-[14px] font-semibold tracking-tight text-slate-950">Workspace status</h3>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">The platform is connected to PostgreSQL-backed workspace APIs and React Query cache hydration.</p>
            <div className="mt-4 rounded-xl bg-[rgba(27,139,90,0.10)] px-4 py-3 text-[12px] font-semibold text-[var(--color-success)]">
              {activeOrg ? 'Workspace data is reachable and configuration is in sync.' : 'No workspace has been created yet.'}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
