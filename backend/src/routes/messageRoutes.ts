import express from 'express';
import { auth } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { messageService } from '../services/messageService';
import { AuthRequest } from '../types';

const router = express.Router();

// Send a message
router.post('/', auth, asyncHandler(async (req: AuthRequest, res) => {
  const message = await messageService.sendMessage({
    ...req.body,
    senderId: req.user?.userId,
  });
  res.status(201).json(message);
}));

// Get conversation with another user
router.get('/conversation/:userId', auth, asyncHandler(async (req: AuthRequest, res) => {
  const messages = await messageService.getConversation(
    req.user?.userId,
    req.params.userId
  );
  res.json(messages);
}));

// Get list of conversations
router.get('/conversations', auth, asyncHandler(async (req: AuthRequest, res) => {
  const conversations = await messageService.getConversationList(req.user?.userId);
  res.json(conversations);
}));

// Delete a message
router.delete('/:id', auth, asyncHandler(async (req: AuthRequest, res) => {
  const message = await messageService.deleteMessage(req.params.id, req.user?.userId);
  res.json(message);
}));

// Mark message as read
router.patch('/:id/read', auth, asyncHandler(async (req: AuthRequest, res) => {
  const message = await messageService.markAsRead(req.params.id, req.user?.userId);
  res.json(message);
}));

// Get unread message count
router.get('/unread/count', auth, asyncHandler(async (req: AuthRequest, res) => {
  const count = await messageService.getUnreadCount(req.user?.userId);
  res.json({ count });
}));

export { router as messageRoutes };
