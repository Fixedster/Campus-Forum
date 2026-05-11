import { Link } from 'react-router-dom';
import type { ArticleVO } from '@/types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

interface ArticleCardProps {
  article: ArticleVO;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <div className="bg-base-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 border border-base-200/50 overflow-hidden">
      <div className="p-5">
        {/* Top: author & meta */}
        <div className="flex items-center gap-2.5 text-sm mb-3">
          <Link
            to={`/user/${article.userId}`}
            className="flex items-center gap-2 group"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-content flex items-center justify-center text-xs font-semibold shadow-sm">
              {article.authorName?.[0] || '?'}
            </div>
            <span className="font-medium text-base-content/80 group-hover:text-primary transition-colors">
              {article.authorName}
            </span>
          </Link>
          <span className="text-base-content/30">·</span>
          <span className="text-base-content/50 text-xs">{dayjs(article.createTime).fromNow()}</span>
          {article.categoryName && (
            <>
              <span className="text-base-content/30">·</span>
              <span className="badge badge-ghost badge-xs">{article.categoryName}</span>
            </>
          )}
          {article.toppingStat === 1 && (
            <span className="badge badge-primary badge-xs gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              置顶
            </span>
          )}
          {article.recommendStat === 1 && (
            <span className="badge badge-secondary badge-xs gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              精华
            </span>
          )}
        </div>

        {/* Title */}
        <Link to={`/article/${article.id}`} className="block group">
          <h2 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-1">
            {article.title}
          </h2>
        </Link>

        {/* Summary */}
        {article.summary && (
          <p className="text-sm text-base-content/60 line-clamp-2 mt-1.5 leading-relaxed">
            {article.summary}
          </p>
        )}

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {article.tags.map((tag) => (
              <span
                key={tag.id}
                className="badge badge-sm bg-primary/5 text-primary border-primary/10 hover:bg-primary/10 transition-colors cursor-default"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-base-200/50 text-xs text-base-content/40">
          <span className="flex items-center gap-1.5 hover:text-base-content/60 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {article.viewCount}
          </span>
          <span className="flex items-center gap-1.5 hover:text-red-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${article.liked ? 'text-red-400 fill-red-400' : ''}`} fill={article.liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {article.likeCount}
          </span>
          <span className="flex items-center gap-1.5 hover:text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {article.commentCount}
          </span>
          {article.collectCount > 0 && (
            <span className="flex items-center gap-1.5 hover:text-yellow-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill={article.collected ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              {article.collectCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
