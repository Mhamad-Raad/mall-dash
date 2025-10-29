import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { UserType } from '@/interfaces/Users.interface';
import { fetchUsers as fetchUsersAPI } from '@/data/Users';

interface UsersState {
  users: UserType[];
  lusers: boolean;
  eusers: string | null;
}

const initialState: UsersState = {
  users: [],
  lusers: false,
  eusers: null,
};

// Create async thunk for fetching users
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchUsersAPI();

      if (data.error) {
        return rejectWithValue(data.error);
      }

      return data;
    } catch (error) {
      return rejectWithValue('Failed to fetch users');
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.eusers = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.lusers = true;
        state.eusers = null;
      })
      .addCase(
        fetchUsers.fulfilled,
        (state, action: PayloadAction<UserType[]>) => {
          state.lusers = false;
          state.users = action.payload;
          state.eusers = null;
        }
      )
      .addCase(fetchUsers.rejected, (state, action) => {
        state.lusers = false;
        state.eusers = (action.payload as string) || 'An error occurred';
      });
  },
});

export const { clearError } = usersSlice.actions;
export default usersSlice.reducer;
