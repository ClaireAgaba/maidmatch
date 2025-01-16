import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { RootStackScreenProps } from '../navigation/types';
import DashboardHeader from '../components/DashboardHeader';
import SkillsSection from '../components/SkillsSection';
import JobListings from '../components/JobListings';
import AvailabilitySection from '../components/AvailabilitySection';

type Props = RootStackScreenProps<'MaidDashboard'>;

const MaidDashboardScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <DashboardHeader
        userName="Jane Doe"
        role="Maid"
        onMenuPress={() => navigation.navigate('Settings')}
      />
      
      <AvailabilitySection />
      <SkillsSection />
      <JobListings />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MaidDashboardScreen;
