import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Building } from '@/interfaces/Building.interface';
import {
  fetchBuildingById,
  updateBuildingName,
  addBuildingFloor,
  deleteBuildingFloor,
} from '@/data/Buildings';

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

export const putBuildingName = createAsyncThunk(
  'building/updateName',
  async (params: { id: number; name: string }, { rejectWithValue }) => {
    const result = await updateBuildingName(params.id, params.name);
    if (result.error) return rejectWithValue(result.error);
    return { ...result, name: params.name, id: params.id };
  }
);

export const postBuildingFloor = createAsyncThunk(
  'building/addFloor',
  async (buildingId: number, { rejectWithValue }) => {
    const result = await addBuildingFloor(buildingId);
    if (result.error) return rejectWithValue(result.error);
    return result;
  }
);

export const removeBuildingFloor = createAsyncThunk(
  'building/deleteFloor',
  async (floorId: number, { rejectWithValue }) => {
    const result = await deleteBuildingFloor(floorId);
    if (result?.error || result?.statusCode >= 400) {
      return rejectWithValue({
        error: result?.error,
        status: result?.statusCode,
        floorId,
      });
    }
    return { floorId };
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
      })
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
      })
      // --- Floor creation
      .addCase(postBuildingFloor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postBuildingFloor.fulfilled, (state) => {
        state.loading = false;
        // Add floor to list if needed or refetch via getBuildingById
        state.error = null;
      })
      .addCase(postBuildingFloor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // --- Floor deletion
      .addCase(removeBuildingFloor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeBuildingFloor.fulfilled, (state, action) => {
        state.loading = false;
        if (state.building && Array.isArray(state.building.floors)) {
          state.building.floors = state.building.floors.filter(
            (f: any) => f.id !== action.payload.floorId
          );
        }
        state.error = null;
      })
      .addCase(removeBuildingFloor.rejected, (state, action) => {
        state.loading = false;
        // Always set the error (and never clear the building here!)
        state.error =
          (action.payload as { error?: string; status?: number })?.error ||
          'Unknown error';
      });
  },
});

export const { clearBuilding } = buildingSlice.actions;
export default buildingSlice.reducer;
