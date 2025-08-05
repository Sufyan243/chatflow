// backend/src/controllers/chatController.js
const Chat = require('../models/chat');
const Message = require('../models/message');
const User = require('../models/User');

const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      'participants.user': req.userId,
      isActive: true
    })
    .populate('participants.user', 'username avatar isOnline lastSeen')
    .populate('lastMessage')
    .sort({ updatedAt: -1 });

    // Format chats with unread count and participant info
    const formattedChats = await Promise.all(
      chats.map(async (chat) => {
        const unreadCount = await Message.countDocuments({
          chat: chat._id,
          sender: { $ne: req.userId },
          readBy: { $not: { $elemMatch: { user: req.userId } } }
        });

        // For direct chats, get the other participant
        const otherParticipant = chat.participants.find(
          p => p.user._id.toString() !== req.userId
        );

        return {
          id: chat._id,
          name: chat.type === 'direct' ? 
            otherParticipant?.user.username : chat.name,
          type: chat.type,
          participants: chat.participants,
          lastMessage: chat.lastMessage ? {
            id: chat.lastMessage._id,
            content: chat.lastMessage.content,
            type: chat.lastMessage.type,
            timestamp: chat.lastMessage.createdAt,
            senderId: chat.lastMessage.sender
          } : null,
          unreadCount,
          isOnline: chat.type === 'direct' ? 
            otherParticipant?.user.isOnline : false,
          lastSeen: chat.type === 'direct' ? 
            otherParticipant?.user.lastSeen : null,
          updatedAt: chat.updatedAt
        };
      })
    );

    res.json(formattedChats);
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createChat = async (req, res) => {
  try {
    const { participantIds, name, type = 'direct' } = req.body;

    // For direct chats, check if chat already exists
    if (type === 'direct' && participantIds.length === 1) {
      const existingChat = await Chat.findOne({
        type: 'direct',
        'participants.user': { $all: [req.userId, participantIds[0]] }
      });

      if (existingChat) {
        return res.json({ chat: existingChat });
      }
    }

    // Create participants array
    const participants = [
      { user: req.userId, role: 'admin' },
      ...participantIds.map(id => ({ user: id, role: 'member' }))
    ];

    const chat = new Chat({
      name: name || 'New Chat',
      type,
      participants
    });

    await chat.save();
    await chat.populate('participants.user', 'username avatar isOnline lastSeen');

    res.status(201).json({ chat });
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Verify user is participant
    const chat = await Chat.findOne({
      _id: chatId,
      'participants.user': req.userId
    });

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({ messages: messages.reverse() });
  } catch (error) {
    console.error('Get chat messages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getChats, createChat, getChatMessages };