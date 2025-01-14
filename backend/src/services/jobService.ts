import { Types } from 'mongoose';
import { Job } from '../models/Job';
import { User } from '../models/User';
import { AppError } from '../middleware/errorHandler';

interface JobCreateParams {
  title: string;
  description: string;
  location: string;
  salary: number;
  employmentType: string;
  startDate: Date;
  endDate?: Date;
  requirements: string[];
  homeownerId: string;
}

interface JobUpdateParams {
  title?: string;
  description?: string;
  location?: string;
  salary?: number;
  employmentType?: string;
  startDate?: Date;
  endDate?: Date;
  requirements?: string[];
  status?: 'open' | 'in-progress' | 'completed' | 'cancelled';
}

export const jobService = {
  async createJob(params: JobCreateParams) {
    const user = await User.findById(params.homeownerId);
    if (!user || user.role !== 'homeowner') {
      throw new AppError(403, 'Only homeowners can post jobs');
    }

    const job = new Job({
      ...params,
      homeowner: params.homeownerId,
      status: 'open',
    });

    await job.save();
    return job;
  },

  async getJobs(query = {}) {
    return Job.find(query)
      .populate('homeowner', 'fullName')
      .populate('maid', 'fullName')
      .sort({ createdAt: -1 });
  },

  async getJobById(jobId: string) {
    const job = await Job.findById(jobId)
      .populate('homeowner', 'fullName')
      .populate('maid', 'fullName')
      .populate('applications.maid', 'fullName');

    if (!job) {
      throw new AppError(404, 'Job not found');
    }

    return job;
  },

  async updateJob(jobId: string, homeownerId: string, updates: JobUpdateParams) {
    const allowedUpdates = [
      'title',
      'description',
      'location',
      'salary',
      'employmentType',
      'startDate',
      'endDate',
      'requirements',
      'status',
    ];

    const updateKeys = Object.keys(updates);
    const isValidOperation = updateKeys.every((key) => allowedUpdates.includes(key));

    if (!isValidOperation) {
      throw new AppError(400, 'Invalid updates');
    }

    const job = await Job.findOne({
      _id: jobId,
      homeowner: homeownerId,
    });

    if (!job) {
      throw new AppError(404, 'Job not found');
    }

    updateKeys.forEach((key) => {
      if (updates[key as keyof JobUpdateParams] !== undefined) {
        (job as any)[key] = updates[key as keyof JobUpdateParams];
      }
    });

    await job.save();
    return job;
  },

  async deleteJob(jobId: string, homeownerId: string) {
    const job = await Job.findOneAndDelete({
      _id: jobId,
      homeowner: homeownerId,
    });

    if (!job) {
      throw new AppError(404, 'Job not found');
    }

    return job;
  },

  async applyForJob(jobId: string, maidId: string) {
    const user = await User.findById(maidId);
    if (!user || user.role !== 'maid') {
      throw new AppError(403, 'Only maids can apply for jobs');
    }

    const job = await Job.findById(jobId);
    if (!job) {
      throw new AppError(404, 'Job not found');
    }

    if (job.status !== 'open') {
      throw new AppError(400, 'This job is no longer accepting applications');
    }

    const alreadyApplied = job.applications.some(
      (application) => application.maid.toString() === maidId
    );

    if (alreadyApplied) {
      throw new AppError(400, 'You have already applied for this job');
    }

    job.applications.push({
      maid: new Types.ObjectId(maidId),
      status: 'pending',
      appliedAt: new Date(),
    });

    await job.save();
    return job;
  },

  async updateApplicationStatus(
    jobId: string,
    maidId: string,
    homeownerId: string,
    status: 'accepted' | 'rejected'
  ) {
    if (!['accepted', 'rejected'].includes(status)) {
      throw new AppError(400, 'Invalid status');
    }

    const job = await Job.findOne({
      _id: jobId,
      homeowner: homeownerId,
    });

    if (!job) {
      throw new AppError(404, 'Job not found');
    }

    const application = job.applications.find(
      (app) => app.maid.toString() === maidId
    );

    if (!application) {
      throw new AppError(404, 'Application not found');
    }

    application.status = status;
    if (status === 'accepted') {
      job.status = 'in-progress';
      job.maid = application.maid;

      // Reject all other applications
      job.applications.forEach((app) => {
        if (app.maid.toString() !== maidId) {
          app.status = 'rejected';
        }
      });
    }

    await job.save();
    return job;
  },
};
