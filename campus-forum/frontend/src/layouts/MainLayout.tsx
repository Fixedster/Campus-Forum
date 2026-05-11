import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';
import { useEffect, useState } from 'react';
import { notificationApi } from '@/api';
import { useAuthStore } from '@/store/useAuthStore';

export default function MainLayout() {
  const { isLogin } = useAuthStore();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isLogin) {
      notificationApi.unreadCount().then(setUnreadCount).catch(() => {});
    }
  }, [isLogin]);

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <Header unreadCount={unreadCount} />
      <main className="max-w-content mx-auto px-4 py-6 w-full flex-1 animate-fade-in">
        <Outlet />
      </main>
      <footer className="bg-base-100 border-t border-base-200/50 py-8 mt-8">
        <div className="max-w-content mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="font-semibold text-sm gradient-text">Campus Forum</span>
            </div>
            <p className="text-xs text-base-content/40">
              校园技术交流平台 &copy; {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
