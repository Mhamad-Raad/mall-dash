import { axiosInstance } from '@/data/axiosInstance';

const API_KEY = import.meta.env.VITE_API_KEY;
const API_VALUE = import.meta.env.VITE_API_VALUE;

export const fetchUsers = async () => {
  try {
    const response = await axiosInstance.get('/Account/users', {
      headers: { key: API_KEY, value: API_VALUE },
    });

    return response.data;
  } catch (error: any) {
    return { error: error.response?.data?.message || error.message };
  }
};
