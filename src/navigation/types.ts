export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  AdminLogin: undefined;
  AdminDashboard: undefined;
  MaidSignup: undefined;
  MaidDashboard: undefined;
  HomeOwnerSignup: undefined;
  HomeOwnerDashboard: undefined;
  MaidProfile: undefined;
  HomeOwnerProfile: undefined;
  JobApplications: undefined;
  Reviews: undefined;
  AvailableMaids: {
    employmentType: 'temporary' | 'permanent';
  };
  MaidDetails: {
    maidId: string;
  };
  Settings: undefined;
  AccountSettings: undefined;
};
