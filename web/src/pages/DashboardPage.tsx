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
import type { PipelineRun } from '../types';

const mockRuns: PipelineRun[] = [
  {
    id: '1', pipeline_id: '1', project_id: '1', run_number: 42,
    status: 'success', trigger_type: 'push', trigger_ref: 'main',
    commit_sha: 'a1b2c3d4e5f6', commit_message: 'feat: add payment gateway integration',
    commit_author: 'Shiv Jani', started_at: '2026-05-13T19:30:00Z',
    finished_at: '2026-05-13T19:32:30Z', duration_ms: 150000, created_at: '2026-05-13T19:30:00Z',
  },
  {
    id: '2', pipeline_id: '1', project_id: '1', run_number: 41,
    status: 'running', trigger_type: 'push', trigger_ref: 'feature/auth',
    commit_sha: 'b2c3d4e5f6g7', commit_message: 'fix: resolve JWT token expiry issue',
    commit_author: 'Priya Sharma', started_at: '2026-05-13T19:35:00Z',
    duration_ms: 0, created_at: '2026-05-13T19:35:00Z',
  },
  {
    id: '3', pipeline_id: '2', project_id: '1', run_number: 40,
    status: 'failed', trigger_type: 'push', trigger_ref: 'main',
    commit_sha: 'c3d4e5f6g7h8', commit_message: 'chore: update dependencies',
    commit_author: 'Raj Patel', started_at: '2026-05-13T18:00:00Z',
    finished_at: '2026-05-13T18:01:45Z', duration_ms: 105000,
    error_message: 'npm test: 2 tests failed', created_at: '2026-05-13T18:00:00Z',
  },
  {
    id: '4', pipeline_id: '1', project_id: '2', run_number: 39,
    status: 'success', trigger_type: 'push', trigger_ref: 'main',
    commit_sha: 'd4e5f6g7h8i9', commit_message: 'feat: add Hindi localization for settings',
    commit_author: 'Ananya Gupta', started_at: '2026-05-13T17:20:00Z',
    finished_at: '2026-05-13T17:23:00Z', duration_ms: 180000, created_at: '2026-05-13T17:20:00Z',
  },
  {
    id: '5', pipeline_id: '3', project_id: '2', run_number: 38,
    status: 'success', trigger_type: 'push', trigger_ref: 'main',
    commit_sha: 'e5f6g7h8i9j0', commit_message: 'refactor: optimize Docker image size',
    commit_author: 'Shiv Jani', started_at: '2026-05-13T16:10:00Z',
    finished_at: '2026-05-13T16:12:15Z', duration_ms: 135000, created_at: '2026-05-13T16:10:00Z',
  },
];

const metrics = [
  {
    label: 'Pipelines',
    value: '12',
    change: '+2 this week',
    trend: 'up' as const,
    icon: GitBranch,
    color: 'var(--color-accent)',
    spark: [3, 5, 4, 7, 6, 8, 9, 7, 10, 12],
  },
  {
    label: 'Success rate',
    value: '94.2%',
    change: '+1.3%',
    trend: 'up' as const,
    icon: CheckCircle2,
    color: 'var(--color-success)',
    spark: [88, 91, 89, 93, 90, 94, 92, 95, 93, 94],
  },
  {
    label: 'Average runtime',
    value: '2m 18s',
    change: '-12s',
    trend: 'down' as const,
    icon: Clock3,
    color: 'var(--color-blue)',
    spark: [5, 4, 6, 3, 4, 3, 3, 2, 3, 2],
  },
  {
    label: 'Deployments',
    value: '28',
    change: '5 today',
    trend: 'up' as const,
    icon: Rocket,
    color: 'var(--color-teal)',
    spark: [2, 4, 3, 5, 6, 4, 7, 5, 6, 5],
  },
];

const activityBars = [64, 47, 78, 58, 86, 72, 90];

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);

  return (
    <div className="flex h-10 items-end gap-1.5" aria-hidden="true">
      {data.map((value, index) => (
        <span
          key={`${index}-${value}`}
          className="w-1.5 rounded-full"
          style={{ height: `${(value / max) * 100}%`, background: color, opacity: 0.75 }}
        />
      ))}
    </div>
  );
}

function formatDuration(ms: number) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return minutes > 0 ? `${minutes}m ${remaining}s` : `${seconds}s`;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function MetricCard({ metric, delay }: { metric: typeof metrics[number]; delay: number }) {
  return (
    <div className="glass-card rounded-xl p-5 animate-fade-in" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: 'var(--color-accent-soft)' }}>
          <metric.icon size={19} style={{ color: metric.color }} />
        </div>
        <Sparkline data={metric.spark} color={metric.color} />
      </div>

      <p className="mt-3 text-[13px] font-medium text-slate-600">{metric.label}</p>
      <p className="mt-1 text-[32px] font-semibold tracking-tight text-slate-950 stat-value">{metric.value}</p>

      <div className="mt-4 flex items-center gap-1.5 border-t border-slate-200/80 pt-3">
        {metric.trend === 'up' ? <TrendingUp size={12} style={{ color: metric.color }} /> : <TrendingDown size={12} style={{ color: metric.color }} />}
        <span className="text-[11px] font-bold" style={{ color: metric.color }}>{metric.change}</span>
        <span className="ml-auto text-[12px] font-medium text-slate-600">vs last week</span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="page-shell">
      <section className="page-header animate-fade-in">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="page-kicker" style={{ background: 'var(--color-success-bg)', color: 'var(--color-success)' }}>
              <span className="h-1.5 w-1.5 rounded-full dot-live" style={{ background: 'var(--color-success)' }} />
              Live
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Overview</span>
          </div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            A calm snapshot of pipelines, deployments, and build health designed to keep the important signals easy to read.
          </p>
        </div>

        <div className="page-actions">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <Calendar size={13} />
            <span>Today, {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
          </div>
          <div className="section-line h-6 w-px" />
          <div className="glass-card-flat flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold" style={{ color: 'var(--color-success)', borderColor: 'var(--color-success-bg)' }}>
            <Activity size={14} className="animate-pulse" />
            <span>All systems operational</span>
          </div>
        </div>
      </section>

      <section className="stat-grid-4">
        {metrics.map((metric, index) => (
          <MetricCard key={metric.label} metric={metric} delay={index * 70} />
        ))}
      </section>

      <section className="split-grid-wide">
        <div className="glass-card overflow-hidden rounded-xl animate-fade-in" style={{ animationDelay: '250ms' }}>
          <div className="flex flex-col gap-3 border-b border-slate-200/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'var(--color-accent-soft)' }}>
                <Zap size={16} style={{ color: 'var(--color-accent)' }} />
              </div>
              <div>
                <h2 className="text-[15px] font-semibold tracking-tight text-slate-950">Recent pipeline runs</h2>
                <p className="text-[12px] font-medium text-slate-500">Last 5 executions with current state</p>
              </div>
            </div>

            <button className="self-start rounded-xl px-3 py-1.5 text-[11px] font-bold text-[color:var(--color-accent)] transition hover:bg-slate-50 sm:self-auto">
              View all →
            </button>
          </div>

          <div className="divide-y divide-slate-200/80">
            {mockRuns.map((run, index) => (
              <div key={run.id} className="flex items-center gap-4 px-5 py-[18px] transition hover:bg-slate-50 sm:px-6" style={{ animationDelay: `${index * 60 + 300}ms` }}>
                <div className="shrink-0">
                  {run.status === 'success' && (
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-success-bg)]">
                      <CheckCircle2 size={16} style={{ color: 'var(--color-success)' }} />
                    </div>
                  )}
                  {run.status === 'failed' && (
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-error-bg)]">
                      <Layers3 size={16} style={{ color: 'var(--color-error)' }} />
                    </div>
                  )}
                  {run.status === 'running' && (
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-info-bg)]">
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-blue-500/30 border-t-blue-500" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate text-[14px] font-medium text-slate-950">{run.commit_message}</span>
                    <StatusBadge status={run.status} size="sm" />
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-500">
                    <span className="flex items-center gap-1 font-sans">
                      <GitBranch size={10} />
                      {run.trigger_ref}
                    </span>
                    <span>#{run.run_number}</span>
                    <span>{run.commit_sha.substring(0, 7)}</span>
                    <span className="font-sans">{run.commit_author}</span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-[12px] font-semibold text-slate-800 font-mono">{run.duration_ms > 0 ? formatDuration(run.duration_ms) : '—'}</p>
                  <p className="mt-0.5 text-[10px] text-slate-500">{timeAgo(run.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="glass-card rounded-xl p-5 animate-fade-in" style={{ animationDelay: '320ms' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 size={15} style={{ color: 'var(--color-blue)' }} />
                <h3 className="text-[14px] font-semibold tracking-tight text-slate-950">Weekly activity</h3>
              </div>
              <span className="text-[12px] font-medium text-slate-600">Last 7 days</span>
            </div>

            <div className="mt-4 flex h-28 items-end gap-2">
              {activityBars.map((value, index) => (
                <div key={`${index}-${value}`} className="flex-1 rounded-t-sm" style={{ height: `${value}%`, background: index === activityBars.length - 1 ? 'var(--color-accent)' : 'rgba(59,130,246,0.6)' }} />
              ))}
            </div>

            <div className="mt-4 flex justify-between text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-xl p-5 animate-fade-in" style={{ animationDelay: '380ms' }}>
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
                { label: 'Add runner', desc: 'Scale self-hosted capacity', icon: Rocket, color: 'var(--color-teal)' },
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

          <div className="glass-card rounded-xl p-5 animate-fade-in" style={{ animationDelay: '440ms' }}>
            <div className="flex items-center gap-2">
              <Users size={15} style={{ color: 'var(--color-success)' }} />
              <h3 className="text-[14px] font-semibold tracking-tight text-slate-950">Team pulse</h3>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              3 active contributors, 2 deployments waiting, and 1 build currently running.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { value: '3', label: 'Active' },
                { value: '2', label: 'Queued' },
                { value: '1', label: 'Running' },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-slate-50/80 p-3 text-center">
                  <p className="mt-1 text-[11px] font-medium text-slate-500">{item.label}</p>
                  <p className="mt-1 text-[20px] font-semibold tracking-tight text-slate-950">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}



