// frontend/src/components/Chat/ChatUI.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../hooks/useSocket';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import StatusIndicators from './StatusIndicators';

const ChatUI = ({ chatId, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const socket = useSocket();

  useEffect(() => {
    if (socket && chatId) {
      // Join chat room
      socket.emit('join_chat', chatId);
      
      // Listen for new messages
      socket.on('new_message', (message) => {
        setMessages(prev => [...prev, message]);
      });

      // Listen for typing indicators
      socket.on('user_typing', ({ userId, isTyping }) => {
        setTypingUsers(prev => 
          isTyping 
            ? [...prev.filter(id => id !== userId), userId]
            : prev.filter(id => id !== userId)
        );
      });

      // Listen for message status updates
      socket.on('message_status_update', ({ messageId, status }) => {
        setMessages(prev => prev.map(msg => 
          msg.id === messageId ? { ...msg, status } : msg
        ));
      });

      return () => {
        socket.off('new_message');
        socket.off('user_typing');
        socket.off('message_status_update');
      };
    }
  }, [socket, chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      chatId,
      content: newMessage,
      type: 'text',
      timestamp: new Date().toISOString()
    };

    // Emit message via socket
    socket.emit('send_message', messageData);
    setNewMessage('');
    setIsTyping(false);
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing_start', { chatId, userId: currentUser.id });
    }

    // Stop typing after 1 second of inactivity
    clearTimeout(window.typingTimer);
    window.typingTimer = setTimeout(() => {
      setIsTyping(false);
      socket.emit('typing_stop', { chatId, userId: currentUser.id });
    }, 1000);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('chatId', chatId);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const result = await response.json();
      
      const messageData = {
        chatId,
        content: result.fileUrl,
        type: file.type.startsWith('image/') ? 'image' : 
              file.type.startsWith('video/') ? 'video' : 
              file.type.startsWith('audio/') ? 'audio' : 'file',
        filename: file.name,
        timestamp: new Date().toISOString()
      };

      socket.emit('send_message', messageData);
    } catch (error) {
      console.error('File upload failed:', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">U</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Chat Name</h3>
            <StatusIndicators isOnline={true} lastSeen="2 min ago" />
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.senderId === currentUser.id}
          />
        ))}
        
        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <TypingIndicator users={typingUsers} />
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t p-4">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
          >
            📎
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
          />
          
          <input
            type="text"
            value={newMessage}
            onChange={handleTyping}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ➤
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatUI;