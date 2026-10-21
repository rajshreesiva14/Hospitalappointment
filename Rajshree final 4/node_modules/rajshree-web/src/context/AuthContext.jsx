import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginUserThunk,
  registerUserThunk,
  logoutUser,
  updateUserProfile,
  setSessionExpired,
  clearAuthError
} from '../store/slices/authSlice';
import { getStoredAuthToken } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, role, loading, error, sessionExpired } = useSelector(
    (state) => state.auth
  );

  // Listen for unauthorized 401 response events from Axios interceptor
  useEffect(() => {
    const handleExpired = (event) => {
      dispatch(setSessionExpired(event.detail?.message));
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('rajshree:session_expired', handleExpired);
      return () => {
        window.removeEventListener('rajshree:session_expired', handleExpired);
      };
    }
  }, [dispatch]);

  // Login handler using REST API and token management
  const login = async (userData, roleParam = 'patient') => {
    const credentials = {
      ...userData,
      role: roleParam || userData.role || 'patient'
    };

    const resultAction = await dispatch(loginUserThunk(credentials));
    if (loginUserThunk.fulfilled.match(resultAction)) {
      return resultAction.payload.user;
    } else {
      throw new Error(resultAction.payload || 'Authentication failed');
    }
  };

  // Register handler using REST API
  const register = async (userData) => {
    const resultAction = await dispatch(registerUserThunk(userData));
    if (registerUserThunk.fulfilled.match(resultAction)) {
      return resultAction.payload.user;
    } else {
      throw new Error(resultAction.payload || 'Registration failed');
    }
  };

  // Logout handler
  const logout = () => {
    dispatch(logoutUser());
  };

  // Profile update
  const updateProfile = (updatedFields) => {
    dispatch(updateUserProfile(updatedFields));
  };

  const clearError = () => {
    dispatch(clearAuthError());
  };

  const value = {
    user,
    token: token || getStoredAuthToken(),
    isAuthenticated,
    role,
    isAdmin: role === 'admin',
    isPatient: role === 'patient',
    loading,
    error,
    sessionExpired,
    login,
    register,
    logout,
    updateProfile,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
