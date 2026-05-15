import { ArrowUpRight, Boxes, Calendar, GitBranch, Globe, Plus, Search, Sparkles, Users } from 'lucide-react';
import type { Project } from '../types';

const projects: (Project & { health: 'healthy' | 'attention'; runs: number; members: number; summary: string; statusText: string })[] = [
  {
    id: '1',
    org_id: 'org-1',
    name: 'Payments Gateway',
    slug: 'payments-gateway',
    description: 'Core checkout and billing services for the storefront.',
    repo_url: 'github.com/swadeshiops/payments-gateway',
    repo_provider: 'github',
    repo_branch: 'main',
    is_active: true,
    created_at: '2026-04-01T10:00:00Z',
    updated_at: '2026-05-13T18:22:00Z',
    health: 'healthy',
    runs: 138,
    members: 5,
    summary: 'Stable on main with fast approvals and clean build history.',
    statusText: 'Healthy',
  },
  {
    id: '2',
    org_id: 'org-1',
    name: 'Developer Portal',
    slug: 'developer-portal',
    description: 'Internal dashboard for docs, onboarding, and support.',
    repo_url: 'github.com/swadeshiops/developer-portal',
    repo_provider: 'github',
    repo_branch: 'develop',
    is_active: true,
    created_at: '2026-04-15T09:20:00Z',
    updated_at: '2026-05-13T12:05:00Z',
    health: 'healthy',
    runs: 94,
    members: 4,
    summary: 'Monitored deployments and a steady release cadence.',
    statusText: 'Healthy',
  },
  {
    id: '3',
    org_id: 'org-1',
    name: 'Mobile API',
    slug: 'mobile-api',
    description: 'Public API serving mobile app sessions and sync.',
    repo_url: 'github.com/swadeshiops/mobile-api',
    repo_provider: 'gitlab',
    repo_branch: 'release',
    is_active: false,
    created_at: '2026-03-18T14:10:00Z',
    updated_at: '2026-05-11T17:45:00Z',
    health: 'attention',
    runs: 61,
    members: 3,
    summary: 'Needs branch cleanup and one failing integration job.',
    statusText: 'Needs attention',
  },
  {
    id: '4',
    org_id: 'org-1',
    name: 'Infrastructure',
    slug: 'infrastructure',
    description: 'Terraform and release automation for core environments.',
    repo_url: 'github.com/swadeshiops/infrastructure',
    repo_provider: 'github',
    repo_branch: 'main',
    is_active: true,
    created_at: '2026-03-02T08:40:00Z',
    updated_at: '2026-05-12T20:30:00Z',
    health: 'healthy',
    runs: 52,
    members: 2,
    summary: 'Small team, clean ownership, predictable delivery.',
    statusText: 'Healthy',
  },
];

const topStats = [
  { label: 'Projects', value: '4', note: '2 active releases', icon: Boxes, color: 'var(--color-accent)' },
  { label: 'Contributors', value: '14', note: 'Across all repos', icon: Users, color: 'var(--color-teal)' },
  { label: 'Builds this week', value: '285', note: '94% green', icon: GitBranch, color: 'var(--color-blue)' },
];

function statTone(health: 'healthy' | 'attention') {
  return health === 'healthy'
    ? { bg: 'var(--color-success-bg)', text: 'var(--color-success)' }
    : { bg: 'rgba(214,138,31,0.12)', text: 'var(--color-warning)' };
}

export default function ProjectsPage() {
  return (
    <div className="page-shell">
      <section className="page-header animate-fade-in">
        <div>
          <div className="page-kicker" style={{ background: 'rgba(47,110,229,0.10)', color: 'var(--color-blue)' }}>
            <Sparkles size={12} />
            Workspace
          </div>
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">
            A clean overview of each repository, its branch, current health, and how much activity it is carrying.
          </p>
        </div>

        <div className="page-actions">
          <div className="glass-card-flat flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-slate-400">
            <Calendar size={13} />
            Updated today
          </div>
          <button className="btn-primary flex items-center gap-2 rounded-xl px-4 py-2.5 text-[14px] font-semibold tracking-tight">
            <Plus size={15} />
            New project
          </button>
        </div>
      </section>

      <section className="stat-grid">
        {topStats.map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[12px] font-medium text-slate-400 text-slate-500">{stat.label}</p>
                <p className="mt-2 text-[32px] font-semibold tracking-tight tracking-tight text-slate-50">{stat.value}</p>
                <p className="mt-2 text-sm text-slate-400">{stat.note}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: 'var(--color-accent-soft)' }}>
                <stat.icon size={18} style={{ color: stat.color }} />
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="split-grid">
        <div className="glass-card overflow-hidden rounded-2xl">
          <div className="flex flex-col gap-3 border-b border-[rgba(255,255,255,0.08)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-[15px] font-semibold tracking-tight text-slate-50">Repository overview</h2>
              <p className="text-[12px] font-medium text-slate-400">Branch, health, and recent run volume</p>
            </div>
            <div className="glass-card-flat flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-slate-400">
              <Search size={14} />
              Search projects
            </div>
          </div>

          <div className="divide-y divide-[rgba(255,255,255,0.08)]">
            {projects.map((project) => {
              const tone = statTone(project.health);
              return (
                <article key={project.id} className="flex flex-col gap-4 px-5 py-5 transition hover:bg-white/5 sm:flex-row sm:items-center sm:px-6">
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl" style={{ background: project.health === 'healthy' ? 'var(--color-success-bg)' : 'rgba(214,138,31,0.12)' }}>
                      <Boxes size={18} style={{ color: project.health === 'healthy' ? 'var(--color-success)' : 'var(--color-warning)' }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-[15px] font-semibold tracking-tight text-slate-50">{project.name}</h3>
                        <span className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]" style={{ background: tone.bg, color: tone.text }}>
                          {project.statusText}
                        </span>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-slate-400">{project.description}</p>
                      <p className="mt-2 text-[12px] text-slate-500">{project.summary}</p>
                    </div>
                  </div>

                  <div className="grid gap-3 text-left text-[11px] text-slate-500 sm:min-w-[240px] sm:text-right">
                    <div>
                      <span className="font-semibold uppercase tracking-[0.16em] text-slate-400">Branch</span>
                      <p className="mt-1 font-semibold text-slate-100 font-mono">{project.repo_branch}</p>
                    </div>
                    <div>
                      <span className="font-semibold uppercase tracking-[0.16em] text-slate-400">Runs</span>
                      <p className="mt-1 font-semibold text-slate-100">{project.runs}</p>
                    </div>
                    <div>
                      <span className="font-semibold uppercase tracking-[0.16em] text-slate-400">Contributors</span>
                      <p className="mt-1 font-semibold text-slate-100">{project.members}</p>
                    </div>
                  </div>

                  <button className="flex items-center gap-2 self-start rounded-xl px-3 py-2 text-[13px] font-medium text-[color:var(--color-accent)] transition hover:bg-white/5 sm:self-center">
                    Open
                    <ArrowUpRight size={14} />
                  </button>
                </article>
              );
            })}
          </div>
        </div>

        <div className="space-y-5">
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[14px] font-semibold tracking-tight text-slate-50">Repository mix</h3>
                <p className="text-[12px] font-medium text-slate-400">Provider and branch health</p>
              </div>
              <Globe size={15} className="text-slate-500" />
            </div>

            <div className="mt-4 space-y-3">
              {[
                { label: 'GitHub', value: '3 repos', width: '78%' },
                { label: 'GitLab', value: '1 repo', width: '22%' },
                { label: 'Default branch main', value: '2 repos', width: '64%' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-1 flex items-center justify-between text-[12px]">
                    <span className="font-semibold text-slate-100">{item.label}</span>
                    <span className="text-slate-500">{item.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-[rgba(255,255,255,0.08)]">
                    <div className="h-2 rounded-full" style={{ width: item.width, background: 'linear-gradient(90deg, #e06a2c, #1b6b5f)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[14px] font-semibold tracking-tight text-slate-50">Recent activity</h3>
                <p className="text-[12px] font-medium text-slate-400">Changes in the last 24 hours</p>
              </div>
              <Users size={15} className="text-slate-500" />
            </div>

            <div className="mt-4 space-y-3">
              {[
                'Branch protection updated for Payments Gateway.',
                'Developer Portal added a new review rule.',
                'Mobile API had one failed run on release branch.',
              ].map((item, index) => (
                <div key={item} className="rounded-xl bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm leading-6 text-slate-300">
                  <span className="mr-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">0{index + 1}</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}




