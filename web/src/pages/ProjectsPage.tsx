import { Boxes, GitBranch, MoreHorizontal, Plus, ExternalLink, Star, Clock, CheckCircle2, Activity } from 'lucide-react';

const projects = [
  {
    id: '1', name: 'SwadeshiOps Web', slug: 'swadeshiops-web',
    description: 'React frontend dashboard with glassmorphic UI, real-time log streaming, and CI/CD integration',
    repo_provider: 'github', branch: 'main', pipelines: 3, lastActivity: '5 min ago',
    stars: 24, language: 'TypeScript', languageColor: '#3178C6',
    health: 94, lastStatus: 'success' as const,
  },
  {
    id: '2', name: 'SwadeshiOps API', slug: 'swadeshiops-api',
    description: 'Go backend API with PostgreSQL, Redis caching, JWT auth, and webhook handlers',
    repo_provider: 'github', branch: 'main', pipelines: 2, lastActivity: '1 hour ago',
    stars: 18, language: 'Go', languageColor: '#00ADD8',
    health: 97, lastStatus: 'success' as const,
  },
  {
    id: '3', name: 'E-Commerce Store', slug: 'ecommerce-store',
    description: 'Full-stack Next.js e-commerce with Stripe payments, inventory, and order management',
    repo_provider: 'gitlab', branch: 'develop', pipelines: 4, lastActivity: '3 hours ago',
    stars: 42, language: 'JavaScript', languageColor: '#F7DF1E',
    health: 88, lastStatus: 'failed' as const,
  },
  {
    id: '4', name: 'Mobile App', slug: 'mobile-app',
    description: 'React Native cross-platform mobile app with offline-first architecture',
    repo_provider: 'github', branch: 'main', pipelines: 1, lastActivity: '1 day ago',
    stars: 8, language: 'TypeScript', languageColor: '#3178C6',
    health: 100, lastStatus: 'success' as const,
  },
];

const providerConfig: Record<string, { color: string; label: string }> = {
  github: { color: '#8B5CF6', label: 'GitHub' },
  gitlab: { color: '#FC6D26', label: 'GitLab' },
  gitea: { color: '#609926', label: 'Gitea' },
};

function getHealthColor(h: number) {
  if (h >= 95) return '#10B981';
  if (h >= 90) return '#F59E0B';
  return '#EF4444';
}

export default function ProjectsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-[30px] font-extrabold text-white tracking-tight">Projects</h1>
          <p className="text-sm text-slate-400 mt-1 font-medium">
            Manage connected repositories and CI/CD workflows
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2 text-sm">
            <ExternalLink size={14} />
            Import
          </button>
          <button className="btn-primary flex items-center gap-2 text-sm">
            <Plus size={16} />
            New Project
          </button>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="flex items-center gap-6 animate-fade-in" style={{ animationDelay: '80ms' }}>
        {[
          { label: 'Total', value: projects.length, color: '#FF6B2B' },
          { label: 'Healthy', value: projects.filter(p => p.health >= 95).length, color: '#10B981' },
          { label: 'Needs Attention', value: projects.filter(p => p.health < 90).length, color: '#EF4444' },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full" style={{ background: s.color, boxShadow: `0 0 6px ${s.color}40` }} />
            <span className="text-slate-400 font-medium">{s.label}</span>
            <span className="text-white font-bold">{s.value}</span>
          </div>
        ))}
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {projects.map((p, i) => (
          <div
            key={p.id}
            className="glass-card rounded-2xl p-6 group cursor-pointer animate-fade-in"
            style={{ animationDelay: `${i * 80 + 100}ms` }}
          >
            {/* Top Row */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,107,43,0.14), rgba(255,107,43,0.04))',
                  }}
                >
                  <Boxes size={20} style={{ color: '#FF6B2B' }} />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-white group-hover:text-slate-50 transition-colors">{p.name}</h3>
                  <p className="text-[10px] text-slate-500 font-mono font-medium">{p.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {/* Health ring */}
                <div
                  className="progress-ring"
                  style={{
                    '--size': '32px',
                    '--stroke': '2.5px',
                    '--progress': p.health,
                    '--color': getHealthColor(p.health),
                  } as React.CSSProperties}
                >
                  <span className="text-[8px] font-bold" style={{ color: getHealthColor(p.health) }}>{p.health}</span>
                </div>
                <button className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-white/[0.05] transition-all">
                  <MoreHorizontal size={16} className="text-slate-400" />
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="text-[12px] text-slate-400 mb-4 leading-relaxed line-clamp-2">{p.description}</p>

            {/* Language + Last pipeline */}
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.languageColor }} />
                {p.language}
              </span>
              <span className="flex items-center gap-1 text-[11px]" style={{ color: p.lastStatus === 'success' ? '#10B981' : '#EF4444' }}>
                {p.lastStatus === 'success' ? <CheckCircle2 size={11} /> : <Activity size={11} />}
                Last pipeline: {p.lastStatus}
              </span>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              <div className="flex items-center gap-3.5 text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: providerConfig[p.repo_provider]?.color, boxShadow: `0 0 6px ${providerConfig[p.repo_provider]?.color}40` }}
                  />
                  <span className="font-medium">{providerConfig[p.repo_provider]?.label}</span>
                </span>
                <span className="flex items-center gap-1 font-mono text-[10px]">
                  <GitBranch size={11} />
                  {p.branch}
                </span>
                <span className="flex items-center gap-1">
                  <Star size={10} />
                  {p.stars}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-600 font-medium">
                <Clock size={10} />
                {p.lastActivity}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
