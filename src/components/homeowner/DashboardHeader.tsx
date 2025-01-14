import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Avatar, Badge, IconButton, useTheme, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { HomeownerProfile } from '../../types/homeowner';

interface DashboardHeaderProps {
  profile: HomeownerProfile;
  notificationCount: number;
  onNotificationPress: () => void;
  onProfilePress: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  profile,
  notificationCount,
  onNotificationPress,
  onProfilePress,
}) => {
  const theme = useTheme();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Surface style={[styles.container, { backgroundColor: theme.colors.background }]} elevation={1}>
      <View style={styles.topRow}>
        <View style={styles.profileSection}>
          {profile.photoUrl ? (
            <Avatar.Image
              size={50}
              source={{ uri: profile.photoUrl }}
              onTouchEnd={onProfilePress}
            />
          ) : (
            <Avatar.Text
              size={50}
              label={getInitials(profile.fullName)}
              onTouchEnd={onProfilePress}
            />
          )}
          <View style={styles.welcomeSection}>
            <Text variant="titleMedium" style={styles.welcomeText}>Welcome back,</Text>
            <Text variant="headlineSmall" style={styles.nameText}>{profile.fullName}</Text>
            <View style={styles.locationRow}>
              <MaterialCommunityIcons name="map-marker" size={16} color={theme.colors.primary} />
              <Text variant="bodySmall" style={styles.locationText}>
                {profile.location.area}, {profile.location.city}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.notificationSection}>
          <IconButton
            icon="bell"
            size={24}
            onPress={onNotificationPress}
          />
          {notificationCount > 0 && (
            <Badge style={styles.badge}>{notificationCount}</Badge>
          )}
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="briefcase-check" size={24} color={theme.colors.primary} />
          <Text variant="titleMedium" style={styles.statValue}>{profile.totalHires}</Text>
          <Text variant="bodySmall" style={styles.statLabel}>Total Hires</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="star" size={24} color={theme.colors.primary} />
          <Text variant="titleMedium" style={styles.statValue}>{profile.rating.toFixed(1)}</Text>
          <Text variant="bodySmall" style={styles.statLabel}>Rating</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="calendar-check" size={24} color={theme.colors.primary} />
          <Text variant="titleMedium" style={styles.statValue}>
            {new Date(profile.memberSince).getFullYear()}
          </Text>
          <Text variant="bodySmall" style={styles.statLabel}>Member Since</Text>
        </View>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  welcomeSection: {
    marginLeft: 12,
    flex: 1,
  },
  welcomeText: {
    opacity: 0.7,
  },
  nameText: {
    fontWeight: 'bold',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    marginLeft: 4,
    opacity: 0.7,
  },
  notificationSection: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontWeight: 'bold',
    marginTop: 4,
  },
  statLabel: {
    opacity: 0.7,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#eee',
  },
});

export default DashboardHeader;
