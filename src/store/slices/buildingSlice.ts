import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Building } from '@/interfaces/Building.interface';
import {
  fetchBuildingById,
  updateBuildingName,
  updateApartment,
  addBuildingFloor,
  deleteBuildingFloor,
  addApartmentToFloor,
  deleteApartment,
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

export const addApartmentToFloorThunk = createAsyncThunk(
  'building/addApartmentToFloor',
  async (
    params: { floorId: number; apartmentName: string },
    { rejectWithValue }
  ) => {
    const result = await addApartmentToFloor(
      params.floorId,
      params.apartmentName
    );
    if (result.error) return rejectWithValue(result.error);
    // Only a message is returned, so just return params (refetch is recommended after this)
    return params;
  }
);

export const deleteApartmentThunk = createAsyncThunk(
  'building/deleteApartment',
  async (apartmentId: number, { rejectWithValue }) => {
    const result = await deleteApartment(apartmentId);
    if (result.error) return rejectWithValue(result.error);
    // Only returns message, so pass back id for local state handling
    return { id: apartmentId };
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
      .addCase(updateApartmentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateApartmentThunk.fulfilled, (state, action) => {
        state.loading = false;
        if (state.building?.floors) {
          state.building.floors = state.building.floors.map((floor: any) => ({
            ...floor,
            apartments: Array.isArray(floor.apartments)
              ? floor.apartments.map((apt: any) =>
                  apt.id === action.payload.id
                    ? {
                        ...apt,
                        ...action.payload.updatedApartment,
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
      })
      .addCase(addApartmentToFloorThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addApartmentToFloorThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addApartmentToFloorThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteApartmentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteApartmentThunk.fulfilled, (state, action) => {
        state.loading = false;
        if (state.building?.floors) {
          state.building.floors = state.building.floors.map((floor: any) => ({
            ...floor,
            apartments: Array.isArray(floor.apartments)
              ? floor.apartments.filter(
                  (apt: any) => apt.id !== action.payload.id
                )
              : floor.apartments,
          }));
        }
        state.error = null;
      })
      .addCase(deleteApartmentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearBuilding } = buildingSlice.actions;
export default buildingSlice.reducer;
