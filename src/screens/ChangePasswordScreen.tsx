import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { authService } from '../services/authService';

const ChangePasswordScreen = () => {
  const navigation = useNavigation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validatePassword = () => {
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleChangePassword = async () => {
    try {
      if (!validatePassword()) return;

      setLoading(true);
      setError('');

      await authService.changePassword(currentPassword, newPassword);

      // Get user role to navigate to appropriate dashboard
      const user = await authService.getCurrentUser();
      if (user?.role === 'maid') {
        navigation.replace('MaidDashboard');
      } else if (user?.role === 'homeowner') {
        navigation.replace('HomeownerDashboard');
      } else if (user?.role === 'admin') {
        navigation.replace('AdminDashboard');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Password</Text>
      <Text style={styles.subtitle}>
        For security reasons, you must change your password before continuing.
      </Text>

      <TextInput
        label="Current Password"
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Confirm New Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        mode="outlined"
        style={styles.input}
      />

      <HelperText type="error" visible={!!error}>
        {error}
      </HelperText>

      <Button
        mode="contained"
        onPress={handleChangePassword}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        Change Password
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
});

export default ChangePasswordScreen;
