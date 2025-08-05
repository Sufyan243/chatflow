// src/pages/Settings.jsx
import React from 'react';

const Settings = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Settings Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Settings</h3>
                  <nav className="space-y-2">
                    <a href="#" className="block px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md">Profile</a>
                    <a href="#" className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">WhatsApp Integration</a>
                    <a href="#" className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">Notifications</a>
                    <a href="#" className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">Security</a>
                    <a href="#" className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">Billing</a>
                  </nav>
                </div>
              </div>
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">⚙️ Profile Settings</h3>
                  
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input type="text" defaultValue="John Doe" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input type="email" defaultValue="john@example.com" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Company</label>
                      <input type="text" defaultValue="ChatFlow Inc." className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <input type="tel" defaultValue="+1234567890" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    
                    <div className="pt-4">
                      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
