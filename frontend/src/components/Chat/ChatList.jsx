// frontend/src/components/Chat/ChatList.jsx
import React, { useState, useEffect } from 'react';
import { useSocket } from '../../hooks/useSocket';
import StatusIndicators from './StatusIndicators';

const ChatList = ({ onSelectChat, selectedChatId }) => {
  const [chats, setChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const socket = useSocket();

  useEffect(() => {
    fetchChats();
    
    if (socket) {
      socket.on('chat_updated', (updatedChat) => {
        setChats(prev => prev.map(chat => 
          chat.id === updatedChat.id ? updatedChat : chat
        ));
      });

      socket.on('new_chat', (newChat) => {
        setChats(prev => [newChat, ...prev]);
      });
    }

    return () => {
      if (socket) {
        socket.off('chat_updated');
        socket.off('new_chat');
      }
    };
  }, [socket]);

  const fetchChats = async () => {
    try {
      const response = await fetch('/api/chats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setChats(data);
    } catch (error) {
      console.error('Failed to fetch chats:', error);
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.lastMessage?.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  const getMessagePreview = (message) => {
    if (!message) return 'No messages yet';
    
    switch (message.type) {
      case 'image': return '📷 Image';
      case 'video': return '🎥 Video';
      case 'audio': return '🎵 Audio';
      case 'file': return '📄 File';
      default: return message.content;
    }
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Search Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            🔍
          </div>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedChatId === chat.id ? 'bg-green-50 border-r-2 border-green-500' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              {/* Avatar */}
              <div className="relative">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {chat.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                {chat.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                )}
              </div>

              {/* Chat Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {chat.name}
                  </h3>
                  <span className="text-xs text-gray-500 ml-2">
                    {chat.lastMessage && formatTime(chat.lastMessage.timestamp)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-gray-600 truncate">
                    {getMessagePreview(chat.lastMessage)}
                  </p>
                  
                  {/* Unread Badge */}
                  {chat.unreadCount > 0 && (
                    <span className="bg-green-500 text-white text-xs rounded-full px-2 py-1 ml-2">
                      {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                    </span>
                  )}
                </div>

                {/* Status Indicators */}
                <StatusIndicators 
                  isOnline={chat.isOnline} 
                  lastSeen={chat.lastSeen}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;