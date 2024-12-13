import api from './api';

export const adminService = {
  async getDashboardStats() {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },

  async getPendingApplications() {
    const response = await api.get('/admin/applications/pending');
    return response.data;
  },

  async updateVerificationStatus(maidId: string, status: 'verified' | 'rejected') {
    const response = await api.patch(`/admin/applications/${maidId}/verify`, { status });
    return response.data;
  },

  async getApplicationDetails(maidId: string) {
    const response = await api.get(`/admin/applications/${maidId}`);
    return response.data;
  },

  async getDocument(documentUrl: string) {
    const response = await api.get(`/admin/documents/${documentUrl}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  async getBusinessMetrics(startDate: string, endDate: string) {
    const response = await api.get('/admin/metrics', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  async getRecentComplaints() {
    const response = await api.get('/admin/complaints');
    return response.data;
  },

  async respondToComplaint(complaintId: string, responseText: string) {
    const response = await api.post(`/admin/complaints/${complaintId}/respond`, { response: responseText });     
    return response.data;
  },

  async getPaymentHistory() {
    const response = await api.get('/admin/payments');
    return response.data;
  },

  async updateSystemSettings(settings: any) {
    const response = await api.patch('/admin/settings', settings);
    return response.data;
  }
};
