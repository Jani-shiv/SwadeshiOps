import { useState, useEffect, useRef } from 'react';
import { Terminal, Search, Download, Pause, Play, ArrowDown } from 'lucide-react';

// Demo log lines for visualization
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
  info: '#94a3b8',
  debug: '#64748b',
  warn: '#F59E0B',
  error: '#EF4444',
  success: '#10B981',
};

export default function LogsPage() {
  const [logs, setLogs] = useState<typeof demoLogs>([]);
  const [filter, setFilter] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const logRef = useRef<HTMLDivElement>(null);

  // Simulate streaming logs
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

  // Auto-scroll
  useEffect(() => {
    if (autoScroll && logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const filteredLogs = logs.filter(
    (log) => !filter || log.text.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Live Logs</h1>
          <p className="text-sm text-slate-400 mt-1">Pipeline Run #42 — Node.js App CI/CD</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              background: isPaused ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
              color: isPaused ? '#10B981' : '#F59E0B',
              border: `1px solid ${isPaused ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}`,
            }}
          >
            {isPaused ? <Play size={12} /> : <Pause size={12} />}
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <Download size={12} />
            Download
          </button>
        </div>
      </div>

      {/* Search/Filter Bar */}
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <Search size={16} className="text-slate-500" />
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter logs... (e.g. 'error', 'npm', 'test')"
          className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
        />
        <span className="text-xs text-slate-500">
          {filteredLogs.length} / {logs.length} lines
        </span>
      </div>

      {/* Log Terminal */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: '#0D1117',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}
      >
        {/* Terminal Header */}
        <div
          className="flex items-center justify-between px-4 py-2.5"
          style={{ background: '#161B22', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: '#FF5F56' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#FFBD2E' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#27C93F' }} />
            </div>
            <Terminal size={14} className="text-slate-500 ml-2" />
            <span className="text-xs text-slate-500 font-mono">pipeline-run-42.log</span>
          </div>
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`flex items-center gap-1 text-xs transition-colors ${autoScroll ? 'text-emerald-400' : 'text-slate-500'}`}
          >
            <ArrowDown size={12} />
            Auto-scroll {autoScroll ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Log Content */}
        <div
          ref={logRef}
          className="p-4 overflow-y-auto font-mono text-[13px] leading-6"
          style={{ maxHeight: '600px', minHeight: '400px' }}
        >
          {filteredLogs.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-slate-500 text-sm">
              {logs.length === 0 ? 'Waiting for logs...' : 'No matching log lines'}
            </div>
          ) : (
            filteredLogs.map((log, idx) => (
              <div
                key={idx}
                className="flex gap-3 hover:bg-white/[0.02] px-2 -mx-2 rounded animate-fade-in"
              >
                <span className="text-slate-600 select-none shrink-0 w-24">
                  {log.time}
                </span>
                <span style={{ color: levelColors[log.level] || '#94a3b8' }}>
                  {log.text || '\u00A0'}
                </span>
              </div>
            ))
          )}

          {/* Cursor blink */}
          {!isPaused && logs.length < demoLogs.length && (
            <div className="flex gap-3 px-2 -mx-2">
              <span className="text-slate-600 w-24" />
              <span className="w-2 h-5 bg-emerald-400 animate-pulse" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
