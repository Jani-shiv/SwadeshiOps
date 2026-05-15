import { Activity, Copy, Filter, PauseCircle, PlayCircle, Search, Shield, TerminalSquare, TimerReset } from 'lucide-react';
import { timeAgo, useWorkspaceData } from '../hooks/useWorkspaceData';

export default function LogsPage() {
  const { data, isError } = useWorkspaceData();
  const runs = data?.runs ?? [];
  const logLines = runs.slice(0, 12).map((run) => ({
    time: new Date(run.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    level: run.status === 'failed' ? 'error' : run.status === 'success' ? 'success' : 'info',
    text: run.error_message || run.commit_message || `Pipeline run #${run.run_number} is ${run.status} on ${run.trigger_ref || 'manual'}.`,
  }));
  const chips = [
    { label: 'Live tail', value: isError ? 'OFF' : 'ON' },
    { label: 'Errors', value: String(runs.filter((run) => run.status === 'failed').length) },
    { label: 'Warnings', value: String(runs.filter((run) => run.status === 'timeout' || run.status === 'cancelled').length) },
    { label: 'Runs', value: String(runs.length) },
  ];

  return (
    <div className="page-shell">
      <section className="page-header animate-fade-in">
        <div>
          <div className="page-kicker" style={{ background: 'rgba(255,122,0,0.12)', color: 'var(--color-warning)' }}>
            <TerminalSquare size={12} />
            Live stream
          </div>
          <h1 className="page-title">Logs</h1>
          <p className="page-subtitle">A focused event viewer powered by recent pipeline run records.</p>
        </div>
        <div className="page-actions">
          <div className="glass-card-flat flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-slate-600">
            <Activity size={13} />
            {isError ? 'Disconnected' : 'Streaming now'}
          </div>
          <button className="btn-secondary flex items-center gap-2 rounded-xl px-4 py-2.5 text-[14px] font-semibold tracking-tight">
            <PauseCircle size={15} />
            Pause
          </button>
        </div>
      </section>

      <section className="stat-grid-4">
        {chips.map((chip) => (
          <div key={chip.label} className="glass-card rounded-[1.5rem] px-5 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">{chip.label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{chip.value}</p>
          </div>
        ))}
      </section>

      <section className="split-grid-tight">
        <aside className="space-y-5">
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2">
              <Filter size={15} className="text-slate-500" />
              <h2 className="text-[14px] font-semibold tracking-tight text-slate-950">Filters</h2>
            </div>
            <div className="mt-4 space-y-3">
              {['All services', 'Errors only', 'Warnings only', 'Last 15 minutes'].map((item) => (
                <button key={item} className="flex w-full items-center justify-between rounded-xl bg-slate-50/80 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                  <span>{item}</span>
                  <span className="text-slate-600">›</span>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2">
              <Shield size={15} className="text-[color:var(--color-success)]" />
              <h2 className="text-[14px] font-semibold tracking-tight text-slate-950">Health check</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {runs.length ? `Latest run updated ${timeAgo(runs[0].created_at)}.` : 'No run events are available yet.'}
            </p>
            <div className="mt-4 rounded-xl bg-[rgba(27,139,90,0.10)] px-4 py-3 text-[12px] font-semibold text-[var(--color-success)]">
              {runs.filter((run) => run.status === 'success').length} successful runs recorded.
            </div>
          </div>
        </aside>

        <div className="glass-card overflow-hidden rounded-2xl">
          <div className="flex flex-col gap-3 border-b border-slate-200/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-[15px] font-semibold tracking-tight text-slate-950">{data?.activeOrg?.name ?? 'Workspace'} / events</h2>
              <p className="text-[12px] font-medium text-slate-600">Recent run output with status markers</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="glass-card-flat flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-slate-600">
                <Search size={14} />
                Search log
              </div>
              <button className="glass-card-flat flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600">
                <Copy size={14} />
                Copy
              </button>
            </div>
          </div>

          <div className="bg-slate-950 px-5 py-5 sm:px-6">
            <div className="mb-4 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-slate-400">
              <span>Workspace stream</span>
              <span>{isError ? 'offline' : 'live tailing'}</span>
            </div>
            <div className="space-y-3 font-mono text-[12px] leading-6 text-slate-200">
              {logLines.map((line) => (
                <div key={`${line.time}-${line.text}`} className="flex gap-4 rounded-xl px-3 py-2 hover:bg-white/5">
                  <span className="w-20 shrink-0 text-slate-400">{line.time}</span>
                  <span className={`shrink-0 font-bold uppercase tracking-[0.14em] ${line.level === 'error' ? 'text-[var(--color-error)]' : line.level === 'success' ? 'text-[var(--color-success)]' : 'text-[color:var(--color-blue)]'}`}>{line.level}</span>
                  <span className="min-w-0 flex-1 text-slate-100">{line.text}</span>
                </div>
              ))}
              {logLines.length === 0 && <div className="rounded-xl px-3 py-2 text-slate-400">No events yet.</div>}
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-200/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-3 text-[12px] text-slate-500">
              <TimerReset size={14} />
              Updated from API cache
            </div>
            <button className="btn-primary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[14px] font-semibold tracking-tight">
              <PlayCircle size={15} />
              Resume stream
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
