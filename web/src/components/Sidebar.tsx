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
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../store/AuthContext';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/projects', icon: Boxes, label: 'Projects' },
  { to: '/pipelines', icon: GitBranch, label: 'Pipelines' },
  { to: '/deployments', icon: Rocket, label: 'Deployments' },
  { to: '/logs', icon: ScrollText, label: 'Logs' },
  { to: '/secrets', icon: Shield, label: 'Secrets' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();

  return (
    <aside
      className={`fixed left-0 top-0 h-screen z-40 flex flex-col transition-all duration-300 ease-in-out ${
        collapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
      style={{
        background: 'linear-gradient(180deg, #0D1B2A 0%, #0A1628 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{
            background: 'linear-gradient(135deg, #FF6B2B, #FF8F5E)',
            boxShadow: '0 0 20px rgba(255, 107, 43, 0.3)',
          }}
        >
          <span className="text-white font-bold text-sm">S</span>
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <h1 className="text-base font-bold text-white tracking-tight">SwadeshiOps</h1>
            <p className="text-[10px] text-slate-500 -mt-0.5">Atmanirbhar DevOps</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`
            }
            style={({ isActive }) =>
              isActive
                ? {
                    background: 'linear-gradient(135deg, rgba(255,107,43,0.15), rgba(255,107,43,0.05))',
                    borderLeft: '3px solid #FF6B2B',
                  }
                : {}
            }
          >
            <item.icon
              size={20}
              className="shrink-0 transition-colors"
            />
            {!collapsed && <span className="animate-fade-in">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User Section */}
      <div className="px-3 pb-3 space-y-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 py-2 mt-3 text-slate-500 hover:text-white text-xs transition-colors rounded-lg hover:bg-white/5"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && <span>Collapse</span>}
        </button>

        {/* User Profile */}
        {user && (
          <div className="flex items-center gap-3 px-2 py-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
              style={{
                background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
              }}
            >
              {user.full_name?.charAt(0)?.toUpperCase() || user.username?.charAt(0)?.toUpperCase()}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0 animate-fade-in">
                <p className="text-sm font-medium text-white truncate">{user.full_name || user.username}</p>
                <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={logout}
                className="text-slate-500 hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
