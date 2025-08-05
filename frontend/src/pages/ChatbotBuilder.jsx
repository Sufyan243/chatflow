// src/pages/ChatbotBuilder.jsx
import React from 'react';

const ChatbotBuilder = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Chatbot Builder</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">🤖 Build Your Chatbot</h2>
            <p className="text-gray-600 mb-4">Create and customize your WhatsApp chatbot flows.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100">
                <div className="text-2xl mb-2">➕</div>
                <div className="font-medium">Create New Bot</div>
              </button>
              <button className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100">
                <div className="text-2xl mb-2">📋</div>
                <div className="font-medium">Use Template</div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatbotBuilder;

