// API Base URL
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  ADMIN_LOGIN: '/api/auth/admin/login',
  REFRESH_TOKEN: '/api/auth/refresh',
  
  // Maid
  MAID_REGISTRATION: '/api/maid/register',
  MAID_PROFILE: '/api/maid/profile',
  MAID_UPDATE: '/api/maid/update',
  
  // Admin
  ADMIN_MAID_APPLICATIONS: '/api/admin/maid-applications',
  ADMIN_DASHBOARD_STATS: '/api/admin/dashboard/stats',
  
  // Home Owner
  HOME_OWNER_REGISTRATION: '/api/home-owner/register',
  HOME_OWNER_PROFILE: '/api/home-owner/profile',
  HOME_OWNER_UPDATE: '/api/home-owner/update',
  
  // Documents
  UPLOAD_DOCUMENT: '/api/documents/upload',
  GET_DOCUMENT: '/api/documents',
  
  // Messages
  SEND_MESSAGE: '/api/messages/send',
  GET_MESSAGES: '/api/messages',
  GET_CONVERSATIONS: '/api/messages/conversations',
};
