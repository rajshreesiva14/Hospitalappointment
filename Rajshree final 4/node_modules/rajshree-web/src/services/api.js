import apiClient, { AUTH_TOKEN_KEY } from './apiClient';

/**
 * Hospital REST API Service layer using Axios
 * Fulfills Experiment 1, Experiment 3, and Experiment 4
 */

// -------------------------------------------------------------
// Experiment 1 & 3: Doctor Information & Availability REST APIs
// -------------------------------------------------------------

/**
 * a) Fetch doctor information using REST APIs
 * b) Implement doctor search and specialty filtering via query params
 */
export const fetchDoctorsApi = async (params = {}) => {
  const response = await apiClient.get('/doctors', { params });
  return response.data; // { success: true, data: [...], total: N }
};

/**
 * d) Fetch individual doctor details dynamically
 */
export const fetchDoctorByIdApi = async (id) => {
  const response = await apiClient.get(`/doctors/${id}`);
  return response.data; // { success: true, data: doctor }
};

/**
 * c) Retrieve available dates and time slots using API requests
 */
export const fetchDoctorAvailabilityApi = async (doctorId, date) => {
  const response = await apiClient.get(`/doctors/${doctorId}/availability`, {
    params: { date }
  });
  return response.data; // { success: true, availableSlots: [...] }
};

// -------------------------------------------------------------
// Experiment 3: Appointment CRUD Operations using REST APIs
// -------------------------------------------------------------

/**
 * a) Retrieve appointments using GET (Protected)
 */
export const fetchAppointmentsApi = async () => {
  const response = await apiClient.get('/appointments');
  return response.data; // { success: true, data: [...] }
};

/**
 * e) Retrieve appointment history using GET (Protected)
 */
export const fetchAppointmentHistoryApi = async () => {
  const response = await apiClient.get('/appointments/history');
  return response.data; // { success: true, data: [...] }
};

/**
 * Retrieve single appointment by ID using GET (Protected)
 */
export const fetchAppointmentByIdApi = async (appointmentId) => {
  const response = await apiClient.get(`/appointments/${appointmentId}`);
  return response.data; // { success: true, data: appointment }
};

/**
 * b) Create an appointment using POST (Protected)
 */
export const createAppointmentApi = async (appointmentData) => {
  const response = await apiClient.post('/appointments', appointmentData);
  return response.data; // { success: true, message: '...', data: newAppointment }
};

/**
 * c) Reschedule an appointment using PUT / PATCH (Protected)
 */
export const rescheduleAppointmentApi = async (appointmentId, { date, timeSlot }) => {
  const response = await apiClient.put(`/appointments/${appointmentId}`, {
    date,
    timeSlot
  });
  return response.data; // { success: true, message: '...', data: updatedAppointment }
};

/**
 * d) Cancel an appointment using DELETE (Protected)
 */
export const cancelAppointmentApi = async (appointmentId, reason = 'Cancelled by user') => {
  const response = await apiClient.delete(`/appointments/${appointmentId}`, {
    data: { reason }
  });
  return response.data; // { success: true, message: '...', data: cancelledAppointment }
};

// -------------------------------------------------------------
// Experiment 4: Hospital Authentication and Token Management
// -------------------------------------------------------------

/**
 * a) Implement patient authentication using a login API
 */
export const loginApi = async (credentials) => {
  const response = await apiClient.post('/auth/login', credentials);
  const { token, user } = response.data;
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
  return response.data; // { success: true, token, user }
};

/**
 * Patient registration API
 */
export const registerApi = async (userData) => {
  const response = await apiClient.post('/auth/register', userData);
  const { token, user } = response.data;
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
  return response.data;
};

/**
 * Verify currently stored token with backend
 */
export const verifyAuthTokenApi = async () => {
  const response = await apiClient.get('/auth/verify');
  return response.data;
};

/**
 * e) Implement logout functionality: clears stored token
 */
export const logoutApi = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

/**
 * Get currently stored token
 */
export const getStoredAuthToken = () => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};
