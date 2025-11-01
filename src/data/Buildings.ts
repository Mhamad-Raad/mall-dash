import { axiosInstance } from '@/data/axiosInstance';

const API_KEY = import.meta.env.VITE_API_KEY;
const API_VALUE = import.meta.env.VITE_API_VALUE;

export const fetchBuildings = async (params?: {
  page?: number;
  limit?: number;
  searchName?: string;
}) => {
  try {
    const response = await axiosInstance.get('/Building', {
      headers: { key: API_KEY, value: API_VALUE },
      params,
    });
    return response.data;
  } catch (error: any) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const fetchBuildingById = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/Building/${id}`, {
      headers: { key: API_KEY, value: API_VALUE },
    });
    return response.data;
  } catch (error: any) {
    return { error: error.response?.data?.message || error.message };
  }
};
