import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #0A1628 0%, #0D1B2A 50%, #132040 100%)' }}>
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center relative overflow-hidden">
        {/* Gradient orbs */}
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #FF6B2B, transparent)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, #2563EB, transparent)' }}
        />

        <div className="relative z-10 max-w-md px-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8"
            style={{
              background: 'linear-gradient(135deg, #FF6B2B, #FF8F5E)',
              boxShadow: '0 0 40px rgba(255, 107, 43, 0.3)',
            }}
          >
            <span className="text-white font-bold text-2xl">S</span>
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">
            SwadeshiOps
          </h1>
          <p className="text-lg text-slate-400 mb-8">
            India's open-source DevOps platform. Build, test, deploy — on your own terms.
          </p>

          <div className="space-y-4">
            {[
              { emoji: '🚀', text: 'CI/CD pipelines that run on a ₹500/mo VPS' },
              { emoji: '🔒', text: 'Self-hosted — your code stays with you' },
              { emoji: '🇮🇳', text: 'Built for Indian developers, by Indian developers' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-300">
                <span className="text-xl">{item.emoji}</span>
                <span className="text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #FF6B2B, #FF8F5E)' }}
            >
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <h1 className="text-2xl font-bold text-white">SwadeshiOps</h1>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="text-slate-400 text-sm mb-8">
            {isLogin ? 'Sign in to your SwadeshiOps dashboard' : 'Get started with SwadeshiOps — free forever'}
          </p>

          {error && (
            <div
              className="mb-6 px-4 py-3 rounded-lg text-sm animate-fade-in"
              style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#EF4444' }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-slate-500 transition-all focus:outline-none focus:ring-2"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      focusRingColor: '#FF6B2B',
                    }}
                    placeholder="Shiv Jani"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-slate-500 transition-all focus:outline-none focus:ring-2"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                    placeholder="shivjani"
                    required
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-slate-500 transition-all focus:outline-none focus:ring-2"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
                placeholder="you@company.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-lg text-sm text-white placeholder-slate-500 transition-all focus:outline-none focus:ring-2"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #FF6B2B, #E55A1B)',
                boxShadow: '0 4px 15px rgba(255, 107, 43, 0.3)',
              }}
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

          <p className="mt-6 text-center text-sm text-slate-500">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="font-medium transition-colors"
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
