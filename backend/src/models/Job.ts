import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
  title: string;
  description: string;
  location: string;
  salary: number;
  employmentType: 'temporary' | 'permanent';
  startDate: Date;
  endDate?: Date;
  requirements: string[];
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  homeowner: mongoose.Types.ObjectId;
  maid?: mongoose.Types.ObjectId;
  applications: {
    maid: mongoose.Types.ObjectId;
    status: 'pending' | 'accepted' | 'rejected';
    appliedAt: Date;
  }[];
  rating?: number;
  review?: string;
}

const jobSchema = new Schema<IJob>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: Number, required: true },
  employmentType: {
    type: String,
    enum: ['temporary', 'permanent'],
    required: true
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  requirements: [{ type: String }],
  status: {
    type: String,
    enum: ['open', 'in-progress', 'completed', 'cancelled'],
    default: 'open'
  },
  homeowner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  maid: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  applications: [{
    maid: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    }
  }],
  rating: {
    type: Number,
    min: 0,
    max: 5
  },
  review: String
}, {
  timestamps: true
});

export const Job = mongoose.model<IJob>('Job', jobSchema);
