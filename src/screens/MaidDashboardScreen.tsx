import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Card, Title, Text, Button, Switch, useTheme, Surface, Avatar, IconButton } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { LinearGradient } from 'expo-linear-gradient';

type Props = NativeStackScreenProps<RootStackParamList, 'MaidDashboard'>;

export function MaidDashboardScreen({ navigation }: Props) {
  const theme = useTheme();
  const [isAvailable, setIsAvailable] = useState(true);
  const [employmentTypes, setEmploymentTypes] = useState<string[]>(['temporary']);

  const handleEmploymentTypeChange = (value: string) => {
    if (employmentTypes.includes(value)) {
      setEmploymentTypes(employmentTypes.filter(type => type !== value));
    } else {
      setEmploymentTypes([...employmentTypes, value]);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header Section */}
      <Surface style={styles.header} elevation={4}>
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <Avatar.Icon size={60} icon="account" style={{ backgroundColor: theme.colors.surface }} />
            <View style={styles.headerText}>
              <Text variant="headlineSmall" style={{ color: theme.colors.surface }}>Welcome Back!</Text>
              <Text variant="bodyLarge" style={{ color: theme.colors.surface }}>
                {isAvailable ? 'You are available for work' : 'You are not available'}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </Surface>

      {/* Quick Stats */}
      <View style={styles.quickStats}>
        <Surface style={[styles.statItem, { backgroundColor: theme.colors.primaryContainer }]} elevation={2}>
          <IconButton icon="briefcase" size={30} iconColor={theme.colors.primary} />
          <Text variant="labelMedium">Active Jobs</Text>
          <Text variant="titleLarge" style={{ color: theme.colors.primary }}>2</Text>
        </Surface>
        <Surface style={[styles.statItem, { backgroundColor: theme.colors.secondaryContainer }]} elevation={2}>
          <IconButton icon="star" size={30} iconColor={theme.colors.secondary} />
          <Text variant="labelMedium">Rating</Text>
          <Text variant="titleLarge" style={{ color: theme.colors.secondary }}>4.8</Text>
        </Surface>
        <Surface style={[styles.statItem, { backgroundColor: theme.colors.tertiaryContainer }]} elevation={2}>
          <IconButton icon="clock" size={30} iconColor={theme.colors.tertiary} />
          <Text variant="labelMedium">Hours</Text>
          <Text variant="titleLarge" style={{ color: theme.colors.tertiary }}>32</Text>
        </Surface>
      </View>

      {/* Availability Card */}
      <View style={styles.cardsContainer}>
        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <View style={styles.cardHeader}>
              <Avatar.Icon size={40} icon="account-clock" style={{ backgroundColor: theme.colors.primary }} />
              <Title style={styles.cardTitle}>Availability Status</Title>
            </View>
            <View style={styles.availabilityContainer}>
              <Text variant="bodyLarge">
                {isAvailable ? 'You are available for work' : 'You are not available'}
              </Text>
              <Switch
                value={isAvailable}
                onValueChange={setIsAvailable}
                color={theme.colors.primary}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Employment Type Card */}
        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <View style={styles.cardHeader}>
              <Avatar.Icon size={40} icon="briefcase-variant" style={{ backgroundColor: theme.colors.secondary }} />
              <Title style={styles.cardTitle}>Employment Type</Title>
            </View>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Select the types of work you're interested in
            </Text>
            <View style={styles.employmentTypes}>
              <Button
                mode={employmentTypes.includes('temporary') ? 'contained' : 'outlined'}
                onPress={() => handleEmploymentTypeChange('temporary')}
                style={styles.typeButton}
              >
                Temporary
              </Button>
              <Button
                mode={employmentTypes.includes('permanent') ? 'contained' : 'outlined'}
                onPress={() => handleEmploymentTypeChange('permanent')}
                style={styles.typeButton}
              >
                Permanent
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Profile Card */}
        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <View style={styles.cardHeader}>
              <Avatar.Icon size={40} icon="account-cog" style={{ backgroundColor: theme.colors.primary }} />
              <Title style={styles.cardTitle}>My Profile</Title>
            </View>
            <Text variant="bodyMedium">Keep your profile updated to get more jobs</Text>
          </Card.Content>
          <Card.Actions style={styles.cardActions}>
            <Button 
              mode="outlined"
              onPress={() => navigation.navigate('MaidProfile')}
              style={styles.actionButton}
            >
              Edit Profile
            </Button>
          </Card.Actions>
        </Card>

        {/* Job Requests Card */}
        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <View style={styles.cardHeader}>
              <Avatar.Icon size={40} icon="file-document" style={{ backgroundColor: theme.colors.secondary }} />
              <Title style={styles.cardTitle}>Job Requests</Title>
            </View>
            <Text variant="bodyMedium">View and manage your job requests</Text>
          </Card.Content>
          <Card.Actions style={styles.cardActions}>
            <Button 
              mode="outlined"
              onPress={() => navigation.navigate('JobApplications')}
              style={styles.actionButton}
            >
              View Requests
            </Button>
          </Card.Actions>
        </Card>

        {/* Reviews Card */}
        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <View style={styles.cardHeader}>
              <Avatar.Icon size={40} icon="star" style={{ backgroundColor: theme.colors.tertiary }} />
              <Title style={styles.cardTitle}>My Reviews</Title>
            </View>
            <Text variant="bodyMedium">See what employers are saying about you</Text>
          </Card.Content>
          <Card.Actions style={styles.cardActions}>
            <Button 
              mode="outlined"
              onPress={() => navigation.navigate('Reviews')}
              style={styles.actionButton}
            >
              View Reviews
            </Button>
          </Card.Actions>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 180,
    overflow: 'hidden',
  },
  headerGradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-end',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 16,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: -30,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  statItem: {
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    width: '30%',
  },
  cardsContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    marginLeft: 12,
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  subtitle: {
    marginBottom: 16,
  },
  employmentTypes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  typeButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  cardActions: {
    padding: 8,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});
