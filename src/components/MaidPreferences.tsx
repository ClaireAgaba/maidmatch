import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, SegmentedButtons, Text } from 'react-native-paper';

type Props = {
  onPreferenceChange: (type: 'temporary' | 'permanent') => void;
};

export function MaidPreferences({ onPreferenceChange }: Props) {
  const [employmentType, setEmploymentType] = useState<'temporary' | 'permanent'>('temporary');

  const handleChange = (value: string) => {
    const type = value as 'temporary' | 'permanent';
    setEmploymentType(type);
    onPreferenceChange(type);
  };

  return (
    <Card style={styles.container}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.title}>
          What type of maid are you looking for?
        </Text>
        <SegmentedButtons
          value={employmentType}
          onValueChange={handleChange}
          buttons={[
            { value: 'temporary', label: 'Temporary' },
            { value: 'permanent', label: 'Permanent' },
          ]}
        />
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  title: {
    marginBottom: 16,
  },
});
