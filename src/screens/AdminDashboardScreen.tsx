import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import DashboardHeader from '../components/admin/DashboardHeader';
import SystemStats from '../components/admin/SystemStats';
import QuickActions from '../components/admin/QuickActions';
import { 
  mockAdminProfile, 
  mockSystemStats, 
  mockNotifications,
  mockPendingApprovals 
} from '../data/adminMockData';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminDashboard'>;

export function AdminDashboardScreen({ navigation }: Props) {
  const theme = useTheme();

  const handleNotificationPress = () => {
    navigation.navigate('AdminNotifications');
  };

  const handleProfilePress = () => {
    navigation.navigate('AdminProfile');
  };

  const handleSettingsPress = () => {
    navigation.navigate('AdminSettings');
  };

  const quickActions = [
    {
      id: '1',
      icon: 'account-check',
      label: 'Approve Users',
      description: 'Review pending registrations',
      badge: mockPendingApprovals.length,
      onPress: () => navigation.navigate('AdminApprovals'),
    },
    {
      id: '2',
      icon: 'account-cog',
      label: 'Manage Accounts',
      description: 'View and manage user accounts',
      onPress: () => navigation.navigate('AdminUserManagement'),
    },
    {
      id: '3',
      icon: 'alert',
      label: 'View Reports',
      description: 'Handle user reports and issues',
      color: theme.colors.error,
      badge: mockSystemStats.reports.pending,
      onPress: () => navigation.navigate('AdminReports'),
    },
    {
      id: '4',
      icon: 'chart-box',
      label: 'Analytics',
      description: 'View system analytics',
      color: theme.colors.secondary,
      onPress: () => navigation.navigate('AdminAnalytics'),
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <DashboardHeader
        profile={mockAdminProfile}
        notificationCount={mockNotifications.filter(n => !n.read).length}
        onNotificationPress={handleNotificationPress}
        onProfilePress={handleProfilePress}
        onSettingsPress={handleSettingsPress}
      />

      <SystemStats
        stats={mockSystemStats}
        onUserStatsPress={() => navigation.navigate('AdminUserManagement')}
        onTransactionStatsPress={() => navigation.navigate('AdminTransactions')}
        onReportStatsPress={() => navigation.navigate('AdminReports')}
      />
      
      <QuickActions actions={quickActions} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
