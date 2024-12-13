import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { Card, Title, Text, Button, useTheme, Surface, Avatar, IconButton, Badge } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { MaidPreferences } from '../components/MaidPreferences';
import { LinearGradient } from 'expo-linear-gradient';
import { authService } from '../services/authService';
import { jobService } from '../services/jobService';
import { messageService } from '../services/messageService';
import DashboardHeader from '../components/DashboardHeader';

type Props = NativeStackScreenProps<RootStackParamList, 'HomeOwnerDashboard'>;

interface DashboardStats {
  activeJobs: number;
  pendingApplications: number;
  unreadMessages: number;
}

interface User {
  fullName: string;
  profilePicture?: string;
}

export function HomeOwnerDashboardScreen({ navigation }: Props) {
  const theme = useTheme();
  const [employmentType, setEmploymentType] = useState<'temporary' | 'permanent'>('temporary');
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    activeJobs: 0,
    pendingApplications: 0,
    unreadMessages: 0
  });

  useEffect(() => {
    loadUserData();
    fetchDashboardData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      // Fetch active jobs
      const jobs = await jobService.getJobs();
      const activeJobsCount = jobs.filter((job: any) => job.status === 'active').length;

      // Fetch pending applications
      const applications = await jobService.getJobApplications('all');
      const pendingCount = applications.filter((app: any) => app.status === 'pending').length;

      // Fetch unread messages
      const conversations = await messageService.getAllConversations();
      const unreadCount = conversations.reduce((acc: number, conv: any) => 
        acc + (conv.unreadCount || 0), 0);

      setStats({
        activeJobs: activeJobsCount,
        pendingApplications: pendingCount,
        unreadMessages: unreadCount
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const handlePreferenceChange = (type: 'temporary' | 'permanent') => {
    setEmploymentType(type);
    navigation.navigate('AvailableMaids', { employmentType: type });
  };

  if (!user) {
    return null; // Or a loading spinner
  }

  return (
    <View style={styles.container}>
      <DashboardHeader
        fullName={user.fullName}
        profilePicture={user.profilePicture}
        rightIcon={
          <IconButton
            icon="cog"
            size={24}
            onPress={() => navigation.navigate('Settings')}
          />
        }
      />
      
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Surface style={[styles.actionItem, { backgroundColor: theme.colors.primaryContainer }]} elevation={2}>
            <IconButton 
              icon="magnify" 
              size={30} 
              iconColor={theme.colors.primary}
              onPress={() => navigation.navigate('AvailableMaids', { employmentType })}
            />
            <Text variant="labelMedium">Search Maids</Text>
          </Surface>
          <Surface style={[styles.actionItem, { backgroundColor: theme.colors.secondaryContainer }]} elevation={2}>
            <View>
              <IconButton 
                icon="calendar" 
                size={30} 
                iconColor={theme.colors.secondary}
                onPress={() => navigation.navigate('JobApplications')}
              />
              {stats.pendingApplications > 0 && (
                <Badge style={styles.badge}>{stats.pendingApplications}</Badge>
              )}
            </View>
            <Text variant="labelMedium">Applications</Text>
          </Surface>
          <Surface style={[styles.actionItem, { backgroundColor: theme.colors.tertiaryContainer }]} elevation={2}>
            <View>
              <IconButton 
                icon="message" 
                size={30} 
                iconColor={theme.colors.tertiary}
                onPress={() => navigation.navigate('Messages')}
              />
              {stats.unreadMessages > 0 && (
                <Badge style={styles.badge}>{stats.unreadMessages}</Badge>
              )}
            </View>
            <Text variant="labelMedium">Messages</Text>
          </Surface>
        </View>

        <MaidPreferences onPreferenceChange={handlePreferenceChange} />

        {/* Main Content Cards */}
        <View style={styles.cardsContainer}>
          {/* Active Jobs Card */}
          <Card style={styles.card} mode="elevated">
            <Card.Content style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Avatar.Icon size={40} icon="briefcase" style={{ backgroundColor: theme.colors.primary }} />
                <Title style={styles.cardTitle}>Active Jobs</Title>
                {stats.activeJobs > 0 && (
                  <Badge style={[styles.badge, styles.cardBadge]}>{stats.activeJobs}</Badge>
                )}
              </View>
              <Text variant="bodyMedium">
                {stats.activeJobs > 0 
                  ? `You have ${stats.activeJobs} active job posting${stats.activeJobs > 1 ? 's' : ''}`
                  : 'Post your first job to find a maid'}
              </Text>
            </Card.Content>
            <Card.Actions style={styles.cardActions}>
              <Button 
                mode="contained"
                onPress={() => navigation.navigate('PostJob')}
                style={styles.actionButton}
              >
                Post New Job
              </Button>
            </Card.Actions>
          </Card>

          {/* Profile Card */}
          <Card style={styles.card} mode="elevated">
            <Card.Content style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Avatar.Icon size={40} icon="account-cog" style={{ backgroundColor: theme.colors.primary }} />
                <Title style={styles.cardTitle}>My Profile</Title>
              </View>
              <Text variant="bodyMedium">
                {user?.profileCompleted 
                  ? 'Keep your profile updated to get better matches'
                  : 'Complete your profile to improve matches'}
              </Text>
            </Card.Content>
            <Card.Actions style={styles.cardActions}>
              <Button 
                mode="outlined"
                onPress={() => navigation.navigate('HomeOwnerProfile')}
                style={styles.actionButton}
              >
                Edit Profile
              </Button>
            </Card.Actions>
          </Card>

          {/* Applications Card */}
          <Card style={styles.card} mode="elevated">
            <Card.Content style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Avatar.Icon size={40} icon="file-document" style={{ backgroundColor: theme.colors.secondary }} />
                <Title style={styles.cardTitle}>Applications</Title>
                {stats.pendingApplications > 0 && (
                  <Badge style={[styles.badge, styles.cardBadge]}>{stats.pendingApplications}</Badge>
                )}
              </View>
              <Text variant="bodyMedium">
                {stats.pendingApplications > 0
                  ? `You have ${stats.pendingApplications} pending application${stats.pendingApplications > 1 ? 's' : ''}`
                  : 'No pending applications'}
              </Text>
            </Card.Content>
            <Card.Actions style={styles.cardActions}>
              <Button 
                mode="outlined"
                onPress={() => navigation.navigate('JobApplications')}
                style={styles.actionButton}
              >
                View Applications
              </Button>
            </Card.Actions>
          </Card>

          {/* Messages Card */}
          <Card style={styles.card} mode="elevated">
            <Card.Content style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Avatar.Icon size={40} icon="message" style={{ backgroundColor: theme.colors.tertiary }} />
                <Title style={styles.cardTitle}>Messages</Title>
                {stats.unreadMessages > 0 && (
                  <Badge style={[styles.badge, styles.cardBadge]}>{stats.unreadMessages}</Badge>
                )}
              </View>
              <Text variant="bodyMedium">
                {stats.unreadMessages > 0
                  ? `You have ${stats.unreadMessages} unread message${stats.unreadMessages > 1 ? 's' : ''}`
                  : 'No new messages'}
              </Text>
            </Card.Content>
            <Card.Actions style={styles.cardActions}>
              <Button 
                mode="outlined"
                onPress={() => navigation.navigate('Messages')}
                style={styles.actionButton}
              >
                View Messages
              </Button>
            </Card.Actions>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: -30,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  actionItem: {
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
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  cardTitle: {
    marginLeft: 12,
    flex: 1,
  },
  cardActions: {
    padding: 8,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  cardBadge: {
    position: 'relative',
    top: 0,
    right: 0,
    marginLeft: 8,
  },
});
