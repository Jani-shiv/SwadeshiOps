import { Activity, ArrowUpRight, CheckCircle2, Clock3, Globe, Rocket, Server, ShieldCheck, Sparkles } from 'lucide-react';
import type { Deployment } from '../types';

const deployments: (Deployment & { target: string; label: string; note: string })[] = [
  {
    id: '1',
    project_id: '1',
    run_id: 'run-42',
    environment: 'Production',
    status: 'success',
    deploy_type: 'rolling',
    target_host: 'prod-01.swadeshiops.in',
    commit_sha: 'a1b2c3d4',
    started_at: '2026-05-13T19:40:00Z',
    finished_at: '2026-05-13T19:42:40Z',
    created_at: '2026-05-13T19:40:00Z',
    target: 'prod-01',
    label: 'Live',
    note: 'Blue/green traffic shift completed without rollback.',
  },
  {
    id: '2',
    project_id: '2',
    run_id: 'run-39',
    environment: 'Staging',
    status: 'deploying',
    deploy_type: 'canary',
    target_host: 'staging-02.swadeshiops.in',
    commit_sha: 'd4e5f6g7',
    started_at: '2026-05-13T20:10:00Z',
    created_at: '2026-05-13T20:10:00Z',
    target: 'staging-02',
    label: 'Deploying',
    note: 'Testing a canary slice before the full rollout.',
  },
  {
    id: '3',
    project_id: '3',
    run_id: 'run-18',
    environment: 'Preview',
    status: 'pending',
    deploy_type: 'manual',
    target_host: 'preview-05.swadeshiops.in',
    commit_sha: 'e5f6g7h8',
    created_at: '2026-05-13T21:05:00Z',
    target: 'preview-05',
    label: 'Queued',
    note: 'Waiting for approval from the platform team.',
  },
  {
    id: '4',
    project_id: '1',
    run_id: 'run-17',
    environment: 'Sandbox',
    status: 'rolled_back',
    deploy_type: 'recreate',
    target_host: 'sandbox-03.swadeshiops.in',
    commit_sha: 'f6g7h8i9',
    finished_at: '2026-05-12T17:00:00Z',
    created_at: '2026-05-12T16:52:00Z',
    target: 'sandbox-03',
    label: 'Rolled back',
    note: 'Older test image was reverted after smoke tests failed.',
  },
];

const statCards = [
  { label: 'Deployments', value: '28', note: '5 today', icon: Rocket, color: 'var(--color-accent)' },
  { label: 'Healthy', value: '22', note: '78% green', icon: CheckCircle2, color: 'var(--color-success)' },
  { label: 'In progress', value: '1', note: 'One active rollout', icon: Clock3, color: 'var(--color-blue)' },
];

function statusTone(status: Deployment['status']) {
  if (status === 'success') return { bg: 'rgba(27,139,90,0.12)', text: 'var(--color-success)' };
  if (status === 'deploying') return { bg: 'rgba(47,110,229,0.12)', text: 'var(--color-blue)' };
  if (status === 'pending') return { bg: 'rgba(214,138,31,0.12)', text: 'var(--color-warning)' };
  return { bg: 'rgba(122,117,109,0.12)', text: 'var(--color-slate-500)' };
}

export default function DeploymentsPage() {
  return (
    <div className="page-shell">
      <section className="page-header animate-fade-in">
        <div>
          <div className="page-kicker" style={{ background: 'rgba(47,110,229,0.10)', color: 'var(--color-blue)' }}>
            <Sparkles size={12} />
            Delivery
          </div>
          <h1 className="page-title">Deployments</h1>
          <p className="page-subtitle">
            Keep a close eye on what is live, what is rolling out, and what still needs approval.
          </p>
        </div>

        <div className="page-actions">
          <div className="glass-card-flat flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-semibold text-slate-600">
            <Globe size={13} />
            Multi-environment view
          </div>
          <button className="btn-primary flex items-center gap-2 rounded-2xl px-4 py-2.5 text-[13px] font-bold">
            <ShieldCheck size={15} />
            Promote release
          </button>
        </div>
      </section>

      <section className="stat-grid">
        {statCards.map((stat) => (
          <div key={stat.label} className="glass-card rounded-[1.75rem] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{stat.label}</p>
                <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">{stat.value}</p>
                <p className="mt-2 text-sm text-slate-600">{stat.note}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: 'rgba(224,106,44,0.10)' }}>
                <stat.icon size={18} style={{ color: stat.color }} />
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="split-grid">
        <div className="glass-card overflow-hidden rounded-[2rem]">
          <div className="border-b border-[rgba(24,22,18,0.06)] px-5 py-4 sm:px-6">
            <h2 className="text-[14px] font-bold text-slate-900">Environment timeline</h2>
            <p className="text-[10px] font-medium text-slate-500">Current state across production, staging, preview, and sandbox</p>
          </div>

          <div className="divide-y divide-[rgba(24,22,18,0.06)]">
            {deployments.map((deployment) => {
              const tone = statusTone(deployment.status);
              return (
                <article key={deployment.id} className="flex flex-col gap-4 px-5 py-5 transition hover:bg-black/5 sm:flex-row sm:items-center sm:px-6">
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl" style={{ background: tone.bg }}>
                      {deployment.status === 'success' && <CheckCircle2 size={18} style={{ color: tone.text }} />}
                      {deployment.status === 'deploying' && <Rocket size={18} style={{ color: tone.text }} />}
                      {deployment.status === 'pending' && <Clock3 size={18} style={{ color: tone.text }} />}
                      {deployment.status === 'rolled_back' && <ShieldCheck size={18} style={{ color: tone.text }} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-[14px] font-bold text-slate-900">{deployment.environment}</h3>
                        <span className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]" style={{ background: tone.bg, color: tone.text }}>
                          {deployment.label}
                        </span>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{deployment.note}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-[12px] text-slate-500">
                        <span className="font-mono">{deployment.target_host}</span>
                        <span>{deployment.deploy_type}</span>
                        <span>{deployment.commit_sha}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 text-left text-[11px] text-slate-500 sm:min-w-[230px] sm:text-right">
                    <div>
                      <span className="font-semibold uppercase tracking-[0.16em] text-slate-400">Target</span>
                      <p className="mt-1 font-semibold text-slate-800 font-mono">{deployment.target}</p>
                    </div>
                    <div>
                      <span className="font-semibold uppercase tracking-[0.16em] text-slate-400">Status</span>
                      <p className="mt-1 font-semibold text-slate-800">{deployment.status}</p>
                    </div>
                    <div>
                      <span className="font-semibold uppercase tracking-[0.16em] text-slate-400">Started</span>
                      <p className="mt-1 font-semibold text-slate-800">{deployment.started_at ? new Date(deployment.started_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : 'Queued'}</p>
                    </div>
                  </div>

                  <button className="flex items-center gap-2 self-start rounded-2xl px-3 py-2 text-[12px] font-bold text-[color:var(--color-accent)] transition hover:bg-black/5 sm:self-center">
                    Review
                    <ArrowUpRight size={14} />
                  </button>
                </article>
              );
            })}
          </div>
        </div>

        <div className="space-y-5">
          <div className="glass-card rounded-[2rem] p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[13px] font-bold text-slate-900">Rollout strategy</h3>
                <p className="text-[10px] font-medium text-slate-500">Healthy promotion path</p>
              </div>
              <Server size={15} className="text-slate-500" />
            </div>

            <div className="mt-4 space-y-3">
              {[
                { label: 'Canary', value: '1 service', width: '30%' },
                { label: 'Rolling', value: '2 services', width: '54%' },
                { label: 'Manual gate', value: '1 service', width: '22%' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-1 flex items-center justify-between text-[12px]">
                    <span className="font-semibold text-slate-800">{item.label}</span>
                    <span className="text-slate-500">{item.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-[rgba(24,22,18,0.06)]">
                    <div className="h-2 rounded-full" style={{ width: item.width, background: 'linear-gradient(90deg, #e06a2c, #1b6b5f)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-[2rem] p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[13px] font-bold text-slate-900">Operational note</h3>
                <p className="text-[10px] font-medium text-slate-500">What to do next</p>
              </div>
              <Activity size={15} className="text-slate-500" />
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Staging is still deploying. Once the canary passes, promote the build to production and keep the rollback window visible.
            </p>

            <button className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-[rgba(47,110,229,0.10)] px-4 py-2.5 text-[12px] font-bold text-[var(--color-blue)] transition hover:bg-[rgba(47,110,229,0.14)]">
              View details
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
