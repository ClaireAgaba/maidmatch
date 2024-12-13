import express, { Response } from 'express';
import { User } from '../models/User';
import { Job } from '../models/Job';
import { Payment } from '../models/Payment';
import { Complaint } from '../models/Complaint';
import { auth } from '../middleware/auth';
import { adminAuth } from '../middleware/adminAuth';
import { AuthRequest } from '../types';
import { sendVerificationEmail } from '../utils/email';

const router = express.Router();

// Ensure all routes require admin authentication
router.use(auth, adminAuth);

// Get dashboard statistics
router.get('/dashboard/stats', async (req: AuthRequest, res: Response) => {
  try {
    const [
      pendingVerifications,
      totalMaids,
      totalHomeowners,
      activeJobs,
      completedJobs,
      payments,
      complaints
    ] = await Promise.all([
      User.countDocuments({ role: 'maid', verificationStatus: 'pending' }),
      User.countDocuments({ role: 'maid' }),
      User.countDocuments({ role: 'homeowner' }),
      Job.countDocuments({ status: 'in-progress' }),
      Job.countDocuments({ status: 'completed' }),
      Payment.find({ status: 'completed' }),
      Complaint.countDocuments({ status: 'pending' })
    ]);

    const totalEarnings = payments.reduce((sum, payment) => sum + payment.amount, 0);

    res.json({
      pendingVerifications,
      totalMaids,
      totalHomeowners,
      activeJobs,
      completedJobs,
      totalEarnings,
      recentComplaints: complaints
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get pending maid applications
router.get('/applications/pending', async (req: AuthRequest, res: Response) => {
  try {
    const applications = await User.find({
      role: 'maid',
      verificationStatus: 'pending'
    })
    .select('fullName email phone documents medicalHistory submittedAt verificationStatus')
    .sort({ submittedAt: -1 });

    res.json(applications);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific application details
router.get('/applications/:id', async (req: AuthRequest, res: Response) => {
  try {
    const application = await User.findById(req.params.id)
      .select('-password');

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(application);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update application verification status
router.patch('/applications/:id/verify', async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.verificationStatus = status;
    await user.save();

    // Send email notification to the maid
    await sendVerificationEmail(user.email, status, user.fullName);

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get business metrics
router.get('/metrics', async (req: AuthRequest, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    const metrics = await Promise.all([
      // Jobs metrics
      Job.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(startDate as string),
              $lte: new Date(endDate as string)
            }
          }
        },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),

      // Payment metrics
      Payment.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(startDate as string),
              $lte: new Date(endDate as string)
            }
          }
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        }
      ]),

      // User growth metrics
      User.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(startDate as string),
              $lte: new Date(endDate as string)
            }
          }
        },
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    res.json(metrics);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get complaints
router.get('/complaints', async (req: AuthRequest, res: Response) => {
  try {
    const complaints = await Complaint.find()
      .populate('user', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(complaints);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Respond to complaint
router.post('/complaints/:id/respond', async (req: AuthRequest, res: Response) => {
  try {
    const { response } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    complaint.adminResponse = response;
    complaint.status = 'resolved';
    complaint.resolvedAt = new Date();
    complaint.resolvedBy = req.user?.userId;

    await complaint.save();

    res.json(complaint);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get payment history
router.get('/payments', async (req: AuthRequest, res: Response) => {
  try {
    const payments = await Payment.find()
      .populate('user', 'fullName email')
      .populate('job', 'title')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(payments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update system settings
router.patch('/settings', async (req: AuthRequest, res: Response) => {
  try {
    // Implement system settings update logic
    res.json({ message: 'Settings updated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export const adminRoutes = router;
