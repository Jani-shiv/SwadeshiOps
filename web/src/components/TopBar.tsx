import { Search, Bell, ChevronRight, Command } from 'lucide-react';
import { useAuth } from '../store/useAuth';

interface TopBarProps {
  breadcrumb: string;
  collapsed: boolean;
}

export default function TopBar({ breadcrumb }: TopBarProps) {
  const { user } = useAuth();

  return (
    <div className="sticky top-0 z-30 animate-slide-down px-5 pb-3 pt-4 lg:px-8">
      <div className="flex items-center justify-between gap-4 rounded-[1.5rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.9)] px-4 py-3 shadow-[0_16px_40px_rgba(66,16,44,0.12)] backdrop-blur-xl">
        <div className="flex items-center gap-2 text-xs font-medium">
          <span className="text-slate-500">SwadeshiOps</span>
          <ChevronRight size={12} className="text-slate-400" />
          <span className="text-slate-900">{breadcrumb}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="hidden items-center gap-2.5 rounded-2xl px-3.5 py-2 text-xs font-semibold text-slate-600 transition-all hover:text-slate-900 glass-card-flat md:flex"
            style={{ minWidth: 220 }}
          >
            <Search size={14} className="text-slate-500" />
            <span className="flex-1 text-left">Search...</span>
            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
              <Command size={10} />
              <span>K</span>
            </div>
          </button>

          <button className="relative rounded-2xl p-2.5 transition-all hover:bg-[rgba(243,22,124,0.08)]">
            <Bell size={17} className="text-slate-600" />
            <span
              className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full dot-live"
              style={{ background: 'var(--color-accent)', boxShadow: '0 0 6px rgba(224,106,44,0.35)' }}
            />
          </button>

          <button className="flex items-center gap-2.5 rounded-2xl px-2 py-1.5 transition-all hover:bg-white/80">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold text-white"
              style={{
                background: 'linear-gradient(135deg, #e06a2c, #1b6b5f)',
                boxShadow: '0 6px 14px rgba(224, 106, 44, 0.2)',
              }}
            >
              {user?.full_name?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || 'S'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-[12px] font-semibold text-slate-900 leading-tight">
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
