import { configureStore } from '@reduxjs/toolkit';

import usersReducer from './slices/usersSlice';
import userReducer from './slices/userSlice';

import BuildingsReducer from './slices/buildingsSlice';
import BuildingReducer from './slices/buildingSlice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    user: userReducer,
    buildings: BuildingsReducer,
    building: BuildingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
