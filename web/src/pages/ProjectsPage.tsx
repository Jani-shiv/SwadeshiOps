import { Boxes, GitBranch, MoreHorizontal } from 'lucide-react';

const projects = [
  { id: '1', name: 'SwadeshiOps Web', slug: 'swadeshiops-web', description: 'React frontend dashboard', repo_provider: 'github', branch: 'main', pipelines: 3, lastActivity: '5 min ago' },
  { id: '2', name: 'SwadeshiOps API', slug: 'swadeshiops-api', description: 'Go backend API server', repo_provider: 'github', branch: 'main', pipelines: 2, lastActivity: '1 hour ago' },
  { id: '3', name: 'E-Commerce Store', slug: 'ecommerce-store', description: 'Full-stack Next.js application', repo_provider: 'gitlab', branch: 'develop', pipelines: 4, lastActivity: '3 hours ago' },
  { id: '4', name: 'Mobile App', slug: 'mobile-app', description: 'React Native mobile app', repo_provider: 'github', branch: 'main', pipelines: 1, lastActivity: '1 day ago' },
];

const providerColors: Record<string, string> = { github: '#6e40c9', gitlab: '#FC6D26', gitea: '#609926' };

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-sm text-slate-400 mt-1">Manage connected repositories</p>
        </div>
        <button className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #FF6B2B, #E55A1B)' }}>+ New Project</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((p, i) => (
          <div key={p.id} className="rounded-xl p-5 hover:border-white/10 group cursor-pointer animate-fade-in" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', animationDelay: `${i * 80}ms` }}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,107,43,0.1)' }}><Boxes size={20} style={{ color: '#FF6B2B' }} /></div>
                <div><h3 className="text-sm font-semibold text-white">{p.name}</h3><p className="text-xs text-slate-500">{p.slug}</p></div>
              </div>
              <button className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-white/5"><MoreHorizontal size={16} className="text-slate-400" /></button>
            </div>
            <p className="text-xs text-slate-400 mb-4">{p.description}</p>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: providerColors[p.repo_provider] }} />{p.repo_provider}</span>
                <span className="flex items-center gap-1"><GitBranch size={12} />{p.branch}</span>
                <span>{p.pipelines} pipelines</span>
              </div>
              <span className="text-[11px] text-slate-600">{p.lastActivity}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
