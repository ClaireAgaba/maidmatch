import express from 'express';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Register User
router.post('/register', async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      location,
      password,
      role,
      passportPhoto,
      maritalStatus,
      numberOfKids,
      nextOfKin
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      fullName,
      email,
      phone,
      location,
      password,
      role,
      passportPhoto,
      maritalStatus,
      numberOfKids,
      nextOfKin
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get Current User
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Update User Profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const {
      fullName,
      phone,
      location,
      maritalStatus,
      numberOfKids,
      nextOfKin
    } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    user.fullName = fullName || user.fullName;
    user.phone = phone || user.phone;
    user.location = location || user.location;
    user.maritalStatus = maritalStatus || user.maritalStatus;
    user.numberOfKids = numberOfKids ?? user.numberOfKids;
    user.nextOfKin = nextOfKin || user.nextOfKin;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
