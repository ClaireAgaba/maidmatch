import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'HomeOwnerSignup'>;

export function HomeOwnerSignupScreen({ navigation }: Props) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    requirements: '',
  });

  const handleSubmit = () => {
    // TODO: Implement form submission
    console.log('Form submitted:', formData);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <TextInput
          label="Full Name"
          value={formData.fullName}
          onChangeText={(text) => setFormData({ ...formData, fullName: text })}
          style={styles.input}
        />
        <TextInput
          label="Email"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          keyboardType="email-address"
          style={styles.input}
        />
        <TextInput
          label="Phone Number"
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          keyboardType="phone-pad"
          style={styles.input}
        />
        <TextInput
          label="Address"
          value={formData.address}
          onChangeText={(text) => setFormData({ ...formData, address: text })}
          multiline
          numberOfLines={3}
          style={styles.input}
        />
        <TextInput
          label="Requirements"
          value={formData.requirements}
          onChangeText={(text) => setFormData({ ...formData, requirements: text })}
          multiline
          numberOfLines={4}
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.button}
        >
          Sign Up
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 24,
  },
});
