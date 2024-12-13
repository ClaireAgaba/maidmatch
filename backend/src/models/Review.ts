import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  job: mongoose.Types.ObjectId;
  reviewer: mongoose.Types.ObjectId;
  reviewee: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  reviewType: 'maid-review' | 'homeowner-review';
}

const reviewSchema = new Schema<IReview>({
  job: {
    type: Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  reviewer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewee: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  reviewType: {
    type: String,
    enum: ['maid-review', 'homeowner-review'],
    required: true
  }
}, {
  timestamps: true
});

// Prevent multiple reviews for the same job by the same reviewer
reviewSchema.index({ job: 1, reviewer: 1 }, { unique: true });

export const Review = mongoose.model<IReview>('Review', reviewSchema);
