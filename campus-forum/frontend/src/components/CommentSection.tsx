import { useState } from 'react';
import type { CommentVO } from '@/types';
import { commentApi } from '@/api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

interface CommentSectionProps {
  articleId: number;
  comments: CommentVO[];
  onCommentAdded: () => void;
}

export default function CommentSection({ articleId, comments, onCommentAdded }: CommentSectionProps) {
  const [content, setContent] = useState('');
  const [replyTo, setReplyTo] = useState<{ parentId: number; userId: number; name: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      await commentApi.add({
        articleId,
        content: content.trim(),
        parentId: replyTo?.parentId,
        replyUserId: replyTo?.userId,
      });
      setContent('');
      setReplyTo(null);
      onCommentAdded();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const renderComment = (comment: CommentVO, isChild = false) => (
    <div key={comment.id} className={`${isChild ? 'ml-10 md:ml-14' : ''} ${!isChild ? 'border-b border-base-200/25 last:border-0' : ''} ${!isChild ? 'py-5' : 'py-3'}`}>
      <div className="flex gap-3 group">
        <div className="avatar placeholder flex-shrink-0">
          <div className={`${isChild ? 'w-7 h-7 text-[11px]' : 'w-8 h-8 text-xs'} rounded-lg bg-gradient-to-br from-primary/80 to-accent/80 text-primary-content flex items-center justify-center font-bold shadow-sm`}>
            <span>{comment.userName?.[0] || '?'}</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-[13px]">{comment.userName}</span>
            {comment.replyUserName && (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-base-content/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                <span className="font-semibold text-[13px] text-primary">{comment.replyUserName}</span>
              </>
            )}
            <span className="text-[11px] text-base-content/25">· {dayjs(comment.createTime).fromNow()}</span>
          </div>
          <p className="text-[13px] leading-relaxed text-base-content/75">{comment.content}</p>
          <button
            className="btn btn-ghost btn-xs text-base-content/30 hover:text-primary mt-1 gap-1 transition-colors duration-200"
            onClick={() => setReplyTo({
              parentId: isChild ? comment.parentId : comment.id,
              userId: comment.userId,
              name: comment.userName,
            })}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            回复
          </button>
          {comment.children && comment.children.map((child) => renderComment(child, true))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="surface rounded-2xl p-6 noise">
      <h3 className="font-bold text-base mb-5 flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        评论 <span className="text-base-content/30 font-normal text-sm">({comments.length})</span>
      </h3>

      {replyTo && (
        <div className="flex items-center gap-2 mb-3 px-4 py-2.5 surface-soft rounded-xl text-[13px] animate-slide-up">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
          <span className="text-base-content/55">回复 <strong className="text-primary">{replyTo.name}</strong></span>
          <button
            className="btn btn-ghost btn-xs ml-auto text-base-content/30 hover:text-error transition-colors"
            onClick={() => setReplyTo(null)}
          >
            取消
          </button>
        </div>
      )}

      <div className="mb-6">
        <div className="flex gap-3">
          <textarea
            className="textarea textarea-bordered flex-1 resize-none rounded-xl focus:border-primary/30 focus:outline-none text-[13px] bg-base-200/20 border-base-200/40 placeholder:text-base-content/20"
            placeholder="写下你的评论..."
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            className="btn btn-primary self-end rounded-xl shadow-sm shadow-primary/15"
            onClick={handleSubmit}
            disabled={submitting || !content.trim()}
          >
            {submitting ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              '发表'
            )}
          </button>
        </div>
      </div>

      <div>
        {comments.length === 0 ? (
          <div className="text-center py-14">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl surface-soft flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-base-content/15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-[13px] text-base-content/35 font-medium">暂无评论，快来发表第一条评论吧~</p>
          </div>
        ) : (
          comments.map((comment) => renderComment(comment))
        )}
      </div>
    </div>
  );
}
