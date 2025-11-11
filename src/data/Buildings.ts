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

export const fetchBuildingsByName = async (searchName: string) => {
  try {
    const response = await axiosInstance.get('/Building', {
      params: {
        limit: 5,
        searchName: searchName,
      },
    });
    return response.data;
  } catch (error: any) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const updateBuildingName = async (id: number, name: string) => {
  try {
    const response = await axiosInstance.put(
      `/Building/BuildingName/${id}`,
      { name },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response.data;
  } catch (error: any) {
    return { error: error?.response?.data?.message || error.message };
  }
};

export const addBuildingFloor = async (buildingId: number) => {
  try {
    const response = await axiosInstance.post(`/Building/${buildingId}/floor`);
    return response.data;
  } catch (error: any) {
    return { error: error?.response?.data?.message || error.message };
  }
};

export const deleteBuildingFloor = async (floorId: number) => {
  try {
    const response = await axiosInstance.delete(`/Building/floor/${floorId}`);
    return response.data;
  } catch (error: any) {
    return { error: error?.response?.data?.message || error.message };
  }
};

export const updateApartment = async (
  id: number,
  apartmentName: string,
  userId: string | number | null
) => {
  try {
    const response = await axiosInstance.put(
      `/Building/apartment/${id}`,
      { apartmentName, userId },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response.data;
  } catch (error: any) {
    return { error: error?.response?.data?.message || error.message };
  }
};
