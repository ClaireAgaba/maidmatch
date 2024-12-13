import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { authService } from '../services/authService';

export const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      console.log('Starting login process...', { email });
      setLoading(true);
      setError('');

      const response = await authService.login({ email, password });
      console.log('Login response:', response);
      
      if (!response) {
        throw new Error('No response from login');
      }

      // Store user data in AsyncStorage
      await authService.storeUserData(response);
      console.log('User data stored successfully');

      // Handle navigation based on user role
      if (response.user.role === 'admin') {
        console.log('Admin user detected, navigating to admin dashboard');
        // @ts-ignore
        navigation.reset({
          index: 0,
          routes: [{ name: 'AdminDashboard' }],
        });
      } else {
        // Trigger auth state update for other users
        await authService.updateAuthState();
      }
      
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    // @ts-ignore - Navigation typing issue
    navigation.navigate('Welcome');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to MaidMatch</Text>
      
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry
        style={styles.input}
      />

      {error ? <HelperText type="error">{error}</HelperText> : null}

      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        Login
      </Button>

      <TouchableOpacity onPress={handleRegister} style={styles.registerContainer}>
        <Text style={styles.registerText}>Don't have an account? </Text>
        <Text style={[styles.registerText, styles.registerLink]}>Register here</Text>
      </TouchableOpacity>
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
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 24,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    fontSize: 16,
  },
  registerLink: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
