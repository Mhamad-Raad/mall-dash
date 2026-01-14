import { axiosInstance } from '@/data/axiosInstance';
import type {
  SupportTicketsResponse,
  TicketStatus,
} from '@/interfaces/SupportTicket.interface';

const API_KEY = import.meta.env.VITE_API_KEY;
const API_VALUE = import.meta.env.VITE_API_VALUE;

export interface FetchSupportTicketsParams {
  page?: number;
  limit?: number;
  status?: TicketStatus | 'all' | null;
  search?: string;
}

export const fetchSupportTickets = async (
  params: FetchSupportTicketsParams = {},
  signal?: AbortSignal
): Promise<SupportTicketsResponse | { error: string }> => {
  try {
    const queryParams: Record<string, any> = {
      page: params.page || 1,
      limit: params.limit || 10,
    };

    if (
      params.status !== undefined &&
      params.status !== null &&
      params.status !== 'all'
    ) {
      queryParams.status = params.status;
    }

    if (params.search) {
      queryParams.search = params.search;
    }

    const response = await axiosInstance.get<SupportTicketsResponse>(
      '/SupportTicket',
      {
        params: queryParams,
        signal,
        headers: { key: API_KEY, value: API_VALUE },
      }
    );

    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Failed to fetch support tickets';

    return { error: message };
  }
};

