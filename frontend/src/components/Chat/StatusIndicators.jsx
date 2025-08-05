// frontend/src/components/Chat/StatusIndicators.jsx
import React from 'react';

const StatusIndicators = ({ isOnline, lastSeen, className = '' }) => {
  const formatLastSeen = (lastSeen) => {
    if (!lastSeen) return '';
    
    const date = new Date(lastSeen);
    const now = new Date();
    const diffMs = now - date;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`flex items-center space-x-1 text-xs ${className}`}>
      <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-gray-400'}`}></div>
      <span className="text-gray-500">
        {isOnline ? 'Online' : `Last seen ${formatLastSeen(lastSeen)}`}
      </span>
    </div>
  );
};

export default StatusIndicators;