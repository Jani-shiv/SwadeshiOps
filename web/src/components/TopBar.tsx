import { Search, Bell, ChevronRight, Command } from 'lucide-react';
import { useAuth } from '../store/useAuth';

interface TopBarProps {
  breadcrumb: string;
  collapsed: boolean;
}

export default function TopBar({ breadcrumb }: TopBarProps) {
  const { user } = useAuth();

  return (
    <div
      className="sticky top-0 z-30 px-8 py-4 animate-slide-down"
      style={{
        background: 'linear-gradient(to bottom, rgba(5, 10, 21, 0.9), rgba(5, 10, 21, 0.6), transparent)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="flex items-center justify-between">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-medium">
          <span className="text-slate-500">SwadeshiOps</span>
          <ChevronRight size={12} className="text-slate-600" />
          <span className="text-white">{breadcrumb}</span>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Command Palette Trigger */}
          <button
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 transition-all hover:text-slate-200 glass-card-flat"
            style={{ minWidth: 200 }}
          >
            <Search size={14} className="text-slate-500" />
            <span className="flex-1 text-left">Search...</span>
            <div className="flex items-center gap-1 text-[10px] text-slate-600 font-mono">
              <Command size={10} />
              <span>K</span>
            </div>
          </button>

          {/* Notifications */}
          <button className="relative p-2.5 rounded-xl transition-all hover:bg-white/[0.04]">
            <Bell size={17} className="text-slate-400" />
            <span
              className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full dot-live"
              style={{ background: '#FF6B2B', boxShadow: '0 0 6px rgba(255,107,43,0.5)' }}
            />
          </button>

          {/* User Avatar */}
          <button className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl transition-all hover:bg-white/[0.03]">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
              style={{
                background: 'linear-gradient(135deg, #FF6B2B, #E55A1B)',
                boxShadow: '0 0 14px rgba(255, 107, 43, 0.25)',
              }}
            >
              {user?.full_name?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || 'S'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-[12px] font-semibold text-white leading-tight">
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
