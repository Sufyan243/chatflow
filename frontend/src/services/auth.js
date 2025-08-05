import { apiService } from './api';

export const authService = {
  // Login user
  login: async (email, password) => {
    const response = await apiService.post('/auth/login', { email, password });
    return response.data;
  },

  // Register user
  register: async (userData) => {
    const response = await apiService.post('/auth/register', userData);
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await apiService.get('/auth/me');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await apiService.put('/auth/profile', profileData);
    return response.data;
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    const response = await apiService.put('/auth/password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await apiService.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    const response = await apiService.post('/auth/reset-password', {
      token,
      newPassword,
    });
    return response.data;
  },

  // Verify email
  verifyEmail: async (token) => {
    const response = await apiService.post('/auth/verify-email', { token });
    return response.data;
  },

  // Resend verification email
  resendVerification: async (email) => {
    const response = await apiService.post('/auth/resend-verification', { email });
    return response.data;
  },

  // Logout
  logout: async () => {
    try {
      await apiService.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      apiService.clearAuthToken();
    }
  },

  // Refresh token
  refreshToken: async () => {
    const response = await apiService.post('/auth/refresh');
    return response.data;
  },

  // Check if token is valid
  validateToken: async () => {
    try {
      const response = await apiService.get('/auth/validate');
      return response.data.valid;
    } catch (error) {
      return false;
    }
  },

  // Get user permissions
  getPermissions: async () => {
    const response = await apiService.get('/auth/permissions');
    return response.data;
  },

  // Update user preferences
  updatePreferences: async (preferences) => {
    const response = await apiService.put('/auth/preferences', preferences);
    return response.data;
  },

  // Get user preferences
  getPreferences: async () => {
    const response = await apiService.get('/auth/preferences');
    return response.data;
  },

  // Delete account
  deleteAccount: async (password) => {
    const response = await apiService.delete('/auth/account', {
      data: { password },
    });
    return response.data;
  },

  // Export user data
  exportData: async () => {
    const response = await apiService.get('/auth/export-data', {
      responseType: 'blob',
    });
    return response.data;
  },

  // Import user data
  importData: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiService.post('/auth/import-data', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
}; 