import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { List, Divider, Text, useTheme, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { authService } from '../services/authService';

export function SettingsScreen() {
  const theme = useTheme();
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await authService.logout();
      // Navigation will be handled automatically by AuthNavigator
      // when it receives the authStateChanged event
    } catch (error) {
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            // TODO: Implement account deletion
            Alert.alert('Not Implemented', 'Account deletion is not yet implemented.');
          },
          style: 'destructive',
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Settings</Text>
      
      <List.Section>
        <List.Subheader>Account</List.Subheader>
        <List.Item
          title="Profile"
          left={props => <List.Icon {...props} icon="account" />}
          onPress={() => {}}
        />
        <List.Item
          title="Change Password"
          left={props => <List.Icon {...props} icon="lock" />}
          onPress={() => navigation.navigate('ChangePassword')}
        />
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader>Preferences</List.Subheader>
        <List.Item
          title="Notifications"
          left={props => <List.Icon {...props} icon="bell" />}
          onPress={() => {}}
        />
        <List.Item
          title="Language"
          left={props => <List.Icon {...props} icon="translate" />}
          onPress={() => {}}
        />
      </List.Section>

      <View style={styles.buttonContainer}>
        <Button
          mode="outlined"
          onPress={handleLogout}
          style={styles.logoutButton}
          icon="logout"
        >
          Logout
        </Button>

        <Button
          mode="outlined"
          onPress={handleDeleteAccount}
          style={[styles.deleteButton, { borderColor: theme.colors.error }]}
          textColor={theme.colors.error}
          icon="delete"
        >
          Delete Account
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    padding: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    padding: 16,
    gap: 16,
  },
  logoutButton: {
    marginTop: 'auto',
  },
  deleteButton: {
    marginTop: 8,
  },
});
