import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { notificationApi } from '@/api';
import type { NotificationVO } from '@/types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

const typeConfig: Record<number, { label: string; icon: string; color: string }> = {
  1: { label: '评论了你的文章', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', color: 'primary' },
  2: { label: '回复了你的评论', icon: 'M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6', color: 'secondary' },
  3: { label: '点赞了你的文章', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', color: 'error' },
  4: { label: '关注了你', icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z', color: 'success' },
  5: { label: '系统通知', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'accent' },
};

export default function Messages() {
  const [notifications, setNotifications] = useState<NotificationVO[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationApi.list(page, 10);
      setNotifications(res.list);
      setTotal(res.total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [page]);

  const handleMarkAll = async () => {
    try {
      await notificationApi.markAllAsRead();
      loadNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkOne = async (id: number) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: 1 } : n))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const totalPages = Math.ceil(total / 10);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">消息通知</h1>
          <p className="text-sm text-base-content/50 mt-1">
            {total > 0 ? `共 ${total} 条通知` : '暂无通知'}
          </p>
        </div>
        {notifications.some((n) => n.isRead === 0) && (
          <button
            className="btn btn-ghost btn-sm gap-1.5 text-primary rounded-xl"
            onClick={handleMarkAll}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            全部已读
          </button>
        )}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-sm text-base-content/50 animate-pulse-soft">加载中...</p>
        </div>
      ) : (
        <>
          {/* List */}
          {notifications.length === 0 ? (
            <div className="bg-base-100 rounded-2xl shadow-sm border border-base-200/50 p-16 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-base-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <p className="text-base text-base-content/50">暂无消息</p>
              <p className="text-xs text-base-content/30 mt-1">当有人与你互动时，你将收到通知</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((noti) => {
                const config = typeConfig[noti.type] || typeConfig[5];
                return (
                  <div
                    key={noti.id}
                    className={`bg-base-100 rounded-xl shadow-sm border transition-all duration-200 cursor-pointer hover:shadow-md ${
                      noti.isRead === 0
                        ? 'border-l-4 border-l-primary border-base-200/50'
                        : 'border-base-200/30 opacity-80'
                    }`}
                    onClick={() => {
                      if (noti.isRead === 0) handleMarkOne(noti.id);
                    }}
                  >
                    <div className="p-4 flex items-start gap-3">
                      {/* Type Icon */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        config.color === 'primary' ? 'bg-primary/10' :
                        config.color === 'secondary' ? 'bg-secondary/10' :
                        config.color === 'error' ? 'bg-error/10' :
                        config.color === 'success' ? 'bg-success/10' :
                        'bg-accent/10'
                      }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${
                          config.color === 'primary' ? 'text-primary' :
                          config.color === 'secondary' ? 'text-secondary' :
                          config.color === 'error' ? 'text-error' :
                          config.color === 'success' ? 'text-success' :
                          'text-accent'
                        }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={config.icon} />
                        </svg>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Link
                            to={`/user/${noti.fromUserId}`}
                            className="font-semibold text-sm hover:text-primary transition-colors"
                          >
                            {noti.fromUserName || '系统'}
                          </Link>
                          <span className="text-xs text-base-content/40">{config.label}</span>
                          {noti.isRead === 0 && (
                            <span className="badge badge-primary badge-xs animate-pulse-soft">新</span>
                          )}
                        </div>
                        {noti.content && !noti.targetId && (
                          <p className="text-sm text-base-content/60 line-clamp-1">{noti.content}</p>
                        )}
                        {noti.targetId > 0 && (
                          <Link
                            to={`/article/${noti.targetId}`}
                            className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                          >
                            查看详情
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        )}
                        <p className="text-xs text-base-content/30 mt-1">{dayjs(noti.createTime).fromNow()}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="join shadow-sm">
                <button
                  className={`join-item btn btn-sm ${page <= 1 ? 'btn-disabled' : ''}`}
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                >
                  «
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let p: number;
                  if (totalPages <= 5) {
                    p = i + 1;
                  } else if (page <= 3) {
                    p = i + 1;
                  } else if (page >= totalPages - 2) {
                    p = totalPages - 4 + i;
                  } else {
                    p = page - 2 + i;
                  }
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
                <button
                  className={`join-item btn btn-sm ${page >= totalPages ? 'btn-disabled' : ''}`}
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages}
                >
                  »
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
