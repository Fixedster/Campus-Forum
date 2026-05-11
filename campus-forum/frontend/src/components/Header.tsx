import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useState, useEffect } from 'react';

interface HeaderProps {
  unreadCount: number;
}

export default function Header({ unreadCount }: HeaderProps) {
  const { user, isLogin, isAdmin, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.getAttribute('data-theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    setDarkMode(next === 'dark');
    localStorage.setItem('theme', next);
  };

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
      setDarkMode(saved === 'dark');
    }
  }, []);

  const isActive = (path: string) => {
    if (path === '/home') return location.pathname === '/home';
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { path: '/home', label: '首页', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  ];

  return (
    <div className={`navbar sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'glass shadow-sm' : 'bg-base-100/80'}`}>
      <div className="max-w-content mx-auto flex-1 px-4">
        <div className="flex-none lg:hidden">
          <button
            className="btn btn-ghost btn-sm btn-circle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        <Link to="/" className="flex items-center gap-2 no-underline">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span className="text-lg font-bold gradient-text hidden sm:inline">Campus Forum</span>
        </Link>

        <div className="hidden lg:flex flex-1 items-center gap-1 ml-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`btn btn-sm gap-1.5 transition-all duration-200 ${
                isActive(link.path)
                  ? 'btn-primary shadow-sm'
                  : 'btn-ghost hover:bg-base-300/50'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
              </svg>
              {link.label}
            </Link>
          ))}
          {isLogin && (
            <Link
              to="/ai"
              className={`btn btn-sm gap-1.5 transition-all duration-200 ${
                isActive('/ai')
                  ? 'btn-primary shadow-sm'
                  : 'btn-ghost hover:bg-base-300/50'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              AI 助手
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              className={`btn btn-sm gap-1.5 transition-all duration-200 ${
                isActive('/admin')
                  ? 'btn-primary shadow-sm'
                  : 'btn-ghost hover:bg-base-300/50'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              管理
            </Link>
          )}
        </div>

        <div className="flex-none flex items-center gap-1">
          <button
            className="btn btn-ghost btn-sm btn-circle theme-toggle"
            onClick={toggleTheme}
            title={darkMode ? '切换到亮色模式' : '切换到暗色模式'}
          >
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {isLogin ? (
            <>
              <button
                className="btn btn-primary btn-sm gap-1.5 shadow-sm hidden sm:inline-flex"
                onClick={() => navigate('/publish')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">发帖</span>
              </button>

              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-sm btn-circle avatar placeholder"
                >
                  <div className="bg-gradient-to-br from-primary to-secondary text-primary-content w-9 rounded-full shadow-sm">
                    <span className="text-sm font-semibold">{user?.nickname?.[0] || '?'}</span>
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="mt-3 z-[1] p-2 shadow-lg menu menu-sm dropdown-content bg-base-100 rounded-box w-56 border border-base-200 animate-scale-in"
                >
                  <li className="menu-title">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-content flex items-center justify-center text-sm font-semibold">
                        {user?.nickname?.[0] || '?'}
                      </div>
                      <div>
                        <span className="font-semibold text-sm">{user?.nickname || user?.username}</span>
                        <span className="text-xs text-base-content/50 block">@{user?.username}</span>
                      </div>
                    </div>
                  </li>
                  <div className="divider my-1"></div>
                  <li>
                    <Link to={`/user/${user?.id}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      个人主页
                    </Link>
                  </li>
                  <li>
                    <Link to="/messages">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      消息通知
                      {unreadCount > 0 && (
                        <span className="badge badge-sm badge-primary badge-outline ml-auto">{unreadCount}</span>
                      )}
                    </Link>
                  </li>
                  <div className="divider my-1"></div>
                  <li>
                    <a onClick={() => { logout(); navigate('/'); }}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      退出登录
                    </a>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-1">
              <Link to="/login" className="btn btn-ghost btn-sm">登录</Link>
              <Link to="/login?tab=register" className="btn btn-primary btn-sm shadow-sm">注册</Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 z-50 animate-slide-up">
          <div className="bg-base-100 border-b border-base-200 shadow-lg p-4 space-y-1">
            <Link
              to="/home"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-base-200 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="font-medium">首页</span>
            </Link>
            {isLogin && (
              <Link
                to="/ai"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-base-200 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="font-medium">AI 助手</span>
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-base-200 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium">管理后台</span>
              </Link>
            )}
            {isLogin && (
              <div className="border-t border-base-200 pt-2 mt-2">
                <Link
                  to={`/user/${user?.id}`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-base-200 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-content flex items-center justify-center text-sm font-semibold">
                    {user?.nickname?.[0] || '?'}
                  </div>
                  <div>
                    <span className="font-medium text-sm">{user?.nickname}</span>
                    <span className="text-xs text-base-content/50 block">@{user?.username}</span>
                  </div>
                </Link>
                <button
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-base-200 transition-colors w-full text-left text-error"
                  onClick={() => { logout(); navigate('/'); setMobileMenuOpen(false); }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>退出登录</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
