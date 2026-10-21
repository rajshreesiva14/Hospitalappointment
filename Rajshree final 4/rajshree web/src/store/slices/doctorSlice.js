import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchDoctorsApi, fetchDoctorByIdApi, fetchDoctorAvailabilityApi } from '../../services/api';
import { INITIAL_DOCTORS } from '../../data/doctorsData';

// Cache expiration threshold: 5 minutes
const CACHE_EXPIRATION_MS = 5 * 60 * 1000;

/**
 * Experiment 1 a & b: Fetch doctor information using REST APIs with filtering & caching
 */
export const fetchDoctorsThunk = createAsyncThunk(
  'doctors/fetchDoctors',
  async (params = {}, { getState, rejectWithValue }) => {
    try {
      const state = getState().doctors;
      const now = Date.now();

      // Check cache if no specific search query or forceRefresh requested
      const hasSpecificFilter = params.search || params.forceRefresh;
      if (!hasSpecificFilter && state.doctors.length > 0 && state.lastFetched && (now - state.lastFetched < CACHE_EXPIRATION_MS)) {
        console.log('[CACHE HIT] Serving doctors from Redux cache');
        return { data: state.doctors, cached: true };
      }

      console.log('[CACHE MISS] Fetching doctors from REST API...');
      const response = await fetchDoctorsApi(params);
      return { data: response.data, cached: false };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch doctors');
    }
  },
  {
    condition: (params = {}, { getState }) => {
      const state = getState().doctors;
      // Prevent concurrent duplicate requests in-flight
      if (state.loading) {
        return false;
      }
      const hasSpecificFilter = params?.search || params?.forceRefresh;
      const now = Date.now();
      // Skip redundant request if cache is fresh and no force refresh requested
      if (!hasSpecificFilter && state.doctors.length > 0 && state.lastFetched && (now - state.lastFetched < CACHE_EXPIRATION_MS)) {
        return false;
      }
      return true;
    }
  }
);

/**
 * Experiment 1 d: Fetch individual doctor details dynamically with caching
 */
export const fetchDoctorByIdThunk = createAsyncThunk(
  'doctors/fetchDoctorById',
  async (doctorId, { getState, rejectWithValue }) => {
    try {
      const state = getState().doctors;
      const numId = Number(doctorId);

      // Check if already in individual details cache
      if (state.doctorDetailsCache[numId]) {
        console.log(`[CACHE HIT] Serving doctor #${numId} from detail cache`);
        return { data: state.doctorDetailsCache[numId], cached: true };
      }

      console.log(`[CACHE MISS] Fetching doctor #${numId} from REST API...`);
      const response = await fetchDoctorByIdApi(numId);
      return { data: response.data, cached: false };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch doctor details');
    }
  },
  {
    condition: (doctorId, { getState }) => {
      const state = getState().doctors;
      const numId = Number(doctorId);
      // Skip if already in detail cache or currently loading in-flight
      if (state.doctorDetailsCache[numId] || state.pendingDoctorDetails?.[numId]) {
        return false;
      }
      return true;
    }
  }
);

/**
 * Experiment 1 c & Experiment 2 e: Retrieve available dates and time slots using API requests with caching
 */
export const fetchDoctorAvailabilityThunk = createAsyncThunk(
  'doctors/fetchAvailability',
  async ({ doctorId, date }, { getState, rejectWithValue }) => {
    try {
      const state = getState().doctors;
      const cacheKey = `${doctorId}_${date}`;

      // Check availability cache
      if (state.availabilityCache[cacheKey]) {
        console.log(`[CACHE HIT] Serving availability for doctor #${doctorId} on ${date} from cache`);
        return {
          cacheKey,
          data: state.availabilityCache[cacheKey],
          cached: true
        };
      }

      console.log(`[CACHE MISS] Fetching availability from REST API for doctor #${doctorId} on ${date}...`);
      const response = await fetchDoctorAvailabilityApi(doctorId, date);
      return {
        cacheKey,
        data: response.availableSlots || [],
        cached: false
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to retrieve available slots');
    }
  },
  {
    condition: ({ doctorId, date }, { getState }) => {
      const state = getState().doctors;
      const cacheKey = `${doctorId}_${date}`;
      // Prevent duplicate in-flight requests or redundant cache misses
      if (state.availabilityCache[cacheKey] || state.pendingAvailability?.[cacheKey]) {
        return false;
      }
      return true;
    }
  }
);

const doctorSlice = createSlice({
  name: 'doctors',
  initialState: {
    doctors: INITIAL_DOCTORS,
    selectedDoctor: null,
    searchQuery: '',
    selectedSpecialty: 'All Specialties',
    selectedDay: 'All Days',
    maxFee: 1500,
    minRating: 0,
    sortBy: 'recommended',
    doctorDetailsCache: {},
    availabilityCache: {},
    pendingAvailability: {},
    pendingDoctorDetails: {},
    loading: false,
    error: null,
    lastFetched: null
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedSpecialty: (state, action) => {
      state.selectedSpecialty = action.payload;
    },
    setSelectedDay: (state, action) => {
      state.selectedDay = action.payload;
    },
    setMaxFee: (state, action) => {
      state.maxFee = action.payload;
    },
    setMinRating: (state, action) => {
      state.minRating = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    resetFilters: (state) => {
      state.searchQuery = '';
      state.selectedSpecialty = 'All Specialties';
      state.selectedDay = 'All Days';
      state.maxFee = 1500;
      state.minRating = 0;
      state.sortBy = 'recommended';
    },
    setSelectedDoctor: (state, action) => {
      state.selectedDoctor = action.payload;
    },
    invalidateAvailabilityCache: (state, action) => {
      if (action.payload) {
        // Invalidate specific doctor or date
        const key = action.payload;
        delete state.availabilityCache[key];
      } else {
        state.availabilityCache = {};
      }
    }
  },
  extraReducers: (builder) => {
    // Doctors list
    builder
      .addCase(fetchDoctorsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload.data;
        if (!action.payload.cached) {
          state.lastFetched = Date.now();
        }
      })
      .addCase(fetchDoctorsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Doctor by ID
    builder
      .addCase(fetchDoctorByIdThunk.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        const numId = Number(action.meta.arg);
        if (numId) {
          state.pendingDoctorDetails[numId] = true;
        }
      })
      .addCase(fetchDoctorByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        const doctor = action.payload.data;
        if (doctor) {
          state.selectedDoctor = doctor;
          state.doctorDetailsCache[doctor.id] = doctor;
        }
        const numId = Number(action.meta.arg);
        if (numId) {
          delete state.pendingDoctorDetails[numId];
        }
      })
      .addCase(fetchDoctorByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        const numId = Number(action.meta.arg);
        if (numId) {
          delete state.pendingDoctorDetails[numId];
        }
      });

    // Availability
    builder
      .addCase(fetchDoctorAvailabilityThunk.pending, (state, action) => {
        const { doctorId, date } = action.meta.arg || {};
        if (doctorId && date) {
          const cacheKey = `${doctorId}_${date}`;
          state.pendingAvailability[cacheKey] = true;
        }
      })
      .addCase(fetchDoctorAvailabilityThunk.fulfilled, (state, action) => {
        const { cacheKey, data } = action.payload;
        state.availabilityCache[cacheKey] = data;
        delete state.pendingAvailability[cacheKey];
      })
      .addCase(fetchDoctorAvailabilityThunk.rejected, (state, action) => {
        const { doctorId, date } = action.meta.arg || {};
        if (doctorId && date) {
          const cacheKey = `${doctorId}_${date}`;
          delete state.pendingAvailability[cacheKey];
        }
      });
  }
});

export const {
  setSearchQuery,
  setSelectedSpecialty,
  setSelectedDay,
  setMaxFee,
  setMinRating,
  setSortBy,
  resetFilters,
  setSelectedDoctor,
  invalidateAvailabilityCache
} = doctorSlice.actions;

export default doctorSlice.reducer;
