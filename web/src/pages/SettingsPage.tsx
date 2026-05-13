import { Settings, User, Bell, Shield, Globe } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Settings</h1><p className="text-sm text-slate-400 mt-1">Manage your account and organization settings</p></div>
      <div className="grid gap-4">
        {[
          { icon: User, label: 'Profile', desc: 'Update your name, email, and avatar' },
          { icon: Bell, label: 'Notifications', desc: 'Configure Telegram, Discord, and email alerts' },
          { icon: Shield, label: 'Security', desc: 'Change password, enable 2FA, manage API keys' },
          { icon: Globe, label: 'Localization', desc: 'Language preferences (English / हिंदी)' },
          { icon: Settings, label: 'Organization', desc: 'Team members, billing, and plan management' },
        ].map((item, i) => (
          <div key={item.label} className="flex items-center gap-4 p-5 rounded-xl cursor-pointer hover:border-white/10 transition-all animate-fade-in" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', animationDelay: `${i * 60}ms` }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,107,43,0.1)' }}><item.icon size={20} style={{ color: '#FF6B2B' }} /></div>
            <div className="flex-1"><h3 className="text-sm font-semibold text-white">{item.label}</h3><p className="text-xs text-slate-400">{item.desc}</p></div>
            <span className="text-slate-600">→</span>
          </div>
        ))}
      </div>
    </div>
  );
}
