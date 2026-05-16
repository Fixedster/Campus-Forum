import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

export default function Login() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'register' ? 'register' : 'login';
  const [tab, setTab] = useState(initialTab);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useAuthStore();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError('请输入用户名和密码');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(username, password);
      navigate('/');
    } catch (e: any) {
      setError(e.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!username.trim() || !password.trim()) {
      setError('请输入用户名和密码');
      return;
    }
    if (password !== confirmPassword) {
      setError('两次密码输入不一致');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await register({ username, password, nickname: nickname || username, email: email || undefined });
      navigate('/');
    } catch (e: any) {
      setError(e.message || '注册失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-primary/[0.04] via-base-200/30 to-accent/[0.04]" />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-primary/[0.03] blur-[100px]" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-accent/[0.03] blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/[0.015] blur-[120px]" />
      </div>

      <div className="w-full max-w-[420px] animate-scale-in relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl shadow-primary/15 animate-glow-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold gradient-text tracking-tight">Campus Forum</h1>
          <p className="text-xs text-base-content/30 mt-1.5 font-medium tracking-wide">校园技术交流社区</p>
        </div>

        <div className="surface-elevated rounded-2xl overflow-hidden noise">
          <div className="flex p-1 surface-soft mx-5 mt-5 rounded-xl">
            <button
              className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                tab === 'login'
                  ? 'bg-base-100 text-base-content shadow-sm'
                  : 'text-base-content/35 hover:text-base-content/55'
              }`}
              onClick={() => { setTab('login'); setError(''); }}
            >
              登录
            </button>
            <button
              className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                tab === 'register'
                  ? 'bg-base-100 text-base-content shadow-sm'
                  : 'text-base-content/35 hover:text-base-content/55'
              }`}
              onClick={() => { setTab('register'); setError(''); }}
            >
              注册
            </button>
          </div>

          <div className="p-6">
            {error && (
              <div className="alert mb-4 py-2.5 rounded-xl text-xs animate-slide-up bg-error/8 border-error/15 text-error">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {tab === 'login' ? (
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-[11px] font-semibold text-base-content/45">用户名</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-base-content/20">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      placeholder="请输入用户名"
                      className="input-styled pl-10 w-full"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-[11px] font-semibold text-base-content/45">密码</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-base-content/20">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </span>
                    <input
                      type="password"
                      placeholder="请输入密码"
                      className="input-styled pl-10 w-full"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    />
                  </div>
                </div>
                <button
                  className={`btn btn-primary w-full h-11 rounded-xl text-sm font-semibold tracking-wide ${loading ? 'loading' : ''}`}
                  style={{ boxShadow: '0 4px 16px -4px hsl(var(--p) / 0.3)' }}
                  onClick={handleLogin}
                  disabled={loading}
                >
                  {loading ? '登录中...' : '登 录'}
                </button>
              </div>
            ) : (
              <div className="space-y-3.5">
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-[11px] font-semibold text-base-content/45">用户名 <span className="text-error">*</span></span>
                  </label>
                  <input
                    type="text"
                    placeholder="3-20位字母/数字"
                    className="input-styled w-full"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-[11px] font-semibold text-base-content/45">昵称</span>
                  </label>
                  <input
                    type="text"
                    placeholder="选填，默认为用户名"
                    className="input-styled w-full"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                  />
                </div>
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-[11px] font-semibold text-base-content/45">邮箱</span>
                  </label>
                  <input
                    type="email"
                    placeholder="选填，用于找回密码"
                    className="input-styled w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-[11px] font-semibold text-base-content/45">密码 <span className="text-error">*</span></span>
                  </label>
                  <input
                    type="password"
                    placeholder="6-32位"
                    className="input-styled w-full"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-[11px] font-semibold text-base-content/45">确认密码 <span className="text-error">*</span></span>
                  </label>
                  <input
                    type="password"
                    placeholder="再次输入密码"
                    className="input-styled w-full"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                  />
                </div>
                <button
                  className={`btn btn-primary w-full h-11 rounded-xl text-sm font-semibold tracking-wide mt-1 ${loading ? 'loading' : ''}`}
                  style={{ boxShadow: '0 4px 16px -4px hsl(var(--p) / 0.3)' }}
                  onClick={handleRegister}
                  disabled={loading}
                >
                  {loading ? '注册中...' : '注 册'}
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-[10px] text-base-content/15 mt-8 tracking-widest font-medium">
          &copy; {new Date().getFullYear()} CAMPUS FORUM
        </p>
      </div>
    </div>
  );
}
