import { Link } from 'react-router-dom';
import type { Category } from '@/types';

interface CategorySidebarProps {
  categories: Category[];
  activeId?: number;
  onSelect: (id: number) => void;
}

export default function CategorySidebar({ categories, activeId, onSelect }: CategorySidebarProps) {
  return (
    <div className="surface rounded-2xl overflow-hidden noise">
      <div className="p-4 border-b border-base-200/30">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </div>
          文章分类
        </h3>
      </div>
      <ul className="menu menu-sm w-full p-2">
        <li>
          <a
            className={`flex items-center gap-3 rounded-xl transition-all duration-200 ${
              activeId === 0
                ? 'active bg-primary/8 text-primary font-semibold'
                : 'text-base-content/50 hover:bg-base-200/30 hover:text-base-content/70'
            }`}
            onClick={() => onSelect(0)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            全部文章
          </a>
        </li>
        {categories.filter((c) => c.id > 1).map((cat) => (
          <li key={cat.id}>
            <a
              className={`flex items-center gap-3 rounded-xl transition-all duration-200 ${
                activeId === cat.id
                  ? 'active bg-primary/8 text-primary font-semibold'
                  : 'text-base-content/50 hover:bg-base-200/30 hover:text-base-content/70'
              }`}
              onClick={() => onSelect(cat.id)}
            >
              {cat.icon ? (
                <span className="text-base">{cat.icon}</span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              )}
              {cat.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
