import { Search, Bell, ChevronRight, Command } from 'lucide-react';
import { useAuth } from '../store/useAuth';

interface TopBarProps {
  breadcrumb: string;
  collapsed: boolean;
}

export default function TopBar({ breadcrumb }: TopBarProps) {
  const { user } = useAuth();

  return (
    <div className="sticky top-0 z-30 flex h-[72px] items-center animate-slide-down border-b border-[var(--color-border)] bg-[var(--color-surface)] px-6 lg:px-10">
      <div className="flex w-full max-w-[1480px] mx-auto items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-medium">
          <span className="text-slate-500">SwadeshiOps</span>
          <ChevronRight size={12} className="text-slate-400" />
          <span className="text-slate-50">{breadcrumb}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="hidden items-center gap-2.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-400 transition-all hover:text-slate-50 glass-card-flat md:flex"
            style={{ minWidth: 220 }}
          >
            <Search size={14} className="text-slate-500" />
            <span className="flex-1 text-left">Search...</span>
            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
              <Command size={10} />
              <span>K</span>
            </div>
          </button>

          <button className="relative rounded-xl p-2.5 transition-all hover:bg-blue-500/10">
            <Bell size={17} className="text-slate-400" />
            <span
              className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full dot-live"
              style={{ background: 'var(--color-accent)', boxShadow: '0 0 6px rgba(59, 130, 246, 0.4)' }}
            />
          </button>

          <button className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-all hover:bg-slate-900/80">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold text-white"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                boxShadow: '0 6px 14px rgba(59, 130, 246, 0.2)',
              }}
            >
              {user?.full_name?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || 'S'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-[12px] font-semibold text-slate-50 leading-tight">
                {user?.full_name || user?.username || 'Shiv Jani'}
              </p>
              <p className="text-[10px] text-slate-500 leading-tight">Admin</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}



