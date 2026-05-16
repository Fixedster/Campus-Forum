import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { userApi, articleApi } from '@/api';
import { useAuthStore } from '@/store/useAuthStore';
import UserCard from '@/components/UserCard';
import ArticleCard from '@/components/ArticleCard';
import type { UserVO, ArticleVO } from '@/types';

export default function UserCenter() {
  const { id } = useParams();
  const { user: currentUser, isLogin } = useAuthStore();
  const [userInfo, setUserInfo] = useState<UserVO | null>(null);
  const [articles, setArticles] = useState<ArticleVO[]>([]);
  const [tab, setTab] = useState<'articles' | 'collects'>('articles');
  const [loading, setLoading] = useState(true);

  const isSelf = currentUser?.id === Number(id);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      userApi.getUserInfo(Number(id)),
      articleApi.getUserArticles(Number(id)),
    ]).then(([user, arts]) => {
      setUserInfo(user);
      setArticles(arts);
    }).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (tab === 'collects' && isSelf) {
      articleApi.getMyCollects().then(setArticles);
    } else if (tab === 'articles') {
      articleApi.getUserArticles(Number(id)).then(setArticles);
    }
  }, [tab, id]);

  const handleFollow = async () => {
    if (!isLogin) return;
    try {
      await userApi.follow(Number(id));
      const updated = await userApi.getUserInfo(Number(id));
      setUserInfo(updated);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-sm text-base-content/40 animate-pulse-soft">加载中...</p>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="text-center py-24">
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl surface-soft flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-base-content/15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-[13px] text-base-content/40 font-medium">用户不存在</p>
      </div>
    );
  }

  return (
    <div className="flex gap-6">
      <div className="w-80 flex-shrink-0 hidden md:block">
        <div className="sticky top-24">
          <UserCard
            username={userInfo.username}
            nickname={userInfo.nickname}
            bio={userInfo.bio}
            college={userInfo.college}
            major={userInfo.major}
            articleCount={userInfo.articleCount}
            followerCount={userInfo.followerCount}
            followingCount={userInfo.followingCount}
          />
          {!isSelf && isLogin && (
            <button
              className="btn btn-primary w-full mt-3 rounded-xl shadow-sm shadow-primary/15 hover:shadow-md hover:shadow-primary/20 transition-all"
              onClick={handleFollow}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              关注
            </button>
          )}
          {isSelf && (
            <Link to="/admin/settings" className="btn btn-outline w-full mt-3 rounded-xl border-base-200/40 hover:border-primary/30 hover:bg-primary/5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              编辑资料
            </Link>
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="md:hidden surface rounded-2xl p-4 mb-4 noise">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-content flex items-center justify-center text-xl font-bold shadow-lg shadow-primary/15">
              {userInfo.nickname?.[0] || '?'}
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-lg tracking-tight">{userInfo.nickname}</h2>
              <p className="text-[11px] text-base-content/40 font-medium">@{userInfo.username}</p>
              {userInfo.bio && <p className="text-[12px] text-base-content/55 mt-1">{userInfo.bio}</p>}
            </div>
            {!isSelf && isLogin && (
              <button className="btn btn-primary btn-sm rounded-xl shadow-sm shadow-primary/15" onClick={handleFollow}>关注</button>
            )}
            {isSelf && (
              <Link to="/admin/settings" className="btn btn-outline btn-sm rounded-xl border-base-200/40">编辑</Link>
            )}
          </div>
        </div>

        <div className="flex p-1 surface-soft rounded-xl mb-4">
          <button
            className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 ${
              tab === 'articles'
                ? 'bg-base-100 text-base-content shadow-sm'
                : 'text-base-content/35 hover:text-base-content/55'
            }`}
            onClick={() => setTab('articles')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            文章
          </button>
          {isSelf && (
            <button
              className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 ${
                tab === 'collects'
                  ? 'bg-base-100 text-base-content shadow-sm'
                  : 'text-base-content/35 hover:text-base-content/55'
              }`}
              onClick={() => setTab('collects')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              收藏
            </button>
          )}
        </div>

        {articles.length === 0 ? (
          <div className="surface rounded-2xl p-16 text-center noise">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl surface-soft flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-base-content/15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <p className="text-[13px] text-base-content/40 font-medium">
              {tab === 'articles' ? '还没有发表文章' : '还没有收藏文章'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
