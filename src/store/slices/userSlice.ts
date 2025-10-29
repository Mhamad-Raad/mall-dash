import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { UserType } from '@/interfaces/Users.interface';
import { fetchUserById as fetchUserByIdAPI } from '@/data/Users';
import { initialUser } from '@/constants/Users';

interface UserState {
  user: UserType;
  luser: boolean; // loading state
  euser: string | null; // error state
}

const initialState: UserState = {
  user: initialUser,
  luser: false,
  euser: null,
};

// Create async thunk for fetching a single user by ID
export const fetchUserById = createAsyncThunk(
  'user/fetchUserById',
  async (userId: string, { rejectWithValue }) => {
    try {
      const data = await fetchUserByIdAPI(userId);

      if (data.error) {
        return rejectWithValue(data.error);
      }

      return data;
    } catch (error) {
      return rejectWithValue('Failed to fetch user');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Clear user state (useful when navigating away)
    clearUser: (state) => {
      state.user = initialUser;
      state.euser = null;
    },

    // Clear error
    clearError: (state) => {
      state.euser = null;
    },
  },
  extraReducers: (builder) => {
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
  },
});

export const { clearUser, clearError } = userSlice.actions;
export default userSlice.reducer;
