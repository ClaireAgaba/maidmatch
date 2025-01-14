import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import DashboardHeader from '../components/homeowner/DashboardHeader';
import QuickActions from '../components/homeowner/QuickActions';
import SearchOptions from '../components/homeowner/SearchOptions';
import { mockHomeownerProfile, mockNotifications } from '../data/homeownerMockData';

type Props = NativeStackScreenProps<RootStackParamList, 'HomeOwnerDashboard'>;

export function HomeOwnerDashboardScreen({ navigation }: Props) {
  const theme = useTheme();

  const handleNotificationPress = () => {
    // TODO: Navigate to notifications
    navigation.navigate('Messages');
  };

  const handleProfilePress = () => {
    navigation.navigate('HomeOwnerProfile');
  };

  const quickActions = [
    {
      id: '1',
      icon: 'file-document-outline',
      label: 'My Requests',
      description: 'View and manage your maid requests',
      onPress: () => navigation.navigate('JobApplications'),
    },
    {
      id: '2',
      icon: 'cash-multiple',
      label: 'Payments',
      description: 'Track payments and transactions',
      onPress: () => navigation.navigate('Settings'),
    },
    {
      id: '3',
      icon: 'star-outline',
      label: 'Reviews',
      description: 'Rate and review your maids',
      onPress: () => navigation.navigate('Reviews'),
    },
    {
      id: '4',
      icon: 'help-circle-outline',
      label: 'Support',
      description: 'Get help and contact support',
      onPress: () => navigation.navigate('Settings'),
    },
  ];

  const searchOptions = [
    {
      id: '1',
      title: 'Hire Temporary Maid',
      description: 'Quick hire for immediate assistance',
      icon: 'clock-fast',
      onPress: () => navigation.navigate('AvailableMaids', { employmentType: 'temporary' }),
    },
    {
      id: '2',
      title: 'Find Permanent Maid',
      description: 'Browse profiles for long-term help',
      icon: 'account-search',
      onPress: () => navigation.navigate('AvailableMaids', { employmentType: 'permanent' }),
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <DashboardHeader
        profile={mockHomeownerProfile}
        notificationCount={mockNotifications.filter(n => !n.read).length}
        onNotificationPress={handleNotificationPress}
        onProfilePress={handleProfilePress}
      />

      <SearchOptions options={searchOptions} />
      
      <QuickActions actions={quickActions} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
