import { Clock, RotateCcw, Globe, Server, Filter, ArrowUpRight, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { useState } from 'react';

const deployments = [
  { id: '1', project: 'SwadeshiOps Web', env: 'production', status: 'success' as const, commitSha: 'a1b2c3d', deployedBy: 'Shiv Jani', time: '5 min ago', duration: '45s', version: 'v2.4.1', service: 'Frontend' },
  { id: '2', project: 'SwadeshiOps API', env: 'staging', status: 'deploying' as const, commitSha: 'b2c3d4e', deployedBy: 'Priya Sharma', time: 'now', duration: '—', version: 'v3.1.0-rc', service: 'Backend' },
  { id: '3', project: 'E-Commerce Store', env: 'production', status: 'failed' as const, commitSha: 'c3d4e5f', deployedBy: 'Raj Patel', time: '1 hour ago', duration: '1m 12s', version: 'v1.8.3', service: 'Fullstack' },
  { id: '4', project: 'Mobile App', env: 'staging', status: 'success' as const, commitSha: 'd4e5f6g', deployedBy: 'Ananya Gupta', time: '3 hours ago', duration: '52s', version: 'v0.9.2', service: 'Mobile' },
  { id: '5', project: 'SwadeshiOps Web', env: 'production', status: 'success' as const, commitSha: 'e5f6g7h', deployedBy: 'Shiv Jani', time: '6 hours ago', duration: '38s', version: 'v2.4.0', service: 'Frontend' },
];

const envConfig: Record<string, { icon: typeof Globe; color: string; bg: string }> = {
  production: { icon: Globe, color: '#EF4444', bg: 'rgba(239,68,68,0.08)' },
  staging: { icon: Server, color: '#3B82F6', bg: 'rgba(59,130,246,0.08)' },
};

function StatusIcon({ status }: { status: string }) {
  if (status === 'success') return <CheckCircle2 size={16} className="text-emerald-400" />;
  if (status === 'failed') return <XCircle size={16} className="text-red-400" />;
  return <Loader2 size={16} className="text-blue-400 animate-spin" />;
}

export default function DeploymentsPage() {
  const [envFilter, setEnvFilter] = useState<string>('all');

  const filtered = envFilter === 'all' ? deployments : deployments.filter(d => d.env === envFilter);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-[30px] font-extrabold text-white tracking-tight">Deployments</h1>
          <p className="text-sm text-slate-400 mt-1 font-medium">Track deployment activity across all environments</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Summary badges */}
          <div className="flex items-center gap-4 text-[11px] font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Globe size={12} />
              3 Prod
            </span>
            <span className="flex items-center gap-1.5 text-blue-400">
              <Server size={12} />
              2 Staging
            </span>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: '80ms' }}>
        <Filter size={13} className="text-slate-500" />
        {['all', 'production', 'staging'].map(env => (
          <button
            key={env}
            onClick={() => setEnvFilter(env)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold capitalize transition-all ${
              envFilter === env ? 'text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]'
            }`}
            style={envFilter === env ? { background: 'rgba(255,107,43,0.1)', border: '1px solid rgba(255,107,43,0.15)' } : { border: '1px solid transparent' }}
          >
            {env}
          </button>
        ))}
      </div>

      {/* Deployment List */}
      <div className="glass-card rounded-2xl overflow-hidden animate-fade-in" style={{ animationDelay: '150ms' }}>
        {filtered.map((d, i) => (
          <div
            key={d.id}
            className="flex items-center gap-5 px-6 py-5 hover:bg-white/[0.02] transition-all duration-200 animate-fade-in group"
            style={{
              animationDelay: `${i * 50 + 200}ms`,
              borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
            }}
          >
            {/* Status Icon */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: d.status === 'success' ? 'rgba(16,185,129,0.08)' : d.status === 'failed' ? 'rgba(239,68,68,0.08)' : 'rgba(59,130,246,0.08)' }}
            >
              <StatusIcon status={d.status} />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 mb-1">
                <span className="text-[13px] font-bold text-white">{d.project}</span>
                <span
                  className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider"
                  style={{ background: envConfig[d.env]?.bg, color: envConfig[d.env]?.color, letterSpacing: '0.06em' }}
                >
                  {d.env}
                </span>
                <StatusBadge status={d.status} size="sm" />
              </div>
              <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono">
                <span>{d.commitSha}</span>
                <span className="text-slate-400 font-sans">{d.deployedBy}</span>
                <span className="flex items-center gap-1">
                  <Clock size={10} />
                  {d.duration}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold" style={{ background: 'rgba(255,255,255,0.03)', color: '#94a3b8' }}>
                  {d.service}
                </span>
              </div>
            </div>

            {/* Right */}
            <div className="shrink-0 flex items-center gap-3">
              <div className="text-right">
                <p className="text-[11px] text-slate-400 font-medium">{d.time}</p>
                <p className="text-[10px] text-slate-600 font-mono">{d.version}</p>
              </div>
              {d.status === 'failed' && (
                <button className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all hover:bg-white/[0.03]" style={{ color: '#FF6B2B' }}>
                  <RotateCcw size={11} />
                  Rollback
                </button>
              )}
              <ArrowUpRight size={14} className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
