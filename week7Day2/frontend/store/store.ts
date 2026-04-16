import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './api/authApi';
import { newsletterApi } from './api/newsletterApi';
import { usersApi } from './api/usersApi';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [newsletterApi.reducerPath]: newsletterApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      newsletterApi.middleware,
      usersApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
