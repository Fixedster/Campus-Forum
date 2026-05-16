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
    <div className="surface rounded-2xl card-hover group noise">
      <div className="p-5 md:p-6">
        <div className="flex items-center gap-2.5 mb-3.5">
          <Link to={`/user/${article.userId}`} className="flex items-center gap-2.5 group/avatar">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary/80 to-accent/80 text-primary-content flex items-center justify-center text-[11px] font-bold shadow-sm shadow-primary/10 group-hover/avatar:shadow-md group-hover/avatar:shadow-primary/15 transition-shadow">
              {article.authorName?.[0] || '?'}
            </div>
            <span className="text-[13px] font-medium text-base-content/55 group-hover/avatar:text-primary transition-colors duration-200">
              {article.authorName}
            </span>
          </Link>
          <span className="text-base-content/15 text-[10px]">·</span>
          <span className="text-[11px] text-base-content/30">{dayjs(article.createTime).fromNow()}</span>
          <div className="flex-1" />
          {article.toppingStat === 1 && (
            <span className="badge badge-xs gap-0.5 bg-primary/6 text-primary border-primary/10 font-semibold">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              置顶
            </span>
          )}
          {article.recommendStat === 1 && (
            <span className="badge badge-xs gap-0.5 bg-secondary/6 text-secondary border-secondary/10 font-semibold">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              精华
            </span>
          )}
          {article.categoryName && (
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-base-200/50 text-base-content/35 font-medium">{article.categoryName}</span>
          )}
        </div>

        <Link to={`/article/${article.id}`} className="block group/title">
          <h2 className="text-[15px] md:text-base font-semibold group-hover/title:text-primary transition-colors duration-200 leading-snug tracking-tight">
            {article.title}
          </h2>
        </Link>

        {article.summary && (
          <p className="text-[13px] text-base-content/40 line-clamp-2 mt-2 leading-relaxed">
            {article.summary}
          </p>
        )}

        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {article.tags.map((tag) => (
              <span
                key={tag.id}
                className="text-[11px] px-2 py-0.5 rounded-md bg-primary/[0.04] text-primary/60 border border-primary/[0.06] font-medium"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-base-200/30 text-[11px] text-base-content/25">
          <span className="flex items-center gap-1.5 hover:text-base-content/45 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {article.viewCount}
          </span>
          <span className="flex items-center gap-1.5 hover:text-error/60 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 ${article.liked ? 'text-error/70 fill-error/70' : ''}`} fill={article.liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {article.likeCount}
          </span>
          <span className="flex items-center gap-1.5 hover:text-primary/50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {article.commentCount}
          </span>
          {article.collectCount > 0 && (
            <span className="flex items-center gap-1.5 hover:text-secondary/60 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill={article.collected ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
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
