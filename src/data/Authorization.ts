import { axiosInstance } from '@/data/axiosInstance';

const API_KEY = import.meta.env.VITE_API_KEY;
const API_VALUE = import.meta.env.VITE_API_VALUE;
const APP_CONTEXT = import.meta.env.VITE_APP_CONTEXT;

export const loginUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const response = await axiosInstance.post(
      '/Account/login',
      {
        email,
        password,
        applicationContext: APP_CONTEXT,
      },
      {
        headers: { key: API_KEY, value: API_VALUE },
      }
    );

    const data = response.data;

    if (data.accessToken && data.refreshToken) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
    }

    return data;
  } catch (error: any) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const logoutUser = async () => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    // Optional: Call backend to invalidate refresh token server-side
    if (accessToken) {
      await axiosInstance.post(
        '/Account/logout',
        { accessToken },
        {
          headers: { key: API_KEY, value: API_VALUE },
        }
      );
    }
    window.dispatchEvent(new Event('force-logout'));
  } catch (error: any) {
    console.error(
      'Logout error:',
      error.response?.data?.message || error.message
    );
  } finally {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    window.dispatchEvent(new Event('force-logout'));
  }
};
