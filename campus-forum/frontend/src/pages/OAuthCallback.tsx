import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { githubLogin } = useAuthStore();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error || !code) {
      navigate('/login?error=github_auth_failed', { replace: true });
      return;
    }

    githubLogin(code)
      .then(() => {
        navigate('/', { replace: true });
      })
      .catch(() => {
        navigate('/login?error=github_login_failed', { replace: true });
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-base-content/60 text-sm">GitHub 登录中...</p>
      </div>
    </div>
  );
}
