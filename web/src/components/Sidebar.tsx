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
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../store/useAuth';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/projects', icon: Boxes, label: 'Projects' },
  { to: '/pipelines', icon: GitBranch, label: 'Pipelines' },
  { to: '/deployments', icon: Rocket, label: 'Deployments' },
  { to: '/logs', icon: ScrollText, label: 'Logs' },
  { to: '/secrets', icon: Shield, label: 'Secrets' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user, logout } = useAuth();

  return (
    <aside
      className={`fixed left-0 top-0 h-screen z-40 flex flex-col glass-sidebar transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        collapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-5 h-[72px] shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div className="relative shrink-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #FF6B2B, #FF8F5E)',
              boxShadow: '0 0 24px rgba(255, 107, 43, 0.3)',
            }}
          >
            <Zap size={18} className="text-white" />
          </div>
          {/* Pulse ring */}
          <div
            className="absolute inset-0 rounded-xl animate-border-glow"
            style={{ border: '1px solid transparent' }}
          />
        </div>
        {!collapsed && (
          <div className="animate-fade-in overflow-hidden">
            <h1 className="text-[15px] font-bold text-white tracking-tight whitespace-nowrap">
              SwadeshiOps
            </h1>
            <p className="text-[10px] text-slate-500 -mt-0.5 whitespace-nowrap font-medium">
              Atmanirbhar DevOps
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                isActive
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
              }`
            }
            style={({ isActive }) =>
              isActive
                ? {
                    background: 'linear-gradient(135deg, rgba(255,107,43,0.12), rgba(255,107,43,0.03))',
                  }
                : {}
            }
          >
            {({ isActive }) => (
              <>
                {/* Active indicator bar */}
                {isActive && (
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                    style={{
                      background: 'linear-gradient(180deg, #FF6B2B, #FF8F5E)',
                      boxShadow: '0 0 8px rgba(255, 107, 43, 0.5)',
                    }}
                  />
                )}
                <item.icon
                  size={18}
                  className={`shrink-0 transition-all duration-200 ${
                    isActive ? 'text-saffron' : 'group-hover:scale-110'
                  }`}
                  style={isActive ? { color: '#FF6B2B' } : {}}
                />
                {!collapsed && (
                  <span className="animate-fade-in whitespace-nowrap">{item.label}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div
        className="px-3 pb-4 space-y-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        {/* Collapse Toggle */}
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 py-2 mt-3 text-slate-500 hover:text-white text-xs transition-all duration-200 rounded-xl hover:bg-white/[0.03]"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && <span className="animate-fade-in">Collapse</span>}
        </button>

        {/* User Profile */}
        {user && (
          <div className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-white/[0.02] transition-colors">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white"
              style={{
                background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
                boxShadow: '0 0 12px rgba(37, 99, 235, 0.3)',
              }}
            >
              {user.full_name?.charAt(0)?.toUpperCase() || user.username?.charAt(0)?.toUpperCase()}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0 animate-fade-in">
                <p className="text-[13px] font-medium text-white truncate">
                  {user.full_name || user.username}
                </p>
                <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={logout}
                className="text-slate-600 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-white/[0.03]"
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
