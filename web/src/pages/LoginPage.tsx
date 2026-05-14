import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/useAuth';
import { Eye, EyeOff, ArrowRight, Zap, Shield, Globe, Server, GitBranch, Lock, ExternalLink } from 'lucide-react';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        navigate('/');
      } else {
        await register(email, username, password, fullName);
        await login(email, password);
        navigate('/');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: { message?: string } } } };
      setError(error?.response?.data?.error?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex relative overflow-hidden noise-overlay"
      style={{ background: '#050A15' }}
    >
      {/* Ambient gradient mesh — more vibrant */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-[10%] left-[5%] w-[600px] h-[600px] rounded-full opacity-[0.08] blur-[120px] animate-float"
          style={{ background: 'radial-gradient(circle, #FF6B2B, transparent)', animationDuration: '8s' }}
        />
        <div
          className="absolute bottom-[5%] right-[10%] w-[500px] h-[500px] rounded-full opacity-[0.06] blur-[100px] animate-float"
          style={{ background: 'radial-gradient(circle, #2563EB, transparent)', animationDelay: '3s', animationDuration: '10s' }}
        />
        <div
          className="absolute top-[55%] left-[45%] w-[350px] h-[350px] rounded-full opacity-[0.04] blur-[80px] animate-float"
          style={{ background: 'radial-gradient(circle, #A855F7, transparent)', animationDelay: '5s', animationDuration: '12s' }}
        />
      </div>

      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center relative z-10">
        <div className="max-w-lg px-10">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 animate-float"
            style={{
              background: 'linear-gradient(135deg, #FF6B2B, #FF8F5E)',
              boxShadow: '0 0 60px rgba(255, 107, 43, 0.3), 0 0 120px rgba(255, 107, 43, 0.1)',
            }}
          >
            <Zap size={28} className="text-white" />
          </div>

          <h1 className="text-[46px] font-extrabold text-white mb-3 tracking-tight leading-[1.1]">
            Swadeshi<span className="gradient-text">Ops</span>
          </h1>
          <p className="text-lg text-slate-400 mb-10 leading-relaxed font-medium">
            India's open-source DevOps platform.<br />
            Build, test, deploy — on your own terms.
          </p>

          <div className="space-y-4">
            {[
              { icon: Server, text: 'CI/CD pipelines that run on a ₹500/mo VPS', color: '#FF6B2B' },
              { icon: Shield, text: 'Self-hosted — your code stays with you', color: '#10B981' },
              { icon: Globe, text: 'Built for Indian developers, by Indian developers', color: '#3B82F6' },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 animate-fade-in"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${item.color}12`, boxShadow: `0 0 12px ${item.color}08` }}
                >
                  <item.icon size={18} style={{ color: item.color }} />
                </div>
                <span className="text-[14px] text-slate-300 font-medium">{item.text}</span>
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div
            className="mt-12 flex items-center gap-8 animate-fade-in"
            style={{ animationDelay: '500ms' }}
          >
            {[
              { value: '1.2K+', label: 'Pipelines Run' },
              { value: '99.9%', label: 'Uptime' },
              { value: '< 3s', label: 'Avg Build' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-xl font-extrabold text-white stat-value">{stat.value}</p>
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Badge */}
          <div
            className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-semibold text-slate-400 animate-fade-in"
            style={{
              animationDelay: '700ms',
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Open Source · MIT License · Forever Free
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 relative z-10">
        <div className="w-full max-w-[440px]">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #FF6B2B, #FF8F5E)' }}
            >
              <Zap size={20} className="text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">SwadeshiOps</h1>
          </div>

          <h2 className="text-[28px] font-extrabold text-white mb-1 tracking-tight">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="text-slate-400 text-sm mb-8 font-medium">
            {isLogin ? 'Sign in to your SwadeshiOps dashboard' : 'Get started with SwadeshiOps — free forever'}
          </p>

          {error && (
            <div
              className="mb-6 px-4 py-3 rounded-xl text-[12px] font-medium animate-fade-in flex items-center gap-2"
              style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.15)', color: '#EF4444' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-slate-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-[13px] glass-input"
                    placeholder="Shiv Jani"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-slate-300 mb-2">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-[13px] glass-input"
                    placeholder="shivjani"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[12px] font-bold text-slate-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-[13px] glass-input"
                placeholder="you@company.com"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[12px] font-bold text-slate-300">Password</label>
                {isLogin && (
                  <button type="button" className="text-[11px] font-semibold transition-colors hover:brightness-110" style={{ color: '#FF6B2B' }}>
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 rounded-xl text-[13px] glass-input"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1 rounded"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-[13px] font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
            <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">or continue with</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <button className="btn-secondary flex items-center justify-center gap-2 py-3 rounded-xl text-[12px] font-bold">
              <ExternalLink size={16} />
              GitHub
            </button>
            <button className="btn-secondary flex items-center justify-center gap-2 py-3 rounded-xl text-[12px] font-bold">
              <GitBranch size={16} />
              GitLab
            </button>
          </div>

          <p className="mt-8 text-center text-[13px] text-slate-500">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="font-bold transition-colors hover:brightness-110"
              style={{ color: '#FF6B2B' }}
            >
              {isLogin ? 'Sign up free' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
