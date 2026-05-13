import type { RunStatus } from '../types';

interface StatusBadgeProps {
  status: RunStatus | string;
  size?: 'sm' | 'md';
}

const statusConfig: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  queued: { bg: 'rgba(245, 158, 11, 0.1)', text: '#F59E0B', dot: '#F59E0B', label: 'Queued' },
  running: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3B82F6', dot: '#3B82F6', label: 'Running' },
  success: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10B981', dot: '#10B981', label: 'Success' },
  failed: { bg: 'rgba(239, 68, 68, 0.1)', text: '#EF4444', dot: '#EF4444', label: 'Failed' },
  cancelled: { bg: 'rgba(107, 114, 128, 0.1)', text: '#6B7280', dot: '#6B7280', label: 'Cancelled' },
  timeout: { bg: 'rgba(168, 85, 247, 0.1)', text: '#A855F7', dot: '#A855F7', label: 'Timeout' },
  pending: { bg: 'rgba(245, 158, 11, 0.1)', text: '#F59E0B', dot: '#F59E0B', label: 'Pending' },
  deploying: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3B82F6', dot: '#3B82F6', label: 'Deploying' },
  rolled_back: { bg: 'rgba(168, 85, 247, 0.1)', text: '#A855F7', dot: '#A855F7', label: 'Rolled Back' },
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.queued;
  const isRunning = status === 'running' || status === 'deploying';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full ${
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
      }`}
      style={{ background: config.bg, color: config.text }}
    >
      <span
        className={`rounded-full shrink-0 ${isRunning ? 'animate-pulse' : ''} ${
          size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'
        }`}
        style={{ background: config.dot }}
      />
      {config.label}
    </span>
  );
}
