import { Activity, Calendar, GitBranch, PlayCircle, Search, Settings2, ShieldCheck, Sparkles, TimerReset } from 'lucide-react';
import type { Pipeline } from '../types';

const pipelines: (Pipeline & { successRate: string; avgRuntime: string; statusText: string; runs: number; owner: string })[] = [
  {
    id: '1',
    project_id: '1',
    name: 'Build and test',
    config_yaml: '.github/workflows/build.yml',
    trigger_type: 'push',
    trigger_branch: 'main',
    is_active: true,
    created_at: '2026-04-02T11:00:00Z',
    updated_at: '2026-05-13T10:45:00Z',
    successRate: '96%',
    avgRuntime: '2m 05s',
    statusText: 'Active',
    runs: 84,
    owner: 'Platform team',
  },
  {
    id: '2',
    project_id: '1',
    name: 'Preview deploy',
    config_yaml: '.github/workflows/preview.yml',
    trigger_type: 'pull_request',
    trigger_branch: 'develop',
    is_active: true,
    created_at: '2026-04-06T09:20:00Z',
    updated_at: '2026-05-13T09:15:00Z',
    successRate: '93%',
    avgRuntime: '3m 12s',
    statusText: 'Active',
    runs: 38,
    owner: 'Frontend team',
  },
  {
    id: '3',
    project_id: '2',
    name: 'Release candidate',
    config_yaml: 'ops/release.yml',
    trigger_type: 'tag',
    trigger_branch: 'release',
    is_active: false,
    created_at: '2026-03-22T16:40:00Z',
    updated_at: '2026-05-11T15:35:00Z',
    successRate: '88%',
    avgRuntime: '4m 40s',
    statusText: 'Paused',
    runs: 24,
    owner: 'Release manager',
  },
  {
    id: '4',
    project_id: '3',
    name: 'Security scan',
    config_yaml: 'security/scan.yml',
    trigger_type: 'schedule',
    trigger_branch: 'main',
    is_active: true,
    created_at: '2026-04-18T08:30:00Z',
    updated_at: '2026-05-12T19:00:00Z',
    successRate: '99%',
    avgRuntime: '1m 40s',
    statusText: 'Active',
    runs: 122,
    owner: 'Security team',
  },
];

const stats = [
  { label: 'Total pipelines', value: '4', note: '2 active, 1 paused', icon: GitBranch, color: 'var(--color-accent)' },
  { label: 'Success rate', value: '94%', note: 'Across last 30 runs', icon: ShieldCheck, color: 'var(--color-success)' },
  { label: 'Avg runtime', value: '2m 54s', note: 'Stable trending', icon: TimerReset, color: 'var(--color-blue)' },
];

export default function PipelinesPage() {
  return (
    <div className="page-shell">
      <section className="page-header animate-fade-in">
        <div>
          <div className="page-kicker" style={{ background: 'rgba(27,139,90,0.10)', color: 'var(--color-success)' }}>
            <Sparkles size={12} />
            Pipelines
          </div>
          <h1 className="page-title">Pipelines</h1>
          <p className="page-subtitle">
            A compact view of each workflow, how often it runs, and whether the current configuration is healthy.
          </p>
        </div>

        <div className="page-actions">
          <div className="glass-card-flat flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-slate-400">
            <Calendar size={13} />
            Synced just now
          </div>
          <button className="btn-primary flex items-center gap-2 rounded-xl px-4 py-2.5 text-[14px] font-semibold tracking-tight">
            <PlayCircle size={15} />
            Run pipeline
          </button>
        </div>
      </section>

      <section className="stat-grid">
        {stats.map((stat) => (
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
              <h2 className="text-[15px] font-semibold tracking-tight text-slate-50">Pipeline library</h2>
              <p className="text-[12px] font-medium text-slate-400">Triggers, branch rules, and runtime health</p>
            </div>
            <div className="glass-card-flat flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-slate-400">
              <Search size={14} />
              Search workflows
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="border-b border-[rgba(255,255,255,0.08)] bg-[rgba(24,22,18,0.02)] text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                <tr>
                  <th className="px-5 py-4 sm:px-6">Pipeline</th>
                  <th className="px-5 py-4">Trigger</th>
                  <th className="px-5 py-4">Health</th>
                  <th className="px-5 py-4">Runs</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pipelines.map((pipeline) => (
                  <tr key={pipeline.id} className="border-b border-[rgba(255,255,255,0.08)] transition hover:bg-white/5 last:border-b-0">
                    <td className="px-5 py-5 sm:px-6">
                      <div className="flex items-start gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${pipeline.is_active ? 'bg-[var(--color-success-bg)]' : 'bg-[rgba(122,117,109,0.12)]'}`}>
                          <GitBranch size={16} style={{ color: pipeline.is_active ? 'var(--color-success)' : 'var(--color-slate-500)' }} />
                        </div>
                        <div>
                          <p className="text-[15px] font-semibold tracking-tight text-slate-50">{pipeline.name}</p>
                          <p className="mt-1 text-[12px] text-slate-500">{pipeline.config_yaml}</p>
                          <p className="mt-1 text-[11px] font-medium text-slate-400">Owner: {pipeline.owner}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5 text-[12px] text-slate-400">
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-100">{pipeline.trigger_type}</p>
                        <p className="text-slate-500">Branch {pipeline.trigger_branch}</p>
                      </div>
                    </td>
                    <td className="px-5 py-5 text-[12px] text-slate-400">
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-100">{pipeline.successRate} success</p>
                        <p className="text-slate-500">{pipeline.avgRuntime} avg runtime</p>
                      </div>
                    </td>
                    <td className="px-5 py-5 text-[12px] text-slate-400">
                      <p className="font-semibold text-slate-100">{pipeline.runs} runs</p>
                      <p className="mt-1 text-slate-500">{pipeline.is_active ? 'Active' : 'Paused'}</p>
                    </td>
                    <td className="px-5 py-5 text-right sm:px-6">
                      <button className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-[13px] font-medium text-[color:var(--color-accent)] transition hover:bg-white/5">
                        Manage
                        <Settings2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-5">
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[14px] font-semibold tracking-tight text-slate-50">Activity status</h3>
                <p className="text-[12px] font-medium text-slate-400">Pipeline execution mix</p>
              </div>
              <Activity size={15} className="text-slate-500" />
            </div>

            <div className="mt-4 space-y-3">
              {[
                { label: 'Push', value: '61%', width: '61%' },
                { label: 'Pull request', value: '23%', width: '23%' },
                { label: 'Schedule', value: '16%', width: '16%' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-1 flex items-center justify-between text-[12px]">
                    <span className="font-semibold text-slate-100">{item.label}</span>
                    <span className="text-slate-500">{item.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-[rgba(255,255,255,0.08)]">
                    <div className="h-2 rounded-full" style={{ width: item.width, background: 'linear-gradient(90deg, #e06a2c, #2f6ee5)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[14px] font-semibold tracking-tight text-slate-50">Recommended next step</h3>
                <p className="text-[12px] font-medium text-slate-400">Keep the workflow tidy</p>
              </div>
              <ShieldCheck size={15} className="text-slate-500" />
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              The release candidate pipeline is paused. Review the branch rule and re-enable it once the integration tests are green.
            </p>

            <button className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[rgba(27,139,90,0.10)] px-4 py-2.5 text-[13px] font-medium text-[var(--color-success)] transition hover:bg-[rgba(27,139,90,0.14)]">
              <PlayCircle size={14} />
              Resume workflow
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}




