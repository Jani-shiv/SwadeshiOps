import { GitBranch, ExternalLink, Clock, Play, MoreHorizontal } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

const pipelines = [
  {
    id: '1',
    name: 'Node.js App CI/CD',
    project: 'swadeshiops-web',
    branch: 'main',
    lastRun: { status: 'success' as const, number: 42, duration: '2m 30s', time: '5 min ago' },
    totalRuns: 156,
    successRate: 94,
  },
  {
    id: '2',
    name: 'API Backend Pipeline',
    project: 'swadeshiops-api',
    branch: 'main',
    lastRun: { status: 'running' as const, number: 87, duration: '—', time: 'now' },
    totalRuns: 312,
    successRate: 97,
  },
  {
    id: '3',
    name: 'Mobile App Build',
    project: 'swadeshiops-mobile',
    branch: 'develop',
    lastRun: { status: 'failed' as const, number: 23, duration: '1m 45s', time: '1 hour ago' },
    totalRuns: 78,
    successRate: 88,
  },
  {
    id: '4',
    name: 'Docker Image Build',
    project: 'swadeshiops-infra',
    branch: 'main',
    lastRun: { status: 'success' as const, number: 64, duration: '4m 12s', time: '3 hours ago' },
    totalRuns: 201,
    successRate: 96,
  },
];

export default function PipelinesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Pipelines</h1>
          <p className="text-sm text-slate-400 mt-1">Manage and monitor your CI/CD pipelines</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:scale-[1.02]"
          style={{
            background: 'linear-gradient(135deg, #FF6B2B, #E55A1B)',
            boxShadow: '0 4px 15px rgba(255, 107, 43, 0.3)',
          }}
        >
          + New Pipeline
        </button>
      </div>

      {/* Pipeline Cards */}
      <div className="grid gap-4">
        {pipelines.map((pipeline, idx) => (
          <div
            key={pipeline.id}
            className="rounded-xl p-5 transition-all duration-300 hover:border-white/10 group animate-fade-in cursor-pointer"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              animationDelay: `${idx * 80}ms`,
            }}
          >
            <div className="flex items-center gap-4">
              {/* Pipeline Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-base font-semibold text-white">{pipeline.name}</h3>
                  <StatusBadge status={pipeline.lastRun.status} size="sm" />
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <ExternalLink size={12} />
                    {pipeline.project}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitBranch size={12} />
                    {pipeline.branch}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {pipeline.lastRun.duration}
                  </span>
                  <span>Run #{pipeline.lastRun.number}</span>
                  <span>{pipeline.lastRun.time}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="hidden sm:flex items-center gap-6 shrink-0">
                <div className="text-center">
                  <p className="text-lg font-bold text-white">{pipeline.totalRuns}</p>
                  <p className="text-[10px] text-slate-500">Total Runs</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold" style={{ color: pipeline.successRate >= 95 ? '#10B981' : pipeline.successRate >= 90 ? '#F59E0B' : '#EF4444' }}>
                    {pipeline.successRate}%
                  </p>
                  <p className="text-[10px] text-slate-500">Success</p>
                </div>

                {/* Success Rate Bar */}
                <div className="w-24">
                  <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${pipeline.successRate}%`,
                        background: pipeline.successRate >= 95 ? '#10B981' : pipeline.successRate >= 90 ? '#F59E0B' : '#EF4444',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  className="p-2 rounded-lg transition-all hover:bg-white/5"
                  title="Trigger Pipeline"
                >
                  <Play size={16} className="text-slate-400 hover:text-emerald-400" />
                </button>
                <button className="p-2 rounded-lg transition-all hover:bg-white/5">
                  <MoreHorizontal size={16} className="text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
