import { Types } from 'mongoose';
import { Review } from '../models/Review';
import { Job } from '../models/Job';
import { User } from '../models/User';
import { AppError } from '../middleware/errorHandler';

interface ReviewCreateParams {
  jobId: string;
  rating: number;
  comment: string;
  reviewerId: string;
}

export const reviewService = {
  async createReview({ jobId, rating, comment, reviewerId }: ReviewCreateParams) {
    const job = await Job.findById(jobId);
    if (!job) {
      throw new AppError(404, 'Job not found');
    }

    if (job.status !== 'completed') {
      throw new AppError(400, 'Can only review completed jobs');
    }

    const reviewer = await User.findById(reviewerId);
    if (!reviewer) {
      throw new AppError(404, 'Reviewer not found');
    }

    // Determine who is being reviewed
    const isHomeownerReviewing = reviewer.role === 'homeowner';
    const reviewedUserId = isHomeownerReviewing ? job.maid : job.homeowner;

    // Check if review already exists
    const existingReview = await Review.findOne({
      job: jobId,
      reviewer: reviewerId,
    });

    if (existingReview) {
      throw new AppError(400, 'You have already reviewed this job');
    }

    const review = new Review({
      job: jobId,
      rating,
      comment,
      reviewer: reviewerId,
      reviewedUser: reviewedUserId,
    });

    await review.save();

    // Update user's average rating
    const reviewedUser = await User.findById(reviewedUserId);
    if (reviewedUser) {
      const reviews = await Review.find({ reviewedUser: reviewedUserId });
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      reviewedUser.rating = totalRating / reviews.length;
      await reviewedUser.save();
    }

    return review.populate(['reviewer', 'reviewedUser']);
  },

  async getReviewsForUser(userId: string) {
    return Review.find({ reviewedUser: userId })
      .populate('reviewer', 'fullName')
      .populate('job', 'title')
      .sort({ createdAt: -1 });
  },

  async getReviewsByUser(userId: string) {
    return Review.find({ reviewer: userId })
      .populate('reviewedUser', 'fullName')
      .populate('job', 'title')
      .sort({ createdAt: -1 });
  },

  async updateReview(reviewId: string, reviewerId: string, updates: { rating?: number; comment?: string }) {
    const review = await Review.findOne({
      _id: reviewId,
      reviewer: reviewerId,
    });

    if (!review) {
      throw new AppError(404, 'Review not found');
    }

    if (updates.rating !== undefined) {
      review.rating = updates.rating;
    }
    if (updates.comment !== undefined) {
      review.comment = updates.comment;
    }

    await review.save();

    // Update user's average rating
    const reviewedUser = await User.findById(review.reviewedUser);
    if (reviewedUser) {
      const reviews = await Review.find({ reviewedUser: review.reviewedUser });
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      reviewedUser.rating = totalRating / reviews.length;
      await reviewedUser.save();
    }

    return review.populate(['reviewer', 'reviewedUser', 'job']);
  },

  async deleteReview(reviewId: string, reviewerId: string) {
    const review = await Review.findOneAndDelete({
      _id: reviewId,
      reviewer: reviewerId,
    });

    if (!review) {
      throw new AppError(404, 'Review not found');
    }

    // Update user's average rating
    const reviewedUser = await User.findById(review.reviewedUser);
    if (reviewedUser) {
      const reviews = await Review.find({ reviewedUser: review.reviewedUser });
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      reviewedUser.rating = reviews.length > 0 ? totalRating / reviews.length : 0;
      await reviewedUser.save();
    }

    return review;
  },
};
