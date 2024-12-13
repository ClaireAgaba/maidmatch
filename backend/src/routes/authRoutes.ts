import express, { Response } from 'express';
import { User } from '../models/User';
import { AuthRequest } from '../types';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Regular user login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid login credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid login credentials' });
    }

    // For maids, check verification status
    if (user.role === 'maid' && user.verificationStatus !== 'verified') {
      return res.status(403).json({ 
        error: 'Your account is pending verification. Please wait for admin approval.' 
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '7d' }
    );

    res.json({ user, token });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin login
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, role: 'admin' });

    if (!user) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '7d' }
    );

    res.json({ user, token });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Register user
router.post('/register', async (req, res) => {
  try {
    const { email, password, role, ...rest } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create new user
    const user = new User({
      email,
      password,
      role,
      ...rest,
      verificationStatus: role === 'maid' ? 'pending' : 'verified'
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({ user, token });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export { router as authRoutes };
