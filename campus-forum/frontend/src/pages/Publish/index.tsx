import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { articleApi } from '@/api';
import { useCategoryStore } from '@/store/useCategoryStore';

export default function Publish() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { categories, tags, loadTags } = useCategoryStore();
  const isEdit = !!id;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [categoryId, setCategoryId] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadTags();
    if (isEdit) {
      articleApi.getDetail(Number(id)).then((article) => {
        setTitle(article.title);
        setContent(article.content || '');
        setSummary(article.summary);
        setCategoryId(article.categoryId);
        setSelectedTags(article.tags?.map((t) => t.id) || []);
      });
    }
  }, [id]);

  useEffect(() => {
    if (categoryId > 0) {
      loadTags(categoryId);
    }
  }, [categoryId]);

  const handleSubmit = async (status: number) => {
    if (!title.trim() || !content.trim() || categoryId === 0) {
      alert('请填写标题、内容并选择分类');
      return;
    }
    setSubmitting(true);
    try {
      if (isEdit) {
        await articleApi.update({
          id: Number(id),
          title,
          content,
          summary,
          categoryId,
          tagIds: selectedTags,
        });
      } else {
        await articleApi.publish({
          title,
          content,
          summary,
          categoryId,
          tagIds: selectedTags,
        });
      }
      navigate('/');
    } catch (e) {
      console.error(e);
      alert('发布失败');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleTag = (tagId: number) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            {isEdit ? '编辑文章' : '发布文章'}
          </h1>
          <p className="text-[11px] text-base-content/30 mt-1 ml-[38px] font-medium">分享你的知识和见解</p>
        </div>
        <div className="text-[11px] text-base-content/20 flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          支持 Markdown
        </div>
      </div>

      <div className="surface rounded-2xl p-5 md:p-6 noise">
        <div className="space-y-4">
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-[11px] font-semibold text-base-content/45">文章标题</span>
            </label>
            <input
              type="text"
              placeholder="请输入文章标题"
              className="input-styled text-base font-semibold"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-[11px] font-semibold text-base-content/45">文章摘要</span>
              <span className="label-text-alt text-[10px] text-base-content/25">选填</span>
            </label>
            <textarea
              placeholder="简单描述文章内容，最多300字"
              className="textarea textarea-bordered h-16 rounded-xl focus:border-primary/30 focus:outline-none text-[13px] bg-base-200/15 border-base-200/40 placeholder:text-base-content/20"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              maxLength={300}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-[11px] font-semibold text-base-content/45">文章分类</span>
              </label>
              <select
                className="select select-bordered rounded-xl focus:border-primary/30 focus:outline-none text-[13px] bg-base-200/15 border-base-200/40"
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
              >
                <option value={0}>请选择分类</option>
                {categories.filter((c) => c.id > 1).map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {tags.length > 0 && (
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-[11px] font-semibold text-base-content/45">标签</span>
                  <span className="label-text-alt text-[10px] text-base-content/25">选填</span>
                </label>
                <div className="flex flex-wrap gap-1.5 min-h-[2.5rem] items-center">
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      className={`text-[11px] px-2.5 py-1 rounded-lg transition-all duration-200 font-medium ${
                        selectedTags.includes(tag.id)
                          ? 'bg-primary text-primary-content shadow-sm shadow-primary/15'
                          : 'bg-primary/5 text-primary/60 border border-primary/8 hover:bg-primary/10'
                      }`}
                      onClick={() => toggleTag(tag.id)}
                    >
                      {selectedTags.includes(tag.id) && '✓ '}
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-[11px] font-semibold text-base-content/45">文章内容</span>
            </label>
            <textarea
              placeholder="请输入文章内容，支持 Markdown 语法&#10;&#10;支持：标题、粗体、斜体、列表、代码块、引用、表格、图片等"
              className="textarea textarea-bordered min-h-[380px] font-mono text-[13px] leading-relaxed rounded-xl focus:border-primary/30 focus:outline-none bg-base-200/15 border-base-200/40 placeholder:text-base-content/20"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-5 mt-5 border-t border-base-200/30">
          <button
            className="btn btn-ghost btn-sm rounded-xl text-base-content/35 hover:text-base-content/55"
            onClick={() => navigate(-1)}
          >
            取消
          </button>
          <button
            className={`btn btn-primary btn-sm rounded-xl shadow-sm shadow-primary/15 px-6 ${submitting ? 'loading' : ''}`}
            onClick={() => handleSubmit(1)}
            disabled={submitting}
          >
            {submitting ? '发布中...' : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                发布文章
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
