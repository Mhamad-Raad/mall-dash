import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuditLog } from '@/interfaces/Audit.interface';
import { fetchAudit as fetchAuditAPI } from '@/data/Audit';
import type { AuditParams } from '@/data/Audit';

interface AuditState {
  logs: AuditLog[];
  loading: boolean;
  error: string | null;
  limit: number;
  page: number;
  total: number;
}

const initialState: AuditState = {
  logs: [],
  loading: false,
  error: null,
  limit: 20,
  page: 1,
  total: 0,
};

export const fetchAuditLogs = createAsyncThunk(
  'audit/fetchAuditLogs',
  async (params: AuditParams = {}, { rejectWithValue }) => {
    try {
      const data = await fetchAuditAPI(params);

      if (data.error) {
        return rejectWithValue(data.error);
      }

      return data;
    } catch (error) {
      return rejectWithValue('Failed to fetch audit logs');
    }
  }
);

const auditSlice = createSlice({
  name: 'audit',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuditLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAuditLogs.fulfilled,
        (
          state,
          action: PayloadAction<{
            data: AuditLog[];
            limit: number;
            page: number;
            total: number;
          }>
        ) => {
          state.loading = false;
          // Handle cases where data might be wrapped or just an array
          // Assuming the API returns { data: [], total: number, page: number, limit: number }
          // If it returns just an array, we might need to adjust.
          // Based on Users slice, it seems to return { data, limit, page, total }
          state.logs = action.payload.data || [];
          state.limit = action.payload.limit || state.limit;
          state.page = action.payload.page || state.page;
          state.total = action.payload.total || 0;
          state.error = null;
        }
      )
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = auditSlice.actions;
export default auditSlice.reducer;

