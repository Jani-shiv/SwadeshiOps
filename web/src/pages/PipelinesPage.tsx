import { Activity, Calendar, GitBranch, PlayCircle, Search, Settings2, ShieldCheck, Sparkles, TimerReset } from 'lucide-react';
import { formatDuration, useWorkspaceData } from '../hooks/useWorkspaceData';

export default function PipelinesPage() {
  const { data, isError } = useWorkspaceData();
  const pipelines = data?.pipelines ?? [];
  const runs = data?.runs ?? [];
  const successfulRuns = runs.filter((run) => run.status === 'success').length;
  const successRate = runs.length ? Math.round((successfulRuns / runs.length) * 100) : 0;
  const completedRuns = runs.filter((run) => run.duration_ms > 0);
  const avgRuntime = completedRuns.length
    ? completedRuns.reduce((total, run) => total + run.duration_ms, 0) / completedRuns.length
    : 0;

  const stats = [
    { label: 'Total pipelines', value: String(pipelines.length), note: `${pipelines.filter((pipeline) => pipeline.is_active).length} active`, icon: GitBranch, color: 'var(--color-accent)' },
    { label: 'Success rate', value: `${successRate}%`, note: 'Across recorded runs', icon: ShieldCheck, color: 'var(--color-success)' },
    { label: 'Avg runtime', value: avgRuntime ? formatDuration(avgRuntime) : '0s', note: 'Completed runs', icon: TimerReset, color: 'var(--color-blue)' },
  ];

  return (
    <div className="page-shell">
      <section className="page-header animate-fade-in">
        <div>
          <div className="page-kicker" style={{ background: 'rgba(27,139,90,0.10)', color: 'var(--color-success)' }}>
            <Sparkles size={12} />
            Pipelines
          </div>
          <h1 className="page-title">Pipelines</h1>
          <p className="page-subtitle">A compact live view of each workflow, its trigger rules, and execution history.</p>
        </div>

        <div className="page-actions">
          <div className="glass-card-flat flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-slate-600">
            <Calendar size={13} />
            API synced
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
              <h2 className="text-[15px] font-semibold tracking-tight text-slate-950">Pipeline library</h2>
              <p className="text-[12px] font-medium text-slate-600">Triggers, branch rules, and runtime health</p>
            </div>
            <div className="glass-card-flat flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-slate-600">
              <Search size={14} />
              Search workflows
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="border-b border-slate-200/80 bg-slate-50 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                <tr>
                  <th className="px-5 py-4 sm:px-6">Pipeline</th>
                  <th className="px-5 py-4">Trigger</th>
                  <th className="px-5 py-4">Health</th>
                  <th className="px-5 py-4">Runs</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isError && (
                  <tr><td className="px-6 py-8 text-sm text-[var(--color-error)]" colSpan={5}>Unable to load pipelines.</td></tr>
                )}
                {!isError && pipelines.length === 0 && (
                  <tr><td className="px-6 py-8 text-sm text-slate-600" colSpan={5}>No pipelines yet. Add one to start running workflows.</td></tr>
                )}
                {pipelines.map((pipeline) => {
                  const pipelineRuns = runs.filter((run) => run.pipeline_id === pipeline.id);
                  const pipelineSuccess = pipelineRuns.length
                    ? Math.round((pipelineRuns.filter((run) => run.status === 'success').length / pipelineRuns.length) * 100)
                    : 0;
                  const latestRun = pipelineRuns[0];
                  return (
                    <tr key={pipeline.id} className="border-b border-slate-200/80 transition hover:bg-slate-50 last:border-b-0">
                      <td className="px-5 py-5 sm:px-6">
                        <div className="flex items-start gap-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${pipeline.is_active ? 'bg-[var(--color-success-bg)]' : 'bg-[rgba(122,117,109,0.12)]'}`}>
                            <GitBranch size={16} style={{ color: pipeline.is_active ? 'var(--color-success)' : 'var(--color-slate-500)' }} />
                          </div>
                          <div>
                            <p className="text-[15px] font-semibold tracking-tight text-slate-950">{pipeline.name}</p>
                            <p className="mt-1 max-w-[360px] truncate text-[12px] text-slate-500">{pipeline.config_yaml}</p>
                            <p className="mt-1 text-[11px] font-medium text-slate-600">Project {pipeline.project_id.slice(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-5 text-[12px] text-slate-600">
                        <p className="font-semibold text-slate-800">{pipeline.trigger_type || 'push'}</p>
                        <p className="text-slate-500">Branch {pipeline.trigger_branch || 'main'}</p>
                      </td>
                      <td className="px-5 py-5 text-[12px] text-slate-600">
                        <p className="font-semibold text-slate-800">{pipelineSuccess}% success</p>
                        <p className="text-slate-500">{latestRun ? `Latest ${latestRun.status}` : 'No runs yet'}</p>
                      </td>
                      <td className="px-5 py-5 text-[12px] text-slate-600">
                        <p className="font-semibold text-slate-800">{pipelineRuns.length} runs</p>
                        <p className="mt-1 text-slate-500">{pipeline.is_active ? 'Active' : 'Paused'}</p>
                      </td>
                      <td className="px-5 py-5 text-right sm:px-6">
                        <button className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-[13px] font-medium text-[color:var(--color-accent)] transition hover:bg-slate-50">
                          Manage
                          <Settings2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-5">
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[14px] font-semibold tracking-tight text-slate-950">Activity status</h3>
                <p className="text-[12px] font-medium text-slate-600">Pipeline execution mix</p>
              </div>
              <Activity size={15} className="text-slate-500" />
            </div>

            <div className="mt-4 space-y-3">
              {['push', 'manual', 'webhook'].map((label) => {
                const count = runs.filter((run) => run.trigger_type === label).length;
                const width = runs.length ? `${(count / runs.length) * 100}%` : '0%';
                return (
                  <div key={label}>
                    <div className="mb-1 flex items-center justify-between text-[12px]">
                      <span className="font-semibold capitalize text-slate-800">{label}</span>
                      <span className="text-slate-500">{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div className="h-2 rounded-full" style={{ width, background: 'linear-gradient(90deg, #e06a2c, #2f6ee5)' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[14px] font-semibold tracking-tight text-slate-950">Recommended next step</h3>
                <p className="text-[12px] font-medium text-slate-600">Keep the workflow tidy</p>
              </div>
              <ShieldCheck size={15} className="text-slate-500" />
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {pipelines.some((pipeline) => !pipeline.is_active)
                ? 'One or more pipelines are paused. Review their branch rules before enabling production triggers.'
                : 'Your active pipelines are ready. Add more run history to improve operational trends.'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
