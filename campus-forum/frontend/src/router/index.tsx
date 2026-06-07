import { useRoutes, Navigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import Home from '@/pages/Home';
import ArticleDetail from '@/pages/ArticleDetail';
import Login from '@/pages/Login';
import OAuthCallback from '@/pages/OAuthCallback';
import UserCenter from '@/pages/UserCenter';
import Publish from '@/pages/Publish';
import Messages from '@/pages/Messages';
import Admin from '@/pages/Admin';
import AiAssistant from '@/pages/AiAssistant';
import { useAuthStore } from '@/store/useAuthStore';

export default function AppRouter() {
  const { isLogin } = useAuthStore();

  return useRoutes([
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { index: true, element: <Navigate to="/home" replace /> },
        { path: 'home', element: <Home /> },
        { path: 'article/:id', element: <ArticleDetail /> },
        { path: 'user/:id', element: <UserCenter /> },
        { path: 'publish', element: isLogin ? <Publish /> : <Navigate to="/login" /> },
        { path: 'edit/:id', element: isLogin ? <Publish /> : <Navigate to="/login" /> },
        { path: 'messages', element: isLogin ? <Messages /> : <Navigate to="/login" /> },
        { path: 'ai', element: isLogin ? <AiAssistant /> : <Navigate to="/login" /> },
        { path: 'admin/*', element: isLogin ? <Admin /> : <Navigate to="/login" /> },
      ],
    },
    { path: '/login', element: <Login /> },
    { path: '/oauth/callback', element: <OAuthCallback /> },
    { path: '*', element: <Navigate to="/" replace /> },
  ]);
}
