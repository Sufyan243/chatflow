// src/pages/Analytics.jsx
import React from 'react';

const Analytics = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">📊 Message Volume</h3>
              <div className="text-3xl font-bold text-blue-600">12,345</div>
              <p className="text-sm text-gray-500">Messages this month</p>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">👥 Active Users</h3>
              <div className="text-3xl font-bold text-green-600">1,234</div>
              <p className="text-sm text-gray-500">Unique users</p>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">⚡ Response Rate</h3>
              <div className="text-3xl font-bold text-purple-600">98.5%</div>
              <p className="text-sm text-gray-500">Average response rate</p>
            </div>
          </div>
          
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">📈 Performance Metrics</h2>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Chart visualization would go here</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;

