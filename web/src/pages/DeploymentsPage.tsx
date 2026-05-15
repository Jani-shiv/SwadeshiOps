import { Activity, ArrowUpRight, CheckCircle2, Clock3, Globe, Rocket, Server, ShieldCheck, Sparkles } from 'lucide-react';
import { timeAgo, useWorkspaceData } from '../hooks/useWorkspaceData';
import type { Deployment } from '../types';

function statusTone(status: Deployment['status']) {
  if (status === 'success') return { bg: 'var(--color-success-bg)', text: 'var(--color-success)', label: 'Live' };
  if (status === 'deploying') return { bg: 'var(--color-info-bg)', text: 'var(--color-blue)', label: 'Deploying' };
  if (status === 'pending') return { bg: 'rgba(214,138,31,0.12)', text: 'var(--color-warning)', label: 'Queued' };
  return { bg: 'rgba(122,117,109,0.12)', text: 'var(--color-slate-500)', label: 'Rolled back' };
}

export default function DeploymentsPage() {
  const { data, isError } = useWorkspaceData();
  const deployments = data?.deployments ?? [];
  const statCards = [
    { label: 'Deployments', value: String(deployments.length), note: 'Total records', icon: Rocket, color: 'var(--color-accent)' },
    { label: 'Healthy', value: String(deployments.filter((deployment) => deployment.status === 'success').length), note: 'Successful releases', icon: CheckCircle2, color: 'var(--color-success)' },
    { label: 'In progress', value: String(deployments.filter((deployment) => deployment.status === 'deploying' || deployment.status === 'pending').length), note: 'Active rollout queue', icon: Clock3, color: 'var(--color-blue)' },
  ];

  return (
    <div className="page-shell">
      <section className="page-header animate-fade-in">
        <div>
          <div className="page-kicker" style={{ background: 'rgba(47,110,229,0.10)', color: 'var(--color-blue)' }}>
            <Sparkles size={12} />
            Delivery
          </div>
          <h1 className="page-title">Deployments</h1>
          <p className="page-subtitle">Live deployment state across environments, targets, and commits.</p>
        </div>
        <div className="page-actions">
          <div className="glass-card-flat flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-slate-600">
            <Globe size={13} />
            Multi-environment view
          </div>
          <button className="btn-primary flex items-center gap-2 rounded-xl px-4 py-2.5 text-[14px] font-semibold tracking-tight">
            <ShieldCheck size={15} />
            Promote release
          </button>
        </div>
      </section>

      <section className="stat-grid">
        {statCards.map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[12px] font-medium text-slate-500">{stat.label}</p>
                <p className="mt-2 text-[32px] font-semibold tracking-tight text-slate-950">{stat.value}</p>
                <p className="mt-2 text-sm text-slate-600">{stat.note}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: 'var(--color-accent-soft)' }}>
                <stat.icon size={18} style={{ color: stat.color }} />
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="split-grid">
        <div className="glass-card overflow-hidden rounded-2xl">
          <div className="border-b border-slate-200/80 px-5 py-4 sm:px-6">
            <h2 className="text-[15px] font-semibold tracking-tight text-slate-950">Environment timeline</h2>
            <p className="text-[12px] font-medium text-slate-600">Current state from deployment records</p>
          </div>
          <div className="divide-y divide-slate-200/80">
            {isError && <div className="px-6 py-8 text-sm text-[var(--color-error)]">Unable to load deployments.</div>}
            {!isError && deployments.length === 0 && <div className="px-6 py-8 text-sm text-slate-600">No deployments yet.</div>}
            {deployments.map((deployment) => {
              const tone = statusTone(deployment.status);
              return (
                <article key={deployment.id} className="flex flex-col gap-4 px-5 py-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:px-6">
                  <div className="flex min-w-0 flex-1 items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl" style={{ background: tone.bg }}>
                      {deployment.status === 'success' && <CheckCircle2 size={18} style={{ color: tone.text }} />}
                      {deployment.status === 'deploying' && <Rocket size={18} style={{ color: tone.text }} />}
                      {deployment.status === 'pending' && <Clock3 size={18} style={{ color: tone.text }} />}
                      {deployment.status === 'rolled_back' && <ShieldCheck size={18} style={{ color: tone.text }} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-[15px] font-semibold tracking-tight text-slate-950">{deployment.environment}</h3>
                        <span className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]" style={{ background: tone.bg, color: tone.text }}>
                          {tone.label}
                        </span>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{deployment.deploy_type || 'manual'} deployment for project {deployment.project_id.slice(0, 8)}.</p>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-[12px] text-slate-500">
                        <span className="font-mono">{deployment.target_host || 'target pending'}</span>
                        {deployment.commit_sha && <span>{deployment.commit_sha}</span>}
                        <span>{timeAgo(deployment.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 self-start rounded-xl px-3 py-2 text-[13px] font-medium text-[color:var(--color-accent)] transition hover:bg-slate-50 sm:self-center">
                    Review
                    <ArrowUpRight size={14} />
                  </button>
                </article>
              );
            })}
          </div>
        </div>

        <div className="space-y-5">
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[14px] font-semibold tracking-tight text-slate-950">Rollout strategy</h3>
                <p className="text-[12px] font-medium text-slate-600">Observed deployment methods</p>
              </div>
              <Server size={15} className="text-slate-500" />
            </div>
            <div className="mt-4 space-y-3">
              {['manual', 'rolling', 'canary'].map((label) => {
                const count = deployments.filter((deployment) => deployment.deploy_type === label).length;
                return (
                  <div key={label}>
                    <div className="mb-1 flex items-center justify-between text-[12px]">
                      <span className="font-semibold capitalize text-slate-800">{label}</span>
                      <span className="text-slate-500">{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div className="h-2 rounded-full" style={{ width: `${deployments.length ? (count / deployments.length) * 100 : 0}%`, background: 'linear-gradient(90deg, #e06a2c, #1b6b5f)' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[14px] font-semibold tracking-tight text-slate-950">Operational note</h3>
                <p className="text-[12px] font-medium text-slate-600">What to do next</p>
              </div>
              <Activity size={15} className="text-slate-500" />
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {deployments.some((deployment) => deployment.status === 'failed')
                ? 'At least one deployment failed. Review logs before promoting additional releases.'
                : 'Deployment records are healthy. Keep rollback targets and promotion gates up to date.'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
