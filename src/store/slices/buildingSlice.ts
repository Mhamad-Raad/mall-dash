import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchBuildingById } from '@/data/Buildings';
import type { Building } from '@/interfaces/Building.interface';

interface BuildingState {
  building: Building | null;
  loading: boolean;
  error: string | null;
}

const initialState: BuildingState = {
  building: null,
  loading: false,
  error: null,
};

export const getBuildingById = createAsyncThunk(
  'building/getById',
  async (id: number, { rejectWithValue }) => {
    const result = await fetchBuildingById(id);
    if (result.error) return rejectWithValue(result.error);
    return result;
  }
);

const buildingSlice = createSlice({
  name: 'building',
  initialState,
  reducers: {
    clearBuilding(state) {
      state.building = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBuildingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBuildingById.fulfilled, (state, action) => {
        state.loading = false;
        state.building = action.payload;
        state.error = null;
      })
      .addCase(getBuildingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearBuilding } = buildingSlice.actions;
export default buildingSlice.reducer;
