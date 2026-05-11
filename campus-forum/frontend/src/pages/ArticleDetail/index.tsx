import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { articleApi, commentApi } from '@/api';
import { useAuthStore } from '@/store/useAuthStore';
import CommentSection from '@/components/CommentSection';
import type { ArticleVO, CommentVO } from '@/types';
import dayjs from 'dayjs';
import 'github-markdown-css/github-markdown.css';

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLogin } = useAuthStore();
  const [article, setArticle] = useState<ArticleVO | null>(null);
  const [comments, setComments] = useState<CommentVO[]>([]);
  const [loading, setLoading] = useState(true);
  const [readProgress, setReadProgress] = useState(0);

  const loadArticle = async () => {
    try {
      const data = await articleApi.getDetail(Number(id));
      setArticle(data);
    } catch (e) {
      console.error(e);
    }
  };

  const loadComments = async () => {
    try {
      const data = await commentApi.getByArticle(Number(id));
      setComments(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([loadArticle(), loadComments()]).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setReadProgress(Math.min((scrollTop / docHeight) * 100, 100));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLike = async () => {
    if (!isLogin) { navigate('/login'); return; }
    try {
      await articleApi.toggleLike(Number(id));
      loadArticle();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCollect = async () => {
    if (!isLogin) { navigate('/login'); return; }
    try {
      await articleApi.toggleCollect(Number(id));
      loadArticle();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-sm text-base-content/50 animate-pulse-soft">加载中...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-24">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-base-200 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-xl font-semibold text-base-content/50 mb-2">文章不存在</p>
        <p className="text-sm text-base-content/30 mb-6">可能已被删除或不存在</p>
        <Link to="/" className="btn btn-primary rounded-xl shadow-sm">返回首页</Link>
      </div>
    );
  }

  return (
    <>
      {/* Reading Progress Bar */}
      <div className="fixed top-16 left-0 right-0 h-1 bg-base-200 z-50">
        <div
          className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-150"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      <div className="flex gap-6 max-w-5xl mx-auto">
        <div className="flex-1 min-w-0">
          {/* Article */}
          <article className="bg-base-100 rounded-2xl shadow-sm border border-base-200/50 overflow-hidden">
            <div className="p-6 md:p-8">
              {/* Badges & Title */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {article.toppingStat === 1 && (
                  <span className="badge badge-primary gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    置顶
                  </span>
                )}
                {article.recommendStat === 1 && (
                  <span className="badge badge-secondary gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    精华
                  </span>
                )}
                {article.categoryName && (
                  <span className="badge badge-ghost">{article.categoryName}</span>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-bold leading-tight">{article.title}</h1>

              {/* Author Meta */}
              <div className="flex items-center gap-3 mt-6 pb-6 border-b border-base-200/50">
                <Link to={`/user/${article.userId}`} className="flex items-center gap-3 group">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-content flex items-center justify-center font-semibold shadow-sm">
                    {article.authorName?.[0] || '?'}
                  </div>
                  <div>
                    <p className="font-semibold text-sm group-hover:text-primary transition-colors">{article.authorName}</p>
                    <p className="text-xs text-base-content/40">{dayjs(article.createTime).format('YYYY-MM-DD HH:mm')} · {article.viewCount} 次浏览</p>
                  </div>
                </Link>
                <div className="flex gap-2 ml-auto">
                  {article.tags?.map((tag) => (
                    <span key={tag.id} className="badge badge-sm bg-primary/5 text-primary border-primary/10">{tag.name}</span>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="mt-6 markdown-body" dangerouslySetInnerHTML={{ __html: article.content || '' }} />
            </div>
          </article>

          {/* Mobile Action Bar (fixed bottom) */}
          <div className="fixed bottom-0 left-0 right-0 bg-base-100 border-t border-base-200 shadow-lg p-3 flex items-center gap-3 z-40 md:hidden">
            <button
              className={`btn btn-sm flex-1 gap-1.5 rounded-xl ${article.liked ? 'btn-primary shadow-sm' : 'btn-outline'}`}
              onClick={handleLike}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill={article.liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {article.liked ? '已赞' : '点赞'} {article.likeCount > 0 && article.likeCount}
            </button>
            <button
              className={`btn btn-sm flex-1 gap-1.5 rounded-xl ${article.collected ? 'btn-secondary shadow-sm' : 'btn-outline'}`}
              onClick={handleCollect}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill={article.collected ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              {article.collected ? '已收藏' : '收藏'}
            </button>
          </div>

          {/* Comment Section */}
          <div className="mt-6 pb-20 md:pb-0">
            <CommentSection
              articleId={article.id}
              comments={comments}
              onCommentAdded={loadComments}
            />
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div className="w-72 flex-shrink-0 hidden xl:block">
          <div className="bg-base-100 rounded-2xl shadow-sm border border-base-200/50 p-5 sticky top-24">
            {/* Author Card */}
            <div className="flex items-center gap-3 mb-4">
              <Link to={`/user/${article.userId}`}>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-content flex items-center justify-center font-semibold shadow-sm">
                  {article.authorName?.[0] || '?'}
                </div>
              </Link>
              <div>
                <Link to={`/user/${article.userId}`} className="font-semibold text-sm hover:text-primary transition-colors">
                  {article.authorName}
                </Link>
                <p className="text-xs text-base-content/40 mt-0.5">作者</p>
              </div>
            </div>

            <div className="divider my-3"></div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 text-center mb-4">
              <div className="bg-base-200/50 rounded-xl py-2.5">
                <p className="font-bold text-lg">{article.viewCount}</p>
                <p className="text-base-content/40 text-xs">浏览</p>
              </div>
              <div className="bg-base-200/50 rounded-xl py-2.5">
                <p className="font-bold text-lg">{article.likeCount}</p>
                <p className="text-base-content/40 text-xs">点赞</p>
              </div>
              <div className="bg-base-200/50 rounded-xl py-2.5">
                <p className="font-bold text-lg">{article.commentCount}</p>
                <p className="text-base-content/40 text-xs">评论</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <button
                className={`btn gap-2 rounded-xl transition-all duration-200 ${
                  article.liked
                    ? 'btn-primary shadow-sm shadow-primary/20'
                    : 'btn-outline hover:bg-primary/5'
                }`}
                onClick={handleLike}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={article.liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {article.liked ? '已点赞' : '点赞'}
              </button>
              <button
                className={`btn gap-2 rounded-xl transition-all duration-200 ${
                  article.collected
                    ? 'btn-secondary shadow-sm shadow-secondary/20'
                    : 'btn-outline hover:bg-secondary/5'
                }`}
                onClick={handleCollect}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={article.collected ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                {article.collected ? '已收藏' : '收藏'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
