import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface, Text, Switch, Button, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface AvailabilitySectionProps {
  isAvailable: boolean;
  onAvailabilityChange: (value: boolean) => void;
  selectedTypes: string[];
  onTypeChange: (type: string) => void;
}

const AvailabilitySection: React.FC<AvailabilitySectionProps> = ({
  isAvailable,
  onAvailabilityChange,
  selectedTypes,
  onTypeChange,
}) => {
  const theme = useTheme();

  return (
    <Surface style={[styles.container, { backgroundColor: theme.colors.background }]} elevation={1}>
      <View style={styles.availabilityRow}>
        <View style={styles.statusSection}>
          <MaterialCommunityIcons
            name={isAvailable ? 'account-check' : 'account-clock'}
            size={24}
            color={isAvailable ? theme.colors.primary : theme.colors.error}
          />
          <View style={styles.statusText}>
            <Text variant="titleMedium">Availability Status</Text>
            <Text variant="bodySmall" style={{ opacity: 0.7 }}>
              {isAvailable ? 'You are available for work' : 'You are not available'}
            </Text>
          </View>
        </View>
        <Switch
          value={isAvailable}
          onValueChange={onAvailabilityChange}
          color={theme.colors.primary}
        />
      </View>

      <View style={styles.divider} />

      <View style={styles.employmentSection}>
        <Text variant="titleMedium" style={styles.sectionTitle}>Employment Type</Text>
        <Text variant="bodySmall" style={styles.subtitle}>
          Select the types of work you're interested in
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            mode={selectedTypes.includes('temporary') ? 'contained' : 'outlined'}
            onPress={() => onTypeChange('temporary')}
            style={styles.typeButton}
          >
            Temporary
          </Button>
          <Button
            mode={selectedTypes.includes('permanent') ? 'contained' : 'outlined'}
            onPress={() => onTypeChange('permanent')}
            style={styles.typeButton}
          >
            Permanent
          </Button>
        </View>
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
  availabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusText: {
    marginLeft: 12,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 16,
  },
  employmentSection: {
    marginTop: 8,
  },
  sectionTitle: {
    marginBottom: 4,
  },
  subtitle: {
    opacity: 0.7,
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
  },
});

export default AvailabilitySection;
