import { Settings, User, Bell, Shield, Globe, ChevronRight, Palette, Key, Webhook, Monitor, Moon, Sun } from 'lucide-react';
import { useState } from 'react';

const settingsGroups = [
  {
    title: 'Account',
    items: [
      { icon: User, label: 'Profile', desc: 'Update your name, email, and avatar', color: '#3B82F6', badge: null },
      { icon: Shield, label: 'Security', desc: 'Password, 2FA, and session management', color: '#EF4444', badge: 'Recommended' },
      { icon: Key, label: 'API Keys', desc: 'Manage personal access tokens', color: '#F59E0B', badge: null },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { icon: Bell, label: 'Notifications', desc: 'Telegram, Discord, Email, and Slack alerts', color: '#A855F7', badge: '3 active' },
      { icon: Globe, label: 'Localization', desc: 'Language preferences (English / हिंदी)', color: '#10B981', badge: null },
      { icon: Palette, label: 'Appearance', desc: 'Theme, accent color, and display density', color: '#EC4899', badge: null },
    ],
  },
  {
    title: 'Organization',
    items: [
      { icon: Settings, label: 'Organization', desc: 'Team members, roles, billing, and plan', color: '#FF6B2B', badge: '5 members' },
      { icon: Webhook, label: 'Webhooks', desc: 'Configure incoming and outgoing webhooks', color: '#06B6D4', badge: null },
      { icon: Monitor, label: 'Audit Log', desc: 'Track all actions and changes in your org', color: '#8B5CF6', badge: null },
    ],
  },
];

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-[30px] font-extrabold text-white tracking-tight">Settings</h1>
        <p className="text-sm text-slate-400 mt-1 font-medium">Manage your account, preferences, and organization</p>
      </div>

      {/* Quick Toggle — Theme */}
      <div className="glass-card-flat rounded-2xl p-5 flex items-center justify-between animate-fade-in" style={{ animationDelay: '80ms' }}>
        <div className="flex items-center gap-3">
          {darkMode ? <Moon size={18} className="text-indigo-400" /> : <Sun size={18} className="text-amber-400" />}
          <div>
            <p className="text-[13px] font-bold text-white">Dark Mode</p>
            <p className="text-[10px] text-slate-500 font-medium">Currently active</p>
          </div>
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="relative w-11 h-6 rounded-full transition-colors duration-300"
          style={{ background: darkMode ? 'linear-gradient(135deg, #FF6B2B, #E55A1B)' : 'rgba(255,255,255,0.1)' }}
        >
          <div
            className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-300"
            style={{ transform: darkMode ? 'translateX(24px)' : 'translateX(4px)' }}
          />
        </button>
      </div>

      {/* Settings Groups */}
      {settingsGroups.map((group, gIdx) => (
        <div key={group.title} className="animate-fade-in" style={{ animationDelay: `${gIdx * 80 + 120}ms` }}>
          <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.12em] mb-3 px-1">{group.title}</h2>
          <div className="space-y-2">
            {group.items.map((item, i) => (
              <div
                key={item.label}
                className="glass-card-flat flex items-center gap-4 p-5 rounded-2xl cursor-pointer group animate-fade-in"
                style={{ animationDelay: `${gIdx * 80 + i * 50 + 150}ms` }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${item.color}10`, boxShadow: `0 0 12px ${item.color}08` }}
                >
                  <item.icon size={18} style={{ color: item.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[13px] font-bold text-white">{item.label}</h3>
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider" style={{ background: `${item.color}10`, color: item.color }}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{item.desc}</p>
                </div>
                <ChevronRight size={16} className="text-slate-600 group-hover:text-slate-400 group-hover:translate-x-1 transition-all duration-200 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
