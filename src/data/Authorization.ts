import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
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
  const url = `${API_URL}/Account/login`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await axios.post(
      url,
      {
        email,
        password,
        applicationContext: APP_CONTEXT,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          key: API_KEY,
          value: API_VALUE,
        },
        withCredentials: true,
        signal: controller.signal,
      }
    );

    clearTimeout(timeout);

    const data = response.data;

    if (data.accessToken && data.refreshToken) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
    }

    console.log('Response object:', data);
    return data;
  } catch (e: any) {
    clearTimeout(timeout);
    console.error(
      'Login error:',
      e.name === 'CanceledError' || e.message === 'canceled'
        ? 'Request timed out'
        : e.message
    );
    return { error: e.message };
  }
};
