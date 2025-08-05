import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Debug logging
console.log('🔍 API Configuration:', {
  baseURL: API_BASE_URL,
  environment: process.env.NODE_ENV,
  reactAppApiUrl: process.env.REACT_APP_API_URL
});

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased timeout to 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
  // Add these for better CORS handling
  withCredentials: false, // Set to true if you need cookies
});

// Request interceptor to add auth token and debug logging
api.interceptors.request.use(
  (config) => {
    // Debug logging
    console.log(`🚀 ${config.method?.toUpperCase()} Request:`, {
      url: config.baseURL + config.url,
      data: config.data,
      headers: config.headers
    });

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Enhanced response interceptor with better error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.method?.toUpperCase()} Success:`, {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    // Enhanced error logging
    console.error('💥 API Error Details:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
      baseURL: error.config?.baseURL,
      data: error.response?.data
    });

    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          console.warn('🔐 Unauthorized access - clearing token');
          localStorage.removeItem('token');
          // Only redirect if not already on login page
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
          break;
        case 403:
          // Forbidden
          console.error('🚫 Access forbidden:', data.message);
          break;
        case 404:
          // Not found
          console.error('🔍 Resource not found:', data.message);
          break;
        case 422:
          // Validation error
          console.error('📝 Validation error:', data.errors || data.message);
          break;
        case 500:
          // Server error
          console.error('🔥 Server error:', data.message);
          break;
        default:
          console.error('⚠️ API error:', data.message || `HTTP ${status}`);
      }
    } else if (error.request) {
      // Network error - no response received
      console.error('🌐 Network Error Details:', {
        message: error.message,
        code: error.code,
        readyState: error.request.readyState,
        status: error.request.status,
        timeout: error.code === 'ECONNABORTED'
      });

      // Handle specific network error types
      if (error.code === 'ERR_NETWORK') {
        console.error('🔌 Cannot connect to server. Check if backend is running on:', API_BASE_URL.replace('/api', ''));
        error.message = `Cannot connect to server. Please check if your backend server is running on ${API_BASE_URL.replace('/api', '')}.`;
      } else if (error.code === 'ECONNABORTED') {
        console.error('⏰ Request timeout');
        error.message = 'Request timeout. The server is taking too long to respond.';
      } else if (error.message.includes('Network Error')) {
        error.message = 'Network connection failed. Please check your internet connection and try again.';
      }
    } else {
      // Request setup error
      console.error('⚙️ Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Test connection function
const testConnection = async () => {
  try {
    console.log('🧪 Testing API connection...');
    const healthUrl = API_BASE_URL.replace('/api', '/health');
    const response = await axios.get(healthUrl, { timeout: 5000 });
    console.log('✅ Backend health check passed:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Backend health check failed:', error.message);
    
    // Try API health endpoint
    try {
      const response = await api.get('/health');
      console.log('✅ API health check passed:', response.data);
      return true;
    } catch (apiError) {
      console.error('❌ API health check also failed:', apiError.message);
      return false;
    }
  }
};

// Enhanced API helper functions
export const apiService = {
  // Test connection
  testConnection,

  // GET request with error handling
  get: async (url, config = {}) => {
    try {
      return await api.get(url, config);
    } catch (error) {
      console.error(`GET ${url} failed:`, error.message);
      throw error;
    }
  },
  
  // POST request with error handling
  post: async (url, data = {}, config = {}) => {
    try {
      return await api.post(url, data, config);
    } catch (error) {
      console.error(`POST ${url} failed:`, error.message);
      throw error;
    }
  },
  
  // PUT request
  put: (url, data = {}, config = {}) => api.put(url, data, config),
  
  // PATCH request
  patch: (url, data = {}, config = {}) => api.patch(url, data, config),
  
  // DELETE request
  delete: (url, config = {}) => api.delete(url, config),
  
  // Upload file
  upload: (url, file, onProgress = null) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: onProgress,
    });
  },
  
  // Download file
  download: (url, filename = 'download') => {
    return api.get(url, {
      responseType: 'blob',
    }).then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    });
  },
  
  // Set auth token
  setAuthToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('🔑 Auth token set');
    } else {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      console.log('🔓 Auth token cleared');
    }
  },
  
  // Clear auth token
  clearAuthToken: () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    console.log('🧹 Auth token cleared');
  },
  
  // Get auth token
  getAuthToken: () => {
    return localStorage.getItem('token');
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get API base URL for debugging
  getBaseURL: () => API_BASE_URL,
};

// Run connection test on load (only in development)
if (process.env.NODE_ENV === 'development') {
  // Delay the test to avoid running during initial app load
  setTimeout(() => {
    testConnection();
  }, 1000);
}

export default api;