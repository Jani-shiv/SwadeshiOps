import {
  GitBranch,
  CheckCircle2,
  XCircle,
  Clock,
  Rocket,
  TrendingUp,
  Activity,
  ArrowUpRight,
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import type { PipelineRun } from '../types';

// Demo data — will be replaced by API calls
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

const stats = [
  {
    label: 'Total Pipelines',
    value: '12',
    change: '+2 this week',
    icon: GitBranch,
    gradient: 'linear-gradient(135deg, rgba(255,107,43,0.15), rgba(255,107,43,0.05))',
    iconColor: '#FF6B2B',
  },
  {
    label: 'Success Rate',
    value: '94.2%',
    change: '+1.3% vs last week',
    icon: CheckCircle2,
    gradient: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))',
    iconColor: '#10B981',
  },
  {
    label: 'Avg Duration',
    value: '2m 18s',
    change: '-12s faster',
    icon: Clock,
    gradient: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(59,130,246,0.05))',
    iconColor: '#3B82F6',
  },
  {
    label: 'Deployments',
    value: '28',
    change: '5 today',
    icon: Rocket,
    gradient: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(168,85,247,0.05))',
    iconColor: '#A855F7',
  },
];

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (minutes > 0) return `${minutes}m ${secs}s`;
  return `${secs}s`;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">Overview of your CI/CD pipelines and deployments</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs" style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981' }}>
            <Activity size={14} className="animate-pulse" />
            System Healthy
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="relative p-5 rounded-xl transition-all duration-300 hover:scale-[1.02] group"
            style={{
              background: stat.gradient,
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: `${stat.iconColor}15` }}
              >
                <stat.icon size={20} style={{ color: stat.iconColor }} />
              </div>
              <ArrowUpRight size={16} className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp size={12} style={{ color: stat.iconColor }} />
              <span className="text-[11px]" style={{ color: stat.iconColor }}>{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Runs */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="text-base font-semibold text-white">Recent Pipeline Runs</h2>
          <button className="text-xs font-medium transition-colors" style={{ color: '#FF6B2B' }}>
            View All →
          </button>
        </div>

        <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
          {mockRuns.map((run, idx) => (
            <div
              key={run.id}
              className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors cursor-pointer animate-fade-in"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {/* Status Icon */}
              <div className="shrink-0">
                {run.status === 'success' && <CheckCircle2 size={20} className="text-emerald-400" />}
                {run.status === 'failed' && <XCircle size={20} className="text-red-400" />}
                {run.status === 'running' && (
                  <div className="w-5 h-5 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-medium text-white truncate">
                    {run.commit_message}
                  </span>
                  <StatusBadge status={run.status} size="sm" />
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <GitBranch size={12} />
                    {run.trigger_ref}
                  </span>
                  <span>#{run.run_number}</span>
                  <span>{run.commit_sha.substring(0, 7)}</span>
                  <span>{run.commit_author}</span>
                </div>
              </div>

              {/* Duration & Time */}
              <div className="text-right shrink-0">
                <p className="text-xs text-slate-300">
                  {run.duration_ms > 0 ? formatDuration(run.duration_ms) : '—'}
                </p>
                <p className="text-[11px] text-slate-500">{timeAgo(run.created_at)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'New Project', desc: 'Connect a Git repository', gradient: 'linear-gradient(135deg, #FF6B2B20, #FF6B2B05)' },
          { label: 'Create Pipeline', desc: 'Define a CI/CD workflow', gradient: 'linear-gradient(135deg, #2563EB20, #2563EB05)' },
          { label: 'Add Runner', desc: 'Register a self-hosted runner', gradient: 'linear-gradient(135deg, #10B98120, #10B98105)' },
        ].map((action) => (
          <button
            key={action.label}
            className="p-5 rounded-xl text-left transition-all duration-300 hover:scale-[1.02] group"
            style={{ background: action.gradient, border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <p className="text-sm font-semibold text-white mb-1">{action.label}</p>
            <p className="text-xs text-slate-400">{action.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
