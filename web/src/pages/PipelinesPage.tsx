import { GitBranch, ExternalLink, Clock, Play, MoreHorizontal, Plus, BarChart3, Zap } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

const pipelines = [
  {
    id: '1', name: 'Node.js App CI/CD', project: 'swadeshiops-web', branch: 'main',
    lastRun: { status: 'success' as const, number: 42, duration: '2m 30s', time: '5 min ago' },
    totalRuns: 156, successRate: 94,
  },
  {
    id: '2', name: 'API Backend Pipeline', project: 'swadeshiops-api', branch: 'main',
    lastRun: { status: 'running' as const, number: 87, duration: '—', time: 'now' },
    totalRuns: 312, successRate: 97,
  },
  {
    id: '3', name: 'Mobile App Build', project: 'swadeshiops-mobile', branch: 'develop',
    lastRun: { status: 'failed' as const, number: 23, duration: '1m 45s', time: '1 hour ago' },
    totalRuns: 78, successRate: 88,
  },
  {
    id: '4', name: 'Docker Image Build', project: 'swadeshiops-infra', branch: 'main',
    lastRun: { status: 'success' as const, number: 64, duration: '4m 12s', time: '3 hours ago' },
    totalRuns: 201, successRate: 96,
  },
];

function getSuccessColor(rate: number) {
  if (rate >= 95) return '#10B981';
  if (rate >= 90) return '#F59E0B';
  return '#EF4444';
}

export default function PipelinesPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-[28px] font-extrabold text-white tracking-tight">Pipelines</h1>
          <p className="text-sm text-slate-400 mt-1 font-medium">Manage and monitor your CI/CD pipelines</p>
        </div>
        <button className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} />
          New Pipeline
        </button>
      </div>

      {/* Pipeline Cards */}
      <div className="space-y-4">
        {pipelines.map((pipeline, idx) => (
          <div
            key={pipeline.id}
            className="glass-card rounded-2xl p-6 group animate-fade-in cursor-pointer"
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            <div className="flex items-center gap-5">
              {/* Pipeline Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="flex items-center gap-2">
                    <Zap size={16} style={{ color: '#FF6B2B' }} />
                    <h3 className="text-[15px] font-bold text-white">{pipeline.name}</h3>
                  </div>
                  <StatusBadge status={pipeline.lastRun.status} size="sm" />
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 font-medium">
                    <ExternalLink size={12} className="text-slate-500" />
                    {pipeline.project}
                  </span>
                  <span className="flex items-center gap-1.5 font-mono text-[11px]">
                    <GitBranch size={12} className="text-slate-500" />
                    {pipeline.branch}
                  </span>
                  <span className="flex items-center gap-1.5 font-mono text-[11px]">
                    <Clock size={12} className="text-slate-500" />
                    {pipeline.lastRun.duration}
                  </span>
                  <span className="font-mono text-[11px]">Run #{pipeline.lastRun.number}</span>
                  <span className="text-slate-500">{pipeline.lastRun.time}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="hidden sm:flex items-center gap-8 shrink-0">
                <div className="text-center">
                  <p className="text-lg font-extrabold text-white stat-value">{pipeline.totalRuns}</p>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Runs</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-extrabold stat-value" style={{ color: getSuccessColor(pipeline.successRate) }}>
                    {pipeline.successRate}%
                  </p>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Success</p>
                </div>

                {/* Progress Bar */}
                <div className="w-28">
                  <div className="flex items-center justify-between mb-1.5">
                    <BarChart3 size={10} className="text-slate-600" />
                    <span className="text-[10px] font-mono text-slate-500">{pipeline.successRate}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${pipeline.successRate}%`,
                        background: `linear-gradient(90deg, ${getSuccessColor(pipeline.successRate)}, ${getSuccessColor(pipeline.successRate)}80)`,
                        boxShadow: `0 0 8px ${getSuccessColor(pipeline.successRate)}30`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  className="p-2.5 rounded-xl transition-all hover:bg-white/[0.05] group/btn"
                  title="Trigger Pipeline"
                >
                  <Play size={15} className="text-slate-500 group-hover/btn:text-emerald-400 transition-colors" />
                </button>
                <button className="p-2.5 rounded-xl transition-all hover:bg-white/[0.05]">
                  <MoreHorizontal size={15} className="text-slate-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
