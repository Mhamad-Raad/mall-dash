import { axiosInstance } from '@/data/axiosInstance';

export const validateRefreshToken = async (): Promise<boolean> => {
  try {
    // The refresh token is sent automatically via HTTP-only cookie
    await axiosInstance.post('/Account/NewRefreshToken', {});
    return true;
  } catch (error) {
    return false;
  }
};

// These functions are kept for backwards compatibility but tokens are now in HTTP-only cookies
export const getStoredTokens = () => ({
  accessToken: null,
  refreshToken: null,
});

export const clearTokens = () => {
  // Tokens are now managed via HTTP-only cookies
  // Call logout endpoint to clear them server-side
};
