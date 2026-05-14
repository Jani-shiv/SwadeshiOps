import type { RunStatus } from '../types';

interface StatusBadgeProps {
  status: RunStatus | string;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig: Record<string, { bg: string; text: string; dot: string; label: string; glow: string }> = {
  queued: { bg: 'rgba(245, 158, 11, 0.08)', text: '#F59E0B', dot: '#F59E0B', label: 'Queued', glow: 'rgba(245, 158, 11, 0.2)' },
  running: { bg: 'rgba(59, 130, 246, 0.08)', text: '#3B82F6', dot: '#3B82F6', label: 'Running', glow: 'rgba(59, 130, 246, 0.3)' },
  success: { bg: 'rgba(16, 185, 129, 0.08)', text: '#10B981', dot: '#10B981', label: 'Success', glow: 'rgba(16, 185, 129, 0.2)' },
  failed: { bg: 'rgba(239, 68, 68, 0.08)', text: '#EF4444', dot: '#EF4444', label: 'Failed', glow: 'rgba(239, 68, 68, 0.2)' },
  canceled: { bg: 'rgba(107, 114, 128, 0.08)', text: '#6B7280', dot: '#6B7280', label: 'Canceled', glow: 'rgba(107, 114, 128, 0.2)' },
  timeout: { bg: 'rgba(168, 85, 247, 0.08)', text: '#A855F7', dot: '#A855F7', label: 'Timeout', glow: 'rgba(168, 85, 247, 0.2)' },
  pending: { bg: 'rgba(245, 158, 11, 0.08)', text: '#F59E0B', dot: '#F59E0B', label: 'Pending', glow: 'rgba(245, 158, 11, 0.2)' },
  deploying: { bg: 'rgba(59, 130, 246, 0.08)', text: '#3B82F6', dot: '#3B82F6', label: 'Deploying', glow: 'rgba(59, 130, 246, 0.3)' },
  rolled_back: { bg: 'rgba(168, 85, 247, 0.08)', text: '#A855F7', dot: '#A855F7', label: 'Rolled Back', glow: 'rgba(168, 85, 247, 0.2)' },
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
        border: `1px solid ${config.bg}`,
        letterSpacing: '0.04em',
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
