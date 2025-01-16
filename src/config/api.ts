// API configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  VERIFY_EMAIL: '/auth/verify-email',
  RESET_PASSWORD: '/auth/reset-password',
  
  // User endpoints
  USER_PROFILE: '/users/profile',
  UPDATE_PROFILE: '/users/profile',
  
  // Maid endpoints
  MAID_REGISTRATION: '/users/maid-registration',
  MAID_PROFILE: '/users/profile',
  UPLOAD_DOCUMENT: '/users/upload-document',
  
  // Admin endpoints
  ADMIN_STATS: '/api/admin/stats',
  PENDING_APPROVALS: '/api/admin/pending-approvals',
  APPROVE_USER: (id: string) => `/api/admin/users/${id}/approve`,
  REJECT_USER: (id: string) => `/api/admin/users/${id}/reject`,
  
  // Job endpoints
  CREATE_JOB: '/jobs/create',
  UPDATE_JOB: (id: string) => `/jobs/${id}`,
  DELETE_JOB: (id: string) => `/jobs/${id}`,
  LIST_JOBS: '/jobs',
  JOB_DETAILS: (id: string) => `/jobs/${id}`,
};

// API headers
export const getAuthHeaders = (token: string) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
  'Accept': 'application/json',
});

export const getMultipartHeaders = (token: string) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'multipart/form-data',
  'Accept': 'application/json',
});
