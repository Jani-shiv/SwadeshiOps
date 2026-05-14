import { useState, useEffect, useRef } from 'react';
import { Terminal, Search, Download, Pause, Play, ArrowDown, FileText, Copy, Maximize2, Filter } from 'lucide-react';

const demoLogs = [
  { time: '19:30:01.123', level: 'info', text: '=== Pipeline: Node.js App CI/CD ===' },
  { time: '19:30:01.124', level: 'info', text: '=== Step: install ===' },
  { time: '19:30:01.200', level: 'info', text: 'Pulling image: node:20-alpine...' },
  { time: '19:30:03.456', level: 'info', text: 'Image pulled successfully (2.2s)' },
  { time: '19:30:03.500', level: 'info', text: '$ npm ci --prefer-offline' },
  { time: '19:30:04.100', level: 'debug', text: 'npm warn config cache-min This option has been deprecated.' },
  { time: '19:30:08.234', level: 'info', text: 'added 1247 packages in 4.7s' },
  { time: '19:30:08.235', level: 'success', text: '✅ Step \'install\' completed in 7.1s' },
  { time: '19:30:08.300', level: 'info', text: '' },
  { time: '19:30:08.301', level: 'info', text: '=== Step: lint ===' },
  { time: '19:30:08.500', level: 'info', text: '$ npm run lint' },
  { time: '19:30:09.100', level: 'info', text: '> app@2.1.0 lint' },
  { time: '19:30:09.200', level: 'info', text: '> eslint src/ --ext .ts,.tsx' },
  { time: '19:30:12.567', level: 'success', text: 'No lint errors found ✓' },
  { time: '19:30:12.568', level: 'success', text: '✅ Step \'lint\' completed in 4.2s' },
  { time: '19:30:12.600', level: 'info', text: '' },
  { time: '19:30:12.601', level: 'info', text: '=== Step: test ===' },
  { time: '19:30:12.700', level: 'info', text: '$ npm test -- --coverage' },
  { time: '19:30:13.200', level: 'info', text: '> app@2.1.0 test' },
  { time: '19:30:13.300', level: 'info', text: '> vitest run --coverage' },
  { time: '19:30:14.100', level: 'info', text: ' ✓ src/auth/service.test.ts (8 tests) 234ms' },
  { time: '19:30:14.500', level: 'info', text: ' ✓ src/pipeline/parser.test.ts (12 tests) 156ms' },
  { time: '19:30:14.800', level: 'warn', text: ' ⚠ src/runner/docker.test.ts (3 tests) 1 skipped' },
  { time: '19:30:15.100', level: 'info', text: ' ✓ src/webhook/handler.test.ts (6 tests) 89ms' },
  { time: '19:30:15.200', level: 'info', text: '' },
  { time: '19:30:15.201', level: 'info', text: 'Test Suites:  4 passed, 4 total' },
  { time: '19:30:15.202', level: 'info', text: 'Tests:        28 passed, 1 skipped, 29 total' },
  { time: '19:30:15.203', level: 'info', text: 'Coverage:     87.3%' },
  { time: '19:30:15.300', level: 'success', text: '✅ Step \'test\' completed in 2.7s' },
  { time: '19:30:15.400', level: 'info', text: '' },
  { time: '19:30:15.401', level: 'info', text: '=== Step: build ===' },
  { time: '19:30:15.500', level: 'info', text: '$ npm run build' },
  { time: '19:30:16.100', level: 'info', text: 'vite v5.4.2 building for production...' },
  { time: '19:30:18.234', level: 'info', text: '✓ 234 modules transformed.' },
  { time: '19:30:18.567', level: 'info', text: 'dist/index.html          0.42 kB │ gzip:  0.28 kB' },
  { time: '19:30:18.568', level: 'info', text: 'dist/assets/index.css   24.17 kB │ gzip:  5.12 kB' },
  { time: '19:30:18.569', level: 'info', text: 'dist/assets/index.js   187.43 kB │ gzip: 58.91 kB' },
  { time: '19:30:18.570', level: 'info', text: '✓ built in 3.0s' },
  { time: '19:30:18.600', level: 'success', text: '✅ Step \'build\' completed in 3.1s' },
  { time: '19:30:18.700', level: 'info', text: '' },
  { time: '19:30:18.701', level: 'success', text: '✅ Pipeline completed in 17.5s' },
];

const levelColors: Record<string, string> = {
  info: '#8B95A5',
  debug: '#5A6374',
  warn: '#F59E0B',
  error: '#EF4444',
  success: '#10B981',
};

const levelBg: Record<string, string> = {
  warn: 'rgba(245,158,11,0.03)',
  error: 'rgba(239,68,68,0.04)',
  success: 'rgba(16,185,129,0.02)',
};

export default function LogsPage() {
  const [logs, setLogs] = useState<typeof demoLogs>([]);
  const [filter, setFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [isPaused, setIsPaused] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setLogs((prev) => {
        if (prev.length >= demoLogs.length) {
          clearInterval(interval);
          return prev;
        }
        return [...prev, demoLogs[prev.length]];
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    if (autoScroll && logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const filteredLogs = logs
    .filter((log) => !filter || log.text.toLowerCase().includes(filter.toLowerCase()))
    .filter((log) => levelFilter === 'all' || log.level === levelFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-[30px] font-extrabold text-white tracking-tight">Live Logs</h1>
          <p className="text-sm text-slate-400 mt-1 font-medium">
            Pipeline Run #42 — Node.js App CI/CD
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold transition-all glass-card-flat"
            style={{
              color: isPaused ? '#10B981' : '#F59E0B',
              borderColor: isPaused ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
            }}
          >
            {isPaused ? <Play size={13} /> : <Pause size={13} />}
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold btn-ghost">
            <Copy size={13} />
            Copy
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold btn-ghost">
            <Download size={13} />
            Download
          </button>
          <button className="p-2 rounded-xl btn-ghost">
            <Maximize2 size={14} />
          </button>
        </div>
      </div>

      {/* Search/Filter Bar */}
      <div className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: '80ms' }}>
        <div className="glass-card-flat flex items-center gap-3 px-4 py-3 rounded-xl flex-1">
          <Search size={15} className="text-slate-500" />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter logs... (e.g. 'error', 'npm', 'test')"
            className="flex-1 bg-transparent text-[12px] text-white placeholder-slate-500 outline-none font-medium"
          />
          <span className="text-[10px] text-slate-500 font-mono font-bold">
            {filteredLogs.length}/{logs.length}
          </span>
        </div>

        {/* Level Filter */}
        <div className="flex items-center gap-1">
          <Filter size={12} className="text-slate-500 mr-1" />
          {['all', 'info', 'warn', 'error', 'success'].map(level => (
            <button
              key={level}
              onClick={() => setLevelFilter(level)}
              className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase transition-all ${
                levelFilter === level ? 'text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
              style={levelFilter === level ? { background: `${levelColors[level] || '#FF6B2B'}15`, color: levelColors[level] || '#FF6B2B' } : {}}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Log Terminal */}
      <div
        className="rounded-2xl overflow-hidden animate-fade-in"
        style={{
          animationDelay: '150ms',
          background: '#06090F',
          border: '1px solid rgba(255,255,255,0.05)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.02)',
        }}
      >
        {/* Terminal Header */}
        <div
          className="flex items-center justify-between px-5 py-2.5"
          style={{ background: '#0C1018', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
        >
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full transition-opacity hover:opacity-80" style={{ background: '#FF5F56' }} />
              <div className="w-3 h-3 rounded-full transition-opacity hover:opacity-80" style={{ background: '#FFBD2E' }} />
              <div className="w-3 h-3 rounded-full transition-opacity hover:opacity-80" style={{ background: '#27C93F' }} />
            </div>
            <div className="flex items-center gap-2 ml-1">
              <FileText size={12} className="text-slate-600" />
              <span className="text-[10px] text-slate-500 font-mono font-bold">pipeline-run-42.log</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isPaused && logs.length < demoLogs.length && (
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                Streaming
              </span>
            )}
            <button
              onClick={() => setAutoScroll(!autoScroll)}
              className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-md transition-all ${
                autoScroll ? 'text-emerald-400 bg-emerald-400/5' : 'text-slate-500 hover:text-slate-400'
              }`}
            >
              <ArrowDown size={11} />
              Auto-scroll
            </button>
          </div>
        </div>

        {/* Log Content */}
        <div
          ref={logRef}
          className="px-0 py-3 overflow-y-auto font-mono text-[12px] leading-[1.85]"
          style={{ maxHeight: '560px', minHeight: '400px' }}
        >
          {filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-slate-500 text-sm gap-3">
              <Terminal size={24} className="text-slate-600" />
              {logs.length === 0 ? 'Waiting for logs...' : 'No matching log lines'}
            </div>
          ) : (
            filteredLogs.map((log, idx) => (
              <div
                key={idx}
                className="flex gap-0 hover:bg-white/[0.02] transition-colors group"
                style={{ background: levelBg[log.level] || 'transparent' }}
              >
                {/* Line number */}
                <span className="text-slate-700 select-none text-right pr-3 pl-4 text-[10px] w-[50px] shrink-0 font-mono">
                  {idx + 1}
                </span>
                {/* Timestamp */}
                <span className="text-slate-600 select-none shrink-0 w-[100px] text-[10.5px] pr-2">
                  {log.time}
                </span>
                {/* Level */}
                <span
                  className="text-[9px] uppercase font-bold w-[50px] shrink-0 tracking-wider text-center"
                  style={{ color: `${levelColors[log.level]}90` }}
                >
                  {log.level}
                </span>
                {/* Text */}
                <span className="pl-2 pr-4" style={{ color: levelColors[log.level] || '#8B95A5' }}>
                  {log.text || '\u00A0'}
                </span>
              </div>
            ))
          )}

          {/* Cursor blink */}
          {!isPaused && logs.length < demoLogs.length && (
            <div className="flex gap-0 pl-4">
              <span className="w-[50px]" />
              <span className="w-[100px]" />
              <span className="w-[50px]" />
              <span
                className="ml-2 w-2 h-[18px] rounded-sm"
                style={{
                  background: '#10B981',
                  animation: 'pulse 1s ease-in-out infinite',
                  boxShadow: '0 0 8px rgba(16, 185, 129, 0.5)',
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
