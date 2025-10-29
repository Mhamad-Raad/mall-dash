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

export const fetchUserById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/Account/user/${id}`, {
      headers: { key: API_KEY, value: API_VALUE },
    });
    return response.data;
  } catch (error: any) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const updateUser = async (
  id: string,
  userData: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: number;
  }
) => {
  try {
    const response = await axiosInstance.put(`/Account/${id}`, userData, {
      headers: {
        key: API_KEY,
        value: API_VALUE,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    return { error: error.response?.data?.message || error.message };
  }
};

// Delete user by ID (DELETE request)
export const deleteUser = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/Account/${id}`, {
      headers: { key: API_KEY, value: API_VALUE },
    });
    return response.data;
  } catch (error: any) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const createUser = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: number;
}) => {
  try {
    const response = await axiosInstance.post('/Account/register', userData, {
      headers: {
        key: API_KEY,
        value: API_VALUE,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    return { error: error.response?.data?.message || error.message };
  }
};
