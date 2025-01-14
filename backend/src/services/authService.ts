import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { User } from '../models/User';
import { AppError } from '../middleware/errorHandler';
import { notificationService } from './notificationService';

interface RegisterParams {
  email: string;
  fullName: string;
  role: 'maid' | 'homeowner';
  phone: string;
  [key: string]: any;
}

interface LoginParams {
  email: string;
  password: string;
}

export const authService = {
  async register(params: RegisterParams) {
    const { email, role } = params;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError(400, 'User already exists');
    }

    const tempPassword = crypto.randomBytes(10).toString('hex');
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const user = new User({
      ...params,
      verificationStatus: 'pending',
      password: hashedPassword,
    });

    await user.save();
    await notificationService.sendVerificationEmail(email, tempPassword, params.fullName);

    return {
      message: `Registration successful. Please wait for ${role === 'maid' ? 'admin verification' : 'admin approval'}.`,
    };
  },

  async login({ email, password }: LoginParams) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError(401, 'Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new AppError(401, 'Invalid credentials');
    }

    if (user.verificationStatus !== 'approved') {
      throw new AppError(403, 'Account pending approval');
    }

    const token = await user.generateAuthToken();
    return { token, user: user.toJSON() };
  },

  async verifyUser(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    user.verificationStatus = 'approved';
    await user.save();

    return { message: 'User verified successfully' };
  },

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      throw new AppError(401, 'Current password is incorrect');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return { message: 'Password changed successfully' };
  },
};
