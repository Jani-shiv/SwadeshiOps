import { Settings, User, Bell, Shield, Globe, ChevronRight, Palette } from 'lucide-react';

const settingsGroups = [
  {
    title: 'Account',
    items: [
      { icon: User, label: 'Profile', desc: 'Update your name, email, and avatar', color: '#3B82F6' },
      { icon: Shield, label: 'Security', desc: 'Change password, enable 2FA, manage API keys', color: '#EF4444' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { icon: Bell, label: 'Notifications', desc: 'Configure Telegram, Discord, and email alerts', color: '#F59E0B' },
      { icon: Globe, label: 'Localization', desc: 'Language preferences (English / हिंदी)', color: '#10B981' },
      { icon: Palette, label: 'Appearance', desc: 'Theme, accent color, and display options', color: '#A855F7' },
    ],
  },
  {
    title: 'Organization',
    items: [
      { icon: Settings, label: 'Organization', desc: 'Team members, billing, and plan management', color: '#FF6B2B' },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-[28px] font-extrabold text-white tracking-tight">Settings</h1>
        <p className="text-sm text-slate-400 mt-1 font-medium">Manage your account and organization settings</p>
      </div>

      {/* Settings Groups */}
      {settingsGroups.map((group, gIdx) => (
        <div key={group.title} className="animate-fade-in" style={{ animationDelay: `${gIdx * 100}ms` }}>
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 px-1">{group.title}</h2>
          <div className="space-y-2">
            {group.items.map((item, i) => (
              <div
                key={item.label}
                className="glass-card flex items-center gap-4 p-5 rounded-2xl cursor-pointer group animate-fade-in"
                style={{ animationDelay: `${gIdx * 100 + i * 60}ms` }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `${item.color}12`,
                    boxShadow: `0 0 12px ${item.color}08`,
                  }}
                >
                  <item.icon size={20} style={{ color: item.color }} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-white">{item.label}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">{item.desc}</p>
                </div>
                <ChevronRight
                  size={16}
                  className="text-slate-600 group-hover:text-slate-400 group-hover:translate-x-1 transition-all duration-200"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
