export interface User {
  id?: string;
  email: string;
  password?: string;
  role: 'maid' | 'homeowner' | 'admin';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserSignupData {
  email: string;
  password: string;
  confirmPassword: string;
  role: 'maid' | 'homeowner' | 'admin';
}

export interface UserLoginData {
  email: string;
  password: string;
}
