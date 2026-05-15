import { ArrowUpRight, Boxes, Calendar, GitBranch, Globe, Plus, Search, Sparkles, Users } from 'lucide-react';
import { useWorkspaceData, timeAgo } from '../hooks/useWorkspaceData';
import type { Project } from '../types';

function statTone(project: Project) {
  return project.is_active
    ? { bg: 'var(--color-success-bg)', text: 'var(--color-success)', label: 'Healthy' }
    : { bg: 'rgba(214,138,31,0.12)', text: 'var(--color-warning)', label: 'Paused' };
}

export default function ProjectsPage() {
  const { data, isLoading, isError } = useWorkspaceData();
  const projects = data?.projects ?? [];
  const activeProjects = projects.filter((project) => project.is_active).length;
  const providers = projects.reduce<Record<string, number>>((acc, project) => {
    const provider = project.repo_provider || 'Unknown';
    acc[provider] = (acc[provider] ?? 0) + 1;
    return acc;
  }, {});
  const mainBranches = projects.filter((project) => project.repo_branch === 'main').length;

  const topStats = [
    { label: 'Projects', value: String(projects.length), note: `${activeProjects} active`, icon: Boxes, color: 'var(--color-accent)' },
    { label: 'Pipelines', value: String(data?.pipelines.length ?? 0), note: 'Connected workflows', icon: GitBranch, color: 'var(--color-blue)' },
    { label: 'Runs tracked', value: String(data?.runs.length ?? 0), note: `${Math.round(data?.stats?.success_rate ?? 0)}% success`, icon: Users, color: 'var(--color-teal)' },
  ];

  return (
    <div className="page-shell">
      <section className="page-header animate-fade-in">
        <div>
          <div className="page-kicker" style={{ background: 'rgba(47,110,229,0.10)', color: 'var(--color-blue)' }}>
            <Sparkles size={12} />
            Workspace
          </div>
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">A live overview of each repository, its branch, current health, and deployment activity.</p>
        </div>

        <div className="page-actions">
          <div className="glass-card-flat flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-slate-600">
            <Calendar size={13} />
            {isLoading ? 'Syncing...' : 'Live data'}
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
                <p className="text-[12px] font-medium text-slate-500">{stat.label}</p>
                <p className="mt-2 text-[32px] font-semibold tracking-tight text-slate-950">{stat.value}</p>
                <p className="mt-2 text-sm text-slate-600">{stat.note}</p>
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
          <div className="flex flex-col gap-3 border-b border-slate-200/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-[15px] font-semibold tracking-tight text-slate-950">Repository overview</h2>
              <p className="text-[12px] font-medium text-slate-600">Branch, health, and recent run volume</p>
            </div>
            <div className="glass-card-flat flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-slate-600">
              <Search size={14} />
              Search projects
            </div>
          </div>

          <div className="divide-y divide-slate-200/80">
            {isError && <div className="px-6 py-8 text-sm text-[var(--color-error)]">Unable to load projects.</div>}
            {!isError && projects.length === 0 && (
              <div className="px-6 py-8 text-sm text-slate-600">No projects yet. Create a project to connect pipelines and deployments.</div>
            )}
            {projects.map((project) => {
              const tone = statTone(project);
              const projectRuns = data?.runs.filter((run) => run.project_id === project.id).length ?? 0;
              return (
                <article key={project.id} className="flex flex-col gap-4 px-5 py-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:px-6">
                  <div className="flex min-w-0 flex-1 items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl" style={{ background: tone.bg }}>
                      <Boxes size={18} style={{ color: tone.text }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-[15px] font-semibold tracking-tight text-slate-950">{project.name}</h3>
                        <span className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]" style={{ background: tone.bg, color: tone.text }}>
                          {tone.label}
                        </span>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{project.description || 'No description has been added yet.'}</p>
                      <p className="mt-2 text-[12px] text-slate-500">
                        {project.repo_url || 'Repository not connected'} · Updated {timeAgo(project.updated_at)}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 text-left text-[11px] text-slate-500 sm:min-w-[240px] sm:text-right">
                    <div>
                      <span className="font-semibold uppercase tracking-[0.16em] text-slate-600">Branch</span>
                      <p className="mt-1 font-mono font-semibold text-slate-800">{project.repo_branch}</p>
                    </div>
                    <div>
                      <span className="font-semibold uppercase tracking-[0.16em] text-slate-600">Runs</span>
                      <p className="mt-1 font-semibold text-slate-800">{projectRuns}</p>
                    </div>
                    <div>
                      <span className="font-semibold uppercase tracking-[0.16em] text-slate-600">Provider</span>
                      <p className="mt-1 font-semibold text-slate-800">{project.repo_provider || 'Manual'}</p>
                    </div>
                  </div>

                  <button className="flex items-center gap-2 self-start rounded-xl px-3 py-2 text-[13px] font-medium text-[color:var(--color-accent)] transition hover:bg-slate-50 sm:self-center">
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
                <h3 className="text-[14px] font-semibold tracking-tight text-slate-950">Repository mix</h3>
                <p className="text-[12px] font-medium text-slate-600">Provider and branch health</p>
              </div>
              <Globe size={15} className="text-slate-500" />
            </div>

            <div className="mt-4 space-y-3">
              {Object.entries(providers).map(([label, count]) => (
                <div key={label}>
                  <div className="mb-1 flex items-center justify-between text-[12px]">
                    <span className="font-semibold text-slate-800">{label}</span>
                    <span className="text-slate-500">{count} repos</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full" style={{ width: `${projects.length ? (count / projects.length) * 100 : 0}%`, background: 'linear-gradient(90deg, #e06a2c, #1b6b5f)' }} />
                  </div>
                </div>
              ))}
              <div>
                <div className="mb-1 flex items-center justify-between text-[12px]">
                  <span className="font-semibold text-slate-800">Default branch main</span>
                  <span className="text-slate-500">{mainBranches} repos</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full" style={{ width: `${projects.length ? (mainBranches / projects.length) * 100 : 0}%`, background: 'linear-gradient(90deg, #e06a2c, #1b6b5f)' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[14px] font-semibold tracking-tight text-slate-950">Recent activity</h3>
                <p className="text-[12px] font-medium text-slate-600">Latest pipeline runs</p>
              </div>
              <Users size={15} className="text-slate-500" />
            </div>
            <div className="mt-4 space-y-3">
              {(data?.runs ?? []).slice(0, 3).map((run, index) => (
                <div key={run.id} className="rounded-xl bg-slate-50/80 px-4 py-3 text-sm leading-6 text-slate-700">
                  <span className="mr-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">0{index + 1}</span>
                  Run #{run.run_number} on {run.trigger_ref || 'manual'} is {run.status}.
                </div>
              ))}
              {(data?.runs.length ?? 0) === 0 && <p className="text-sm leading-6 text-slate-600">No activity yet.</p>}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
