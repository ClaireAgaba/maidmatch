import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { List, Text, Button, TextInput, useTheme, Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { authService } from '../services/authService';
import * as ImagePicker from 'expo-image-picker';

export function AccountSettingsScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // TODO: Implement account deletion
              await authService.deleteAccount();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete account. Please try again.');
            }
          },
        },
      ],
    );
  };

  const handleChangePhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        // TODO: Implement photo upload
        Alert.alert('Success', 'Profile photo updated successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile photo. Please try again.');
    }
  };

  const handleSaveChanges = async () => {
    try {
      // TODO: Implement save changes
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium">Account Settings</Text>
      </View>

      <View style={styles.photoSection}>
        <Avatar.Image
          size={100}
          source={{ uri: 'https://via.placeholder.com/100' }}
        />
        <Button
          mode="outlined"
          onPress={handleChangePhoto}
          style={styles.photoButton}
        >
          Change Photo
        </Button>
      </View>

      <List.Section>
        <List.Subheader>Contact Information</List.Subheader>
        
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          disabled={!isEditing}
          style={styles.input}
        />
        
        <TextInput
          label="Phone Number"
          value={phone}
          onChangeText={setPhone}
          disabled={!isEditing}
          style={styles.input}
        />
        
        <TextInput
          label="Location"
          value={location}
          onChangeText={setLocation}
          disabled={!isEditing}
          style={styles.input}
        />

        {!isEditing ? (
          <Button
            mode="contained"
            onPress={() => setIsEditing(true)}
            style={styles.button}
          >
            Edit Information
          </Button>
        ) : (
          <Button
            mode="contained"
            onPress={handleSaveChanges}
            style={styles.button}
          >
            Save Changes
          </Button>
        )}
      </List.Section>

      <List.Section>
        <List.Subheader>Account Actions</List.Subheader>
        
        <Button
          mode="outlined"
          onPress={handleLogout}
          icon="logout"
          style={styles.button}
        >
          Logout
        </Button>
        
        <Button
          mode="outlined"
          onPress={handleDeleteAccount}
          icon="delete"
          style={[styles.button, styles.deleteButton]}
          textColor={theme.colors.error}
        >
          Delete Account
        </Button>
      </List.Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
  },
  photoSection: {
    alignItems: 'center',
    padding: 16,
  },
  photoButton: {
    marginTop: 8,
  },
  input: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  button: {
    margin: 16,
  },
  deleteButton: {
    borderColor: 'red',
  },
});
