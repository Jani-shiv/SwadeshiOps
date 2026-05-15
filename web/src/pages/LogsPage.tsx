import { Activity, Copy, Filter, PauseCircle, PlayCircle, Search, Shield, TerminalSquare, TimerReset } from 'lucide-react';

const logLines = [
  { time: '14:21:08', level: 'info', text: 'Starting build container for payments-gateway.' },
  { time: '14:21:10', level: 'info', text: 'Installing dependencies with pnpm.' },
  { time: '14:21:14', level: 'warn', text: 'Optional package sharp skipped for this platform.' },
  { time: '14:21:18', level: 'info', text: 'Running unit tests: 42 passed, 0 failed.' },
  { time: '14:21:25', level: 'info', text: 'Packaging artifacts and preparing deployment.' },
  { time: '14:21:31', level: 'error', text: 'Preview environment health check returned 503 on first probe.' },
  { time: '14:21:33', level: 'info', text: 'Retrying health check with extended timeout.' },
  { time: '14:21:37', level: 'success', text: 'Deployment succeeded after retry.' },
];

const chips = [
  { label: 'Live tail', value: 'ON' },
  { label: 'Errors', value: '1' },
  { label: 'Warnings', value: '1' },
  { label: 'Latency', value: '2.3s' },
];

export default function LogsPage() {
  return (
      <div className="page-shell">
        <section className="page-header animate-fade-in">
        <div>
            <div className="page-kicker" style={{ background: 'rgba(255,122,0,0.12)', color: 'var(--color-warning)' }}>
            <TerminalSquare size={12} />
            Live stream
          </div>
            <h1 className="page-title">Logs</h1>
            <p className="page-subtitle">
            A focused log viewer with filters, line numbers, and the current deployment health right beside it.
          </p>
        </div>

          <div className="page-actions">
          <div className="glass-card-flat flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-semibold text-slate-600">
            <Activity size={13} />
            Streaming now
          </div>
          <button className="btn-secondary flex items-center gap-2 rounded-2xl px-4 py-2.5 text-[13px] font-bold">
            <PauseCircle size={15} />
            Pause
          </button>
        </div>
      </section>

        <section className="stat-grid-4">
        {chips.map((chip) => (
          <div key={chip.label} className="glass-card rounded-[1.5rem] px-5 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">{chip.label}</p>
            <p className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">{chip.value}</p>
          </div>
        ))}
      </section>

        <section className="split-grid-tight">
        <aside className="space-y-5">
          <div className="glass-card rounded-[2rem] p-5">
            <div className="flex items-center gap-2">
              <Filter size={15} className="text-slate-500" />
              <h2 className="text-[13px] font-bold text-slate-900">Filters</h2>
            </div>
            <div className="mt-4 space-y-3">
              {['All services', 'Errors only', 'Warnings only', 'Last 15 minutes'].map((item) => (
                <button key={item} className="flex w-full items-center justify-between rounded-2xl bg-[rgba(24,22,18,0.03)] px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-[rgba(24,22,18,0.06)]">
                  <span>{item}</span>
                  <span className="text-slate-400">›</span>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-[2rem] p-5">
            <div className="flex items-center gap-2">
              <Shield size={15} className="text-[color:var(--color-success)]" />
              <h2 className="text-[13px] font-bold text-slate-900">Health check</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              The preview environment recovered after one retry. Production remains stable and build latency is within target.
            </p>
            <div className="mt-4 rounded-2xl bg-[rgba(27,139,90,0.10)] px-4 py-3 text-[12px] font-semibold text-[var(--color-success)]">
              98.7% successful log queries in the last hour.
            </div>
          </div>
        </aside>

        <div className="glass-card overflow-hidden rounded-[2rem]">
          <div className="flex flex-col gap-3 border-b border-[rgba(24,22,18,0.06)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-[14px] font-bold text-slate-900">payments-gateway / deploy</h2>
              <p className="text-[10px] font-medium text-slate-500">Tail -f output with line groups and status markers</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="glass-card-flat flex items-center gap-2 rounded-2xl px-3 py-2 text-xs text-slate-600">
                <Search size={14} />
                Search log
              </div>
              <button className="glass-card-flat flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-semibold text-slate-600">
                <Copy size={14} />
                Copy
              </button>
            </div>
          </div>

          <div className="bg-[#0f172a] px-5 py-5 sm:px-6">
            <div className="mb-4 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-slate-400">
              <span>Session 042</span>
              <span>Live tailing</span>
            </div>

            <div className="space-y-3 font-mono text-[12px] leading-6 text-slate-200">
              {logLines.map((line) => (
                <div key={`${line.time}-${line.text}`} className="flex gap-4 rounded-2xl px-3 py-2 hover:bg-white/5">
                  <span className="w-20 shrink-0 text-slate-500">{line.time}</span>
                  <span className={`shrink-0 font-bold uppercase tracking-[0.14em] ${line.level === 'error' ? 'text-[var(--color-error)]' : line.level === 'warn' ? 'text-[var(--color-warning)]' : line.level === 'success' ? 'text-[var(--color-success)]' : 'text-[color:var(--color-blue)]'}`}>
                    {line.level}
                  </span>
                  <span className="min-w-0 flex-1 text-slate-100">{line.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-[rgba(24,22,18,0.06)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-3 text-[12px] text-slate-500">
              <TimerReset size={14} />
              Updated a few seconds ago
            </div>
            <button className="btn-primary inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-[13px] font-bold">
              <PlayCircle size={15} />
              Resume stream
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
