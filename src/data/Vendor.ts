import { axiosInstance } from '@/data/axiosInstance';

const API_KEY = import.meta.env.VITE_API_KEY;
const API_VALUE = import.meta.env.VITE_API_VALUE;

export const createVendor = async (params: {
  name: string;
  description: string;
  openingTime: string;
  closeTime: string;
  type: number;
  userId: string;
  ProfileImageUrl?: File;
}) => {
  try {
    const hasFile = params.ProfileImageUrl instanceof File;

    if (hasFile && params.ProfileImageUrl) {
      // Use FormData for file upload
      const formData = new FormData();
      formData.append('name', params.name);
      formData.append('description', params.description);
      formData.append('openingTime', params.openingTime);
      formData.append('closeTime', params.closeTime);
      formData.append('type', params.type.toString());
      formData.append('userId', params.userId);
      formData.append('ProfileImageUrl', params.ProfileImageUrl);

      const response = await axiosInstance.post('/Vendor', formData, {
        headers: {
          key: API_KEY,
          value: API_VALUE,
        },
        transformRequest: [(data) => data],
      });

      return response.data;
    } else {
      const response = await axiosInstance.post(
        '/Vendor',
        {
          name: params.name,
          description: params.description,
          openingTime: params.openingTime,
          closeTime: params.closeTime,
          type: params.type,
          userId: params.userId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            key: API_KEY,
            value: API_VALUE,
          },
        }
      );
      return response.data;
    }
  } catch (error: any) {
    return { error: error?.response?.data?.message || error.message };
  }
};

export const fetchVendors = async (params?: {
  page?: number;
  limit?: number;
  searchName?: string;
}) => {
  try {
    const response = await axiosInstance.get('/Vendor', {
      headers: { key: API_KEY, value: API_VALUE },
      params,
    });
    return response.data;
  } catch (error: any) {
    return { error: error.response?.data?.message || error.message };
  }
};

