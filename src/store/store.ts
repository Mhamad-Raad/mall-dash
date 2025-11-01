import { configureStore } from '@reduxjs/toolkit';

import usersReducer from './slices/usersSlice';
import userReducer from './slices/userSlice';

import BuildingReducer from './slices/buildingsSlice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    user: userReducer,
    buildings: BuildingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
