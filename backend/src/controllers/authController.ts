import { Request, Response } from 'express';
import { User } from '../models/User';
import { notificationService } from '../services/notificationService';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const { email, fullName, role, phone } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // For homeowners, create account with pending status
      if (role === 'homeowner') {
        const user = new User({
          ...req.body,
          verificationStatus: 'pending',
          password: await bcrypt.hash(crypto.randomBytes(10).toString('hex'), 10),
        });
        await user.save();
        return res.status(201).json({ 
          message: 'Registration successful. Please wait for admin approval.' 
        });
      }

      // For maids, create account with pending status and required documents
      if (role === 'maid') {
        const user = new User({
          ...req.body,
          verificationStatus: 'pending',
          password: await bcrypt.hash(crypto.randomBytes(10).toString('hex'), 10),
        });
        await user.save();
        return res.status(201).json({ 
          message: 'Registration successful. Please wait for admin verification.' 
        });
      }

      return res.status(400).json({ message: 'Invalid role specified' });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Registration failed' });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check verification status
      if (user.verificationStatus === 'pending') {
        return res.status(403).json({ 
          message: 'Your account is pending approval. Please wait for admin verification.' 
        });
      }

      if (user.verificationStatus === 'rejected') {
        return res.status(403).json({ 
          message: 'Your registration has been rejected. Please contact support for more information.' 
        });
      }

      // Verify password
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate token
      const token = await user.generateAuthToken();

      res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          isFirstLogin: user.isFirstLogin,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  },

  async verifyUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { action, reason } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (action === 'approve') {
        // Generate temporary password
        const tempPassword = crypto.randomBytes(6).toString('hex');
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        // Update user
        user.verificationStatus = 'verified';
        user.password = hashedPassword;
        user.isFirstLogin = true;
        await user.save();

        // Send notifications
        await notificationService.sendVerificationEmail(user.email, tempPassword, user.fullName);
        if (user.phone) {
          await notificationService.sendVerificationSMS(user.phone, tempPassword);
        }

        return res.json({ message: 'User verified successfully' });
      } 
      
      if (action === 'reject') {
        user.verificationStatus = 'rejected';
        await user.save();

        // Send notifications
        await notificationService.sendRejectionEmail(user.email, user.fullName, reason);
        if (user.phone) {
          await notificationService.sendRejectionSMS(user.phone);
        }

        return res.json({ message: 'User rejected successfully' });
      }

      return res.status(400).json({ message: 'Invalid action' });
    } catch (error) {
      console.error('Verification error:', error);
      res.status(500).json({ message: 'Verification failed' });
    }
  },

  async changePassword(req: Request, res: Response) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id; // From auth middleware

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Verify current password
      const isValidPassword = await user.comparePassword(currentPassword);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }

      // Update password
      user.password = await bcrypt.hash(newPassword, 10);
      user.isFirstLogin = false;
      await user.save();

      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error('Password change error:', error);
      res.status(500).json({ message: 'Password change failed' });
    }
  },
};
