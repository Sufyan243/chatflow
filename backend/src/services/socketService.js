
const Message = require('../models/message');
const Chat = require('../models/chat');
const User = require('../models/User');

class SocketService {
  initialize(io) {
    this.io = io;
    this.connectedUsers = new Map();

    io.on('connection', (socket) => {
      console.log(`User ${socket.userId} connected`);
      
      this.handleUserConnection(socket);
      this.handleChatEvents(socket);
      this.handleMessageEvents(socket);
      this.handleTypingEvents(socket);
      this.handleDisconnection(socket);
    });
  }

  async handleUserConnection(socket) {
    // Update user online status
    await User.findByIdAndUpdate(socket.userId, {
      isOnline: true,
      socketId: socket.id
    });

    // Store connected user
    this.connectedUsers.set(socket.userId, socket.id);

    // Notify other users about online status
    socket.broadcast.emit('user_online', {
      userId: socket.userId,
      isOnline: true
    });
  }

  handleChatEvents(socket) {
    socket.on('join_chat', async (chatId) => {
      try {
        // Verify user is participant in chat
        const chat = await Chat.findOne({
          _id: chatId,
          'participants.user': socket.userId
        });

        if (chat) {
          socket.join(chatId);
          console.log(`User ${socket.userId} joined chat ${chatId}`);
          
          // Mark messages as delivered
          await this.markMessagesAsDelivered(chatId, socket.userId);
        }
      } catch (error) {
        console.error('Error joining chat:', error);
      }
    });

    socket.on('leave_chat', (chatId) => {
      socket.leave(chatId);
      console.log(`User ${socket.userId} left chat ${chatId}`);
    });
  }

  handleMessageEvents(socket) {
    socket.on('send_message', async (messageData) => {
      try {
        // Create new message
        const message = new Message({
          chat: messageData.chatId,
          sender: socket.userId,
          content: messageData.content,
          type: messageData.type || 'text',
          filename: messageData.filename,
          status: 'sent'
        });

        await message.save();
        await message.populate('sender', 'username avatar');

        // Update chat's last message
        await Chat.findByIdAndUpdate(messageData.chatId, {
          lastMessage: message._id,
          updatedAt: new Date()
        });

        // Emit to all users in the chat
        this.io.to(messageData.chatId).emit('new_message', {
          id: message._id,
          chatId: message.chat,
          senderId: message.sender._id,
          senderName: message.sender.username,
          content: message.content,
          type: message.type,
          filename: message.filename,
          status: message.status,
          timestamp: message.createdAt
        });

        // Handle delivery status
        setTimeout(() => {
          this.updateMessageStatus(message._id, 'delivered');
        }, 1000);

      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('message_error', { error: 'Failed to send message' });
      }
    });

    socket.on('mark_as_read', async ({ messageId, chatId }) => {
      try {
        await this.markMessageAsRead(messageId, socket.userId);
        
        socket.to(chatId).emit('message_status_update', {
          messageId,
          status: 'read',
          userId: socket.userId
        });
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    });
  }

  handleTypingEvents(socket) {
    socket.on('typing_start', ({ chatId }) => {
      socket.to(chatId).emit('user_typing', {
        userId: socket.userId,
        isTyping: true
      });
    });

    socket.on('typing_stop', ({ chatId }) => {
      socket.to(chatId).emit('user_typing', {
        userId: socket.userId,
        isTyping: false
      });
    });
  }

  handleDisconnection(socket) {
    socket.on('disconnect', async () => {
      console.log(`User ${socket.userId} disconnected`);
      
      try {
        // Update user offline status
        await User.findByIdAndUpdate(socket.userId, {
          isOnline: false,
          lastSeen: new Date(),
          socketId: null
        });

        // Remove from connected users
        this.connectedUsers.delete(socket.userId);

        // Notify other users about offline status
        socket.broadcast.emit('user_online', {
          userId: socket.userId,
          isOnline: false,
          lastSeen: new Date()
        });
      } catch (error) {
        console.error('Error handling disconnection:', error);
      }
    });
  }

  async markMessagesAsDelivered(chatId, userId) {
    try {
      const messages = await Message.find({
        chat: chatId,
        sender: { $ne: userId },
        status: 'sent'
      });

      for (const message of messages) {
        if (!message.deliveredTo.some(d => d.user.toString() === userId)) {
          message.deliveredTo.push({ user: userId });
          message.status = 'delivered';
          await message.save();

          this.io.to(chatId).emit('message_status_update', {
            messageId: message._id,
            status: 'delivered'
          });
        }
      }
    } catch (error) {
      console.error('Error marking messages as delivered:', error);
    }
  }

  async markMessageAsRead(messageId, userId) {
    try {
      const message = await Message.findById(messageId);
      if (!message) return;

      if (!message.readBy.some(r => r.user.toString() === userId)) {
        message.readBy.push({ user: userId });
        message.status = 'read';
        await message.save();
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  }

  async updateMessageStatus(messageId, status) {
    try {
      const message = await Message.findByIdAndUpdate(
        messageId,
        { status },
        { new: true }
      );

      if (message) {
        this.io.to(message.chat.toString()).emit('message_status_update', {
          messageId: message._id,
          status: message.status
        });
      }
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  }
}


