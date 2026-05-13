import { Shield, Eye, Trash2, Plus } from 'lucide-react';

const secrets = [
  { id: '1', name: 'DATABASE_URL', description: 'PostgreSQL connection string', env: 'all', updatedAt: '2 days ago' },
  { id: '2', name: 'JWT_SECRET', description: 'JWT signing key', env: 'production', updatedAt: '1 week ago' },
  { id: '3', name: 'DEPLOY_HOST', description: 'Production server hostname', env: 'production', updatedAt: '3 days ago' },
  { id: '4', name: 'TELEGRAM_BOT_TOKEN', description: 'Telegram notification bot', env: 'all', updatedAt: '5 days ago' },
  { id: '5', name: 'DOCKER_REGISTRY_TOKEN', description: 'Container registry auth', env: 'all', updatedAt: '1 week ago' },
];

export default function SecretsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Secrets & Variables</h1><p className="text-sm text-slate-400 mt-1">Encrypted environment variables for your pipelines</p></div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #FF6B2B, #E55A1B)' }}><Plus size={16} />Add Secret</button>
      </div>
      <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span>Name</span><span>Environment</span><span>Updated</span><span>Actions</span>
        </div>
        {secrets.map((s, i) => (
          <div key={s.id} className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-6 py-4 hover:bg-white/[0.02] animate-fade-in" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', animationDelay: `${i * 50}ms` }}>
            <div>
              <div className="flex items-center gap-2"><Shield size={14} className="text-amber-500" /><span className="text-sm font-mono font-medium text-white">{s.name}</span></div>
              <p className="text-xs text-slate-500 mt-0.5 ml-5">{s.description}</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium" style={{ background: s.env === 'production' ? 'rgba(239,68,68,0.1)' : 'rgba(59,130,246,0.1)', color: s.env === 'production' ? '#EF4444' : '#3B82F6' }}>{s.env}</span>
            <span className="text-xs text-slate-500">{s.updatedAt}</span>
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded hover:bg-white/5"><Eye size={14} className="text-slate-400" /></button>
              <button className="p-1.5 rounded hover:bg-white/5"><Trash2 size={14} className="text-slate-400 hover:text-red-400" /></button>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 rounded-xl text-xs text-slate-500" style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.1)' }}>
        🔐 All secrets are encrypted with AES-256-GCM at rest. Values are never logged or exposed in pipeline outputs.
      </div>
    </div>
  );
}
