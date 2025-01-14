import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Avatar, Badge, ProgressBar, useTheme, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ImageSourcePropType } from 'react-native';

interface DashboardHeaderProps {
  fullName: string;
  profilePicture?: ImageSourcePropType;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  profileProgress: number;
  notificationCount: number;
  onNotificationPress: () => void;
  earnings: {
    current: number;
    currency: string;
    period: 'week' | 'month';
  };
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  fullName,
  profilePicture,
  verificationStatus,
  profileProgress,
  notificationCount,
  onNotificationPress,
  earnings
}) => {
  const theme = useTheme();
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return theme.colors.primary;
      case 'pending':
        return theme.colors.warning;
      case 'rejected':
        return theme.colors.error;
      default:
        return theme.colors.secondary;
    }
  };

  const renderAvatar = () => {
    if (profilePicture) {
      return (
        <Avatar.Image
          size={60}
          source={profilePicture}
        />
      );
    }
    return (
      <Avatar.Text
        size={60}
        label={getInitials(fullName)}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.topRow}>
        <View style={styles.profileSection}>
          {renderAvatar()}
          <View style={styles.nameSection}>
            <Text variant="titleMedium" style={styles.welcomeText}>Welcome back,</Text>
            <Text variant="headlineSmall" style={styles.nameText}>{fullName}</Text>
            <View style={styles.verificationBadge}>
              <MaterialCommunityIcons 
                name={verificationStatus === 'approved' ? 'check-circle' : 'clock-outline'} 
                size={16} 
                color={getStatusColor(verificationStatus)} 
              />
              <Text variant="labelMedium" style={{ color: getStatusColor(verificationStatus), marginLeft: 4 }}>
                {verificationStatus.charAt(0).toUpperCase() + verificationStatus.slice(1)}
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

      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text variant="labelMedium">Profile Completion</Text>
          <Text variant="labelMedium">{Math.round(profileProgress)}%</Text>
        </View>
        <ProgressBar 
          progress={profileProgress / 100} 
          color={theme.colors.primary} 
          style={styles.progressBar} 
        />
      </View>

      <View style={styles.earningsSection}>
        <Text variant="labelMedium" style={styles.earningsLabel}>
          {earnings.period === 'week' ? 'This Week' : 'This Month'}
        </Text>
        <Text variant="headlineMedium" style={styles.earningsAmount}>
          {earnings.currency} {earnings.current.toLocaleString()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameSection: {
    marginLeft: 12,
  },
  welcomeText: {
    opacity: 0.7,
  },
  nameText: {
    fontWeight: 'bold',
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  notificationSection: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  progressSection: {
    marginTop: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  earningsSection: {
    marginTop: 16,
    alignItems: 'center',
  },
  earningsLabel: {
    opacity: 0.7,
  },
  earningsAmount: {
    fontWeight: 'bold',
    marginTop: 4,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
});

export default DashboardHeader;
