import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Building } from '@/interfaces/Building.interface';

import { fetchBuildingById, updateBuildingName } from '@/data/Buildings';
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

// Thunk to fetch a building by id
export const getBuildingById = createAsyncThunk(
  'building/getById',
  async (id: number, { rejectWithValue }) => {
    const result = await fetchBuildingById(id);
    if (result.error) return rejectWithValue(result.error);
    return result; // should be the full building object
  }
);

// Thunk to update the building name
export const putBuildingName = createAsyncThunk(
  'building/updateName',
  async (params: { id: number; name: string }, { rejectWithValue }) => {
    const result = await updateBuildingName(params.id, params.name);
    if (result.error) return rejectWithValue(result.error);
    return { ...result, name: params.name, id: params.id };
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
      // Get building by ID
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
      })
      // Update Building Name
      .addCase(putBuildingName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(putBuildingName.fulfilled, (state, action) => {
        state.loading = false;
        if (state.building) {
          state.building.name = action.payload.name;
        }
        state.error = null;
      })
      .addCase(putBuildingName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearBuilding } = buildingSlice.actions;
export default buildingSlice.reducer;
