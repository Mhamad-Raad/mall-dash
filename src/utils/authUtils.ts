import { axiosInstance } from '@/data/axiosInstance';

export const refreshAccessToken = async (): Promise<boolean> => {
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!refreshToken) {
    return false;
  }

  try {
    const response = await axiosInstance.post('/Account/refresh', {
      refreshToken,
    });

    if (response.data?.accessToken && response.data?.refreshToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      return true;
    }

    return false;
  } catch (error) {
    // If refresh fails, token is invalid - clear everything
    clearTokens();
    return false;
  }
};

export const getStoredTokens = () => ({
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
});

export const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('appContext');
};

// Decode JWT token to extract claims
const decodeJWT = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

// Validate that the user's token matches the current app context
export const validateAppContext = (): boolean => {
  const accessToken = localStorage.getItem('accessToken');
  const storedAppContext = localStorage.getItem('appContext');
  const currentAppContext = import.meta.env.VITE_APP_CONTEXT;

  // If no token, validation passes (user will be redirected to login)
  if (!accessToken) {
    return true;
  }

  // Check stored app context matches current app context
  if (storedAppContext !== currentAppContext) {
    // User is on wrong app - clear tokens and force logout
    clearTokens();
    return false;
  }

  // Optional: Also validate from JWT token if backend includes it
  const decoded = decodeJWT(accessToken);
  if (decoded?.applicationContext && decoded.applicationContext !== currentAppContext) {
    clearTokens();
    return false;
  }

  return true;
};
