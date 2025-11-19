import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { VendorType, VendorAPIResponse } from '@/interfaces/Vendor.interface';
import { mapVendorAPIToUI } from '@/interfaces/Vendor.interface';
import { fetchVendorById as fetchVendorByIdAPI, updateVendor as updateVendorAPI } from '@/data/Vendor';

interface VendorState {
  vendor: VendorType | null;
  loading: boolean;
  error: string | null;
  updating: boolean;
  updateError: string | null;
}

const initialState: VendorState = {
  vendor: null,
  loading: false,
  error: null,
  updating: false,
  updateError: null,
};

export const fetchVendorById = createAsyncThunk(
  'vendor/fetchVendorById',
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await fetchVendorByIdAPI(id);

      if (data.error) {
        return rejectWithValue(data.error);
      }

      return data;
    } catch (error) {
      return rejectWithValue('Failed to fetch vendor');
    }
  }
);

export const updateVendor = createAsyncThunk(
  'vendor/updateVendor',
  async (
    {
      id,
      vendorData,
    }: {
      id: string;
      vendorData: {
        name: string;
        description: string;
        openingTime: string;
        closeTime: string;
        type: number;
        userId: string;
        ProfileImageUrl?: File;
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const data = await updateVendorAPI(id, vendorData);

      if (data.error) {
        return rejectWithValue(data.error);
      }

      return data;
    } catch (error) {
      return rejectWithValue('Failed to update vendor');
    }
  }
);

const vendorSlice = createSlice({
  name: 'vendor',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.updateError = null;
    },
    clearVendor: (state) => {
      state.vendor = null;
      state.error = null;
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch vendor by ID
      .addCase(fetchVendorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchVendorById.fulfilled,
        (state, action: PayloadAction<VendorAPIResponse>) => {
          state.loading = false;
          state.vendor = mapVendorAPIToUI(action.payload);
          state.error = null;
        }
      )
      .addCase(fetchVendorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update vendor
      .addCase(updateVendor.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(
        updateVendor.fulfilled,
        (state, action: PayloadAction<VendorAPIResponse>) => {
          state.updating = false;
          state.vendor = mapVendorAPIToUI(action.payload);
          state.updateError = null;
        }
      )
      .addCase(updateVendor.rejected, (state, action) => {
        state.updating = false;
        state.updateError = action.payload as string;
      });
  },
});

export const { clearError, clearVendor } = vendorSlice.actions;
export default vendorSlice.reducer;
