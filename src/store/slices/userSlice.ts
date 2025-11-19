import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { UserType } from '@/interfaces/Users.interface';
import {
  fetchUserById as fetchUserByIdAPI,
  updateUser as updateUserAPI,
  deleteUser as deleteUserAPI,
} from '@/data/Users';
import { initialUser } from '@/constants/Users';

interface UserState {
  user: UserType;
  luser: boolean;
  euser: string | null;
  updating: boolean;
  updatingError: string | null;
  deleting: boolean;
  deletingError: string | null;
}

const initialState: UserState = {
  user: initialUser,
  luser: false,
  euser: null,
  updating: false,
  updatingError: null,
  deleting: false,
  deletingError: null,
};

export const fetchUserById = createAsyncThunk(
  'user/fetchUserById',
  async (userId: string, { rejectWithValue }) => {
    const data = await fetchUserByIdAPI(userId);
    if (data.error) return rejectWithValue(data.error);
    return data;
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (
    {
      id,
      update,
    }: {
      id: string;
      update: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        role: number;
        imageFile?: File;
        buildingName?: string;
      };
    },
    { rejectWithValue }
  ) => {
    // Transform imageFile to ProfileImageUrl for API compatibility
    const apiPayload: any = {
      firstName: update.firstName,
      lastName: update.lastName,
      email: update.email,
      phoneNumber: update.phoneNumber,
      role: update.role,
    };

    // Only include ProfileImageUrl if a new file was provided
    if (update.imageFile instanceof File) {
      apiPayload.ProfileImageUrl = update.imageFile;
    }

    const data = await updateUserAPI(id, apiPayload);
    if (data.error) return rejectWithValue(data.error);
    return data;
  }
);

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (id: string, { rejectWithValue }) => {
    const data = await deleteUserAPI(id);
    if (data.error) return rejectWithValue(data.error);
    return data;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = initialUser;
      state.euser = null;
      state.updating = false;
      state.updatingError = null;
      state.deleting = false;
      state.deletingError = null;
    },
    clearError: (state) => {
      state.euser = null;
      state.updatingError = null;
      state.deletingError = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch user
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.luser = true;
        state.euser = null;
      })
      .addCase(
        fetchUserById.fulfilled,
        (state, action: PayloadAction<UserType>) => {
          state.luser = false;
          state.user = action.payload;
          state.euser = null;
        }
      )
      .addCase(fetchUserById.rejected, (state, action) => {
        state.luser = false;
        state.euser = (action.payload as string) || 'An error occurred';
      });

    // Update user
    builder
      .addCase(updateUser.pending, (state) => {
        state.updating = true;
        state.updatingError = null;
      })
      .addCase(
        updateUser.fulfilled,
        (state, action: PayloadAction<UserType>) => {
          state.updating = false;
          state.user = action.payload;
          state.updatingError = null;
        }
      )
      .addCase(updateUser.rejected, (state, action) => {
        state.updating = false;
        state.updatingError = (action.payload as string) || 'An error occurred';
      });

    // Delete user
    builder
      .addCase(deleteUser.pending, (state) => {
        state.deleting = true;
        state.deletingError = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.deleting = false;
        state.user = initialUser; // Clear user after deletion
        state.deletingError = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.deleting = false;
        state.deletingError = (action.payload as string) || 'An error occurred';
      });
  },
});

export const { clearUser, clearError } = userSlice.actions;
export default userSlice.reducer;
