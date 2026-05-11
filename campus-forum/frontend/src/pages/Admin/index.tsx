import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { adminApi } from '@/api';
import type { DashboardVO, UserVO, ArticleVO } from '@/types';
import dayjs from 'dayjs';

function Dashboard() {
  const [data, setData] = useState<DashboardVO | null>(null);

  useEffect(() => {
    adminApi.getDashboard().then(setData).catch(console.error);
  }, []);

  if (!data) {
    return (
      <div className="flex justify-center py-12">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const stats = [
    { label: '总用户', value: data.totalUsers, color: 'from-primary to-blue-600', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { label: '总文章', value: data.totalArticles, color: 'from-secondary to-purple-600', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
    { label: '总评论', value: data.totalComments, color: 'from-accent to-cyan-600', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
    { label: '今日新增用户', value: data.todayNewUsers, color: 'from-success to-emerald-600', icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z' },
    { label: '今日新增文章', value: data.todayNewArticles, color: 'from-warning to-orange-600', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">数据概览</h2>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-base-100 rounded-xl shadow-sm border border-base-200/50 p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10 flex items-center justify-center mb-3`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
              </svg>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-base-content/50 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        各分类文章数
      </h3>
      <div className="bg-base-100 rounded-xl shadow-sm border border-base-200/50 overflow-hidden">
        <table className="table">
          <thead>
            <tr className="bg-base-200/50">
              <th className="text-xs font-semibold uppercase tracking-wider">分类</th>
              <th className="text-xs font-semibold uppercase tracking-wider">文章数</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data.categoryArticleCount).map(([name, count]) => (
              <tr key={name} className="hover:bg-base-200/30 transition-colors">
                <td className="font-medium">{name}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 max-w-[200px] bg-base-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                        style={{ width: `${Math.min((count / Math.max(...Object.values(data.categoryArticleCount))) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="font-bold text-sm">{count}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UserManagement() {
  const [users, setUsers] = useState<UserVO[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const loadUsers = async () => {
    try {
      const res = await adminApi.listUsers(page, 10);
      setUsers(res.list);
      setTotal(res.total);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [page]);

  const handleChangeRole = async (id: number, role: number) => {
    try {
      await adminApi.changeUserRole(id, role);
      loadUsers();
    } catch (e) {
      console.error(e);
    }
  };

  const handleChangeStatus = async (id: number, status: number) => {
    try {
      await adminApi.changeUserStatus(id, status);
      loadUsers();
    } catch (e) {
      console.error(e);
    }
  };

  const roleLabels = ['普通用户', '管理员', '超级管理员'];
  const totalPages = Math.ceil(total / 10);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">用户管理</h2>
      <div className="bg-base-100 rounded-xl shadow-sm border border-base-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr className="bg-base-200/50">
                <th>ID</th>
                <th>用户</th>
                <th>邮箱</th>
                <th>角色</th>
                <th>注册时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-base-200/30 transition-colors">
                  <td className="text-xs font-mono text-base-content/50">#{u.id}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-content flex items-center justify-center text-xs font-semibold shadow-sm">
                        {u.nickname?.[0] || u.username?.[0] || '?'}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{u.nickname || u.username}</p>
                        <p className="text-xs text-base-content/40">@{u.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-sm text-base-content/60">{u.email || '-'}</td>
                  <td>
                    <span className={`badge badge-sm ${
                      u.role >= 2 ? 'badge-primary' : u.role >= 1 ? 'badge-secondary' : 'badge-ghost'
                    }`}>
                      {roleLabels[u.role]}
                    </span>
                  </td>
                  <td className="text-sm text-base-content/60">{dayjs(u.createTime).format('YYYY-MM-DD')}</td>
                  <td>
                    <div className="flex gap-1">
                      <select
                        className="select select-bordered select-xs w-24 rounded-lg"
                        value={u.role}
                        onChange={(e) => handleChangeRole(u.id, Number(e.target.value))}
                      >
                        <option value={0}>普通用户</option>
                        <option value={1}>管理员</option>
                        <option value={2}>超级管理员</option>
                      </select>
                      <button
                        className={`btn btn-xs rounded-lg ${u.status === 1 ? 'btn-error' : 'btn-success'}`}
                        onClick={() => handleChangeStatus(u.id, u.status === 1 ? 0 : 1)}
                      >
                        {u.status === 1 ? '禁用' : '启用'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <div className="join shadow-sm">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let p: number;
              if (totalPages <= 5) p = i + 1;
              else if (page <= 3) p = i + 1;
              else if (page >= totalPages - 2) p = totalPages - 4 + i;
              else p = page - 2 + i;
              return (
                <button
                  key={p}
                  className={`join-item btn btn-sm ${p === page ? 'btn-primary shadow-sm' : ''}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function ArticleManagement() {
  const [articles, setArticles] = useState<ArticleVO[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');

  const loadArticles = async () => {
    try {
      const res = await adminApi.listArticles({ keyword, page, size: 10 });
      setArticles(res.list);
      setTotal(res.total);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadArticles();
  }, [page]);

  const totalPages = Math.ceil(total / 10);

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">文章管理</h2>
        <div className="join w-full sm:w-auto">
          <input
            className="input input-bordered input-sm join-item flex-1 sm:w-48 rounded-l-lg"
            placeholder="搜索文章标题"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadArticles()}
          />
          <button className="btn btn-sm join-item btn-primary rounded-r-lg" onClick={loadArticles}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="bg-base-100 rounded-xl shadow-sm border border-base-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr className="bg-base-200/50">
                <th>ID</th>
                <th>标题</th>
                <th>作者</th>
                <th>状态</th>
                <th>发布时间</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => (
                <tr key={a.id} className="hover:bg-base-200/30 transition-colors">
                  <td className="text-xs font-mono text-base-content/50">#{a.id}</td>
                  <td>
                    <Link to={`/article/${a.id}`} className="font-medium hover:text-primary transition-colors line-clamp-1">
                      {a.title}
                    </Link>
                  </td>
                  <td className="text-sm text-base-content/60">{a.authorName}</td>
                  <td>
                    <span className={`badge badge-sm ${
                      a.status === 1 ? 'badge-success' : a.status === 3 ? 'badge-error' : 'badge-warning'
                    }`}>
                      {a.status === 0 ? '草稿' : a.status === 1 ? '已发布' : a.status === 2 ? '审核中' : '已下架'}
                    </span>
                  </td>
                  <td className="text-sm text-base-content/60">{dayjs(a.createTime).format('YYYY-MM-DD')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <div className="join shadow-sm">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let p: number;
              if (totalPages <= 5) p = i + 1;
              else if (page <= 3) p = i + 1;
              else if (page >= totalPages - 2) p = totalPages - 4 + i;
              else p = page - 2 + i;
              return (
                <button
                  key={p}
                  className={`join-item btn btn-sm ${p === page ? 'btn-primary shadow-sm' : ''}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function Settings() {
  const [configs, setConfigs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getConfigs()
      .then(setConfigs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (key: string, value: string) => {
    try {
      await adminApi.updateConfig({ configKey: key, configValue: value });
      setConfigs((prev) => ({ ...prev, [key]: value }));
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">系统设置</h2>
      <div className="bg-base-100 rounded-xl shadow-sm border border-base-200/50 p-6">
        <div className="space-y-5">
          {Object.entries(configs).map(([key, value]) => (
            <div key={key} className="form-control">
              <label className="label">
                <span className="label-text font-semibold">{key}</span>
              </label>
              <div className="join w-full">
                <input
                  type="text"
                  className="input input-bordered join-item flex-1 rounded-l-lg focus:border-primary transition-colors"
                  value={value}
                  onChange={(e) => setConfigs((prev) => ({ ...prev, [key]: e.target.value }))}
                />
                <button
                  className="btn btn-primary join-item rounded-r-lg shadow-sm"
                  onClick={() => handleUpdate(key, value)}
                >
                  保存
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const { isAdmin } = useAuthStore();
  const location = useLocation();

  if (!isAdmin) {
    return (
      <div className="text-center py-24">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-base-200 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-base-content/50">无权限访问</p>
        <p className="text-sm text-base-content/30 mt-1">需要管理员权限</p>
      </div>
    );
  }

  const currentPath = location.pathname;

  const menuItems = [
    { path: '/admin', label: '数据概览', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { path: '/admin/users', label: '用户管理', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { path: '/admin/articles', label: '文章管理', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
    { path: '/admin/settings', label: '系统设置', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) return currentPath === path;
    return currentPath.startsWith(path) && (currentPath === path || currentPath.startsWith(path + '/'));
  };

  return (
    <div className="flex gap-6">
      <div className="w-56 flex-shrink-0 hidden md:block">
        <div className="bg-base-100 rounded-xl shadow-sm border border-base-200/50 overflow-hidden sticky top-24">
          <div className="p-4 border-b border-base-200/50 bg-gradient-to-r from-primary/5 to-secondary/5">
            <h3 className="font-bold flex items-center gap-2 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              </svg>
              管理后台
            </h3>
          </div>
          <ul className="menu menu-sm w-full p-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 rounded-lg transition-all duration-200 ${
                    isActive(item.path, item.path === '/admin')
                      ? 'active bg-primary/10 text-primary font-semibold'
                      : 'hover:bg-base-200/50'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        {/* Mobile Admin Nav */}
        <div className="md:hidden flex gap-2 overflow-x-auto mb-4 pb-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`btn btn-sm rounded-xl whitespace-nowrap ${
                isActive(item.path, item.path === '/admin')
                  ? 'btn-primary shadow-sm'
                  : 'btn-ghost'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {currentPath === '/admin/users' ? <UserManagement /> :
         currentPath === '/admin/articles' ? <ArticleManagement /> :
         currentPath === '/admin/settings' ? <Settings /> :
         <Dashboard />}
      </div>
    </div>
  );
}
