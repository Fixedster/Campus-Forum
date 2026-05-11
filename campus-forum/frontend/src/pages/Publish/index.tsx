import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { articleApi } from '@/api';
import { useCategoryStore } from '@/store/useCategoryStore';
import type { TagVO } from '@/types';

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
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{isEdit ? '编辑文章' : '发布文章'}</h1>
          <p className="text-sm text-base-content/50 mt-1">分享你的知识和见解</p>
        </div>
        <div className="badge badge-outline badge-sm gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          支持 Markdown
        </div>
      </div>

      <div className="bg-base-100 rounded-2xl shadow-sm border border-base-200/50 p-6">
        <div className="space-y-5">
          {/* Title */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">文章标题</span>
            </label>
            <input
              type="text"
              placeholder="请输入文章标题"
              className="input input-bordered text-lg font-medium rounded-xl focus:border-primary transition-colors"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Summary */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">文章摘要</span>
              <span className="label-text-alt text-base-content/40">选填</span>
            </label>
            <textarea
              placeholder="简单描述文章内容，最多300字"
              className="textarea textarea-bordered h-20 rounded-xl focus:border-primary transition-colors"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              maxLength={300}
            />
          </div>

          {/* Category & Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">文章分类</span>
              </label>
              <select
                className="select select-bordered rounded-xl focus:border-primary transition-colors"
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
                <label className="label">
                  <span className="label-text font-semibold">标签</span>
                  <span className="label-text-alt text-base-content/40">选填</span>
                </label>
                <div className="flex flex-wrap gap-2 min-h-[3rem] items-center">
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      className={`badge badge-lg cursor-pointer transition-all duration-200 ${
                        selectedTags.includes(tag.id)
                          ? 'badge-primary shadow-sm scale-105'
                          : 'badge-outline hover:bg-primary/5'
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

          {/* Content */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">文章内容</span>
            </label>
            <textarea
              placeholder="请输入文章内容，支持 Markdown 语法&#10;&#10;支持：标题、粗体、斜体、列表、代码块、引用、表格、图片等"
              className="textarea textarea-bordered min-h-[400px] font-mono text-sm leading-relaxed rounded-xl focus:border-primary transition-colors"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-base-200/50">
          <button
            className="btn btn-ghost rounded-xl"
            onClick={() => navigate(-1)}
          >
            取消
          </button>
          <div className="flex gap-3">
            <button
              className={`btn btn-primary rounded-xl shadow-sm px-8 ${submitting ? 'loading' : ''}`}
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
    </div>
  );
}
