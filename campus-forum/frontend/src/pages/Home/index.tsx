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
      <div className="w-64 flex-shrink-0 hidden lg:block">
        <CategorySidebar
          categories={categories}
          activeId={categoryId}
          onSelect={handleCategorySelect}
        />

        {/* Stats Card */}
        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-4 mt-4 border border-base-200">
          <div className="flex items-center gap-2 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-semibold">社区动态</span>
          </div>
          <div className="space-y-2 text-xs text-base-content/60">
            <p>共 {total} 篇文章</p>
            <p>{categories.length} 个分类</p>
          </div>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        {/* Hero Section (only on first page, no filter) */}
        {categoryId === 0 && page === 1 && !keyword && (
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 rounded-2xl p-6 md:p-8 mb-6 border border-primary/10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  欢迎来到 <span className="gradient-text">Campus Forum</span>
                </h1>
                <p className="text-base-content/60 text-sm md:text-base">
                  校园技术交流社区 · 分享知识 · 共同成长
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg animate-float">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="bg-base-100 rounded-xl shadow-sm p-4 mb-4 border border-base-200/50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="tabs tabs-boxed bg-base-200/80 p-1 gap-1">
              <button
                className={`tab tab-sm rounded-lg transition-all duration-200 ${sort === 'latest' ? 'tab-active bg-primary text-primary-content shadow-sm' : 'hover:bg-base-300/50'}`}
                onClick={() => setSort('latest')}
              >
                最新
              </button>
              <button
                className={`tab tab-sm rounded-lg transition-all duration-200 ${sort === 'hot' ? 'tab-active bg-primary text-primary-content shadow-sm' : 'hover:bg-base-300/50'}`}
                onClick={() => setSort('hot')}
              >
                最热
              </button>
              <button
                className={`tab tab-sm rounded-lg transition-all duration-200 ${sort === 'like' ? 'tab-active bg-primary text-primary-content shadow-sm' : 'hover:bg-base-300/50'}`}
                onClick={() => setSort('like')}
              >
                点赞最多
              </button>
            </div>

            <div className="join w-full sm:w-auto">
              <input
                className="input input-bordered input-sm join-item flex-1 sm:w-48"
                placeholder="搜索文章..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button className="btn btn-sm join-item btn-primary" onClick={handleSearch}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="text-sm text-base-content/50 animate-pulse-soft">加载中...</p>
          </div>
        ) : (
          <>
            {/* Articles List */}
            {articles.length === 0 ? (
              <div className="bg-base-100 rounded-xl shadow-sm p-16 text-center border border-base-200/50">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-base-200 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <p className="text-base text-base-content/50">暂无文章</p>
                <p className="text-xs text-base-content/30 mt-1">还没有人发布文章，快来发表第一篇吧</p>
              </div>
            ) : (
              <div className="space-y-3">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="join shadow-sm">
                  <button
                    className={`join-item btn btn-sm ${page <= 1 ? 'btn-disabled' : ''}`}
                    onClick={() => page > 1 && setSearchParams({ categoryId: String(categoryId), page: String(page - 1) })}
                    disabled={page <= 1}
                  >
                    «
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
                        className={`join-item btn btn-sm ${p === page ? 'btn-primary shadow-sm' : ''}`}
                        onClick={() => setSearchParams({ categoryId: String(categoryId), page: String(p) })}
                      >
                        {p}
                      </button>
                    );
                  })}
                  <button
                    className={`join-item btn btn-sm ${page >= totalPages ? 'btn-disabled' : ''}`}
                    onClick={() => page < totalPages && setSearchParams({ categoryId: String(categoryId), page: String(page + 1) })}
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
    </div>
  );
}
