import { configureStore } from '@reduxjs/toolkit';
import { projectsSlice } from './slices/projectsSlice';

export const store = configureStore({
  reducer: {
    projects: projectsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;