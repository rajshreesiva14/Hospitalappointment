import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchAppointmentsApi,
  fetchAppointmentHistoryApi,
  fetchAppointmentByIdApi,
  createAppointmentApi,
  rescheduleAppointmentApi,
  cancelAppointmentApi
} from '../../services/api';
import { AUTH_TOKEN_KEY } from '../../services/apiClient';
import { invalidateAvailabilityCache } from './doctorSlice';

/**
 * Experiment 3 a: Retrieve appointments using GET
 */
export const fetchAppointmentsThunk = createAsyncThunk(
  'appointment/fetchAppointments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchAppointmentsApi();
      return response.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch appointments');
    }
  }
);

/**
 * Experiment 3 e: Retrieve appointment history using GET
 */
export const fetchAppointmentHistoryThunk = createAsyncThunk(
  'appointment/fetchAppointmentHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchAppointmentHistoryApi();
      return response.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch appointment history');
    }
  }
);

/**
 * Retrieve single appointment by ID using GET
 */
export const fetchAppointmentByIdThunk = createAsyncThunk(
  'appointment/fetchAppointmentById',
  async (appointmentId, { rejectWithValue }) => {
    try {
      const response = await fetchAppointmentByIdApi(appointmentId);
      return response.data || response;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch appointment');
    }
  }
);

/**
 * Experiment 3 b: Create an appointment using POST
 */
export const bookAppointmentThunk = createAsyncThunk(
  'appointment/bookAppointment',
  async (bookingPayload, { dispatch, rejectWithValue }) => {
    try {
      const response = await createAppointmentApi(bookingPayload);
      // Invalidate availability cache so new slots reflect accurately
      dispatch(invalidateAvailabilityCache(`${bookingPayload.doctorId}_${bookingPayload.date}`));
      if (response?.token) {
        try {
          localStorage.setItem(AUTH_TOKEN_KEY, response.token);
        } catch {}
      }
      return response.data || response;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to book appointment');
    }
  }
);

/**
 * Experiment 3 c: Reschedule an appointment using PUT / PATCH
 */
export const rescheduleAppointmentThunk = createAsyncThunk(
  'appointment/rescheduleAppointment',
  async ({ appointmentId, date, timeSlot }, { dispatch, rejectWithValue }) => {
    try {
      const response = await rescheduleAppointmentApi(appointmentId, { date, timeSlot });
      dispatch(invalidateAvailabilityCache());
      return response.data || response;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to reschedule appointment');
    }
  }
);

/**
 * Experiment 3 d: Cancel an appointment using DELETE
 */
export const cancelAppointmentThunk = createAsyncThunk(
  'appointment/cancelAppointment',
  async ({ appointmentId, reason }, { dispatch, rejectWithValue }) => {
    try {
      const response = await cancelAppointmentApi(appointmentId, reason);
      dispatch(invalidateAvailabilityCache());
      return response.data || response;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to cancel appointment');
    }
  }
);

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState: {
    appointments: [],
    history: [],
    selectedDoctor: null,
    appointmentDate: '',
    selectedTimeSlot: '',
    patientDetails: {
      name: '',
      email: '',
      phone: '',
      age: '',
      gender: 'Male',
      symptoms: '',
      medicalHistory: ''
    },
    bookingStatus: 'idle', // 'idle' | 'loading' | 'success' | 'error'
    loading: false,
    error: null,
    lastBookedAppointment: null,
    reminderNotification: null,
    monitoredActions: []
  },
  reducers: {
    setSelectedDoctor: (state, action) => {
      state.selectedDoctor = action.payload;
      state.selectedTimeSlot = '';
    },
    setAppointmentDate: (state, action) => {
      state.appointmentDate = action.payload;
      state.selectedTimeSlot = '';
    },
    setSelectedTimeSlot: (state, action) => {
      state.selectedTimeSlot = action.payload;
    },
    setPatientDetails: (state, action) => {
      state.patientDetails = { ...state.patientDetails, ...action.payload };
    },
    setBookingStatus: (state, action) => {
      state.bookingStatus = action.payload;
    },
    setLastBookedAppointment: (state, action) => {
      state.lastBookedAppointment = action.payload;
    },
    setReminderNotification: (state, action) => {
      state.reminderNotification = action.payload;
    },
    clearAppointmentDraft: (state) => {
      state.selectedDoctor = null;
      state.appointmentDate = '';
      state.selectedTimeSlot = '';
      state.patientDetails = {
        name: '',
        email: '',
        phone: '',
        age: '',
        gender: 'Male',
        symptoms: '',
        medicalHistory: ''
      };
      state.bookingStatus = 'idle';
      state.error = null;
    },
    recordMonitoredAction: (state, action) => {
      state.monitoredActions.unshift(action.payload);
      if (state.monitoredActions.length > 50) {
        state.monitoredActions.pop();
      }
    }
  },
  extraReducers: (builder) => {
    // Fetch Appointments
    builder
      .addCase(fetchAppointmentsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointmentsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.data || [];
      })
      .addCase(fetchAppointmentsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch History
    builder
      .addCase(fetchAppointmentHistoryThunk.fulfilled, (state, action) => {
        state.history = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.data || [];
      });

    // Fetch Appointment by ID
    builder
      .addCase(fetchAppointmentByIdThunk.fulfilled, (state, action) => {
        const item = action.payload?.data || action.payload;
        if (item && item.id) {
          const idx = state.appointments.findIndex((a) => a.id === item.id);
          if (idx >= 0) {
            state.appointments[idx] = item;
          } else {
            state.appointments.push(item);
          }
        }
      });

    // Book Appointment (POST)
    builder
      .addCase(bookAppointmentThunk.pending, (state) => {
        state.bookingStatus = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(bookAppointmentThunk.fulfilled, (state, action) => {
        state.bookingStatus = 'success';
        state.loading = false;
        const booked = action.payload?.data || action.payload;
        state.lastBookedAppointment = booked;
        state.appointments.unshift(booked);
      })
      .addCase(bookAppointmentThunk.rejected, (state, action) => {
        state.bookingStatus = 'error';
        state.loading = false;
        state.error = action.payload;
      });

    // Reschedule Appointment (PUT/PATCH)
    builder
      .addCase(rescheduleAppointmentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rescheduleAppointmentThunk.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload?.data || action.payload;
        if (updated && updated.id) {
          state.appointments = state.appointments.map((apt) =>
            apt.id === updated.id ? updated : apt
          );
        }
      })
      .addCase(rescheduleAppointmentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Cancel Appointment (DELETE)
    builder
      .addCase(cancelAppointmentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelAppointmentThunk.fulfilled, (state, action) => {
        state.loading = false;
        const cancelled = action.payload?.data || action.payload;
        if (cancelled && cancelled.id) {
          state.appointments = state.appointments.map((apt) =>
            apt.id === cancelled.id ? cancelled : apt
          );
        }
      })
      .addCase(cancelAppointmentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  setSelectedDoctor,
  setAppointmentDate,
  setSelectedTimeSlot,
  setPatientDetails,
  setBookingStatus,
  setLastBookedAppointment,
  setReminderNotification,
  clearAppointmentDraft,
  recordMonitoredAction
} = appointmentSlice.actions;

export default appointmentSlice.reducer;
