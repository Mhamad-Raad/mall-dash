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

    // Tokens are now set as HTTP-only cookies by the backend
    return response.data;
  } catch (error: any) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const logoutUser = async () => {
  try {
    // Call backend to invalidate refresh token and clear HTTP-only cookies
    await axiosInstance.post(
      '/Account/logout',
      {},
      {
        headers: { key: API_KEY, value: API_VALUE },
      }
    );
  } catch (error: any) {
    console.error(
      'Logout error:',
      error.response?.data?.message || error.message
    );
  } finally {
    window.dispatchEvent(new Event('force-logout'));
  }
};
