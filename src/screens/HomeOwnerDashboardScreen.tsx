import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, ImageBackground } from 'react-native';
import { Card, Title, Text, Button, useTheme, Surface, Avatar, IconButton } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { MaidPreferences } from '../components/MaidPreferences';
import { LinearGradient } from 'expo-linear-gradient';

type Props = NativeStackScreenProps<RootStackParamList, 'HomeOwnerDashboard'>;

export function HomeOwnerDashboardScreen({ navigation }: Props) {
  const theme = useTheme();
  const [employmentType, setEmploymentType] = useState<'temporary' | 'permanent'>('temporary');

  const handlePreferenceChange = (type: 'temporary' | 'permanent') => {
    setEmploymentType(type);
    navigation.navigate('AvailableMaids', { employmentType: type });
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
              <Text variant="bodyLarge" style={{ color: theme.colors.surface }}>Find your perfect maid today</Text>
            </View>
          </View>
        </LinearGradient>
      </Surface>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Surface style={[styles.actionItem, { backgroundColor: theme.colors.primaryContainer }]} elevation={2}>
          <IconButton icon="magnify" size={30} iconColor={theme.colors.primary} />
          <Text variant="labelMedium">Search Maids</Text>
        </Surface>
        <Surface style={[styles.actionItem, { backgroundColor: theme.colors.secondaryContainer }]} elevation={2}>
          <IconButton icon="calendar" size={30} iconColor={theme.colors.secondary} />
          <Text variant="labelMedium">Schedule</Text>
        </Surface>
        <Surface style={[styles.actionItem, { backgroundColor: theme.colors.tertiaryContainer }]} elevation={2}>
          <IconButton icon="message" size={30} iconColor={theme.colors.tertiary} />
          <Text variant="labelMedium">Messages</Text>
        </Surface>
      </View>

      <MaidPreferences onPreferenceChange={handlePreferenceChange} />

      {/* Main Content Cards */}
      <View style={styles.cardsContainer}>
        {/* Available Maids Card */}
        <Card style={styles.card} mode="elevated">
          <Card.Cover source={{ uri: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=500' }} />
          <Card.Content style={styles.cardContent}>
            <Title>Available Maids</Title>
            <Text variant="bodyMedium">Browse {employmentType} maids in your area</Text>
          </Card.Content>
          <Card.Actions style={styles.cardActions}>
            <Button 
              mode="contained"
              onPress={() => navigation.navigate('AvailableMaids', { employmentType })}
              style={styles.actionButton}
            >
              Browse Now
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
            <Text variant="bodyMedium">Complete your profile to improve matches</Text>
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

        {/* Requests Card */}
        <Card style={styles.card} mode="elevated">
          <Card.Content style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Avatar.Icon size={40} icon="file-document" style={{ backgroundColor: theme.colors.secondary }} />
              <Title style={styles.cardTitle}>My Requests</Title>
            </View>
            <Text variant="bodyMedium">Track your maid requests and applications</Text>
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
          <Card.Content style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Avatar.Icon size={40} icon="star" style={{ backgroundColor: theme.colors.tertiary }} />
              <Title style={styles.cardTitle}>Reviews</Title>
            </View>
            <Text variant="bodyMedium">Rate and review your experience</Text>
          </Card.Content>
          <Card.Actions style={styles.cardActions}>
            <Button 
              mode="outlined"
              onPress={() => navigation.navigate('Reviews')}
              style={styles.actionButton}
            >
              Manage Reviews
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
  },
  cardTitle: {
    marginLeft: 12,
  },
  cardActions: {
    padding: 8,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});
