import { create } from 'zustand';
import type { Category, TagVO } from '@/types';
import { categoryApi } from '@/api';

interface CategoryState {
  categories: Category[];
  tags: TagVO[];
  loadCategories: () => Promise<void>;
  loadTags: (categoryId?: number) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  tags: [],
  loadCategories: async () => {
    const categories = await categoryApi.list();
    set({ categories });
  },
  loadTags: async (categoryId) => {
    const tags = await categoryApi.listTags(categoryId);
    set({ tags });
  },
}));
