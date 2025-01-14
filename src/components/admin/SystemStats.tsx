import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface, Text, useTheme, TouchableRipple } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { SystemStats as SystemStatsType } from '../../types/admin';

interface SystemStatsProps {
  stats: SystemStatsType;
  onUserStatsPress: () => void;
  onTransactionStatsPress: () => void;
  onReportStatsPress: () => void;
}

const SystemStatsDisplay: React.FC<SystemStatsProps> = ({
  stats,
  onUserStatsPress,
  onTransactionStatsPress,
  onReportStatsPress,
}) => {
  const theme = useTheme();

  const StatCard = ({ 
    title, 
    icon, 
    mainStat, 
    subStats,
    onPress,
    color = theme.colors.primary 
  }: {
    title: string;
    icon: string;
    mainStat: { label: string; value: number | string };
    subStats: { label: string; value: number; color?: string }[];
    onPress: () => void;
    color?: string;
  }) => (
    <TouchableRipple onPress={onPress}>
      <Surface style={[styles.card, { backgroundColor: theme.colors.background }]} elevation={1}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name={icon as any} size={24} color={color} />
          <Text variant="titleMedium" style={styles.cardTitle}>{title}</Text>
        </View>
        <View style={styles.mainStat}>
          <Text variant="displaySmall" style={[styles.mainStatValue, { color }]}>
            {mainStat.value}
          </Text>
          <Text variant="bodySmall" style={styles.mainStatLabel}>
            {mainStat.label}
          </Text>
        </View>
        <View style={styles.subStats}>
          {subStats.map((stat, index) => (
            <View key={index} style={styles.subStat}>
              <Text variant="titleMedium" style={{ color: stat.color || color }}>
                {stat.value}
              </Text>
              <Text variant="bodySmall" style={styles.subStatLabel}>
                {stat.label}
              </Text>
            </View>
          ))}
        </View>
      </Surface>
    </TouchableRipple>
  );

  return (
    <View style={styles.container}>
      <StatCard
        title="User Accounts"
        icon="account-group"
        mainStat={{ label: 'Total Users', value: stats.users.total }}
        subStats={[
          { 
            label: 'Pending', 
            value: stats.users.maids.pending + stats.users.homeowners.pending,
            color: theme.colors.warning 
          },
          { 
            label: 'Suspended', 
            value: stats.users.maids.suspended + stats.users.homeowners.suspended,
            color: theme.colors.error 
          }
        ]}
        onPress={onUserStatsPress}
      />

      <StatCard
        title="Transactions"
        icon="cash-multiple"
        color={theme.colors.secondary}
        mainStat={{ 
          label: 'Total Amount', 
          value: `UGX ${(stats.transactions.totalAmount / 1000000).toFixed(1)}M` 
        }}
        subStats={[
          { label: 'Pending', value: stats.transactions.pending },
          { label: 'Disputed', value: stats.transactions.disputed }
        ]}
        onPress={onTransactionStatsPress}
      />

      <StatCard
        title="Reports"
        icon="alert-circle"
        color={theme.colors.error}
        mainStat={{ label: 'Total Reports', value: stats.reports.total }}
        subStats={[
          { label: 'Pending', value: stats.reports.pending },
          { label: 'Resolved', value: stats.reports.resolved }
        ]}
        onPress={onReportStatsPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  card: {
    padding: 16,
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    marginLeft: 8,
    fontWeight: 'bold',
  },
  mainStat: {
    alignItems: 'center',
    marginBottom: 16,
  },
  mainStatValue: {
    fontWeight: 'bold',
  },
  mainStatLabel: {
    opacity: 0.7,
  },
  subStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  subStat: {
    alignItems: 'center',
  },
  subStatLabel: {
    opacity: 0.7,
  },
});

export default SystemStatsDisplay;
