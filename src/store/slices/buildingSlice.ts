import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Building } from '@/interfaces/Building.interface';
import {
  fetchBuildingById,
  updateBuildingName,
  updateApartment,
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

export const updateApartmentThunk = createAsyncThunk(
  'building/updateApartment',
  async (
    params: {
      id: number;
      apartmentName: string;
      userId: string | number | null;
    },
    { rejectWithValue }
  ) => {
    const result = await updateApartment(
      params.id,
      params.apartmentName,
      params.userId
    );
    if (result.error) return rejectWithValue(result.error);

    return { ...params, updatedApartment: result };
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
      // =========== UNIFIED APARTMENT UPDATE ===========
      .addCase(updateApartmentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateApartmentThunk.fulfilled, (state, action) => {
        state.loading = false;
        // Find and update the target apartment in floors
        if (state.building?.floors) {
          state.building.floors = state.building.floors.map((floor: any) => ({
            ...floor,
            apartments: Array.isArray(floor.apartments)
              ? floor.apartments.map((apt: any) =>
                  apt.id === action.payload.id
                    ? {
                        ...apt,
                        apartmentName: action.payload.apartmentName,
                        occupant: action.payload.updatedApartment.occupant, // From backend response
                      }
                    : apt
                )
              : floor.apartments,
          }));
        }
        state.error = null;
      })
      .addCase(updateApartmentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(postBuildingFloor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postBuildingFloor.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(postBuildingFloor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
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
        state.error =
          (action.payload as { error?: string; status?: number })?.error ||
          'Unknown error';
      });
  },
});

export const { clearBuilding } = buildingSlice.actions;
export default buildingSlice.reducer;
