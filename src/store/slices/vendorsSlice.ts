import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { VendorType, VendorAPIResponse } from '@/interfaces/Vendor.interface';
import { mapVendorAPIToUI } from '@/interfaces/Vendor.interface';
import { fetchVendors as fetchVendorsAPI } from '@/data/Vendor';

interface VendorsState {
  vendors: VendorType[];
  lvendors: boolean;
  evendors: string | null;
  limit: number;
  page: number;
  total: number;
}

const initialState: VendorsState = {
  vendors: [],
  lvendors: false,
  evendors: null,
  limit: 10,
  page: 1,
  total: 10,
};

export const fetchVendors = createAsyncThunk(
  'vendors/fetchVendors',
  async (
    params: {
      page?: number;
      limit?: number;
      searchName?: string;
      type?: number;
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const data = await fetchVendorsAPI(params);

      if (data.error) {
        return rejectWithValue(data.error);
      }

      return data;
    } catch (error) {
      return rejectWithValue('Failed to fetch vendors');
    }
  }
);

const vendorsSlice = createSlice({
  name: 'vendors',
  initialState,
  reducers: {
    clearError: (state) => {
      state.evendors = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendors.pending, (state) => {
        state.lvendors = true;
        state.evendors = null;
      })
      .addCase(
        fetchVendors.fulfilled,
        (
          state,
          action: PayloadAction<{
            data: VendorAPIResponse[];
            limit: number;
            page: number;
            total: number;
          }>
        ) => {
          state.lvendors = false;
          // Map API response to UI format
          state.vendors = action.payload.data.map(mapVendorAPIToUI);
          state.limit = action.payload.limit;
          state.page = action.payload.page;
          state.total = action.payload.total;
          state.evendors = null;
        }
      )
      .addCase(fetchVendors.rejected, (state, action) => {
        state.lvendors = false;
        state.evendors = action.payload as string;
      });
  },
});

export const { clearError } = vendorsSlice.actions;
export default vendorsSlice.reducer;
