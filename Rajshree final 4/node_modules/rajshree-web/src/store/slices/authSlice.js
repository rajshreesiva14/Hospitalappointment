import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginApi, registerApi, verifyAuthTokenApi, logoutApi, getStoredAuthToken } from '../../services/api';
import { AUTH_TOKEN_KEY } from '../../services/apiClient';
import { safeBtoa } from '../../services/mockApiServer';

const USER_STORAGE_KEY = 'rajshree_hospital_auth_user';

// Initial state from localStorage
let storedToken = getStoredAuthToken();
let storedUser = null;
try {
  const raw =
    localStorage.getItem(USER_STORAGE_KEY) ||
    localStorage.getItem('rajshree_hospital_auth');
  storedUser = raw ? JSON.parse(raw) : null;
} catch {
  storedUser = null;
}

// If user is stored in localStorage but token wasn't cached, generate session token
if (storedUser && !storedToken) {
  storedToken = `jwt_${safeBtoa(JSON.stringify({ ...storedUser, exp: Date.now() + 86400000 * 7 }))}`;
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, storedToken);
  } catch {}
}

export const loginUserThunk = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginApi(credentials);
      return response; // { success, token, user }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Login failed');
    }
  }
);

export const registerUserThunk = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await registerApi(userData);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Registration failed');
    }
  }
);

export const verifySessionThunk = createAsyncThunk(
  'auth/verifySession',
  async (_, { rejectWithValue }) => {
    try {
      const response = await verifyAuthTokenApi();
      return response.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Invalid session');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storedUser,
    token: storedToken,
    isAuthenticated: !!storedToken && !!storedUser,
    role: storedUser?.role || null,
    loading: false,
    error: null,
    sessionExpired: false
  },
  reducers: {
    logoutUser: (state) => {
      logoutApi();
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem('rajshree_hospital_auth');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.role = null;
      state.error = null;
      state.sessionExpired = false;
    },
    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(state.user));
        localStorage.setItem('rajshree_hospital_auth', JSON.stringify(state.user));
      }
    },
    setSessionExpired: (state, action) => {
      state.sessionExpired = true;
      state.error = action.payload || 'Session expired. Please log in again.';
      state.isAuthenticated = false;
      state.token = null;
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem('rajshree_hospital_auth');
    },
    clearAuthError: (state) => {
      state.error = null;
      state.sessionExpired = false;
    }
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.sessionExpired = false;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.role = action.payload.user?.role || 'patient';
        state.error = null;
        if (action.payload.token) {
          try {
            localStorage.setItem(AUTH_TOKEN_KEY, action.payload.token);
          } catch {}
        }
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(action.payload.user));
        localStorage.setItem('rajshree_hospital_auth', JSON.stringify(action.payload.user));
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      });

    // Register
    builder
      .addCase(registerUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.role = 'patient';
        state.error = null;
        if (action.payload.token) {
          try {
            localStorage.setItem(AUTH_TOKEN_KEY, action.payload.token);
          } catch {}
        }
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(action.payload.user));
        localStorage.setItem('rajshree_hospital_auth', JSON.stringify(action.payload.user));
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      });

    // Verify session
    builder
      .addCase(verifySessionThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.role = action.payload.role || 'patient';
      })
      .addCase(verifySessionThunk.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.role = null;
      });
  }
});

export const { logoutUser, updateUserProfile, setSessionExpired, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
