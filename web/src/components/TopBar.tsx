import { Search, Bell, ChevronRight, Command, Menu } from 'lucide-react';
import { useAuth } from '../store/useAuth';

interface TopBarProps {
  breadcrumb: string;
  onOpenNav: () => void;
}

export default function TopBar({ breadcrumb, onOpenNav }: TopBarProps) {
  const { user } = useAuth();

  return (
    <div className="topbar sticky top-0 z-30 flex h-[68px] items-center animate-slide-down px-4 sm:px-6 lg:h-[72px] lg:px-10">
      <div className="flex w-full max-w-[1480px] mx-auto items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            aria-label="Open navigation"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-950 lg:hidden"
            onClick={onOpenNav}
          >
            <Menu size={18} />
          </button>
          <div className="flex min-w-0 items-center gap-2 text-xs font-semibold">
            <span className="hidden text-slate-500 sm:inline">SwadeshiOps</span>
            <ChevronRight size={12} className="hidden text-slate-400 sm:inline" />
            <span className="truncate text-slate-950">{breadcrumb}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="hidden items-center gap-2.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-600 transition-all hover:text-slate-950 glass-card-flat md:flex"
            style={{ minWidth: 220 }}
          >
            <Search size={14} className="text-slate-500" />
            <span className="flex-1 text-left">Search...</span>
            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
              <Command size={10} />
              <span>K</span>
            </div>
          </button>

          <button aria-label="Notifications" className="relative rounded-xl p-2.5 transition-all hover:bg-indigo-500/10">
            <Bell size={17} className="text-slate-600" />
            <span
              className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full dot-live"
              style={{ background: 'var(--color-accent)', boxShadow: '0 0 6px rgba(59, 130, 246, 0.4)' }}
            />
          </button>

          <button className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-all hover:bg-white/80">
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
              <p className="text-[12px] font-semibold text-slate-950 leading-tight">
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



