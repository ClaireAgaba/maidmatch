import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface, Text, Avatar, Badge, IconButton, useTheme, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AdminProfile } from '../../types/admin';

interface DashboardHeaderProps {
  profile: AdminProfile;
  notificationCount: number;
  onNotificationPress: () => void;
  onProfilePress: () => void;
  onSettingsPress: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  profile,
  notificationCount,
  onNotificationPress,
  onProfilePress,
  onSettingsPress,
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
          <Avatar.Text
            size={50}
            label={getInitials(profile.fullName)}
            onTouchEnd={onProfilePress}
          />
          <View style={styles.welcomeSection}>
            <Text variant="titleMedium" style={styles.welcomeText}>Welcome back,</Text>
            <Text variant="headlineSmall" style={styles.nameText}>{profile.fullName}</Text>
            <View style={styles.roleSection}>
              <Chip
                mode="flat"
                style={[
                  styles.roleChip,
                  { backgroundColor: theme.colors.primaryContainer }
                ]}
              >
                {profile.role === 'super_admin' ? 'Super Admin' : 'Admin'}
              </Chip>
              {profile.twoFactorEnabled && (
                <MaterialCommunityIcons
                  name="shield-check"
                  size={16}
                  color={theme.colors.primary}
                  style={styles.securityIcon}
                />
              )}
            </View>
          </View>
        </View>

        <View style={styles.actionsSection}>
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
          <IconButton
            icon="cog"
            size={24}
            onPress={onSettingsPress}
          />
        </View>
      </View>

      <View style={styles.lastLoginSection}>
        <MaterialCommunityIcons
          name="clock-outline"
          size={16}
          color={theme.colors.onSurfaceVariant}
        />
        <Text variant="bodySmall" style={styles.lastLoginText}>
          Last login: {new Date(profile.lastLogin).toLocaleString()}
        </Text>
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
  roleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  roleChip: {
    height: 24,
  },
  securityIcon: {
    marginLeft: 8,
  },
  actionsSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationSection: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  lastLoginSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    opacity: 0.7,
  },
  lastLoginText: {
    marginLeft: 4,
  },
});

export default DashboardHeader;
