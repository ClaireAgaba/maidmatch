import express from 'express';
import { auth } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { reviewService } from '../services/reviewService';
import { AuthRequest } from '../types';

const router = express.Router();

// Create a review
router.post('/', auth, asyncHandler(async (req: AuthRequest, res) => {
  const review = await reviewService.createReview({
    ...req.body,
    reviewerId: req.user?.userId,
  });
  res.status(201).json(review);
}));

// Get reviews for a user
router.get('/user/:userId', auth, asyncHandler(async (req, res) => {
  const reviews = await reviewService.getReviewsForUser(req.params.userId);
  res.json(reviews);
}));

// Get reviews by a user
router.get('/by-user/:userId', auth, asyncHandler(async (req, res) => {
  const reviews = await reviewService.getReviewsByUser(req.params.userId);
  res.json(reviews);
}));

// Get review by id
router.get('/:id', auth, asyncHandler(async (req, res) => {
  const review = await reviewService.getReviewById(req.params.id);
  if (!review) {
    return res.status(404).json({ error: 'Review not found' });
  }
  res.json(review);
}));

// Update a review
router.patch('/:id', auth, asyncHandler(async (req: AuthRequest, res) => {
  const review = await reviewService.updateReview(
    req.params.id,
    req.user?.userId,
    req.body
  );
  res.json(review);
}));

// Delete a review
router.delete('/:id', auth, asyncHandler(async (req: AuthRequest, res) => {
  const review = await reviewService.deleteReview(req.params.id, req.user?.userId);
  res.json(review);
}));

export { router as reviewRoutes };
