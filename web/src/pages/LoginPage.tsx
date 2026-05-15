import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/useAuth';
import { Eye, EyeOff, ArrowRight, Zap, Shield, GitBranch, Lock, ExternalLink, LayoutDashboard, Rocket, CheckCircle2 } from 'lucide-react';

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
    <div className="relative min-h-screen overflow-hidden noise-overlay">
      <div className="mesh-gradient" />

      <div className="relative z-10 grid min-h-screen lg:grid-cols-[1.15fr_0.85fr]">
        <section className="hidden flex-col justify-between border-r border-[var(--color-border)] bg-[rgba(255,255,255,0.7)] p-10 lg:flex xl:p-14">
          <div>
            <div className="mb-8 inline-flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-white/90 px-4 py-3 shadow-[0_10px_30px_rgba(66,16,44,0.12)] backdrop-blur-xl">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: 'linear-gradient(135deg, #e06a2c, #c85b23)' }}>
                <Zap size={22} className="text-white" />
              </div>
              <div>
                <p className="text-[16px] font-extrabold tracking-tight text-slate-900">SwadeshiOps</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">DevOps platform</p>
              </div>
            </div>

            <h1 className="max-w-xl text-5xl font-extrabold leading-[1.05] tracking-tight text-slate-900">
              A cleaner control room for shipping software.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              One workspace for projects, pipelines, deployments, logs, and secrets, designed to feel fast, calm, and easy to scan.
            </p>

            <div className="mt-10 grid max-w-xl gap-4">
              {[
                { icon: LayoutDashboard, title: 'Single dashboard', text: 'Everything important in one place, without visual clutter.' },
                { icon: Rocket, title: 'Faster decisions', text: 'Compact cards, clear states, and readable hierarchy.' },
                { icon: CheckCircle2, title: 'Built for trust', text: 'Status, activity, and actions stay visible at every step.' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 rounded-3xl border border-[var(--color-border)] bg-white/90 p-4 shadow-[0_10px_25px_rgba(66,16,44,0.12)] backdrop-blur-xl">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl" style={{ background: 'rgba(224,106,44,0.10)' }}>
                    <item.icon size={19} style={{ color: 'var(--color-accent)' }} />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-slate-900">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid max-w-xl grid-cols-3 gap-4">
            {[
              { value: '1.2K+', label: 'Runs tracked' },
              { value: '99.9%', label: 'Availability' },
              { value: '< 3s', label: 'Avg build time' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-[var(--color-border)] bg-white/90 p-4 text-center shadow-[0_10px_25px_rgba(66,16,44,0.12)] backdrop-blur-xl">
                <p className="text-xl font-extrabold tracking-tight text-slate-900">{stat.value}</p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-10 sm:px-8 lg:px-10">
          <div className="w-full max-w-[460px]">
            <div className="mb-8 lg:hidden">
              <div className="mb-4 inline-flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-white/90 px-4 py-3 shadow-[0_10px_30px_rgba(66,16,44,0.12)] backdrop-blur-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl" style={{ background: 'linear-gradient(135deg, #e06a2c, #c85b23)' }}>
                  <Zap size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-[15px] font-extrabold tracking-tight text-slate-900">SwadeshiOps</p>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">DevOps platform</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.95)] p-6 shadow-[0_18px_50px_rgba(66,16,44,0.16)] backdrop-blur-xl sm:p-8">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                    {isLogin ? 'Welcome back' : 'Create your account'}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {isLogin ? 'Sign in to continue to your dashboard.' : 'Set up your workspace in a few quick steps.'}
                  </p>
                </div>
                <div className="hidden rounded-2xl bg-[rgba(224,106,44,0.10)] p-3 text-[color:var(--color-accent)] sm:block">
                  <Shield size={18} />
                </div>
              </div>

              {error && (
                <div className="mb-5 flex items-center gap-2 rounded-2xl border border-[rgba(209,67,67,0.18)] bg-[rgba(209,67,67,0.08)] px-4 py-3 text-[12px] font-medium text-[var(--color-error)] animate-fade-in">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--color-error)]" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-[12px] font-bold text-slate-700">Full Name</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-[13px] text-slate-900 outline-none transition focus:border-[var(--color-accent)] focus:ring-4 focus:ring-[rgba(224,106,44,0.12)]"
                        placeholder="Shiv Jani"
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-[12px] font-bold text-slate-700">Username</label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-[13px] text-slate-900 outline-none transition focus:border-[var(--color-accent)] focus:ring-4 focus:ring-[rgba(224,106,44,0.12)]"
                        placeholder="shivjani"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-[12px] font-bold text-slate-700">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-[13px] text-slate-900 outline-none transition focus:border-[var(--color-accent)] focus:ring-4 focus:ring-[rgba(224,106,44,0.12)]"
                    placeholder="you@company.com"
                    required
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-[12px] font-bold text-slate-700">Password</label>
                    {isLogin && (
                      <button type="button" className="text-[11px] font-semibold text-[color:var(--color-accent)] transition hover:opacity-80">
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
                      className="w-full rounded-2xl border border-[var(--color-border)] bg-white py-3 pl-10 pr-12 text-[13px] text-slate-900 outline-none transition focus:border-[var(--color-accent)] focus:ring-4 focus:ring-[rgba(224,106,44,0.12)]"
                      placeholder="••••••••"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-[13px] font-bold disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <>
                      {isLogin ? 'Sign In' : 'Create Account'}
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-[rgba(24,22,18,0.08)]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">or continue with</span>
                <div className="h-px flex-1 bg-[rgba(24,22,18,0.08)]" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="btn-secondary flex items-center justify-center gap-2 rounded-2xl py-3 text-[12px] font-bold">
                  <ExternalLink size={16} />
                  GitHub
                </button>
                <button className="btn-secondary flex items-center justify-center gap-2 rounded-2xl py-3 text-[12px] font-bold">
                  <GitBranch size={16} />
                  GitLab
                </button>
              </div>

              <p className="mt-8 text-center text-[13px] text-slate-500">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <button
                  onClick={() => { setIsLogin(!isLogin); setError(''); }}
                  className="font-bold text-[color:var(--color-accent)] transition hover:opacity-80"
                >
                  {isLogin ? 'Sign up free' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
