import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout/DashboardLayout';
import {
  getStoredTokens,
  validateRefreshToken,
  clearTokens,
} from '@/utils/authUtils';
import Logo from '@/assets/Logo.jpg';
import { Loader2 } from 'lucide-react';

const LoadingPage = () => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => navigate('/login', { replace: true });
    window.addEventListener('force-logout', handler);
    return () => window.removeEventListener('force-logout', handler);
  }, [navigate]);

  useEffect(() => {
    const checkAuth = async () => {
      const { refreshToken } = getStoredTokens();
      if (!refreshToken) {
        setIsAuthorized(false);
        return;
      }
      const refreshTokenIsValid = await validateRefreshToken(refreshToken);
      if (!refreshTokenIsValid) {
        clearTokens();
        setIsAuthorized(false);
        return;
      }
      setIsAuthorized(true);
    };

    // Give time for localStorage update after login
    const timer = setTimeout(() => {
      checkAuth();
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isAuthorized === false) {
      navigate('/login', { replace: true });
    }
  }, [isAuthorized, navigate]);

  if (isAuthorized === null) {
    return (
      <div className='flex flex-col justify-center items-center h-screen'>
        <img
          src={Logo}
          alt='Company Logo'
          className='w-32 h-32 object-contain'
          style={{ animation: 'bw-pulse 2.5s infinite' }}
        />
        <Loader2 className='mt-8 h-8 w-8 animate-spin text-gray-800' />
      </div>
    );
  }

  return (
    <>
      <Layout />
    </>
  );
};

export default LoadingPage;
