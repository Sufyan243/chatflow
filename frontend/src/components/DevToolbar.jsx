// frontend/src/components/DevToolbar.jsx
import React from 'react';
import { useAuth } from '../hooks/useAuth';

const DevToolbar = () => {
  const { isDevelopment, DEV_BYPASS, user, switchDevUser, logout } = useAuth();

  // Only show in development mode
  if (!isDevelopment || !DEV_BYPASS) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-yellow-400 text-black p-2 z-50 border-t-2 border-yellow-600">
      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        <div className="flex items-center space-x-2">
          <span className="font-bold">🚧 DEV MODE</span>
          <span className="text-sm">
            Current User: {user?.username} ({user?.role})
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => switchDevUser('default')}
            className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
          >
            Dev User
          </button>
          <button
            onClick={() => switchDevUser('admin')}
            className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
          >
            Admin
          </button>
          <button
            onClick={() => switchDevUser('user2')}
            className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
          >
            User 2
          </button>
          <button
            onClick={() => switchDevUser('user3')}
            className="px-2 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600"
          >
            User 3
          </button>
          <button
            onClick={logout}
            className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default DevToolbar;