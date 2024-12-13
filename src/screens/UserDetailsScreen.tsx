import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Avatar, Card, List, useTheme } from 'react-native-paper';
import { authService } from '../services/authService';

interface UserDetails {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  role: 'maid' | 'homeowner';
  profilePicture?: string;
  rating?: number;
  totalJobs?: number;
  completedJobs?: number;
  memberSince: string;
}

export function UserDetailsScreen() {
  const theme = useTheme();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  useEffect(() => {
    loadUserDetails();
  }, []);

  const loadUserDetails = async () => {
    try {
      const user = await authService.getCurrentUser();
      setUserDetails(user);
    } catch (error) {
      console.error('Error loading user details:', error);
    }
  };

  if (!userDetails) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Image
          size={120}
          source={
            userDetails.profilePicture
              ? { uri: userDetails.profilePicture }
              : require('../assets/default-avatar.png')
          }
        />
        <Text variant="headlineMedium" style={styles.name}>
          {userDetails.fullName}
        </Text>
        <Text variant="bodyLarge" style={styles.role}>
          {userDetails.role.charAt(0).toUpperCase() + userDetails.role.slice(1)}
        </Text>
      </View>

      {userDetails.role === 'maid' && (
        <Card style={styles.statsCard}>
          <Card.Content style={styles.statsContent}>
            <View style={styles.statItem}>
              <Text variant="headlineMedium">{userDetails.rating?.toFixed(1) || '-'}</Text>
              <Text variant="bodyMedium">Rating</Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="headlineMedium">{userDetails.completedJobs || 0}</Text>
              <Text variant="bodyMedium">Completed Jobs</Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="headlineMedium">{userDetails.totalJobs || 0}</Text>
              <Text variant="bodyMedium">Total Jobs</Text>
            </View>
          </Card.Content>
        </Card>
      )}

      <List.Section>
        <List.Subheader>Contact Information</List.Subheader>
        <List.Item
          title="Email"
          description={userDetails.email}
          left={props => <List.Icon {...props} icon="email" />}
        />
        <List.Item
          title="Phone"
          description={userDetails.phone}
          left={props => <List.Icon {...props} icon="phone" />}
        />
        <List.Item
          title="Location"
          description={userDetails.location}
          left={props => <List.Icon {...props} icon="map-marker" />}
        />
      </List.Section>

      <List.Section>
        <List.Subheader>Account Information</List.Subheader>
        <List.Item
          title="Member Since"
          description={new Date(userDetails.memberSince).toLocaleDateString()}
          left={props => <List.Icon {...props} icon="calendar" />}
        />
      </List.Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f5f5f5',
  },
  name: {
    marginTop: 16,
    fontWeight: 'bold',
  },
  role: {
    marginTop: 4,
    color: '#666',
  },
  statsCard: {
    margin: 16,
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
});
