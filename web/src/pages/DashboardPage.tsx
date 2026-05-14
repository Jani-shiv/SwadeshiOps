import {
  GitBranch,
  CheckCircle2,
  XCircle,
  Clock,
  Rocket,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Zap,
  Server,
  Plus,
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import type { PipelineRun } from '../types';

// Demo data
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
    gradient: 'linear-gradient(135deg, rgba(255,107,43,0.12), rgba(255,107,43,0.02))',
    iconBg: 'linear-gradient(135deg, #FF6B2B, #FF8F5E)',
    iconColor: '#FF6B2B',
    changeColor: '#FF8F5E',
  },
  {
    label: 'Success Rate',
    value: '94.2%',
    change: '+1.3% vs last week',
    icon: CheckCircle2,
    gradient: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.02))',
    iconBg: 'linear-gradient(135deg, #10B981, #34D399)',
    iconColor: '#10B981',
    changeColor: '#34D399',
  },
  {
    label: 'Avg Duration',
    value: '2m 18s',
    change: '-12s faster',
    icon: Clock,
    gradient: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(59,130,246,0.02))',
    iconBg: 'linear-gradient(135deg, #3B82F6, #60A5FA)',
    iconColor: '#3B82F6',
    changeColor: '#60A5FA',
  },
  {
    label: 'Deployments',
    value: '28',
    change: '5 today',
    icon: Rocket,
    gradient: 'linear-gradient(135deg, rgba(168,85,247,0.12), rgba(168,85,247,0.02))',
    iconBg: 'linear-gradient(135deg, #A855F7, #C084FC)',
    iconColor: '#A855F7',
    changeColor: '#C084FC',
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
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-[28px] font-extrabold text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-medium">
            Overview of your CI/CD pipelines and deployments
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold glass-card"
            style={{ color: '#10B981', borderColor: 'rgba(16, 185, 129, 0.15)' }}
          >
            <Activity size={14} className="animate-pulse" />
            <span>System Healthy</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => (
          <div
            key={stat.label}
            className="relative glass-card p-6 rounded-2xl group animate-fade-in"
            style={{
              background: stat.gradient,
              animationDelay: `${idx * 80}ms`,
            }}
          >
            {/* Subtle glow on hover */}
            <div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 50% 0%, ${stat.iconColor}08, transparent 70%)`,
              }}
            />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{
                    background: stat.iconBg,
                    boxShadow: `0 4px 16px ${stat.iconColor}30`,
                  }}
                >
                  <stat.icon size={20} className="text-white" />
                </div>
                <ArrowUpRight
                  size={16}
                  className="text-slate-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
                />
              </div>

              <p className="text-3xl font-extrabold text-white stat-value animate-count-up" style={{ animationDelay: `${idx * 100 + 200}ms` }}>
                {stat.value}
              </p>
              <p className="text-xs text-slate-400 mt-1 font-medium">{stat.label}</p>

              <div className="flex items-center gap-1.5 mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                <TrendingUp size={12} style={{ color: stat.changeColor }} />
                <span className="text-[11px] font-semibold" style={{ color: stat.changeColor }}>
                  {stat.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Runs */}
      <div className="glass-card rounded-2xl overflow-hidden animate-fade-in" style={{ animationDelay: '300ms' }}>
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(255, 107, 43, 0.1)' }}
            >
              <Zap size={16} style={{ color: '#FF6B2B' }} />
            </div>
            <h2 className="text-[15px] font-bold text-white">Recent Pipeline Runs</h2>
          </div>
          <button className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:bg-white/[0.03]" style={{ color: '#FF6B2B' }}>
            View All →
          </button>
        </div>

        <div>
          {mockRuns.map((run, idx) => (
            <div
              key={run.id}
              className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.015] transition-all duration-200 cursor-pointer animate-fade-in group"
              style={{
                animationDelay: `${idx * 60 + 350}ms`,
                borderBottom: idx < mockRuns.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
              }}
            >
              {/* Status Icon */}
              <div className="shrink-0">
                {run.status === 'success' && (
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                    <CheckCircle2 size={16} className="text-emerald-400" />
                  </div>
                )}
                {run.status === 'failed' && (
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                    <XCircle size={16} className="text-red-400" />
                  </div>
                )}
                {run.status === 'running' && (
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                    <div className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-1">
                  <span className="text-sm font-semibold text-white truncate group-hover:text-slate-100 transition-colors">
                    {run.commit_message}
                  </span>
                  <StatusBadge status={run.status} size="sm" />
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-mono text-[11px]">
                    <GitBranch size={11} />
                    {run.trigger_ref}
                  </span>
                  <span className="font-mono text-[11px]">#{run.run_number}</span>
                  <span className="font-mono text-[11px]">{run.commit_sha.substring(0, 7)}</span>
                  <span className="text-slate-400">{run.commit_author}</span>
                </div>
              </div>

              {/* Duration & Time */}
              <div className="text-right shrink-0">
                <p className="text-xs text-slate-300 font-semibold font-mono">
                  {run.duration_ms > 0 ? formatDuration(run.duration_ms) : '—'}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">{timeAgo(run.created_at)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          {
            label: 'New Project',
            desc: 'Connect a Git repository',
            icon: Plus,
            gradient: 'linear-gradient(135deg, rgba(255,107,43,0.1), rgba(255,107,43,0.02))',
            iconBg: '#FF6B2B',
          },
          {
            label: 'Create Pipeline',
            desc: 'Define a CI/CD workflow',
            icon: GitBranch,
            gradient: 'linear-gradient(135deg, rgba(37,99,235,0.1), rgba(37,99,235,0.02))',
            iconBg: '#3B82F6',
          },
          {
            label: 'Add Runner',
            desc: 'Register a self-hosted runner',
            icon: Server,
            gradient: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.02))',
            iconBg: '#10B981',
          },
        ].map((action, idx) => (
          <button
            key={action.label}
            className="glass-card p-6 rounded-2xl text-left group animate-fade-in"
            style={{
              background: action.gradient,
              animationDelay: `${idx * 80 + 500}ms`,
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
              style={{
                background: `${action.iconBg}15`,
                boxShadow: `0 0 16px ${action.iconBg}10`,
              }}
            >
              <action.icon size={18} style={{ color: action.iconBg }} />
            </div>
            <p className="text-sm font-bold text-white mb-1">{action.label}</p>
            <p className="text-xs text-slate-400 font-medium">{action.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
