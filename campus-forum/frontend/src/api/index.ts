import axios from 'axios';
import type { Result, Tokens, UserVO, ArticleVO, PageResult, CommentVO, Category, TagVO, NotificationVO, DashboardVO } from '@/types';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const tokens: Tokens = JSON.parse(localStorage.getItem('tokens') || '{}');
  if (tokens.accessToken) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    const res = response.data as Result<any>;
    if (res.code !== 200) {
      return Promise.reject(new Error(res.message));
    }
    return res.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('tokens');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const oauthApi = {
  githubConfig: () => api.get('/oauth/github/config') as Promise<{ clientId: string; redirectUri: string }>,
  githubLogin: (code: string) => api.post('/oauth/github/callback', { code }) as Promise<Tokens>,
};

export const userApi = {
  register: (data: { username: string; password: string; nickname?: string; email?: string; college?: string; major?: string; studentId?: string }) =>
    api.post('/user/register', data) as Promise<Tokens>,
  login: (data: { username: string; password: string }) =>
    api.post('/user/login', data) as Promise<Tokens>,
  refresh: (refreshToken: string) =>
    api.post(`/user/refresh?refreshToken=${refreshToken}`) as Promise<Tokens>,
  logout: () => api.post('/user/logout'),
  getUserInfo: (id: number) => api.get(`/user/info/${id}`) as Promise<UserVO>,
  getCurrentUser: () => api.get('/user/info') as Promise<UserVO>,
  updateProfile: (data: Partial<UserVO>) => api.put('/user/profile', data),
  follow: (userId: number) => api.post(`/user/follow/${userId}`),
};

export const articleApi = {
  list: (params: {
    keyword?: string;
    categoryId?: number;
    tagId?: number;
    sort?: string;
    page?: number;
    size?: number;
  }) => api.get('/article/list', { params }) as Promise<PageResult<ArticleVO>>,
  getDetail: (id: number) => api.get(`/article/${id}`) as Promise<ArticleVO>,
  publish: (data: {
    title: string;
    content: string;
    summary?: string;
    coverImage?: string;
    categoryId: number;
    tagIds?: number[];
    source?: number;
  }) => api.post('/article/publish', data) as Promise<number>,
  update: (data: any) => api.put('/article/update', data),
  delete: (id: number) => api.delete(`/article/${id}`),
  toggleLike: (id: number) => api.post(`/article/${id}/like`),
  toggleCollect: (id: number) => api.post(`/article/${id}/collect`),
  getUserArticles: (userId: number, page = 1, size = 10) =>
    api.get(`/article/user/${userId}`, { params: { page, size } }) as Promise<ArticleVO[]>,
  getMyCollects: (page = 1, size = 10) =>
    api.get('/article/collects', { params: { page, size } }) as Promise<ArticleVO[]>,
};

export const commentApi = {
  getByArticle: (articleId: number) =>
    api.get(`/comment/article/${articleId}`) as Promise<CommentVO[]>,
  add: (data: { articleId: number; content: string; parentId?: number; replyUserId?: number }) =>
    api.post('/comment/add', data) as Promise<number>,
  delete: (id: number) => api.delete(`/comment/${id}`),
};

export const categoryApi = {
  list: () => api.get('/category/list') as Promise<Category[]>,
  listTags: (categoryId?: number) =>
    api.get('/category/tags', { params: { categoryId } }) as Promise<TagVO[]>,
};

export const notificationApi = {
  list: (page = 1, size = 10) =>
    api.get('/notification/list', { params: { page, size } }) as Promise<PageResult<NotificationVO>>,
  unreadCount: () => api.get('/notification/unread-count') as Promise<number>,
  markAsRead: (id: number) => api.post(`/notification/read/${id}`),
  markAllAsRead: () => api.post('/notification/read-all'),
};

export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard') as Promise<DashboardVO>,
  listUsers: (page = 1, size = 10) =>
    api.get('/admin/users', { params: { page, size } }) as Promise<PageResult<UserVO>>,
  changeUserRole: (id: number, role: number) =>
    api.put(`/admin/user/${id}/role?role=${role}`),
  changeUserStatus: (id: number, status: number) =>
    api.put(`/admin/user/${id}/status?status=${status}`),
  listArticles: (params: { keyword?: string; categoryId?: number; page?: number; size?: number }) =>
    api.get('/admin/articles', { params }) as Promise<PageResult<ArticleVO>>,
  getConfigs: () => api.get('/admin/configs') as Promise<Record<string, string>>,
  updateConfig: (data: { configKey: string; configValue: string; comment?: string }) =>
    api.put('/admin/config', data),
};

export const aiApi = {
  chat: (message: string) => api.post('/ai/chat', { message }) as Promise<string>,
  generateImage: (prompt: string) => api.post('/ai/generate-image', { prompt }) as Promise<string>,
  helpWrite: (topic: string, type?: string) => api.post('/ai/help-write', { topic, type }) as Promise<string>,
  status: () => api.get('/ai/status') as Promise<{ enabled: boolean; model: string; imageModel: string }>,
};
