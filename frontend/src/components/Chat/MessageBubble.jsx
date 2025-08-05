// frontend/src/components/Chat/MessageBubble.jsx
import React from 'react';

const MessageBubble = ({ message, isOwn }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent': return '✓';
      case 'delivered': return '✓✓';
      case 'read': return '✓✓';
      default: return '⏱';
    }
  };

  const renderMessageContent = () => {
    switch (message.type) {
      case 'image':
        return (
          <img 
            src={message.content} 
            alt="Shared image"
            className="max-w-xs rounded-lg"
          />
        );
      case 'video':
        return (
          <video 
            src={message.content} 
            controls
            className="max-w-xs rounded-lg"
          />
        );
      case 'audio':
        return (
          <audio 
            src={message.content} 
            controls
            className="max-w-xs"
          />
        );
      case 'file':
        return (
          <div className="flex items-center space-x-2 p-3 bg-gray-100 rounded-lg">
            <span>📄</span>
            <span className="text-sm">{message.filename}</span>
          </div>
        );
      default:
        return <p className="text-sm">{message.content}</p>;
    }
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        isOwn 
          ? 'bg-green-500 text-white' 
          : 'bg-white border border-gray-200'
      }`}>
        {renderMessageContent()}
        
        <div className={`flex items-center justify-between mt-1 space-x-2 text-xs ${
          isOwn ? 'text-green-100' : 'text-gray-500'
        }`}>
          <span>{formatTime(message.timestamp)}</span>
          {isOwn && (
            <span className={message.status === 'read' ? 'text-blue-200' : ''}>
              {getStatusIcon(message.status)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;