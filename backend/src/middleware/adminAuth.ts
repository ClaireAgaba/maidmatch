import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { User } from '../models/User';

export const adminAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.user?.userId);
    
    if (!user || user.role !== 'admin') {
      throw new Error();
    }

    next();
  } catch (error) {
    res.status(403).json({ error: 'Access denied. Admin privileges required.' });
  }
};
