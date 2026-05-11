import AppRouter from '@/router';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useCategoryStore } from '@/store/useCategoryStore';

export default function App() {
  const { loadUser, isLogin } = useAuthStore();
  const { loadCategories } = useCategoryStore();

  useEffect(() => {
    if (isLogin) {
      loadUser();
    }
    loadCategories();
  }, []);

  return <AppRouter />;
}
