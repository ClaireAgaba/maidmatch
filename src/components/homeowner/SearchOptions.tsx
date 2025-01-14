import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface, Text, TouchableRipple, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface SearchOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  onPress: () => void;
}

interface SearchOptionsProps {
  options: SearchOption[];
}

const SearchOptions: React.FC<SearchOptionsProps> = ({ options }) => {
  const theme = useTheme();

  return (
    <Surface style={[styles.container, { backgroundColor: theme.colors.background }]} elevation={1}>
      <Text variant="titleMedium" style={styles.title}>Find Your Perfect Match</Text>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableRipple
            key={option.id}
            style={[
              styles.optionCard,
              { backgroundColor: theme.colors.primaryContainer }
            ]}
            onPress={option.onPress}
          >
            <View style={styles.optionContent}>
              <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary }]}>
                <MaterialCommunityIcons
                  name={option.icon as any}
                  size={32}
                  color={theme.colors.surface}
                />
              </View>
              <View style={styles.textContainer}>
                <Text variant="titleMedium" style={styles.optionTitle}>
                  {option.title}
                </Text>
                <Text variant="bodySmall" style={styles.optionDescription}>
                  {option.description}
                </Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color={theme.colors.primary}
              />
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
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  optionTitle: {
    fontWeight: 'bold',
  },
  optionDescription: {
    marginTop: 4,
    opacity: 0.7,
  },
});

export default SearchOptions;
