import express, { Response } from 'express';
import { Message } from '../models/Message';
import { auth } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = express.Router();

// Send a message
router.post('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const message = new Message({
      sender: req.user?.userId,
      receiver: req.body.receiver,
      content: req.body.content
    });

    await message.save();
    
    await message.populate([
      { path: 'sender', select: 'fullName' },
      { path: 'receiver', select: 'fullName' }
    ]);

    res.status(201).json(message);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Get conversation with a specific user
router.get('/conversation/:userId', auth, async (req: AuthRequest, res: Response) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user?.userId, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user?.userId }
      ]
    })
      .populate('sender', 'fullName')
      .populate('receiver', 'fullName')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get all conversations (grouped by user)
router.get('/conversations', auth, async (req: AuthRequest, res: Response) => {
  try {
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: req.user?.userId }, { receiver: req.user?.userId }]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ['$sender', req.user?.userId] },
              then: '$receiver',
              else: '$sender'
            }
          },
          lastMessage: { $first: '$$ROOT' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          user: {
            _id: 1,
            fullName: 1
          },
          lastMessage: 1
        }
      }
    ]);

    res.json(conversations);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Mark messages as read
router.patch('/read/:senderId', auth, async (req: AuthRequest, res: Response) => {
  try {
    await Message.updateMany(
      {
        sender: req.params.senderId,
        receiver: req.user?.userId,
        read: false
      },
      { read: true }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a message
router.delete('/:messageId', auth, async (req: AuthRequest, res: Response) => {
  try {
    const message = await Message.findOneAndDelete({
      _id: req.params.messageId,
      sender: req.user?.userId
    });

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json(message);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export const messageRoutes = router;
