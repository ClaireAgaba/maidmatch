import express, { Response } from 'express';
import { Review } from '../models/Review';
import { Job } from '../models/Job';
import { auth } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = express.Router();

// Create a review
router.post('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const job = await Job.findById(req.body.job);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Verify that the reviewer is either the homeowner or the maid of the job
    if (
      job.homeowner.toString() !== req.user?.userId &&
      job.maid?.toString() !== req.user?.userId
    ) {
      return res.status(403).json({ error: 'Not authorized to review this job' });
    }

    // Determine review type and reviewee based on reviewer
    const isHomeownerReviewing = job.homeowner.toString() === req.user?.userId;
    const reviewType = isHomeownerReviewing ? 'maid-review' : 'homeowner-review';
    const reviewee = isHomeownerReviewing ? job.maid : job.homeowner;

    const review = new Review({
      ...req.body,
      reviewer: req.user?.userId,
      reviewee,
      reviewType
    });

    await review.save();
    
    // Populate reviewer and reviewee information
    await review.populate([
      { path: 'reviewer', select: 'fullName' },
      { path: 'reviewee', select: 'fullName' }
    ]);

    res.status(201).json(review);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Get reviews for a user
router.get('/user/:userId', auth, async (req: AuthRequest, res: Response) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'fullName')
      .populate('job', 'description')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get review by id
router.get('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('reviewer', 'fullName')
      .populate('reviewee', 'fullName')
      .populate('job', 'description');

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json(review);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update review
router.patch('/:id', auth, async (req: AuthRequest, res: Response) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['rating', 'comment'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ error: 'Invalid updates' });
  }

  try {
    const review = await Review.findOne({
      _id: req.params.id,
      reviewer: req.user?.userId
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    updates.forEach((update) => {
      if (req.body[update] !== undefined) {
        (review as any)[update] = req.body[update];
      }
    });

    await review.save();
    res.json(review);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Delete review
router.delete('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const review = await Review.findOneAndDelete({
      _id: req.params.id,
      reviewer: req.user?.userId
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json(review);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export const reviewRoutes = router;
