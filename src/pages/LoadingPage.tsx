import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout/DashboardLayout';
import {
  getStoredTokens,
  refreshAccessToken,
  clearTokens,
  validateAppContext,
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
      // First, validate app context
      if (!validateAppContext()) {
        setIsAuthorized(false);
        return;
      }
      
      const { accessToken, refreshToken } = getStoredTokens();
      
      // If we have an access token, assume we're authenticated
      // The axios interceptor will handle refresh if needed
      if (accessToken) {
        setIsAuthorized(true);
        return;
      }
      
      // If no access token but we have a refresh token, try to refresh
      if (refreshToken) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          setIsAuthorized(true);
          return;
        }
      }
      
      // No valid tokens - user needs to login
      setIsAuthorized(false);
    };

    checkAuth();
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
