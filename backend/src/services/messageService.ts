import { Types } from 'mongoose';
import { Message } from '../models/Message';
import { User } from '../models/User';
import { AppError } from '../middleware/errorHandler';

interface MessageCreateParams {
  content: string;
  senderId: string;
  receiverId: string;
  jobId?: string;
}

export const messageService = {
  async sendMessage({ content, senderId, receiverId, jobId }: MessageCreateParams) {
    const [sender, receiver] = await Promise.all([
      User.findById(senderId),
      User.findById(receiverId),
    ]);

    if (!sender || !receiver) {
      throw new AppError(404, 'User not found');
    }

    const message = new Message({
      content,
      sender: senderId,
      receiver: receiverId,
      job: jobId,
      read: false,
    });

    await message.save();
    return message.populate(['sender', 'receiver', 'job']);
  },

  async getConversation(userId: string, otherUserId: string) {
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId },
      ],
    })
      .populate('sender', 'fullName')
      .populate('receiver', 'fullName')
      .populate('job', 'title')
      .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      {
        sender: otherUserId,
        receiver: userId,
        read: false,
      },
      { read: true }
    );

    return messages;
  },

  async getConversationList(userId: string) {
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate('sender', 'fullName')
      .populate('receiver', 'fullName')
      .sort({ createdAt: -1 });

    const conversations = new Map();

    messages.forEach((message) => {
      const otherUser =
        message.sender._id.toString() === userId
          ? message.receiver
          : message.sender;
      
      if (!conversations.has(otherUser._id.toString())) {
        conversations.set(otherUser._id.toString(), {
          user: otherUser,
          lastMessage: message,
          unreadCount: message.receiver._id.toString() === userId && !message.read ? 1 : 0,
        });
      } else if (
        message.receiver._id.toString() === userId &&
        !message.read
      ) {
        const conv = conversations.get(otherUser._id.toString());
        conv.unreadCount += 1;
      }
    });

    return Array.from(conversations.values());
  },

  async deleteMessage(messageId: string, userId: string) {
    const message = await Message.findOne({
      _id: messageId,
      $or: [{ sender: userId }, { receiver: userId }],
    });

    if (!message) {
      throw new AppError(404, 'Message not found');
    }

    await message.remove();
    return message;
  },

  async markAsRead(messageId: string, userId: string) {
    const message = await Message.findOne({
      _id: messageId,
      receiver: userId,
    });

    if (!message) {
      throw new AppError(404, 'Message not found');
    }

    message.read = true;
    await message.save();
    return message;
  },

  async getUnreadCount(userId: string) {
    return Message.countDocuments({
      receiver: userId,
      read: false,
    });
  },
};
