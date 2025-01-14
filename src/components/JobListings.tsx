import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, Chip, useTheme, Surface, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Job } from '../types/maid';

interface JobListingsProps {
  jobs: Job[];
  onJobPress: (jobId: string) => void;
  onApplyPress: (jobId: string) => void;
}

const JobListings: React.FC<JobListingsProps> = ({ jobs, onJobPress, onApplyPress }) => {
  const theme = useTheme();

  const formatPayRate = (job: Job) => {
    const amount = job.payRate.amount.toLocaleString();
    switch (job.payRate.type) {
      case 'hourly':
        return `UGX ${amount}/hr`;
      case 'daily':
        return `UGX ${amount}/day`;
      case 'monthly':
        return `UGX ${amount}/month`;
      default:
        return `UGX ${amount}`;
    }
  };

  return (
    <Surface style={[styles.container, { backgroundColor: theme.colors.background }]} elevation={1}>
      <View style={styles.header}>
        <Text variant="titleMedium">Available Jobs</Text>
        <Button mode="text" onPress={() => {}}>See All</Button>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        {jobs.map((job) => (
          <Card key={job.id} style={styles.jobCard} onPress={() => onJobPress(job.id)}>
            <Card.Content>
              <View style={styles.employerInfo}>
                <IconButton
                  icon="briefcase"
                  size={24}
                  style={{ backgroundColor: theme.colors.primaryContainer }}
                />
                <View style={styles.employerText}>
                  <Text variant="titleMedium">{job.title}</Text>
                  <Text variant="bodySmall" style={styles.employerName}>{job.employerName}</Text>
                </View>
              </View>

              <View style={styles.jobTypes}>
                {job.jobType.map((type, index) => (
                  <Chip
                    key={index}
                    style={styles.chip}
                    textStyle={{ fontSize: 12 }}
                  >
                    {type}
                  </Chip>
                ))}
              </View>

              <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                  <MaterialCommunityIcons name="map-marker" size={16} color={theme.colors.primary} />
                  <Text variant="bodySmall">{job.location.area}</Text>
                </View>
                <View style={styles.detailItem}>
                  <MaterialCommunityIcons name="clock" size={16} color={theme.colors.primary} />
                  <Text variant="bodySmall">
                    {job.workingHours.start} - {job.workingHours.end}
                  </Text>
                </View>
              </View>

              <View style={styles.payRate}>
                <Text variant="titleMedium" style={{ color: theme.colors.primary }}>
                  {formatPayRate(job)}
                </Text>
              </View>

              <Button
                mode="contained"
                onPress={() => onApplyPress(job.id)}
                style={styles.applyButton}
              >
                Apply Now
              </Button>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    margin: 16,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  scrollView: {
    marginHorizontal: -16,
  },
  jobCard: {
    width: 300,
    marginHorizontal: 8,
    marginBottom: 8,
  },
  employerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  employerText: {
    marginLeft: 8,
    flex: 1,
  },
  employerName: {
    opacity: 0.7,
  },
  jobTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    height: 24,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  payRate: {
    marginBottom: 12,
  },
  applyButton: {
    marginTop: 8,
  },
});

export default JobListings;
