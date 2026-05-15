import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock3,
  GitBranch,
  Layers3,
  Rocket,
  Server,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { formatDuration, timeAgo, useWorkspaceData } from '../hooks/useWorkspaceData';

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex h-10 items-end gap-1.5" aria-hidden="true">
      {data.map((value, index) => (
        <span key={`${index}-${value}`} className="w-1.5 rounded-full" style={{ height: `${(value / max) * 100}%`, background: color, opacity: 0.75 }} />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { data, isLoading, isError } = useWorkspaceData();
  const runs = data?.runs ?? [];
  const deployments = data?.deployments ?? [];
  const completedRuns = runs.filter((run) => run.duration_ms > 0);
  const avgRuntime = completedRuns.length ? completedRuns.reduce((total, run) => total + run.duration_ms, 0) / completedRuns.length : 0;
  const successRate = Math.round(data?.stats?.success_rate ?? 0);
  const spark = runs.slice(0, 10).map((run) => (run.status === 'success' ? 10 : run.status === 'failed' ? 3 : 6));

  const metrics = [
    { label: 'Pipelines', value: String(data?.pipelines.length ?? 0), change: `${data?.projects.length ?? 0} projects`, trend: 'up' as const, icon: GitBranch, color: 'var(--color-accent)', spark },
    { label: 'Success rate', value: `${successRate}%`, change: `${runs.length} total runs`, trend: 'up' as const, icon: CheckCircle2, color: 'var(--color-success)', spark },
    { label: 'Average runtime', value: avgRuntime ? formatDuration(avgRuntime) : '0s', change: 'completed runs', trend: 'down' as const, icon: Clock3, color: 'var(--color-blue)', spark },
    { label: 'Deployments', value: String(deployments.length), change: `${deployments.filter((deployment) => deployment.status === 'deploying').length} active`, trend: 'up' as const, icon: Rocket, color: 'var(--color-teal)', spark },
  ];

  const activityBars = [0, 1, 2, 3, 4, 5, 6].map((dayOffset) => {
    const day = new Date();
    day.setDate(day.getDate() - dayOffset);
    return runs.filter((run) => new Date(run.created_at).toDateString() === day.toDateString()).length;
  }).reverse();

  return (
    <div className="page-shell">
      <section className="page-header animate-fade-in">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="page-kicker" style={{ background: 'var(--color-success-bg)', color: 'var(--color-success)' }}>
              <span className="h-1.5 w-1.5 rounded-full dot-live" style={{ background: 'var(--color-success)' }} />
              {isLoading ? 'Syncing' : 'Live'}
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Overview</span>
          </div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">A live snapshot of pipelines, deployments, and build health from your SwadeshiOps API.</p>
        </div>

        <div className="page-actions">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <Calendar size={13} />
            <span>Today, {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
          </div>
          <div className="section-line h-6 w-px" />
          <div className="glass-card-flat flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold" style={{ color: isError ? 'var(--color-error)' : 'var(--color-success)', borderColor: 'var(--color-success-bg)' }}>
            <Activity size={14} className="animate-pulse" />
            <span>{isError ? 'API needs attention' : 'All systems reachable'}</span>
          </div>
        </div>
      </section>

      <section className="stat-grid-4">
        {metrics.map((metric, index) => (
          <div key={metric.label} className="glass-card rounded-xl p-5 animate-fade-in" style={{ animationDelay: `${index * 70}ms` }}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: 'var(--color-accent-soft)' }}>
                <metric.icon size={19} style={{ color: metric.color }} />
              </div>
              <Sparkline data={metric.spark.length ? metric.spark : [1]} color={metric.color} />
            </div>
            <p className="mt-3 text-[13px] font-medium text-slate-600">{metric.label}</p>
            <p className="stat-value mt-1 text-[32px] font-semibold tracking-tight text-slate-950">{metric.value}</p>
            <div className="mt-4 flex items-center gap-1.5 border-t border-slate-200/80 pt-3">
              {metric.trend === 'up' ? <TrendingUp size={12} style={{ color: metric.color }} /> : <TrendingDown size={12} style={{ color: metric.color }} />}
              <span className="text-[11px] font-bold" style={{ color: metric.color }}>{metric.change}</span>
              <span className="ml-auto text-[12px] font-medium text-slate-600">live</span>
            </div>
          </div>
        ))}
      </section>

      <section className="split-grid-wide">
        <div className="glass-card animate-fade-in overflow-hidden rounded-xl" style={{ animationDelay: '250ms' }}>
          <div className="flex flex-col gap-3 border-b border-slate-200/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'var(--color-accent-soft)' }}>
                <Zap size={16} style={{ color: 'var(--color-accent)' }} />
              </div>
              <div>
                <h2 className="text-[15px] font-semibold tracking-tight text-slate-950">Recent pipeline runs</h2>
                <p className="text-[12px] font-medium text-slate-500">Latest executions from the database</p>
              </div>
            </div>
            <button className="self-start rounded-xl px-3 py-1.5 text-[11px] font-bold text-[color:var(--color-accent)] transition hover:bg-slate-50 sm:self-auto">
              View all
            </button>
          </div>

          <div className="divide-y divide-slate-200/80">
            {runs.slice(0, 5).map((run, index) => (
              <div key={run.id} className="flex items-center gap-4 px-5 py-[18px] transition hover:bg-slate-50 sm:px-6" style={{ animationDelay: `${index * 60 + 300}ms` }}>
                <div className="shrink-0">
                  {run.status === 'success' && <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-success-bg)]"><CheckCircle2 size={16} style={{ color: 'var(--color-success)' }} /></div>}
                  {run.status === 'failed' && <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-error-bg)]"><Layers3 size={16} style={{ color: 'var(--color-error)' }} /></div>}
                  {run.status !== 'success' && run.status !== 'failed' && <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-info-bg)]"><div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-blue-500/30 border-t-blue-500" /></div>}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate text-[14px] font-medium text-slate-950">{run.commit_message || `Pipeline run #${run.run_number}`}</span>
                    <StatusBadge status={run.status} size="sm" />
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 font-mono text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 font-sans"><GitBranch size={10} />{run.trigger_ref || 'manual'}</span>
                    <span>#{run.run_number}</span>
                    {run.commit_sha && <span>{run.commit_sha.substring(0, 7)}</span>}
                    {run.commit_author && <span className="font-sans">{run.commit_author}</span>}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-mono text-[12px] font-semibold text-slate-800">{run.duration_ms > 0 ? formatDuration(run.duration_ms) : '0s'}</p>
                  <p className="mt-0.5 text-[10px] text-slate-500">{timeAgo(run.created_at)}</p>
                </div>
              </div>
            ))}
            {runs.length === 0 && <div className="px-6 py-8 text-sm text-slate-600">No pipeline runs yet.</div>}
          </div>
        </div>

        <div className="space-y-5">
          <div className="glass-card animate-fade-in rounded-xl p-5" style={{ animationDelay: '320ms' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 size={15} style={{ color: 'var(--color-blue)' }} />
                <h3 className="text-[14px] font-semibold tracking-tight text-slate-950">Weekly activity</h3>
              </div>
              <span className="text-[12px] font-medium text-slate-600">Last 7 days</span>
            </div>
            <div className="mt-4 flex h-28 items-end gap-2">
              {activityBars.map((value, index) => (
                <div key={`${index}-${value}`} className="flex-1 rounded-t-sm" style={{ height: `${Math.max(value, 1) * 18}%`, background: index === activityBars.length - 1 ? 'var(--color-accent)' : 'rgba(59,130,246,0.6)' }} />
              ))}
            </div>
          </div>

          <div className="glass-card animate-fade-in rounded-xl p-5" style={{ animationDelay: '380ms' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={15} style={{ color: 'var(--color-accent)' }} />
                <h3 className="text-[14px] font-semibold tracking-tight text-slate-950">Quick actions</h3>
              </div>
              <span className="text-[12px] font-medium text-slate-600">Shortcuts</span>
            </div>
            <div className="mt-4 space-y-3">
              {[
                { label: 'New project', desc: 'Connect a repository', icon: Server, color: 'var(--color-accent)' },
                { label: 'Create pipeline', desc: 'Define a workflow', icon: GitBranch, color: 'var(--color-blue)' },
                { label: 'Promote deployment', desc: 'Ship a successful run', icon: Rocket, color: 'var(--color-teal)' },
              ].map((action) => (
                <button key={action.label} className="glass-card-flat flex w-full items-center gap-3 rounded-xl p-4 text-left transition hover:translate-y-[-1px] hover:shadow-[0_12px_24px_rgba(15,23,42,0.08)]">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: `${action.color}14` }}>
                    <action.icon size={18} style={{ color: action.color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium text-slate-950">{action.label}</p>
                    <p className="text-[12px] font-normal text-slate-500">{action.desc}</p>
                  </div>
                  <ArrowUpRight size={14} className="text-slate-500" />
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card animate-fade-in rounded-xl p-5" style={{ animationDelay: '440ms' }}>
            <div className="flex items-center gap-2">
              <Users size={15} style={{ color: 'var(--color-success)' }} />
              <h3 className="text-[14px] font-semibold tracking-tight text-slate-950">Team pulse</h3>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {data?.activeOrg ? `${data.activeOrg.name} has ${data.projects.length} projects and ${data.pipelines.length} workflows configured.` : 'Create a workspace to start tracking team activity.'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
