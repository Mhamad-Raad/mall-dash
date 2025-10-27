import { axiosInstance } from '@/data/axiosInstance';

export const validateRefreshToken = async (
  refreshToken: string
): Promise<boolean> => {
  try {
    const response = await axiosInstance.post('/Account/validate-token', {
      refreshToken,
    });
    return response.data?.isValid === true;
  } catch (error) {
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
};
