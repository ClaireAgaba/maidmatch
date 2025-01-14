import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface, Text, TouchableRipple, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface QuickAction {
  id: string;
  icon: string;
  label: string;
  description: string;
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
            style={[styles.actionItem, { backgroundColor: theme.colors.primaryContainer }]}
            onPress={action.onPress}
          >
            <View style={styles.actionContent}>
              <MaterialCommunityIcons
                name={action.icon as any}
                size={32}
                color={theme.colors.primary}
              />
              <Text variant="labelLarge" style={styles.actionLabel}>{action.label}</Text>
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
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionItem: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    aspectRatio: 1,
  },
  actionContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    marginTop: 12,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  actionDescription: {
    marginTop: 4,
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default QuickActions;
