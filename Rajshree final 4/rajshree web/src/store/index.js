import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import doctorReducer from './slices/doctorSlice';
import appointmentReducer from './slices/appointmentSlice';
import { appointmentLoggerMiddleware } from './middleware/appointmentLoggerMiddleware';

/**
 * Factory to create a fresh store instance (useful for test isolation and SSR)
 */
export const createAppStore = (preloadedState = {}) =>
  configureStore({
    reducer: {
      auth: authReducer,
      doctors: doctorReducer,
      appointment: appointmentReducer
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false
      }).concat(appointmentLoggerMiddleware),
    devTools: typeof process !== 'undefined' ? process.env?.NODE_ENV !== 'production' : true
  });

/**
 * Global Appointment Store (Experiment 2 a)
 * Configured with Redux Toolkit and custom middleware for monitoring actions.
 */
export const store = createAppStore();

export default store;
