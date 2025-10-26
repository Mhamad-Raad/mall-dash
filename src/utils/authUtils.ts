export const isRefreshTokenExpired = (): boolean => {
  const expiresAt = localStorage.getItem('refreshTokenExpiresAt');
  if (!expiresAt) return true;
  return Date.now() > new Date(expiresAt).getTime();
};

export const getStoredTokens = () => ({
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
});

export const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('refreshTokenExpiresAt');
};
