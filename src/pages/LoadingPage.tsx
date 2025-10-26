import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';

import { Loader2 } from 'lucide-react';

import Layout from '@/components/Layout/DashboardLayout';

import { axiosInstance } from '@/data/axiosInstance';
import {
  getStoredTokens,
  isRefreshTokenExpired,
  clearTokens,
} from '@/utils/authUtils';

import Logo from '@/assets/Logo.jpg';

const LoadingPage = () => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Slight delay to ensure localStorage is updated
    const timer = setTimeout(() => {
      const checkAuth = async () => {
        const { refreshToken } = getStoredTokens();
        const expiresAt = localStorage.getItem('refreshTokenExpiresAt');
        console.log('refreshToken:', refreshToken);
        console.log('refreshTokenExpiresAt:', expiresAt);

        if (!refreshToken) {
          console.log('NO REFRESH TOKEN');
          setIsAuthorized(false);
          return;
        }
        if (isRefreshTokenExpired()) {
          console.log('TOKEN EXPIRED');
          clearTokens();
          setIsAuthorized(false);
          return;
        }
        try {
          await axiosInstance.post('/Account/refresh', { refreshToken });
          setIsAuthorized(true);
        } catch (e) {
          console.log('REFRESH FAILED', e);
          clearTokens();
          setIsAuthorized(false);
          return;
        }
      };

      checkAuth();
    }, 30);

    return () => clearTimeout(timer);
  }, []);

  if (isAuthorized === null) {
    return (
      <div className='flex flex-col justify-center items-center h-screen'>
        <img
          src={Logo}
          alt='Company Logo'
          className='w-32 h-32 object-contain'
          style={{
            animation: 'bw-pulse 2.5s infinite',
          }}
        />
        <Loader2 className='mt-8 h-8 w-8 animate-spin text-gray-800' />
      </div>
    );
  }

  if (!isAuthorized) {
    navigate('/login');
    return;
  }

  return (
    <>
      <Layout />
      <ToastContainer
        position='bottom-right'
        autoClose={5000}
        hideProgressBar={false}
      />
    </>
  );
};

export default LoadingPage;
