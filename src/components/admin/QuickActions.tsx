import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface, Text, TouchableRipple, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface QuickAction {
  id: string;
  icon: string;
  label: string;
  description: string;
  color?: string;
  badge?: number;
  onPress: () => void;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

const QuickActions: React.FC<QuickActionsProps> = ({ actions }) => {
  const theme = useTheme();

  return (
    <Surface style={[styles.container, { backgroundColor: theme.colors.background }]} elevation={1}>
      <Text variant="titleMedium" style={styles.title}>Quick Actions</Text>
      <View style={styles.grid}>
        {actions.map((action) => (
          <TouchableRipple
            key={action.id}
            style={[
              styles.actionItem,
              { backgroundColor: theme.colors.primaryContainer }
            ]}
            onPress={action.onPress}
          >
            <View style={styles.actionContent}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name={action.icon as any}
                  size={32}
                  color={action.color || theme.colors.primary}
                />
                {action.badge !== undefined && action.badge > 0 && (
                  <View style={[styles.badge, { backgroundColor: theme.colors.error }]}>
                    <Text style={[styles.badgeText, { color: theme.colors.onError }]}>
                      {action.badge}
                    </Text>
                  </View>
                )}
              </View>
              <Text variant="titleMedium" style={styles.actionLabel}>{action.label}</Text>
              <Text variant="bodySmall" style={styles.actionDescription}>
                {action.description}
              </Text>
            </View>
          </TouchableRipple>
        ))}
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  title: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionItem: {
    width: '48%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionContent: {
    padding: 16,
    alignItems: 'center',
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionLabel: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  actionDescription: {
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default QuickActions;
