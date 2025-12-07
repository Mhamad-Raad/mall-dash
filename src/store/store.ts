import { configureStore } from '@reduxjs/toolkit';

import usersReducer from './slices/usersSlice';
import userReducer from './slices/userSlice';

import BuildingsReducer from './slices/buildingsSlice';
import BuildingReducer from './slices/buildingSlice';

import vendorsReducer from './slices/vendorsSlice';
import vendorReducer from './slices/vendorSlice';
import meReducer from './slices/meSlice';

export const store = configureStore({
  reducer: {
    me: meReducer,
    users: usersReducer,
    user: userReducer,
    buildings: BuildingsReducer,
    building: BuildingReducer,
    vendors: vendorsReducer,
    vendor: vendorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
