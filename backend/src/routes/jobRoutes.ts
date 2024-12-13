import express, { Response } from 'express';
import { Job } from '../models/Job';
import { User } from '../models/User';
import { auth } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = express.Router();

// Create a job posting
router.post('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.userId);
    if (!user || user.role !== 'homeowner') {
      return res.status(403).json({ error: 'Only homeowners can post jobs' });
    }

    const job = new Job({
      ...req.body,
      homeowner: req.user?.userId,
      status: 'open'
    });

    await job.save();
    res.status(201).json(job);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Get all jobs
router.get('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const jobs = await Job.find({})
      .populate('homeowner', 'fullName')
      .populate('maid', 'fullName')
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get job by id
router.get('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('homeowner', 'fullName')
      .populate('maid', 'fullName')
      .populate('applications.maid', 'fullName');

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(job);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update job
router.patch('/:id', auth, async (req: AuthRequest, res: Response) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    'title',
    'description',
    'location',
    'salary',
    'employmentType',
    'startDate',
    'endDate',
    'requirements',
    'status'
  ];

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).json({ error: 'Invalid updates' });
  }

  try {
    const job = await Job.findOne({
      _id: req.params.id,
      homeowner: req.user?.userId,
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    updates.forEach((update) => {
      if (req.body[update] !== undefined) {
        (job as any)[update] = req.body[update];
      }
    });

    await job.save();
    res.json(job);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Delete job
router.delete('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      homeowner: req.user?.userId,
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(job);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Apply for a job
router.post('/:id/apply', auth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.userId);
    if (!user || user.role !== 'maid') {
      return res.status(403).json({ error: 'Only maids can apply for jobs' });
    }

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.status !== 'open') {
      return res.status(400).json({ error: 'This job is no longer accepting applications' });
    }

    // Check if already applied
    const alreadyApplied = job.applications.some(
      (application) => application.maid.toString() === req.user?.userId
    );

    if (alreadyApplied) {
      return res.status(400).json({ error: 'You have already applied for this job' });
    }

    job.applications.push({
      maid: req.user?.userId as any,
      status: 'pending',
      appliedAt: new Date()
    });

    await job.save();
    res.json(job);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Update application status
router.patch('/:id/applications/:maidId', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const job = await Job.findOne({
      _id: req.params.id,
      homeowner: req.user?.userId
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const application = job.applications.find(
      (app) => app.maid.toString() === req.params.maidId
    );

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    application.status = status;
    if (status === 'accepted') {
      job.status = 'in-progress';
      job.maid = application.maid;
      
      // Reject all other applications
      job.applications.forEach((app) => {
        if (app.maid.toString() !== req.params.maidId) {
          app.status = 'rejected';
        }
      });
    }

    await job.save();
    res.json(job);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export const jobRoutes = router;
