import { Rocket, Clock, RotateCcw, Globe, Server } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

const deployments = [
  { id: '1', project: 'SwadeshiOps Web', env: 'production', status: 'success' as const, commitSha: 'a1b2c3d', deployedBy: 'Shiv Jani', time: '5 min ago', duration: '45s', version: 'v2.4.1' },
  { id: '2', project: 'SwadeshiOps API', env: 'staging', status: 'deploying' as const, commitSha: 'b2c3d4e', deployedBy: 'Priya Sharma', time: 'now', duration: '—', version: 'v3.1.0-rc' },
  { id: '3', project: 'E-Commerce Store', env: 'production', status: 'failed' as const, commitSha: 'c3d4e5f', deployedBy: 'Raj Patel', time: '1 hour ago', duration: '1m 12s', version: 'v1.8.3' },
  { id: '4', project: 'Mobile App', env: 'staging', status: 'success' as const, commitSha: 'd4e5f6g', deployedBy: 'Ananya Gupta', time: '3 hours ago', duration: '52s', version: 'v0.9.2' },
];

const envConfig: Record<string, { icon: typeof Globe; color: string; bg: string }> = {
  production: { icon: Globe, color: '#EF4444', bg: 'rgba(239,68,68,0.08)' },
  staging: { icon: Server, color: '#3B82F6', bg: 'rgba(59,130,246,0.08)' },
};

export default function DeploymentsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-[28px] font-extrabold text-white tracking-tight">Deployments</h1>
          <p className="text-sm text-slate-400 mt-1 font-medium">Track all deployment activity across environments</p>
        </div>
      </div>

      {/* Deployment List */}
      <div className="glass-card rounded-2xl overflow-hidden animate-fade-in" style={{ animationDelay: '100ms' }}>
        {deployments.map((d, i) => (
          <div
            key={d.id}
            className="flex items-center gap-5 px-6 py-5 hover:bg-white/[0.015] transition-all duration-200 animate-fade-in group"
            style={{
              animationDelay: `${i * 60 + 150}ms`,
              borderBottom: i < deployments.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
            }}
          >
            {/* Icon */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: 'linear-gradient(135deg, rgba(168,85,247,0.12), rgba(168,85,247,0.04))',
              }}
            >
              <Rocket size={18} style={{ color: '#A855F7' }} />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 mb-1">
                <span className="text-sm font-bold text-white">{d.project}</span>
                <span
                  className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    background: envConfig[d.env]?.bg,
                    color: envConfig[d.env]?.color,
                    letterSpacing: '0.05em',
                  }}
                >
                  {d.env}
                </span>
                <StatusBadge status={d.status} size="sm" />
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="font-mono text-[11px]">{d.commitSha}</span>
                <span className="text-slate-400">{d.deployedBy}</span>
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <Clock size={11} />
                  {d.duration}
                </span>
                <span className="text-slate-600">{d.version}</span>
              </div>
            </div>

            {/* Right */}
            <div className="text-right shrink-0 flex items-center gap-3">
              <p className="text-[11px] text-slate-500 font-medium">{d.time}</p>
              {d.status === 'failed' && (
                <button
                  className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all hover:bg-white/[0.03]"
                  style={{ color: '#FF6B2B' }}
                >
                  <RotateCcw size={11} />
                  Rollback
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
