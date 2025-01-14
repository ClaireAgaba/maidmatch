import express from 'express';
import { auth } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { jobService } from '../services/jobService';
import { AuthRequest } from '../types';

const router = express.Router();

// Create a job posting
router.post('/', auth, asyncHandler(async (req: AuthRequest, res) => {
  const job = await jobService.createJob({
    ...req.body,
    homeownerId: req.user?.userId,
  });
  res.status(201).json(job);
}));

// Get all jobs
router.get('/', auth, asyncHandler(async (req, res) => {
  const jobs = await jobService.getJobs();
  res.json(jobs);
}));

// Get job by id
router.get('/:id', auth, asyncHandler(async (req, res) => {
  const job = await jobService.getJobById(req.params.id);
  res.json(job);
}));

// Update job
router.patch('/:id', auth, asyncHandler(async (req: AuthRequest, res) => {
  const job = await jobService.updateJob(
    req.params.id,
    req.user?.userId,
    req.body
  );
  res.json(job);
}));

// Delete job
router.delete('/:id', auth, asyncHandler(async (req: AuthRequest, res) => {
  const job = await jobService.deleteJob(req.params.id, req.user?.userId);
  res.json(job);
}));

// Apply for a job
router.post('/:id/apply', auth, asyncHandler(async (req: AuthRequest, res) => {
  const job = await jobService.applyForJob(req.params.id, req.user?.userId);
  res.json(job);
}));

// Update application status
router.patch('/:id/applications/:maidId', auth, asyncHandler(async (req: AuthRequest, res) => {
  const job = await jobService.updateApplicationStatus(
    req.params.id,
    req.params.maidId,
    req.user?.userId,
    req.body.status
  );
  res.json(job);
}));

export { router as jobRoutes };
