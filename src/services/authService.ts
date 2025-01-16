import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

interface RegisterData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  passportPhoto?: string;
  nextOfKin: {
    fullName: string;
    phone: string;
    relationship: string;
  };
  maritalStatus: string;
  numberOfKids: number;
  role: string;
}

export const authService = {
  async sendOTP(phoneNumber: string): Promise<void> {
    try {
      // Format phone number to include country code if not present
      const formattedPhone = phoneNumber.startsWith('+256') 
        ? phoneNumber 
        : `+256${phoneNumber.startsWith('0') ? phoneNumber.slice(1) : phoneNumber}`;

      const response = await axios.post(`${API_URL}/auth/send-otp`, { 
        phoneNumber: formattedPhone,
        channel: 'sms' // Specify SMS as the delivery channel
      });

      if (response.data?.error) {
        throw new Error(response.data.error);
      }
    } catch (error: any) {
      // Handle specific error cases
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.status === 429) {
        throw new Error('Too many attempts. Please try again later.');
      } else if (error.response?.status === 400) {
        throw new Error('Invalid phone number format.');
      } else {
        throw new Error('Failed to send OTP. Please check your network connection and try again.');
      }
    }
  },

  async verifyOTP(phoneNumber: string, otp: string): Promise<{ success: boolean; token: string; user: any }> {
    try {
      // Format phone number consistently
      const formattedPhone = phoneNumber.startsWith('+256') 
        ? phoneNumber 
        : `+256${phoneNumber.startsWith('0') ? phoneNumber.slice(1) : phoneNumber}`;

      const response = await axios.post(`${API_URL}/auth/verify-otp`, { 
        phoneNumber: formattedPhone, 
        otp,
        channel: 'sms'
      });

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      return {
        success: true,
        token: response.data.token,
        user: response.data.user
      };
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.status === 401) {
        throw new Error('Invalid OTP code.');
      } else if (error.response?.status === 410) {
        throw new Error('OTP has expired. Please request a new one.');
      } else {
        throw new Error('Failed to verify OTP. Please try again.');
      }
    }
  },

  async register(data: RegisterData): Promise<void> {
    try {
      const formData = new FormData();

      // Format phone numbers
      const formattedPhone = data.phone.startsWith('+256') 
        ? data.phone 
        : `+256${data.phone.startsWith('0') ? data.phone.slice(1) : data.phone}`;

      const formattedNextOfKinPhone = data.nextOfKin.phone.startsWith('+256')
        ? data.nextOfKin.phone
        : `+256${data.nextOfKin.phone.startsWith('0') ? data.nextOfKin.phone.slice(1) : data.nextOfKin.phone}`;

      // Append passport photo if exists
      if (data.passportPhoto) {
        const filename = data.passportPhoto.split('/').pop() || 'photo.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('passportPhoto', {
          uri: data.passportPhoto,
          name: filename,
          type,
        });
      }

      // Append other data
      formData.append('fullName', data.fullName);
      formData.append('email', data.email);
      formData.append('phone', formattedPhone);
      formData.append('location', data.location);
      formData.append('nextOfKin', JSON.stringify({
        ...data.nextOfKin,
        phone: formattedNextOfKinPhone,
      }));
      formData.append('maritalStatus', data.maritalStatus);
      formData.append('numberOfKids', data.numberOfKids.toString());
      formData.append('role', data.role);

      const response = await axios.post(`${API_URL}/auth/register`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data?.error) {
        throw new Error(response.data.error);
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.status === 409) {
        throw new Error('A user with this phone number already exists.');
      } else {
        throw new Error('Registration failed. Please try again.');
      }
    }
  },

  async login(phoneNumber: string, otp: string): Promise<{ token: string }> {
    try {
      // Format phone number consistently
      const formattedPhone = phoneNumber.startsWith('+256') 
        ? phoneNumber 
        : `+256${phoneNumber.startsWith('0') ? phoneNumber.slice(1) : phoneNumber}`;

      const response = await axios.post(`${API_URL}/auth/login`, {
        phoneNumber: formattedPhone,
        otp,
      });

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.status === 401) {
        throw new Error('Invalid credentials.');
      } else {
        throw new Error('Login failed. Please try again.');
      }
    }
  },
};

export default authService;
