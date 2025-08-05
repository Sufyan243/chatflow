import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🚧 Development mode flag - set to false for production
  const isDevelopment = process.env.NODE_ENV === 'development';
  const DEV_BYPASS = isDevelopment && process.env.REACT_APP_DEV_BYPASS === 'true';

  useEffect(() => {
    // 🚧 Development bypass - automatically set guest user
    if (DEV_BYPASS) {
      console.log('🔧 Development mode: Bypassing authentication');
      const guestUser = {
        id: 'dev-guest-' + Date.now(),
        username: 'Dev User',
        email: 'dev@chatflow.local',
        avatar: null,
        role: 'developer',
        isOnline: true,
        isDevelopmentUser: true
      };
      setUser(guestUser);
      setLoading(false);
      return;
    }

    // Normal authentication flow
    const token = localStorage.getItem('token');
    if (token) {
      authService.getCurrentUser()
        .then(userData => {
          setUser(userData);
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [DEV_BYPASS]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const { user: userData, token } = await authService.login(email, password);
      localStorage.setItem('token', token);
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const { user: newUser, token } = await authService.register(userData);
      localStorage.setItem('token', token);
      setUser(newUser);
      return newUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // 🚧 In dev mode, just reset to guest user instead of full logout
    if (DEV_BYPASS) {
      console.log('🔧 Development mode: Resetting to guest user');
      const guestUser = {
        id: 'dev-guest-' + Date.now(),
        username: 'Dev User',
        email: 'dev@chatflow.local',
        avatar: null,
        role: 'developer',
        isOnline: true,
        isDevelopmentUser: true
      };
      setUser(guestUser);
      setError(null);
      return;
    }

    localStorage.removeItem('token');
    setUser(null);
    setError(null);
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      
      // 🚧 Development bypass for profile updates
      if (DEV_BYPASS) {
        console.log('🔧 Development mode: Mocking profile update');
        const updatedUser = { ...user, ...profileData };
        setUser(updatedUser);
        return updatedUser;
      }

      const updatedUser = await authService.updateProfile(profileData);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      setError(null);
      
      // 🚧 Development bypass for password changes
      if (DEV_BYPASS) {
        console.log('🔧 Development mode: Mocking password change');
        return;
      }

      await authService.changePassword(currentPassword, newPassword);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      setError(null);
      
      // 🚧 Development bypass for forgot password
      if (DEV_BYPASS) {
        console.log('🔧 Development mode: Mocking forgot password');
        return;
      }

      await authService.forgotPassword(email);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      setLoading(true);
      setError(null);
      
      // 🚧 Development bypass for password reset
      if (DEV_BYPASS) {
        console.log('🔧 Development mode: Mocking password reset');
        return;
      }

      await authService.resetPassword(token, newPassword);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🆕 Manual skip login for development (can be called from UI)
  const skipLogin = () => {
    const guestUser = {
      id: 'manual-guest-' + Date.now(),
      username: 'Guest User',
      email: 'guest@chatflow.local',
      avatar: null,
      role: 'guest',
      isOnline: true,
      isDevelopmentUser: true
    };
    setUser(guestUser);
    setLoading(false);
    console.log('⏭️ Manually skipped login, guest user set:', guestUser);
  };

  // 🚧 Development helper to switch between different test users
  const switchDevUser = (userType = 'default') => {
    if (!isDevelopment) return;

    const devUsers = {
      default: {
        id: 'dev-user-1',
        username: 'Dev User',
        email: 'dev@chatflow.local',
        avatar: null,
        role: 'developer'
      },
      admin: {
        id: 'dev-admin-1',
        username: 'Dev Admin',
        email: 'admin@chatflow.local',
        avatar: null,
        role: 'admin'
      },
      user2: {
        id: 'dev-user-2',
        username: 'Test User 2',
        email: 'user2@chatflow.local',
        avatar: null,
        role: 'user'
      },
      user3: {
        id: 'dev-user-3',
        username: 'Test User 3',
        email: 'user3@chatflow.local',
        avatar: null,
        role: 'user'
      }
    };

    const selectedUser = {
      ...devUsers[userType],
      isOnline: true,
      isDevelopmentUser: true
    };

    setUser(selectedUser);
    console.log(`🔧 Switched to dev user: ${userType}`, selectedUser);
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    clearError,
    skipLogin,
    switchDevUser, // 🚧 Development helper
    isAuthenticated: !!user,
    isDevelopment,
    DEV_BYPASS, // 🚧 Expose dev bypass flag
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};