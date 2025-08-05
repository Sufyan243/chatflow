// frontend/src/components/Chat/TypingIndicator.jsx
import React from 'react';

const TypingIndicator = ({ users }) => {
  return (
    <div className="flex justify-start">
      <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 max-w-xs">
        <div className="flex items-center space-x-1">
          <span className="text-sm text-gray-600">
            {users.length === 1 ? 'Someone is' : `${users.length} people are`} typing
          </span>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;