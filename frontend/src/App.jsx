import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { AuthProvider } from './hooks/useAuth';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ChatbotBuilder from './pages/ChatbotBuilder';
import Contacts from './pages/Contacts';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Automation from './pages/Automation';

// Components
import Loading from './components/common/Loading';
import DevToolbar from './components/DevToolbar'; // Add this if you want the dev toolbar

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading, DEV_BYPASS } = useAuth();

  console.log('🔒 ProtectedRoute check → user:', user, 'loading:', loading, 'dev bypass:', DEV_BYPASS);

  if (loading) {
    return <Loading />;
  }

  // In development with bypass, allow access even without "real" authentication
  if (DEV_BYPASS && user?.isDevelopmentUser) {
    return children;
  }

  return user ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirect if already authenticated)
const PublicRoute = ({ children }) => {
  const { user, loading, DEV_BYPASS } = useAuth();

  console.log('🌐 PublicRoute check → user:', user, 'loading:', loading, 'dev bypass:', DEV_BYPASS);

  if (loading) {
    return <Loading />;
  }

  // In development mode, still allow access to login/register for testing
  if (DEV_BYPASS) {
    return children;
  }

  return user ? <Navigate to="/dashboard" replace /> : children;
};

// Development Route Access Component
const DevRoute = ({ children }) => {
  const { isDevelopment } = useAuth();
  
  if (!isDevelopment) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function AppRoutes() {
  const { DEV_BYPASS } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/chatbot-builder" 
            element={
              <ProtectedRoute>
                <ChatbotBuilder />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/contacts" 
            element={
              <ProtectedRoute>
                <Contacts />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/analytics" 
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/automation" 
            element={
              <ProtectedRoute>
                <Automation />
              </ProtectedRoute>
            } 
          />

          {/* Development-only routes (optional) */}
          {DEV_BYPASS && (
            <>
              <Route 
                path="/dev" 
                element={
                  <DevRoute>
                    <div className="p-8">
                      <h1 className="text-2xl font-bold mb-4">🚧 Development Tools</h1>
                      <div className="bg-white p-6 rounded-lg shadow">
                        <p>Development utilities and testing tools go here.</p>
                        <div className="mt-4 space-x-2">
                          <a href="/dashboard" className="text-blue-500 hover:underline">Dashboard</a>
                          <a href="/chatbot-builder" className="text-blue-500 hover:underline">Chatbot Builder</a>
                          <a href="/contacts" className="text-blue-500 hover:underline">Contacts</a>
                          <a href="/analytics" className="text-blue-500 hover:underline">Analytics</a>
                        </div>
                      </div>
                    </div>
                  </DevRoute>
                } 
              />
            </>
          )}

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>

        {/* Development Toolbar - shows at bottom in dev mode */}
        <DevToolbar />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;