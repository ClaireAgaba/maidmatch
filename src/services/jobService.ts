import api from './api';

export interface JobData {
  title: string;
  description: string;
  location: string;
  salary: number;
  jobType: 'full-time' | 'part-time' | 'temporary';
  requirements?: string[];
  startDate?: Date;
  endDate?: Date;
}

export const jobService = {
  async createJob(jobData: JobData) {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },

  async getJobs(filters?: {
    jobType?: string;
    location?: string;
    salary?: { min?: number; max?: number };
  }) {
    const response = await api.get('/jobs', { params: filters });
    return response.data;
  },

  async getJobById(jobId: string) {
    const response = await api.get(`/jobs/${jobId}`);
    return response.data;
  },

  async updateJob(jobId: string, jobData: Partial<JobData>) {
    const response = await api.patch(`/jobs/${jobId}`, jobData);
    return response.data;
  },

  async deleteJob(jobId: string) {
    const response = await api.delete(`/jobs/${jobId}`);
    return response.data;
  },

  async applyForJob(jobId: string) {
    const response = await api.post(`/jobs/${jobId}/apply`);
    return response.data;
  },

  async getMyApplications() {
    const response = await api.get('/jobs/applications');
    return response.data;
  },

  async getJobApplications(jobId: string) {
    const response = await api.get(`/jobs/${jobId}/applications`);
    return response.data;
  },

  async updateApplicationStatus(jobId: string, applicantId: string, status: 'accepted' | 'rejected') {
    const response = await api.patch(`/jobs/${jobId}/applications/${applicantId}`, { status });
    return response.data;
  },
};
