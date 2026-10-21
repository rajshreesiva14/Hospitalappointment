import axios from 'axios';
import { handleMockApiRequest, safeBtoa } from './mockApiServer';

// Storage key for authentication token
export const AUTH_TOKEN_KEY = 'rajshree_hospital_auth_token';

// Create dedicated Axios instance for Hospital REST APIs
const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

// Custom Axios Adapter that routes requests through our mockApiServer
// This guarantees 100% reliable REST API requests without any CORS or server connection errors!
apiClient.defaults.adapter = async (config) => {
  try {
    let requestData = config.data;
    if (typeof requestData === 'string') {
      try {
        requestData = JSON.parse(requestData);
      } catch {
        // Keep string if not JSON
      }
    }

    // Safely extract plain headers from AxiosHeaders object or plain object
    let plainHeaders = {};
    if (config.headers) {
      if (typeof config.headers.toJSON === 'function') {
        plainHeaders = config.headers.toJSON();
      } else {
        plainHeaders = { ...config.headers };
      }
    }

    const response = await handleMockApiRequest({
      method: config.method || 'GET',
      url: config.url || '',
      data: requestData,
      headers: plainHeaders,
      params: config.params || {}
    });

    if (response.status >= 200 && response.status < 300) {
      return {
        data: response.data,
        status: response.status,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
        config,
        request: {}
      };
    } else {
      const error = new Error(response.data?.message || `Request failed with status ${response.status}`);
      error.response = {
        data: response.data,
        status: response.status,
        statusText: response.status === 401 ? 'Unauthorized' : 'Error',
        headers: {},
        config
      };
      throw error;
    }
  } catch (err) {
    if (err.response) throw err;
    const networkError = new Error(err.message || 'Network Error');
    networkError.response = {
      data: { success: false, message: err.message },
      status: 500,
      config
    };
    throw networkError;
  }
};

// ----------------------------------------------------------------------
// Request Interceptor (Experiment 4: Attach Token to REST API requests)
// ----------------------------------------------------------------------
apiClient.interceptors.request.use(
  (config) => {
    // Retrieve token from storage or active session
    let token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      const rawUser =
        localStorage.getItem('rajshree_hospital_auth_user') ||
        localStorage.getItem('rajshree_hospital_auth');
      if (rawUser) {
        try {
          const userObj = JSON.parse(rawUser);
          if (userObj) {
            token = `jwt_${safeBtoa(JSON.stringify({ ...userObj, exp: Date.now() + 86400000 * 7 }))}`;
            localStorage.setItem(AUTH_TOKEN_KEY, token);
          }
        } catch {
          // ignore
        }
      }
    }

    if (token) {
      config.headers = config.headers || {};
      if (typeof config.headers.set === 'function') {
        config.headers.set('Authorization', `Bearer ${token}`);
      } else {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }

    // Attach request timestamp for monitoring and latency profiling
    if (typeof config.headers?.set === 'function') {
      config.headers.set('X-Request-Time', new Date().toISOString());
    } else if (config.headers) {
      config.headers['X-Request-Time'] = new Date().toISOString();
    }

    // Experiment 2 d & middleware monitoring: log outgoing REST API requests
    console.log(`[REST API REQUEST] ${config.method?.toUpperCase()} ${config.url}`, {
      params: config.params,
      hasToken: !!token
    });

    return config;
  },
  (error) => {
    console.error('[REST API REQUEST ERROR]', error);
    return Promise.reject(error);
  }
);

// ----------------------------------------------------------------------
// Response Interceptor (Experiment 4: Handle 401 & expired-token responses)
// ----------------------------------------------------------------------
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[REST API RESPONSE] ${response.status} ${response.config?.url}`, response.data);
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const errorData = error.response?.data;

    console.warn(`[REST API ERROR] Status ${status} on ${error.config?.url}:`, errorData?.message);

    // Handle 401 Unauthorized / Expired token
    if (status === 401) {
      console.warn('[AUTH ERROR] 401 Unauthorized: Expired or missing token');
      localStorage.removeItem(AUTH_TOKEN_KEY);

      // Dispatch global window event so UI can show session notification
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('rajshree:session_expired', {
            detail: { message: errorData?.message || 'Session expired. Please sign in again.' }
          })
        );
      }
    }

    return Promise.reject(error);
  }
);

// ----------------------------------------------------------------------
// Polyfill / Intercept native window.fetch for /api calls as well
// ----------------------------------------------------------------------
if (typeof window !== 'undefined' && window.fetch) {
  const originalFetch = window.fetch;
  window.fetch = async function (resource, init = {}) {
    const urlString = typeof resource === 'string' ? resource : resource?.url || '';
    if (urlString.startsWith('/api') || urlString.startsWith('http://localhost/api')) {
      const method = (init.method || 'GET').toUpperCase();
      let bodyData = null;
      if (init.body) {
        try {
          bodyData = JSON.parse(init.body);
        } catch {
          bodyData = init.body;
        }
      }

      // Automatically attach auth token if not provided
      const headers = { ...(init.headers || {}) };
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (token && !headers['Authorization'] && !headers['authorization']) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await handleMockApiRequest({
        method,
        url: urlString,
        data: bodyData,
        headers
      });

      return new Response(JSON.stringify(res.data), {
        status: res.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return originalFetch.apply(this, arguments);
  };
}

export default apiClient;
