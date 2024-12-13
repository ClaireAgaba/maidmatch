import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceEventEmitter } from 'react-native';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserRole {
  role: 'admin' | 'maid' | 'homeowner';
}

export interface RegisterData {
  email?: string;
  password: string;
  fullName: string;
  role: 'maid' | 'homeowner';
  phone: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  nationality: string;
  tribe: string;
  languages: Array<{
    name: string;
    proficiency: 'Basic' | 'Intermediate' | 'Fluent';
  }>;
  currentAddress: string;
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;
  bloodType: string;
  allergies: string[];
  chronicConditions: string[];
  vaccinations: {
    covid19: boolean;
    hepatitisB: boolean;
    tuberculosis: boolean;
  };
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: UserRole['role'];
    isFirstLogin?: boolean;
    verificationStatus?: 'pending' | 'verified' | 'rejected';
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('Making login request with credentials:', { email: credentials.email });
      const response = await api.post('/auth/login', credentials);
      console.log('Raw login response:', response);
      
      if (!response.data) {
        throw new Error('No data in login response');
      }
      
      console.log('Login successful:', response.data);
      await this.storeUserData(response.data);
      await this.updateAuthState();
      return response.data;
    } catch (error: any) {
      console.error('Login error in service:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  async storeUserData(authResponse: AuthResponse): Promise<void> {
    try {
      console.log('Storing user data:', authResponse);
      const { token, user } = authResponse;
      
      await AsyncStorage.setItem('token', token);
      console.log('Token stored');
      
      await AsyncStorage.setItem('user', JSON.stringify(user));
      console.log('User data stored');
      
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('Auth header set');
    } catch (error) {
      console.error('Error storing user data:', error);
      throw error;
    }
  },

  async updateAuthState(): Promise<void> {
    try {
      console.log('Updating auth state...');
      DeviceEventEmitter.emit('authStateChanged', true);
      console.log('Auth state update emitted');
    } catch (error) {
      console.error('Error updating auth state:', error);
      throw error;
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      console.log('Making register request with data:', data);
      const response = await api.post('/auth/register', data);
      console.log('Raw register response:', response);
      
      if (!response.data) {
        throw new Error('No data in register response');
      }
      
      console.log('Register successful:', response.data);
      await this.storeUserData(response.data);
      await this.updateAuthState();
      return response.data;
    } catch (error: any) {
      console.error('Registration error in service:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      console.log('Logging out user...');
      // Clear the auth token
      await AsyncStorage.removeItem('token');
      // Clear the user data
      await AsyncStorage.removeItem('user');
      // Emit auth state change event
      DeviceEventEmitter.emit('authStateChanged', false);
      console.log('Logout successful');
    } catch (error) {
      console.error('Error during logout:', error);
      throw new Error('Failed to logout');
    }
  },

  async getCurrentUser(): Promise<AuthResponse['user'] | null> {
    try {
      console.log('Getting current user...');
      const userStr = await AsyncStorage.getItem('user');
      console.log('User data from storage:', userStr);
      const user = userStr ? JSON.parse(userStr) : null;
      console.log('Parsed user:', user);
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  async isAuthenticated(): Promise<boolean> {
    try {
      console.log('Checking authentication...');
      const token = await AsyncStorage.getItem('token');
      const isAuth = !!token;
      console.log('Is authenticated:', isAuth);
      return isAuth;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  },

  async getUserRole(): Promise<UserRole['role'] | null> {
    try {
      const user = await this.getCurrentUser();
      console.log('Got user role:', user?.role);
      return user?.role || null;
    } catch (error) {
      console.error('Error getting user role:', error);
      return null;
    }
  }
};
