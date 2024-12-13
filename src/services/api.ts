import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Use different base URLs for iOS simulator, Android emulator, and physical devices
const getBaseUrl = () => {
  if (__DEV__) {
    // Use the local IP address when running in development
    return 'http://192.168.100.5:3000';
  }
  // Production URL
  return 'https://your-production-api.com'; // Update this with your production API URL
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('API Error:', error);
    
    if (error.message === 'Network Error') {
      return Promise.reject(new Error('Unable to connect to server. Please check your internet connection and try again.'));
    }
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return Promise.reject(new Error(error.response.data.error || 'An error occurred'));
    } else if (error.request) {
      // The request was made but no response was received
      return Promise.reject(new Error('No response from server. Please try again.'));
    } else {
      // Something happened in setting up the request that triggered an Error
      return Promise.reject(new Error('Error setting up the request. Please try again.'));
    }
  }
);

export default api;
