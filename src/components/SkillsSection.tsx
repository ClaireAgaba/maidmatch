import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface, useTheme, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Skill } from '../types/maid';

interface SkillsSectionProps {
  skills: Skill[];
  onEditPress?: () => void;
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ skills, onEditPress }) => {
  const theme = useTheme();

  return (
    <Surface style={[styles.container, { backgroundColor: theme.colors.background }]} elevation={1}>
      <View style={styles.header}>
        <Text variant="titleMedium">Skills & Services</Text>
        {onEditPress && (
          <IconButton
            icon="pencil"
            size={20}
            onPress={onEditPress}
          />
        )}
      </View>
      <View style={styles.skillsGrid}>
        {skills.map((skill) => (
          <Surface key={skill.id} style={[styles.skillItem, { backgroundColor: theme.colors.primaryContainer }]} elevation={2}>
            <MaterialCommunityIcons
              name={skill.icon as any}
              size={24}
              color={theme.colors.primary}
            />
            <Text variant="labelMedium" style={styles.skillName}>{skill.name}</Text>
            <Text variant="bodySmall" style={styles.skillDescription}>{skill.description}</Text>
          </Surface>
        ))}
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    margin: 16,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  skillItem: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '47%',
    aspectRatio: 1,
  },
  skillName: {
    marginTop: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  skillDescription: {
    marginTop: 4,
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default SkillsSection;
