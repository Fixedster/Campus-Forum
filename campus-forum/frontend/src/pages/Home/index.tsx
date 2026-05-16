import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ArticleCard from '@/components/ArticleCard';
import CategorySidebar from '@/components/CategorySidebar';
import { articleApi } from '@/api';
import { useCategoryStore } from '@/store/useCategoryStore';
import type { ArticleVO } from '@/types';

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories } = useCategoryStore();
  const [articles, setArticles] = useState<ArticleVO[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState('latest');
  const [keyword, setKeyword] = useState('');

  const categoryId = Number(searchParams.get('categoryId')) || 0;
  const page = Number(searchParams.get('page')) || 1;

  const loadArticles = async () => {
    setLoading(true);
    try {
      const res = await articleApi.list({
        categoryId: categoryId > 0 ? categoryId : undefined,
        keyword: keyword || undefined,
        sort: sort === 'hot' ? 'hot' : sort === 'like' ? 'like' : undefined,
        page,
        size: 10,
      });
      setArticles(res.list);
      setTotal(Number(res.total));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, [categoryId, page, sort]);

  const handleCategorySelect = (id: number) => {
    setSearchParams({ categoryId: String(id), page: '1' });
  };

  const handleSearch = () => {
    loadArticles();
  };

  const totalPages = Math.ceil(total / 10);

  return (
    <div className="flex gap-6">
      <div className="w-60 flex-shrink-0 hidden lg:block">
        <CategorySidebar
          categories={categories}
          activeId={categoryId}
          onSelect={handleCategorySelect}
        />

        <div className="surface rounded-2xl p-4 mt-3 noise">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-base-content/60">社区动态</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="surface-soft rounded-xl p-3 text-center">
              <div className="text-lg font-bold gradient-text">{total}</div>
              <div className="text-[10px] text-base-content/30 mt-0.5 font-medium">篇文章</div>
            </div>
            <div className="surface-soft rounded-xl p-3 text-center">
              <div className="text-lg font-bold gradient-text">{categories.length}</div>
              <div className="text-[10px] text-base-content/30 mt-0.5 font-medium">个分类</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        {categoryId === 0 && page === 1 && !keyword && (
          <div className="relative overflow-hidden rounded-2xl p-7 md:p-9 mb-5 surface-elevated noise">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/[0.06] via-accent/[0.03] to-transparent rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-accent/[0.04] to-transparent rounded-tr-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-primary/[0.03] to-transparent rounded-full" />
            <div className="relative flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-1 h-7 rounded-full bg-gradient-to-b from-primary via-accent to-primary/30" />
                  <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">
                    欢迎来到 <span className="gradient-text">Campus Forum</span>
                  </h1>
                </div>
                <p className="text-[13px] text-base-content/40 ml-[18px] font-medium tracking-wide">
                  校园技术交流社区 · 分享知识 · 共同成长
                </p>
              </div>
              <div className="hidden md:flex">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/15 animate-float">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="surface rounded-2xl p-3 mb-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-0.5 p-1 surface-soft rounded-xl">
              {[
                { key: 'latest', label: '最新' },
                { key: 'hot', label: '最热' },
                { key: 'like', label: '点赞最多' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                    sort === key
                      ? 'bg-primary text-primary-content shadow-sm shadow-primary/15'
                      : 'text-base-content/40 hover:text-base-content/60 hover:bg-base-200/40'
                  }`}
                  onClick={() => setSort(key)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="join w-full sm:w-auto">
              <input
                className="input input-bordered input-sm join-item flex-1 sm:w-52 rounded-l-xl focus:outline-none focus:border-primary/30 border-base-200/50 bg-base-200/20 text-sm placeholder:text-base-content/25"
                placeholder="搜索文章..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button className="btn btn-sm join-item btn-primary rounded-r-xl shadow-sm shadow-primary/15" onClick={handleSearch}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="text-xs text-base-content/30 animate-pulse-soft">加载中...</p>
          </div>
        ) : (
          <>
            {articles.length === 0 ? (
              <div className="surface rounded-2xl p-20 text-center">
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl surface-soft flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-base-content/15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <p className="text-sm text-base-content/35 font-semibold">暂无文章</p>
                <p className="text-xs text-base-content/20 mt-1.5">还没有人发布文章，快来发表第一篇吧</p>
              </div>
            ) : (
              <div className="space-y-3">
                {articles.map((article, i) => (
                  <div key={article.id} className="animate-slide-up" style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'backwards' }}>
                    <ArticleCard article={article} />
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center gap-1">
                  <button
                    className={`btn btn-sm btn-ghost rounded-lg ${page <= 1 ? 'btn-disabled' : ''}`}
                    onClick={() => page > 1 && setSearchParams({ categoryId: String(categoryId), page: String(page - 1) })}
                    disabled={page <= 1}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    let p: number;
                    if (totalPages <= 7) {
                      p = i + 1;
                    } else if (page <= 3) {
                      p = i + 1;
                    } else if (page >= totalPages - 2) {
                      p = totalPages - 6 + i;
                    } else {
                      p = page - 3 + i;
                    }
                    return (
                      <button
                        key={p}
                        className={`btn btn-sm rounded-lg min-w-[34px] ${
                          p === page
                            ? 'btn-primary shadow-sm shadow-primary/15'
                            : 'btn-ghost text-base-content/40 hover:bg-base-200/40'
                        }`}
                        onClick={() => setSearchParams({ categoryId: String(categoryId), page: String(p) })}
                      >
                        {p}
                      </button>
                    );
                  })}
                  <button
                    className={`btn btn-sm btn-ghost rounded-lg ${page >= totalPages ? 'btn-disabled' : ''}`}
                    onClick={() => page < totalPages && setSearchParams({ categoryId: String(categoryId), page: String(page + 1) })}
                    disabled={page >= totalPages}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
