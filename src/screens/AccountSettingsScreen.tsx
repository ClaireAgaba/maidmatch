import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Card, Title, Text, Button, useTheme, TextInput, Avatar } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'AccountSettings'>;

export function AccountSettingsScreen({ navigation }: Props) {
  const theme = useTheme();
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [phone, setPhone] = useState('+256 123 456 789');
  const [address, setAddress] = useState('123 Main St, Kampala');

  const handleSave = () => {
    // TODO: Implement save functionality
    navigation.goBack();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Avatar.Icon 
          size={100} 
          icon="account-edit" 
          style={{ backgroundColor: theme.colors.primary }}
        />
        <Title style={styles.headerTitle}>Account Settings</Title>
      </View>

      <Card style={styles.section}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Personal Information</Title>
          
          <TextInput
            label="Full Name"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            style={styles.input}
          />

          <TextInput
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            mode="outlined"
            keyboardType="phone-pad"
            style={styles.input}
          />

          <TextInput
            label="Address"
            value={address}
            onChangeText={setAddress}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.input}
          />
        </Card.Content>
      </Card>

      <Card style={styles.section}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Security</Title>
          <Button 
            mode="outlined"
            onPress={() => {/* TODO: Implement */}}
            style={styles.button}
          >
            Change Password
          </Button>
          <Button 
            mode="outlined"
            onPress={() => {/* TODO: Implement */}}
            style={styles.button}
          >
            Enable Two-Factor Authentication
          </Button>
        </Card.Content>
      </Card>

      <View style={styles.actions}>
        <Button 
          mode="contained"
          onPress={handleSave}
          style={styles.saveButton}
        >
          Save Changes
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 24,
  },
  headerTitle: {
    marginTop: 16,
  },
  section: {
    margin: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginBottom: 12,
  },
  actions: {
    padding: 16,
    paddingBottom: 32,
  },
  saveButton: {
    padding: 8,
  },
});
