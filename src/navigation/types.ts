import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type MaidRegistrationFormData = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
};

export type RootStackParamList = {
  Welcome: undefined;
  Login: {
    redirectTo?: keyof RootStackParamList;
    formData?: any;
  } | undefined;
  AdminLogin: undefined;
  AdminDashboard: undefined;
  AdminMaidReview: undefined;
  MaidRegistration: { formData?: Partial<MaidRegistrationFormData> } | undefined;
  HomeOwnerSignup: undefined;
  MaidDashboard: undefined;
  HomeOwnerDashboard: undefined;
  AdminApprovals: undefined;
  Messages: undefined;
  Settings: undefined;
  AccountSettings: undefined;
  AvailableMaids: {
    employmentType: 'temporary' | 'permanent';
  };
  PendingApproval: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = 
  NativeStackScreenProps<RootStackParamList, T>;
