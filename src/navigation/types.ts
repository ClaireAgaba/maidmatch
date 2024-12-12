export type RootStackParamList = {
  Welcome: undefined;
  MaidSignup: undefined;
  HomeOwnerSignup: undefined;
  MaidDashboard: undefined;
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
