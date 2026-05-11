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
    <div className="min-h-screen bg-gradient-to-br from-primary/15 via-base-200 to-secondary/15 flex items-center justify-center p-4">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-secondary/5 blur-3xl"></div>
      </div>

      <div className="w-full max-w-md animate-scale-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold gradient-text">Campus Forum</h1>
          <p className="text-sm text-base-content/50 mt-1">校园技术交流社区</p>
        </div>

        {/* Card */}
        <div className="bg-base-100 rounded-2xl shadow-xl border border-base-200/50 overflow-hidden">
          {/* Tabs */}
          <div className="flex p-1 bg-base-200/50 mx-4 mt-4 rounded-xl">
            <button
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                tab === 'login'
                  ? 'bg-base-100 text-base-content shadow-sm'
                  : 'text-base-content/50 hover:text-base-content'
              }`}
              onClick={() => { setTab('login'); setError(''); }}
            >
              登录
            </button>
            <button
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                tab === 'register'
                  ? 'bg-base-100 text-base-content shadow-sm'
                  : 'text-base-content/50 hover:text-base-content'
              }`}
              onClick={() => { setTab('register'); setError(''); }}
            >
              注册
            </button>
          </div>

          <div className="p-6">
            {error && (
              <div className="alert alert-error mb-4 py-2.5 rounded-xl text-sm shadow-sm animate-slide-up">
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
                    <span className="label-text text-xs font-medium text-base-content/60">用户名</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-base-content/40">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      placeholder="请输入用户名"
                      className="input input-bordered w-full pl-9 input-sm h-11 rounded-xl"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-xs font-medium text-base-content/60">密码</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-base-content/40">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </span>
                    <input
                      type="password"
                      placeholder="请输入密码"
                      className="input input-bordered w-full pl-9 input-sm h-11 rounded-xl"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    />
                  </div>
                </div>
                <button
                  className={`btn btn-primary w-full h-11 rounded-xl shadow-sm shadow-primary/20 ${loading ? 'loading' : ''}`}
                  onClick={handleLogin}
                  disabled={loading}
                >
                  {loading ? '登录中...' : '登 录'}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-xs font-medium text-base-content/60">用户名 <span className="text-error">*</span></span>
                  </label>
                  <input
                    type="text"
                    placeholder="3-20位字母/数字"
                    className="input input-bordered w-full input-sm h-11 rounded-xl"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-xs font-medium text-base-content/60">昵称</span>
                  </label>
                  <input
                    type="text"
                    placeholder="选填，默认为用户名"
                    className="input input-bordered w-full input-sm h-11 rounded-xl"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                  />
                </div>
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-xs font-medium text-base-content/60">邮箱</span>
                  </label>
                  <input
                    type="email"
                    placeholder="选填，用于找回密码"
                    className="input input-bordered w-full input-sm h-11 rounded-xl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-xs font-medium text-base-content/60">密码 <span className="text-error">*</span></span>
                  </label>
                  <input
                    type="password"
                    placeholder="6-32位"
                    className="input input-bordered w-full input-sm h-11 rounded-xl"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-xs font-medium text-base-content/60">确认密码 <span className="text-error">*</span></span>
                  </label>
                  <input
                    type="password"
                    placeholder="再次输入密码"
                    className="input input-bordered w-full input-sm h-11 rounded-xl"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                  />
                </div>
                <button
                  className={`btn btn-primary w-full h-11 rounded-xl shadow-sm shadow-primary/20 mt-1 ${loading ? 'loading' : ''}`}
                  onClick={handleRegister}
                  disabled={loading}
                >
                  {loading ? '注册中...' : '注 册'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer text */}
        <p className="text-center text-xs text-base-content/40 mt-6">
          &copy; {new Date().getFullYear()} Campus Forum. All rights reserved.
        </p>
      </div>
    </div>
  );
}
