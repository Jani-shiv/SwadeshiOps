import { GitBranch, ExternalLink, Clock, Play, MoreHorizontal, Plus, Zap, CheckCircle2, XCircle, Loader2, Filter } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { useState } from 'react';

const pipelines = [
  {
    id: '1', name: 'Node.js App CI/CD', project: 'swadeshiops-web', branch: 'main',
    lastRun: { status: 'success' as const, number: 42, duration: '2m 30s', time: '5 min ago' },
    totalRuns: 156, successRate: 94,
    steps: [
      { name: 'Install', status: 'success', duration: '7.1s' },
      { name: 'Lint', status: 'success', duration: '4.2s' },
      { name: 'Test', status: 'success', duration: '2.7s' },
      { name: 'Build', status: 'success', duration: '3.1s' },
      { name: 'Deploy', status: 'success', duration: '45s' },
    ],
  },
  {
    id: '2', name: 'API Backend Pipeline', project: 'swadeshiops-api', branch: 'main',
    lastRun: { status: 'running' as const, number: 87, duration: '—', time: 'now' },
    totalRuns: 312, successRate: 97,
    steps: [
      { name: 'Build', status: 'success', duration: '12s' },
      { name: 'Test', status: 'success', duration: '8s' },
      { name: 'Lint', status: 'running', duration: '—' },
      { name: 'Docker', status: 'pending', duration: '—' },
      { name: 'Deploy', status: 'pending', duration: '—' },
    ],
  },
  {
    id: '3', name: 'Mobile App Build', project: 'swadeshiops-mobile', branch: 'develop',
    lastRun: { status: 'failed' as const, number: 23, duration: '1m 45s', time: '1 hour ago' },
    totalRuns: 78, successRate: 88,
    steps: [
      { name: 'Install', status: 'success', duration: '15s' },
      { name: 'Test', status: 'failed', duration: '32s' },
      { name: 'Build', status: 'skipped', duration: '—' },
    ],
  },
  {
    id: '4', name: 'Docker Image Build', project: 'swadeshiops-infra', branch: 'main',
    lastRun: { status: 'success' as const, number: 64, duration: '4m 12s', time: '3 hours ago' },
    totalRuns: 201, successRate: 96,
    steps: [
      { name: 'Build', status: 'success', duration: '3m' },
      { name: 'Push', status: 'success', duration: '45s' },
      { name: 'Scan', status: 'success', duration: '27s' },
    ],
  },
];

function getSuccessColor(rate: number) {
  if (rate >= 95) return '#10B981';
  if (rate >= 90) return '#F59E0B';
  return '#EF4444';
}

function StepDot({ status }: { status: string }) {
  if (status === 'success') return <CheckCircle2 size={11} className="text-emerald-400" />;
  if (status === 'failed') return <XCircle size={11} className="text-red-400" />;
  if (status === 'running') return <Loader2 size={11} className="text-blue-400 animate-spin" />;
  return <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }} />;
}

export default function PipelinesPage() {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filteredPipelines = activeFilter === 'all'
    ? pipelines
    : pipelines.filter(p => p.lastRun.status === activeFilter);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-[30px] font-extrabold text-white tracking-tight">Pipelines</h1>
          <p className="text-sm text-slate-400 mt-1 font-medium">
            Manage and monitor your CI/CD pipelines
          </p>
        </div>
        <button className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} />
          New Pipeline
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: '80ms' }}>
        <Filter size={13} className="text-slate-500" />
        {[
          { key: 'all', label: 'All', count: pipelines.length },
          { key: 'running', label: 'Running', count: pipelines.filter(p => p.lastRun.status === 'running').length },
          { key: 'success', label: 'Passed', count: pipelines.filter(p => p.lastRun.status === 'success').length },
          { key: 'failed', label: 'Failed', count: pipelines.filter(p => p.lastRun.status === 'failed').length },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
              activeFilter === tab.key
                ? 'text-white'
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]'
            }`}
            style={activeFilter === tab.key ? {
              background: 'rgba(255,107,43,0.1)',
              border: '1px solid rgba(255,107,43,0.15)',
            } : { border: '1px solid transparent' }}
          >
            {tab.label}
            <span
              className="ml-1.5 px-1.5 py-0.5 rounded-md text-[9px] font-bold"
              style={{
                background: activeFilter === tab.key ? 'rgba(255,107,43,0.15)' : 'rgba(255,255,255,0.04)',
                color: activeFilter === tab.key ? '#FF8F5E' : 'inherit',
              }}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Pipeline Cards */}
      <div className="space-y-4">
        {filteredPipelines.map((pipeline, idx) => (
          <div
            key={pipeline.id}
            className="glass-card rounded-2xl p-5 group animate-fade-in cursor-pointer"
            style={{ animationDelay: `${idx * 80 + 120}ms` }}
          >
            <div className="flex items-center gap-5">
              {/* Pipeline Icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                style={{ background: 'rgba(255, 107, 43, 0.08)' }}
              >
                <Zap size={18} style={{ color: '#FF6B2B' }} />
              </div>

              {/* Pipeline Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-[14px] font-bold text-white">{pipeline.name}</h3>
                  <StatusBadge status={pipeline.lastRun.status} size="sm" />
                </div>
                <div className="flex items-center gap-3.5 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5 font-medium">
                    <ExternalLink size={11} className="text-slate-500" />
                    {pipeline.project}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-[10px]">
                    <GitBranch size={11} className="text-slate-500" />
                    {pipeline.branch}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-[10px]">
                    <Clock size={11} className="text-slate-500" />
                    {pipeline.lastRun.duration}
                  </span>
                  <span className="font-mono text-[10px]">Run #{pipeline.lastRun.number}</span>
                  <span className="text-slate-500">{pipeline.lastRun.time}</span>
                </div>

                {/* Step Progress Timeline */}
                <div className="flex items-center gap-1.5 mt-3">
                  {pipeline.steps.map((step, si) => (
                    <div key={si} className="flex items-center gap-1.5">
                      <div className="flex items-center gap-1" data-tooltip={`${step.name}: ${step.duration}`}>
                        <StepDot status={step.status} />
                        <span className="text-[9px] font-semibold text-slate-500 hidden lg:inline">{step.name}</span>
                      </div>
                      {si < pipeline.steps.length - 1 && (
                        <div
                          className="w-5 h-px"
                          style={{
                            background: step.status === 'success'
                              ? 'rgba(16,185,129,0.3)'
                              : step.status === 'failed'
                                ? 'rgba(239,68,68,0.3)'
                                : 'rgba(255,255,255,0.06)',
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="hidden sm:flex items-center gap-6 shrink-0">
                <div className="text-center">
                  <p className="text-lg font-extrabold text-white stat-value">{pipeline.totalRuns}</p>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Runs</p>
                </div>
                <div className="text-center">
                  <div
                    className="progress-ring mx-auto"
                    style={{
                      '--size': '44px',
                      '--stroke': '3px',
                      '--progress': pipeline.successRate,
                      '--color': getSuccessColor(pipeline.successRate),
                    } as React.CSSProperties}
                  >
                    <span className="text-[10px] font-extrabold" style={{ color: getSuccessColor(pipeline.successRate) }}>
                      {pipeline.successRate}
                    </span>
                  </div>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-1">Rate</p>
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
