import React, { useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import DashboardHeader from '../components/DashboardHeader';
import SkillsSection from '../components/SkillsSection';
import JobListings from '../components/JobListings';
import AvailabilitySection from '../components/AvailabilitySection';
import { mockMaidProfile, mockJobs, mockNotifications } from '../data/mockData';

type Props = NativeStackScreenProps<RootStackParamList, 'MaidDashboard'>;

export function MaidDashboardScreen({ navigation }: Props) {
  const theme = useTheme();
  const [isAvailable, setIsAvailable] = useState(true);
  const [employmentTypes, setEmploymentTypes] = useState<string[]>(['temporary']);

  const handleNotificationPress = () => {
    // TODO: Navigate to notifications
    navigation.navigate('Messages');
  };

  const handleJobPress = (jobId: string) => {
    // TODO: Navigate to job details
    navigation.navigate('MaidDetails', { maidId: jobId });
  };

  const handleApplyPress = (jobId: string) => {
    // TODO: Handle job application
    navigation.navigate('JobApplications');
  };

  const handleEditSkills = () => {
    // TODO: Navigate to skills edit screen
    navigation.navigate('Settings');
  };

  const handleEmploymentTypeChange = (type: string) => {
    setEmploymentTypes(current =>
      current.includes(type)
        ? current.filter(t => t !== type)
        : [...current, type]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <DashboardHeader
        fullName={mockMaidProfile.fullName}
        profilePicture={mockMaidProfile.photoUrl}
        verificationStatus={mockMaidProfile.verificationStatus}
        profileProgress={mockMaidProfile.profileProgress}
        notificationCount={mockNotifications.filter(n => !n.read).length}
        onNotificationPress={handleNotificationPress}
        earnings={{
          current: 80000,
          currency: 'UGX',
          period: 'month'
        }}
      />

      <AvailabilitySection
        isAvailable={isAvailable}
        onAvailabilityChange={setIsAvailable}
        selectedTypes={employmentTypes}
        onTypeChange={handleEmploymentTypeChange}
      />
      
      <SkillsSection
        skills={mockMaidProfile.skills}
        onEditPress={handleEditSkills}
      />

      <JobListings
        jobs={mockJobs}
        onJobPress={handleJobPress}
        onApplyPress={handleApplyPress}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
