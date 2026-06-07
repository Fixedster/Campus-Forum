import { create } from 'zustand';
import type { UserVO, Tokens } from '@/types';
import { userApi, oauthApi } from '@/api';

interface AuthState {
  user: UserVO | null;
  isLogin: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (data: { username: string; password: string; nickname?: string; email?: string }) => Promise<void>;
  githubLogin: (code: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => {
  const storedTokens = localStorage.getItem('tokens');
  const storedUser = localStorage.getItem('user');
  const initialUser = storedUser ? JSON.parse(storedUser) : null;

  return {
    user: initialUser,
    isLogin: !!storedTokens,
    isAdmin: initialUser?.role >= 1,
    isSuperAdmin: initialUser?.role >= 2,

    login: async (username, password) => {
      const tokens = await userApi.login({ username, password });
      localStorage.setItem('tokens', JSON.stringify(tokens));
      const user = await userApi.getCurrentUser();
      localStorage.setItem('user', JSON.stringify(user));
      set({
        user,
        isLogin: true,
        isAdmin: user.role >= 1,
        isSuperAdmin: user.role >= 2,
      });
    },

    register: async (data) => {
      const tokens = await userApi.register(data);
      localStorage.setItem('tokens', JSON.stringify(tokens));
      const user = await userApi.getCurrentUser();
      localStorage.setItem('user', JSON.stringify(user));
      set({
        user,
        isLogin: true,
        isAdmin: user.role >= 1,
        isSuperAdmin: user.role >= 2,
      });
    },

    githubLogin: async (code) => {
      const tokens = await oauthApi.githubLogin(code);
      localStorage.setItem('tokens', JSON.stringify(tokens));
      const user = await userApi.getCurrentUser();
      localStorage.setItem('user', JSON.stringify(user));
      set({
        user,
        isLogin: true,
        isAdmin: user.role >= 1,
        isSuperAdmin: user.role >= 2,
      });
    },

    logout: () => {
      userApi.logout().catch(() => {});
      localStorage.removeItem('tokens');
      localStorage.removeItem('user');
      set({ user: null, isLogin: false, isAdmin: false, isSuperAdmin: false });
    },

    loadUser: async () => {
      try {
        const user = await userApi.getCurrentUser();
        localStorage.setItem('user', JSON.stringify(user));
        set({
          user,
          isLogin: true,
          isAdmin: user.role >= 1,
          isSuperAdmin: user.role >= 2,
        });
      } catch {
        localStorage.removeItem('tokens');
        localStorage.removeItem('user');
        set({ user: null, isLogin: false, isAdmin: false, isSuperAdmin: false });
      }
    },
  };
});
