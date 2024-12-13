import express, { Response } from 'express';
import { User } from '../models/User';
import { auth } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).json({ user, token });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('Invalid login credentials');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid login credentials');
    }

    const token = await user.generateAuthToken();
    res.json({ user, token });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

// Get current user profile
router.get('/me', auth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.patch('/me', auth, async (req: AuthRequest, res: Response) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['fullName', 'email', 'password', 'phone', 'address', 'isAvailable', 'skills', 'experience', 'hourlyRate', 'preferredSchedule', 'languages'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ error: 'Invalid updates!' });
  }

  try {
    const user = await User.findById(req.user?.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    updates.forEach((update) => {
      if (req.body[update] !== undefined) {
        (user as any)[update] = req.body[update];
      }
    });

    await user.save();
    res.json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Delete user account
router.delete('/me', auth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.user?.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Switch user role
router.post('/switch-role', auth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.role = user.role === 'maid' ? 'homeowner' : 'maid';
    await user.save();
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export const userRoutes = router;
