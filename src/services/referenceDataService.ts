import api from './api';

interface ReferenceDataItem {
  _id: string;
  name: string;
  active: boolean;
  region?: string;
}

interface ReferenceData {
  districts: ReferenceDataItem[];
  tribes: ReferenceDataItem[];
  languages: ReferenceDataItem[];
  relationships: ReferenceDataItem[];
}

class ReferenceDataService {
  async getAllReferenceData(): Promise<ReferenceData> {
    try {
      const response = await api.get('/reference/all');
      return response.data;
    } catch (error) {
      console.error('Error fetching reference data:', error);
      throw new Error('Failed to fetch reference data');
    }
  }

  async getDistricts() {
    try {
      const response = await api.get('/reference/districts');
      return response.data;
    } catch (error) {
      console.error('Error fetching districts:', error);
      throw new Error('Failed to fetch districts');
    }
  }

  async getTribes() {
    try {
      const response = await api.get('/reference/tribes');
      return response.data;
    } catch (error) {
      console.error('Error fetching tribes:', error);
      throw new Error('Failed to fetch tribes');
    }
  }

  async getLanguages() {
    try {
      const response = await api.get('/reference/languages');
      return response.data;
    } catch (error) {
      console.error('Error fetching languages:', error);
      throw new Error('Failed to fetch languages');
    }
  }

  async getRelationships() {
    try {
      const response = await api.get('/reference/relationships');
      return response.data;
    } catch (error) {
      console.error('Error fetching relationships:', error);
      throw new Error('Failed to fetch relationships');
    }
  }

  // Admin functions
  async addReferenceData(type: string, data: { name: string; region?: string }) {
    try {
      const response = await api.post(`/reference/${type}s`, data);
      return response.data;
    } catch (error) {
      console.error(`Error adding ${type}:`, error);
      throw new Error(`Failed to add ${type}`);
    }
  }

  async updateReferenceData(type: string, id: string, data: { name?: string; region?: string; active?: boolean }) {
    try {
      const response = await api.put(`/reference/${type}s/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating ${type}:`, error);
      throw new Error(`Failed to update ${type}`);
    }
  }

  async deleteReferenceData(type: string, id: string) {
    try {
      const response = await api.delete(`/reference/${type}s/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      throw new Error(`Failed to delete ${type}`);
    }
  }
}

export const referenceDataService = new ReferenceDataService();
