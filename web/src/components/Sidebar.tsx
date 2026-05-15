import {
  LayoutDashboard,
  GitBranch,
  Rocket,
  ScrollText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Boxes,
  Shield,
  Zap,
  Sparkles,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../store/useAuth';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navSections = [
  {
    label: 'Main',
    items: [
      { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/projects', icon: Boxes, label: 'Projects' },
      { to: '/pipelines', icon: GitBranch, label: 'Pipelines' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { to: '/deployments', icon: Rocket, label: 'Deployments' },
      { to: '/logs', icon: ScrollText, label: 'Logs' },
      { to: '/secrets', icon: Shield, label: 'Secrets' },
    ],
  },
  {
    label: 'Config',
    items: [
      { to: '/settings', icon: Settings, label: 'Settings' },
    ],
  },
];

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user, logout } = useAuth();

  return (
    <aside
      className={`fixed left-0 top-0 h-screen z-40 flex flex-col glass-sidebar transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        collapsed ? 'w-[88px]' : 'w-[268px]'
      }`}
    >
      <div className="flex h-[72px] shrink-0 items-center gap-3 border-b border-[var(--color-border)] px-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl" style={{ background: 'linear-gradient(135deg, #e06a2c, #c85b23)', boxShadow: '0 12px 22px rgba(224, 106, 44, 0.22)' }}>
          <Zap size={20} className="text-white" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <h1 className="text-[16px] font-extrabold tracking-tight text-slate-900 whitespace-nowrap">
              Swadeshi<span className="gradient-text">Ops</span>
            </h1>
            <p className="-mt-0.5 whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              DevOps platform
            </p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {navSections.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <p className="mb-2 px-3 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">
                {section.label}
              </p>
            )}
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) => `group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[13px] font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[rgba(243,22,124,0.14)] text-slate-900 shadow-[inset_0_0_0_1px_rgba(243,22,124,0.18)]'
                      : 'text-slate-600 hover:bg-[rgba(243,22,124,0.08)] hover:text-slate-900'
                  }`}
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        size={18}
                        className={`shrink-0 transition-all duration-200 ${isActive ? 'text-[color:var(--color-accent)]' : 'text-slate-500 group-hover:text-slate-900'}`}
                      />
                      {!collapsed && (
                        <span className="animate-fade-in whitespace-nowrap">{item.label}</span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-auto space-y-3 border-t border-[var(--color-border)] px-4 pb-5 pt-4">
        {!collapsed && (
          <div className="glass-card-flat animate-fade-in cursor-pointer rounded-3xl p-4">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles size={14} style={{ color: 'var(--color-accent)' }} />
              <span className="text-[12px] font-bold text-slate-900">Upgrade to Pro</span>
            </div>
            <p className="text-[10px] leading-relaxed text-slate-500">
              Unlock unlimited pipelines, runners, and team seats.
            </p>
          </div>
        )}

        <button
          onClick={onToggle}
          className="flex w-full items-center justify-center gap-2 rounded-2xl py-2 text-xs font-medium text-slate-500 transition-all duration-200 hover:bg-[rgba(243,22,124,0.08)] hover:text-slate-900"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && <span className="animate-fade-in">Collapse</span>}
        </button>

        {user && (
          <div className="flex items-center gap-3 rounded-2xl px-2 py-2.5 transition-colors hover:bg-[rgba(243,22,124,0.08)]">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
              style={{
                background: 'linear-gradient(135deg, #2f6ee5, #1b6b5f)',
                boxShadow: '0 6px 16px rgba(47, 110, 229, 0.2)',
              }}
            >
              {user.full_name?.charAt(0)?.toUpperCase() || user.username?.charAt(0)?.toUpperCase()}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1 animate-fade-in">
                <p className="truncate text-[13px] font-semibold text-slate-900">
                  {user.full_name || user.username}
                </p>
                <p className="truncate text-[10px] text-slate-500">{user.email}</p>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={logout}
                className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-[rgba(243,22,124,0.08)] hover:text-red-500"
                title="Logout"
              >
                <LogOut size={14} />
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
