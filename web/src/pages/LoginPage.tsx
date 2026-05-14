import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/useAuth';
import { Eye, EyeOff, ArrowRight, Zap, Shield, Globe, Server } from 'lucide-react';

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
      className="min-h-screen flex relative overflow-hidden"
      style={{ background: '#060B18' }}
    >
      {/* Ambient gradient mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-[15%] left-[10%] w-[500px] h-[500px] rounded-full opacity-[0.07] blur-[100px]"
          style={{ background: 'radial-gradient(circle, #FF6B2B, transparent)' }}
        />
        <div
          className="absolute bottom-[10%] right-[15%] w-[400px] h-[400px] rounded-full opacity-[0.05] blur-[100px]"
          style={{ background: 'radial-gradient(circle, #2563EB, transparent)' }}
        />
        <div
          className="absolute top-[60%] left-[50%] w-[300px] h-[300px] rounded-full opacity-[0.04] blur-[80px]"
          style={{ background: 'radial-gradient(circle, #A855F7, transparent)' }}
        />
      </div>

      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center relative z-10">
        <div className="max-w-md px-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 animate-float"
            style={{
              background: 'linear-gradient(135deg, #FF6B2B, #FF8F5E)',
              boxShadow: '0 0 50px rgba(255, 107, 43, 0.25)',
            }}
          >
            <Zap size={28} className="text-white" />
          </div>

          <h1 className="text-[42px] font-extrabold text-white mb-3 tracking-tight leading-tight">
            Swadeshi<span className="gradient-text">Ops</span>
          </h1>
          <p className="text-lg text-slate-400 mb-10 leading-relaxed font-medium">
            India's open-source DevOps platform.<br />
            Build, test, deploy — on your own terms.
          </p>

          <div className="space-y-5">
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
                  style={{ background: `${item.color}12` }}
                >
                  <item.icon size={18} style={{ color: item.color }} />
                </div>
                <span className="text-sm text-slate-300 font-medium">{item.text}</span>
              </div>
            ))}
          </div>

          {/* Floating badge */}
          <div
            className="mt-12 inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-semibold text-slate-400 animate-fade-in"
            style={{
              animationDelay: '600ms',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Open Source · MIT License · Forever Free
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 relative z-10">
        <div className="w-full max-w-[420px]">
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

          <h2 className="text-[26px] font-extrabold text-white mb-1.5 tracking-tight">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="text-slate-400 text-sm mb-8 font-medium">
            {isLogin ? 'Sign in to your SwadeshiOps dashboard' : 'Get started with SwadeshiOps — free forever'}
          </p>

          {error && (
            <div
              className="mb-6 px-4 py-3 rounded-xl text-sm font-medium animate-fade-in flex items-center gap-2"
              style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.15)', color: '#EF4444' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-[13px] font-semibold text-slate-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl text-sm text-white placeholder-slate-500 glass-input"
                    placeholder="Shiv Jani"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-slate-300 mb-2">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl text-sm text-white placeholder-slate-500 glass-input"
                    placeholder="shivjani"
                    required
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-[13px] font-semibold text-slate-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl text-sm text-white placeholder-slate-500 glass-input"
                placeholder="you@company.com"
                required
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-slate-300 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 pr-12 rounded-xl text-sm text-white placeholder-slate-500 glass-input"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1 rounded"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="font-semibold transition-colors hover:brightness-110"
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
