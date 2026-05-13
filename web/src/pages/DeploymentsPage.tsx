import { Rocket, Clock, RotateCcw } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

const deployments = [
  { id: '1', project: 'SwadeshiOps Web', env: 'production', status: 'success' as const, commitSha: 'a1b2c3d', deployedBy: 'Shiv Jani', time: '5 min ago', duration: '45s' },
  { id: '2', project: 'SwadeshiOps API', env: 'staging', status: 'deploying' as const, commitSha: 'b2c3d4e', deployedBy: 'Priya Sharma', time: 'now', duration: '—' },
  { id: '3', project: 'E-Commerce Store', env: 'production', status: 'failed' as const, commitSha: 'c3d4e5f', deployedBy: 'Raj Patel', time: '1 hour ago', duration: '1m 12s' },
  { id: '4', project: 'Mobile App', env: 'staging', status: 'success' as const, commitSha: 'd4e5f6g', deployedBy: 'Ananya Gupta', time: '3 hours ago', duration: '52s' },
];

export default function DeploymentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Deployments</h1><p className="text-sm text-slate-400 mt-1">Track all deployment activity</p></div>
      </div>
      <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
          {deployments.map((d, i) => (
            <div key={d.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
              <Rocket size={18} className="text-slate-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-medium text-white">{d.project}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium" style={{ background: d.env === 'production' ? 'rgba(239,68,68,0.1)' : 'rgba(59,130,246,0.1)', color: d.env === 'production' ? '#EF4444' : '#3B82F6' }}>{d.env}</span>
                  <StatusBadge status={d.status} size="sm" />
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>{d.commitSha}</span><span>{d.deployedBy}</span><span className="flex items-center gap-1"><Clock size={11} />{d.duration}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[11px] text-slate-500">{d.time}</p>
                {d.status === 'failed' && <button className="flex items-center gap-1 text-[10px] mt-1" style={{ color: '#FF6B2B' }}><RotateCcw size={10} />Rollback</button>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
