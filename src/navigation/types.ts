export type RootStackParamList = {
  InterfaceSelector: undefined;
  MaidDashboard: undefined;
  HomeOwnerDashboard: undefined;
  AdminDashboard: undefined;
  AdminProfile: undefined;
  AdminSettings: undefined;
  AdminNotifications: undefined;
  AdminApprovals: undefined;
  AdminUserManagement: undefined;
  AdminReports: undefined;
  AdminAnalytics: undefined;
  AdminTransactions: undefined;
  Settings: undefined;
  AccountSettings: undefined;
  Messages: undefined;
  JobApplications: undefined;
  Reviews: undefined;
  AvailableMaids: {
    employmentType: 'temporary' | 'permanent';
  };
  MaidDetails: {
    maidId: string;
  };
};
