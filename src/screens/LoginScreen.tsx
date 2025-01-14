import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // For testing, navigate directly to dashboard based on email domain
    if (email.includes('admin')) {
      // @ts-ignore
      navigation.reset({
        index: 0,
        routes: [{ name: 'AdminDashboard' }],
      });
    } else if (email.includes('maid')) {
      // @ts-ignore
      navigation.reset({
        index: 0,
        routes: [{ name: 'MaidDashboard' }],
      });
    } else {
      // Default to homeowner
      // @ts-ignore
      navigation.reset({
        index: 0,
        routes: [{ name: 'HomeOwnerDashboard' }],
      });
    }
  };

  const handleRegister = () => {
    // @ts-ignore
    navigation.navigate('Welcome');
  };

  const handleAdminLogin = () => {
    // @ts-ignore
    navigation.navigate('AdminLogin');
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

      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.button}
      >
        Login
      </Button>

      <TouchableOpacity onPress={handleRegister} style={styles.registerContainer}>
        <Text style={styles.registerText}>Don't have an account? </Text>
        <Text style={[styles.registerText, styles.registerLink]}>Register here</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleAdminLogin} style={styles.adminLoginContainer}>
        <Text style={[styles.registerText, styles.adminLoginText]}>Admin Login</Text>
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
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
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
  },
  adminLoginContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  adminLoginText: {
    color: '#666',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
