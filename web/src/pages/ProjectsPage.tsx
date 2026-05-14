import { Boxes, GitBranch, MoreHorizontal, Plus, ExternalLink, Star } from 'lucide-react';

const projects = [
  { id: '1', name: 'SwadeshiOps Web', slug: 'swadeshiops-web', description: 'React frontend dashboard with modern UI/UX', repo_provider: 'github', branch: 'main', pipelines: 3, lastActivity: '5 min ago', stars: 24 },
  { id: '2', name: 'SwadeshiOps API', slug: 'swadeshiops-api', description: 'Go backend API server with PostgreSQL', repo_provider: 'github', branch: 'main', pipelines: 2, lastActivity: '1 hour ago', stars: 18 },
  { id: '3', name: 'E-Commerce Store', slug: 'ecommerce-store', description: 'Full-stack Next.js e-commerce application', repo_provider: 'gitlab', branch: 'develop', pipelines: 4, lastActivity: '3 hours ago', stars: 42 },
  { id: '4', name: 'Mobile App', slug: 'mobile-app', description: 'React Native cross-platform mobile app', repo_provider: 'github', branch: 'main', pipelines: 1, lastActivity: '1 day ago', stars: 8 },
];

const providerConfig: Record<string, { color: string; label: string }> = {
  github: { color: '#8B5CF6', label: 'GitHub' },
  gitlab: { color: '#FC6D26', label: 'GitLab' },
  gitea: { color: '#609926', label: 'Gitea' },
};

export default function ProjectsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-[28px] font-extrabold text-white tracking-tight">Projects</h1>
          <p className="text-sm text-slate-400 mt-1 font-medium">Manage connected repositories and workflows</p>
        </div>
        <button className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} />
          New Project
        </button>
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {projects.map((p, i) => (
          <div
            key={p.id}
            className="glass-card rounded-2xl p-6 group cursor-pointer animate-fade-in"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,107,43,0.15), rgba(255,107,43,0.05))',
                  }}
                >
                  <Boxes size={20} style={{ color: '#FF6B2B' }} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-slate-100 transition-colors">{p.name}</h3>
                  <p className="text-[11px] text-slate-500 font-mono">{p.slug}</p>
                </div>
              </div>
              <button className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-white/[0.05] transition-all">
                <MoreHorizontal size={16} className="text-slate-400" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-5 leading-relaxed">{p.description}</p>

            {/* Meta info */}
            <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: providerConfig[p.repo_provider]?.color, boxShadow: `0 0 6px ${providerConfig[p.repo_provider]?.color}40` }}
                  />
                  <span className="font-medium">{providerConfig[p.repo_provider]?.label}</span>
                </span>
                <span className="flex items-center gap-1">
                  <GitBranch size={12} />
                  <span className="font-mono">{p.branch}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Star size={11} />
                  {p.stars}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-600 font-medium">{p.lastActivity}</span>
                <ExternalLink size={12} className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
