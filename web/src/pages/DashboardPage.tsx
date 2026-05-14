import {
  GitBranch,
  CheckCircle2,
  XCircle,

  Rocket,
  TrendingUp,
  TrendingDown,
  Activity,
  ArrowUpRight,
  Zap,
  Server,
  Plus,
  Timer,
  BarChart3,
  Calendar,
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
    trend: 'up' as const,
    icon: GitBranch,
    gradient: 'linear-gradient(135deg, rgba(255,107,43,0.1), rgba(255,107,43,0.02))',
    iconBg: 'linear-gradient(135deg, #FF6B2B, #FF8F5E)',
    iconColor: '#FF6B2B',
    changeColor: '#FF8F5E',
    sparkData: [3, 5, 4, 7, 6, 8, 9, 7, 10, 12],
  },
  {
    label: 'Success Rate',
    value: '94.2%',
    change: '+1.3%',
    trend: 'up' as const,
    icon: CheckCircle2,
    gradient: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.02))',
    iconBg: 'linear-gradient(135deg, #10B981, #34D399)',
    iconColor: '#10B981',
    changeColor: '#34D399',
    sparkData: [88, 91, 89, 93, 90, 94, 92, 95, 93, 94],
  },
  {
    label: 'Avg Duration',
    value: '2m 18s',
    change: '-12s',
    trend: 'down' as const,
    icon: Timer,
    gradient: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(59,130,246,0.02))',
    iconBg: 'linear-gradient(135deg, #3B82F6, #60A5FA)',
    iconColor: '#3B82F6',
    changeColor: '#60A5FA',
    sparkData: [5, 4, 6, 3, 4, 3, 3, 2, 3, 2],
  },
  {
    label: 'Deployments',
    value: '28',
    change: '5 today',
    trend: 'up' as const,
    icon: Rocket,
    gradient: 'linear-gradient(135deg, rgba(168,85,247,0.1), rgba(168,85,247,0.02))',
    iconBg: 'linear-gradient(135deg, #A855F7, #C084FC)',
    iconColor: '#A855F7',
    changeColor: '#C084FC',
    sparkData: [2, 4, 3, 5, 6, 4, 7, 5, 6, 5],
  },
];

// Mini sparkline component
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  return (
    <div className="sparkline" style={{ color }}>
      {data.map((val, i) => (
        <div
          key={i}
          className="sparkline-bar"
          style={{ height: `${(val / max) * 100}%` }}
        />
      ))}
    </div>
  );
}

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
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-[30px] font-extrabold text-white tracking-tight">
              Dashboard
            </h1>
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
              style={{ background: 'rgba(16, 185, 129, 0.08)', color: '#10B981' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 dot-live" />
              Live
            </div>
          </div>
          <p className="text-sm text-slate-400 font-medium">
            Real-time overview of your CI/CD infrastructure
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Calendar size={13} />
            <span>Today, {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
          </div>
          <div className="section-line w-px h-6" />
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold glass-card-flat"
            style={{ color: '#10B981', borderColor: 'rgba(16, 185, 129, 0.12)' }}
          >
            <Activity size={14} className="animate-pulse" />
            <span>All Systems Operational</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => (
          <div
            key={stat.label}
            className="relative glass-card p-5 rounded-2xl group animate-fade-in"
            style={{
              background: stat.gradient,
              animationDelay: `${idx * 80}ms`,
            }}
          >
            {/* Hover glow */}
            <div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 30% 20%, ${stat.iconColor}0A, transparent 70%)`,
              }}
            />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: stat.iconBg,
                    boxShadow: `0 4px 20px ${stat.iconColor}35`,
                  }}
                >
                  <stat.icon size={18} className="text-white" />
                </div>
                <Sparkline data={stat.sparkData} color={stat.iconColor} />
              </div>

              <p
                className="text-[28px] font-extrabold text-white stat-value animate-count-up leading-tight"
                style={{ animationDelay: `${idx * 100 + 200}ms` }}
              >
                {stat.value}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5 font-semibold tracking-wide">{stat.label}</p>

              <div className="flex items-center gap-1.5 mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                {stat.trend === 'up' ? (
                  <TrendingUp size={12} style={{ color: stat.changeColor }} />
                ) : (
                  <TrendingDown size={12} style={{ color: stat.changeColor }} />
                )}
                <span className="text-[11px] font-bold" style={{ color: stat.changeColor }}>
                  {stat.change}
                </span>
                <span className="text-[10px] text-slate-600 ml-auto font-medium">vs last week</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Recent Runs + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Runs — 2 col */}
        <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(255, 107, 43, 0.1)' }}
              >
                <Zap size={16} style={{ color: '#FF6B2B' }} />
              </div>
              <div>
                <h2 className="text-[14px] font-bold text-white">Recent Pipeline Runs</h2>
                <p className="text-[10px] text-slate-500 font-medium">Last 5 pipeline executions</p>
              </div>
            </div>
            <button className="text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all hover:bg-white/[0.03]" style={{ color: '#FF6B2B' }}>
              View All →
            </button>
          </div>

          <div>
            {mockRuns.map((run, idx) => (
              <div
                key={run.id}
                className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/[0.02] transition-all duration-200 cursor-pointer animate-fade-in group"
                style={{
                  animationDelay: `${idx * 50 + 350}ms`,
                  borderBottom: idx < mockRuns.length - 1 ? '1px solid rgba(255,255,255,0.025)' : 'none',
                }}
              >
                {/* Status Icon */}
                <div className="shrink-0">
                  {run.status === 'success' && (
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                      <CheckCircle2 size={15} className="text-emerald-400" />
                    </div>
                  )}
                  {run.status === 'failed' && (
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                      <XCircle size={15} className="text-red-400" />
                    </div>
                  )}
                  {run.status === 'running' && (
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                      <div className="w-3.5 h-3.5 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[13px] font-semibold text-white truncate">
                      {run.commit_message}
                    </span>
                    <StatusBadge status={run.status} size="sm" />
                  </div>
                  <div className="flex items-center gap-2.5 text-[11px] text-slate-500 font-mono">
                    <span className="flex items-center gap-1">
                      <GitBranch size={10} />
                      {run.trigger_ref}
                    </span>
                    <span>#{run.run_number}</span>
                    <span>{run.commit_sha.substring(0, 7)}</span>
                    <span className="text-slate-400 font-sans text-[11px]">{run.commit_author}</span>
                  </div>
                </div>

                {/* Duration & Time */}
                <div className="text-right shrink-0">
                  <p className="text-[12px] text-slate-300 font-semibold font-mono">
                    {run.duration_ms > 0 ? formatDuration(run.duration_ms) : '—'}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{timeAgo(run.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column — Activity Feed & Quick Actions */}
        <div className="space-y-5">
          {/* Activity Summary Card */}
          <div className="glass-card rounded-2xl p-5 animate-fade-in" style={{ animationDelay: '350ms' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 size={15} style={{ color: '#3B82F6' }} />
                <h3 className="text-[13px] font-bold text-white">Weekly Activity</h3>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Last 7 days</span>
            </div>

            {/* Mini chart visualization */}
            <div className="flex items-end gap-1.5 h-20 mb-4">
              {[65, 45, 80, 55, 90, 70, 85].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <div
                    className="w-full rounded-md transition-all duration-300 hover:opacity-100"
                    style={{
                      height: `${h}%`,
                      background: i === 6
                        ? 'linear-gradient(180deg, #FF6B2B, rgba(255,107,43,0.3))'
                        : 'linear-gradient(180deg, rgba(59,130,246,0.5), rgba(59,130,246,0.15))',
                      opacity: i === 6 ? 1 : 0.6,
                      boxShadow: i === 6 ? '0 0 8px rgba(255,107,43,0.2)' : 'none',
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[9px] text-slate-600 font-semibold uppercase tracking-wider">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2.5">
            {[
              { label: 'New Project', desc: 'Connect a repository', icon: Plus, color: '#FF6B2B' },
              { label: 'Create Pipeline', desc: 'Define a CI/CD workflow', icon: GitBranch, color: '#3B82F6' },
              { label: 'Add Runner', desc: 'Self-hosted runner', icon: Server, color: '#10B981' },
            ].map((action, idx) => (
              <button
                key={action.label}
                className="w-full glass-card-flat p-4 rounded-xl text-left flex items-center gap-3.5 group animate-fade-in"
                style={{ animationDelay: `${idx * 60 + 450}ms` }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${action.color}12` }}
                >
                  <action.icon size={16} style={{ color: action.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-white">{action.label}</p>
                  <p className="text-[10px] text-slate-500 font-medium">{action.desc}</p>
                </div>
                <ArrowUpRight
                  size={14}
                  className="text-slate-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
