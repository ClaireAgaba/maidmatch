import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { List, Text, Button, TextInput, useTheme, Avatar } from 'react-native-paper';
import type { RootStackScreenProps } from '../navigation/types';
import { authService } from '../services/authService';
import * as ImagePicker from 'expo-image-picker';

type Props = RootStackScreenProps<'AccountSettings'>;

interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  avatar?: string;
  role: 'maid' | 'homeowner' | 'admin';
}

const mockProfile: UserProfile = {
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+256 123 456 789',
  location: 'Kampala, Uganda',
  role: 'homeowner',
};

const AccountSettingsScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(mockProfile);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: Implement profile update API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please grant camera roll permissions to change your profile picture.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setProfile(prev => ({
          ...prev,
          avatar: result.assets[0].uri,
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>Account Settings</Text>
        
        <View style={styles.avatarContainer}>
          {profile.avatar ? (
            <Avatar.Image
              size={80}
              source={{ uri: profile.avatar }}
            />
          ) : (
            <Avatar.Text
              size={80}
              label={getInitials(profile.fullName)}
            />
          )}
          <Button
            mode="text"
            onPress={handlePickImage}
            style={styles.changeAvatarButton}
          >
            Change Photo
          </Button>
        </View>
      </View>

      <View style={styles.form}>
        <TextInput
          label="Full Name"
          value={profile.fullName}
          onChangeText={value => setProfile(prev => ({ ...prev, fullName: value }))}
          mode="outlined"
          disabled={!isEditing}
          style={styles.input}
        />

        <TextInput
          label="Email"
          value={profile.email}
          onChangeText={value => setProfile(prev => ({ ...prev, email: value }))}
          mode="outlined"
          disabled={!isEditing}
          keyboardType="email-address"
          style={styles.input}
        />

        <TextInput
          label="Phone Number"
          value={profile.phone}
          onChangeText={value => setProfile(prev => ({ ...prev, phone: value }))}
          mode="outlined"
          disabled={!isEditing}
          keyboardType="phone-pad"
          style={styles.input}
        />

        <TextInput
          label="Location"
          value={profile.location}
          onChangeText={value => setProfile(prev => ({ ...prev, location: value }))}
          mode="outlined"
          disabled={!isEditing}
          style={styles.input}
        />

        <View style={styles.buttonContainer}>
          {isEditing ? (
            <>
              <Button
                mode="contained"
                onPress={handleSave}
                loading={loading}
                style={[styles.button, { backgroundColor: theme.colors.primary }]}
              >
                Save Changes
              </Button>
              <Button
                mode="outlined"
                onPress={() => {
                  setIsEditing(false);
                  setProfile(mockProfile);
                }}
                style={styles.button}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              mode="contained"
              onPress={() => setIsEditing(true)}
              style={[styles.button, { backgroundColor: theme.colors.primary }]}
            >
              Edit Profile
            </Button>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    alignItems: 'center',
  },
  title: {
    marginBottom: 24,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  changeAvatarButton: {
    marginTop: 8,
  },
  form: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  buttonContainer: {
    gap: 8,
    marginTop: 8,
  },
  button: {
    paddingVertical: 8,
  },
});

export default AccountSettingsScreen;
