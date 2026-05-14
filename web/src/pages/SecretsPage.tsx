import { Plus, Eye, EyeOff, Clock, Copy, Trash2, Lock, ShieldAlert, Search, Filter } from 'lucide-react';
import { useState } from 'react';

const secrets = [
  { id: '1', key: 'DATABASE_URL', scope: 'production', masked: '••••••••••@db.swadeshi.dev:5432/main', updatedAt: '2 hours ago', updatedBy: 'Shiv Jani', type: 'connection' },
  { id: '2', key: 'JWT_SECRET', scope: 'global', masked: '••••••••••', updatedAt: '3 days ago', updatedBy: 'Priya Sharma', type: 'auth' },
  { id: '3', key: 'REDIS_URL', scope: 'production', masked: '••••••••••:6379', updatedAt: '1 week ago', updatedBy: 'Shiv Jani', type: 'connection' },
  { id: '4', key: 'STRIPE_SECRET_KEY', scope: 'staging', masked: 'sk_test_••••••••', updatedAt: '5 days ago', updatedBy: 'Raj Patel', type: 'payment' },
  { id: '5', key: 'SENTRY_DSN', scope: 'global', masked: 'https://••••@sentry.io/123', updatedAt: '2 weeks ago', updatedBy: 'Ananya Gupta', type: 'monitoring' },
  { id: '6', key: 'GH_TOKEN', scope: 'staging', masked: 'ghp_••••••••••••', updatedAt: '1 day ago', updatedBy: 'Shiv Jani', type: 'auth' },
];

const scopeConfig: Record<string, { color: string; bg: string }> = {
  production: { color: '#EF4444', bg: 'rgba(239,68,68,0.08)' },
  staging: { color: '#3B82F6', bg: 'rgba(59,130,246,0.08)' },
  global: { color: '#A855F7', bg: 'rgba(168,85,247,0.08)' },
};

export default function SecretsPage() {
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [scopeFilter, setScopeFilter] = useState('all');

  const toggleReveal = (id: string) => {
    setRevealedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = secrets
    .filter(s => scopeFilter === 'all' || s.scope === scopeFilter)
    .filter(s => s.key.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-[30px] font-extrabold text-white tracking-tight">Secrets</h1>
          <p className="text-sm text-slate-400 mt-1 font-medium">Manage encrypted environment variables and credentials</p>
        </div>
        <button className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} />
          Add Secret
        </button>
      </div>

      {/* Security Notice */}
      <div
        className="glass-card-flat rounded-2xl p-4 flex items-center gap-4 animate-fade-in"
        style={{ animationDelay: '80ms', borderColor: 'rgba(255,107,43,0.1)' }}
      >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(255,107,43,0.08)' }}>
          <ShieldAlert size={18} style={{ color: '#FF6B2B' }} />
        </div>
        <div className="flex-1">
          <p className="text-[12px] font-bold text-white">End-to-end encrypted</p>
          <p className="text-[10px] text-slate-400 mt-0.5 font-medium">All secrets are encrypted at rest with AES-256-GCM. Values are never exposed in logs or API responses.</p>
        </div>
        <Lock size={14} className="text-slate-600 shrink-0" />
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: '120ms' }}>
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search secrets..."
            className="w-full glass-input rounded-xl pl-9 pr-4 py-2.5 text-[12px] font-medium"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <Filter size={13} className="text-slate-500" />
          {['all', 'production', 'staging', 'global'].map(scope => (
            <button
              key={scope}
              onClick={() => setScopeFilter(scope)}
              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold capitalize transition-all ${
                scopeFilter === scope ? 'text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
              style={scopeFilter === scope ? { background: 'rgba(255,107,43,0.1)' } : {}}
            >
              {scope}
            </button>
          ))}
        </div>
      </div>

      {/* Secrets Table */}
      <div className="glass-card rounded-2xl overflow-hidden animate-fade-in" style={{ animationDelay: '160ms' }}>
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 text-[9px] font-bold text-slate-500 uppercase tracking-[0.1em]" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <span className="col-span-3">Key</span>
          <span className="col-span-3">Value</span>
          <span className="col-span-1">Scope</span>
          <span className="col-span-2">Updated</span>
          <span className="col-span-2">By</span>
          <span className="col-span-1 text-right">Actions</span>
        </div>

        {/* Rows */}
        {filtered.map((secret, i) => (
          <div
            key={secret.id}
            className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/[0.015] transition-all duration-200 animate-fade-in group"
            style={{
              animationDelay: `${i * 40 + 200}ms`,
              borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.025)' : 'none',
            }}
          >
            {/* Key */}
            <div className="col-span-3 flex items-center gap-2">
              <Lock size={12} className="text-slate-600 shrink-0" />
              <span className="text-[12px] font-bold text-white font-mono truncate">{secret.key}</span>
            </div>

            {/* Value */}
            <div className="col-span-3">
              <span className="text-[11px] text-slate-500 font-mono truncate block">
                {revealedIds.has(secret.id) ? secret.masked.replace(/•/g, '*') : secret.masked}
              </span>
            </div>

            {/* Scope */}
            <div className="col-span-1">
              <span
                className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider"
                style={{ background: scopeConfig[secret.scope]?.bg, color: scopeConfig[secret.scope]?.color }}
              >
                {secret.scope}
              </span>
            </div>

            {/* Updated */}
            <div className="col-span-2 flex items-center gap-1 text-[10px] text-slate-500 font-medium">
              <Clock size={10} />
              {secret.updatedAt}
            </div>

            {/* By */}
            <div className="col-span-2 text-[11px] text-slate-400 font-medium truncate">{secret.updatedBy}</div>

            {/* Actions */}
            <div className="col-span-1 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => toggleReveal(secret.id)} className="p-1.5 rounded-lg hover:bg-white/[0.05] transition-colors" title="Toggle visibility">
                {revealedIds.has(secret.id) ? <EyeOff size={13} className="text-slate-400" /> : <Eye size={13} className="text-slate-400" />}
              </button>
              <button className="p-1.5 rounded-lg hover:bg-white/[0.05] transition-colors" title="Copy">
                <Copy size={13} className="text-slate-400" />
              </button>
              <button className="p-1.5 rounded-lg hover:bg-white/[0.05] transition-colors" title="Delete">
                <Trash2 size={13} className="text-red-400/50 hover:text-red-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
