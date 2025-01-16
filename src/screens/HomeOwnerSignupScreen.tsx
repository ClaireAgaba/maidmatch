import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { Button, TextInput, Text } from 'react-native-paper';
import type { RootStackScreenProps } from '../navigation/types';
import { authService } from '../services/authService';

type Props = RootStackScreenProps<'HomeOwnerSignup'>;

const HomeOwnerSignupScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    otp: '',
  });

  const handleSendOTP = async () => {
    if (!formData.phone) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    try {
      setLoading(true);
      await authService.sendOTP(formData.phone);
      setOtpSent(true);
      Alert.alert('Success', 'OTP has been sent to your phone');
    } catch (error) {
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!formData.otp) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }

    try {
      setLoading(true);
      await authService.verifyOTP(formData.phone, formData.otp);
      await authService.register({
        ...formData,
        role: 'homeowner',
        nextOfKin: {
          fullName: '',
          phone: '',
          relationship: '',
        },
        maritalStatus: '',
        numberOfKids: 0,
      });
      Alert.alert(
        'Success',
        'Registration successful! Please login.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Register as Home Owner</Text>

      <TextInput
        label="Full Name"
        value={formData.fullName}
        onChangeText={(value) => setFormData({ ...formData, fullName: value })}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Email"
        value={formData.email}
        onChangeText={(value) => setFormData({ ...formData, email: value })}
        mode="outlined"
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        label="Phone Number"
        value={formData.phone}
        onChangeText={(value) => setFormData({ ...formData, phone: value })}
        mode="outlined"
        keyboardType="phone-pad"
        style={styles.input}
      />

      <TextInput
        label="Location"
        value={formData.location}
        onChangeText={(value) => setFormData({ ...formData, location: value })}
        mode="outlined"
        style={styles.input}
      />

      {otpSent && (
        <TextInput
          label="Enter OTP"
          value={formData.otp}
          onChangeText={(value) => setFormData({ ...formData, otp: value })}
          mode="outlined"
          keyboardType="number-pad"
          style={styles.input}
        />
      )}

      <Button
        mode="contained"
        onPress={otpSent ? handleRegister : handleSendOTP}
        loading={loading}
        style={styles.button}
      >
        {otpSent ? 'Complete Registration' : 'Send OTP'}
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.goBack()}
        style={styles.button}
      >
        Back
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginVertical: 8,
  },
});

export default HomeOwnerSignupScreen;
