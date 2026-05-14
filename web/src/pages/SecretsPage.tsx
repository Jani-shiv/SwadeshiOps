import { Eye, Trash2, Plus, Lock, AlertTriangle } from 'lucide-react';

const secrets = [
  { id: '1', name: 'DATABASE_URL', description: 'PostgreSQL connection string', env: 'all', updatedAt: '2 days ago' },
  { id: '2', name: 'JWT_SECRET', description: 'JWT signing key', env: 'production', updatedAt: '1 week ago' },
  { id: '3', name: 'DEPLOY_HOST', description: 'Production server hostname', env: 'production', updatedAt: '3 days ago' },
  { id: '4', name: 'TELEGRAM_BOT_TOKEN', description: 'Telegram notification bot', env: 'all', updatedAt: '5 days ago' },
  { id: '5', name: 'DOCKER_REGISTRY_TOKEN', description: 'Container registry auth', env: 'all', updatedAt: '1 week ago' },
];

export default function SecretsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-[28px] font-extrabold text-white tracking-tight">Secrets & Variables</h1>
          <p className="text-sm text-slate-400 mt-1 font-medium">Encrypted environment variables for your pipelines</p>
        </div>
        <button className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} />
          Add Secret
        </button>
      </div>

      {/* Secrets Table */}
      <div className="glass-card rounded-2xl overflow-hidden animate-fade-in" style={{ animationDelay: '100ms' }}>
        {/* Table Header */}
        <div
          className="grid grid-cols-[1fr_auto_auto_auto] gap-6 px-6 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.08em]"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
        >
          <span>Name</span>
          <span>Scope</span>
          <span>Updated</span>
          <span>Actions</span>
        </div>

        {/* Secret Rows */}
        {secrets.map((s, i) => (
          <div
            key={s.id}
            className="grid grid-cols-[1fr_auto_auto_auto] gap-6 items-center px-6 py-4.5 hover:bg-white/[0.015] transition-all duration-200 animate-fade-in group"
            style={{
              borderBottom: i < secrets.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
              animationDelay: `${i * 50 + 150}ms`,
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'rgba(245, 158, 11, 0.08)' }}
              >
                <Lock size={14} style={{ color: '#F59E0B' }} />
              </div>
              <div>
                <span className="text-[13px] font-mono font-bold text-white">{s.name}</span>
                <p className="text-[11px] text-slate-500 mt-0.5">{s.description}</p>
              </div>
            </div>

            <span
              className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider"
              style={{
                background: s.env === 'production' ? 'rgba(239,68,68,0.08)' : 'rgba(59,130,246,0.08)',
                color: s.env === 'production' ? '#EF4444' : '#3B82F6',
              }}
            >
              {s.env}
            </span>

            <span className="text-[11px] text-slate-500 font-medium">{s.updatedAt}</span>

            <div className="flex items-center gap-1">
              <button className="p-2 rounded-lg hover:bg-white/[0.04] transition-colors">
                <Eye size={14} className="text-slate-500 hover:text-slate-300 transition-colors" />
              </button>
              <button className="p-2 rounded-lg hover:bg-white/[0.04] transition-colors">
                <Trash2 size={14} className="text-slate-500 hover:text-red-400 transition-colors" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Security Note */}
      <div
        className="flex items-start gap-3 p-5 rounded-2xl animate-fade-in"
        style={{
          animationDelay: '400ms',
          background: 'rgba(245,158,11,0.04)',
          border: '1px solid rgba(245,158,11,0.08)',
        }}
      >
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'rgba(245,158,11,0.1)' }}>
          <AlertTriangle size={15} style={{ color: '#F59E0B' }} />
        </div>
        <div>
          <p className="text-xs font-bold text-amber-200/80 mb-0.5">End-to-end encryption</p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            All secrets are encrypted with AES-256-GCM at rest. Values are never logged, exposed in pipeline outputs, or stored in plaintext.
          </p>
        </div>
      </div>
    </div>
  );
}
