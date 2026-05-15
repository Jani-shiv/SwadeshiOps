import type { RunStatus } from '../types';

interface StatusBadgeProps {
  status: RunStatus | string;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig: Record<string, { bg: string; text: string; dot: string; label: string; glow: string }> = {
  queued: { bg: 'var(--color-warning-bg)', text: 'var(--color-warning)', dot: 'var(--color-warning)', label: 'Queued', glow: 'rgba(214, 138, 31, 0.2)' },
  running: { bg: 'var(--color-info-bg)', text: 'var(--color-info)', dot: 'var(--color-info)', label: 'Running', glow: 'rgba(47, 110, 229, 0.25)' },
  success: { bg: 'var(--color-success-bg)', text: 'var(--color-success)', dot: 'var(--color-success)', label: 'Success', glow: 'rgba(27, 139, 90, 0.2)' },
  failed: { bg: 'var(--color-error-bg)', text: 'var(--color-error)', dot: 'var(--color-error)', label: 'Failed', glow: 'rgba(209, 67, 67, 0.2)' },
  canceled: { bg: 'rgba(122, 117, 109, 0.12)', text: 'var(--color-slate-500)', dot: 'var(--color-slate-500)', label: 'Canceled', glow: 'rgba(122, 117, 109, 0.2)' },
  cancelled: { bg: 'rgba(122, 117, 109, 0.12)', text: 'var(--color-slate-500)', dot: 'var(--color-slate-500)', label: 'Cancelled', glow: 'rgba(122, 117, 109, 0.2)' },
  timeout: { bg: 'rgba(122, 117, 109, 0.12)', text: 'var(--color-slate-600)', dot: 'var(--color-slate-600)', label: 'Timeout', glow: 'rgba(122, 117, 109, 0.2)' },
  pending: { bg: 'var(--color-warning-bg)', text: 'var(--color-warning)', dot: 'var(--color-warning)', label: 'Pending', glow: 'rgba(214, 138, 31, 0.2)' },
  deploying: { bg: 'var(--color-info-bg)', text: 'var(--color-info)', dot: 'var(--color-info)', label: 'Deploying', glow: 'rgba(47, 110, 229, 0.25)' },
  rolled_back: { bg: 'rgba(122, 117, 109, 0.12)', text: 'var(--color-slate-600)', dot: 'var(--color-slate-600)', label: 'Rolled Back', glow: 'rgba(122, 117, 109, 0.2)' },
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.queued;
  const isRunning = status === 'running' || status === 'deploying';

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-[11px] gap-1.5',
    lg: 'px-3 py-1.5 text-xs gap-2',
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-[6px] h-[6px]',
    lg: 'w-2 h-2',
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full tracking-wide uppercase ${sizeClasses[size]}`}
      style={{
        background: config.bg,
        color: config.text,
        border: '1px solid rgba(24, 22, 18, 0.08)',
        letterSpacing: '0.04em',
        boxShadow: `0 10px 18px ${config.glow}`,
      }}
    >
      <span
        className={`rounded-full shrink-0 ${dotSizes[size]}`}
        style={{
          background: config.dot,
          boxShadow: isRunning ? `0 0 8px ${config.glow}` : 'none',
          animation: isRunning ? 'pulse 1.5s ease-in-out infinite' : 'none',
        }}
      />
      {config.label}
    </span>
  );
}



