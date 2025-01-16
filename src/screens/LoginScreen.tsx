import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button, useTheme, HelperText } from 'react-native-paper';
import type { RootStackScreenProps } from '../navigation/types';
import { authService } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = RootStackScreenProps<'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const { login: setAuthData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState<{
    phone?: string;
    otp?: string;
  }>({});

  const validatePhone = () => {
    if (!phone) {
      setErrors(prev => ({ ...prev, phone: 'Phone number is required' }));
      return false;
    }
    if (!/^(0|\+256)[1-9][0-9]{8}$/.test(phone)) {
      setErrors(prev => ({
        ...prev,
        phone: 'Invalid phone number format. Use format: 0XXXXXXXXX or +256XXXXXXXXX'
      }));
      return false;
    }
    return true;
  };

  const startResendTimer = () => {
    setResendDisabled(true);
    setResendTimer(30);
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOTP = async () => {
    if (!validatePhone()) {
      return;
    }

    try {
      setLoading(true);
      await authService.sendOTP(phone);
      setOtpSent(true);
      startResendTimer();
      Alert.alert(
        'OTP Sent',
        'A verification code has been sent to your phone number. Please check your messages.'
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateOtp = () => {
    if (!otp) {
      setErrors(prev => ({ ...prev, otp: 'Please enter the OTP' }));
      return false;
    }

    if (!/^\d{6}$/.test(otp)) {
      setErrors(prev => ({ ...prev, otp: 'OTP must be 6 digits' }));
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validateOtp()) return;

    setLoading(true);
    try {
      const response = await authService.verifyOtp(phone, otp);
      if (response.success) {
        // Store auth data
        await AsyncStorage.setItem('auth_token', response.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
        setAuthData(response.token, response.user);

        // If there's a redirect, navigate there
        if (route.params?.redirectTo) {
          navigation.replace(route.params.redirectTo, route.params.formData ? { formData: route.params.formData } : undefined);
        } else {
          // Default navigation based on user role
          switch (response.user.role) {
            case 'admin':
              navigation.replace('AdminDashboard');
              break;
            case 'maid':
              navigation.replace('MaidDashboard');
              break;
            case 'homeowner':
              navigation.replace('HomeOwnerDashboard');
              break;
            default:
              navigation.replace('Welcome');
          }
        }
      } else {
        Alert.alert('Error', 'Login failed. Please try again.');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="headlineMedium" style={styles.title}>Login</Text>

      <View style={styles.form}>
        <TextInput
          label="Phone Number"
          value={phone}
          onChangeText={(value) => {
            setPhone(value);
            setErrors(prev => ({ ...prev, phone: undefined }));
          }}
          mode="outlined"
          error={!!errors.phone}
          disabled={otpSent}
          keyboardType="phone-pad"
          placeholder="0XXXXXXXXX or +256XXXXXXXXX"
          style={styles.input}
        />
        <HelperText type="error" visible={!!errors.phone}>
          {errors.phone}
        </HelperText>

        {otpSent && (
          <>
            <TextInput
              label="Verification Code"
              value={otp}
              onChangeText={(value) => {
                setOtp(value);
                setErrors(prev => ({ ...prev, otp: undefined }));
              }}
              mode="outlined"
              error={!!errors.otp}
              keyboardType="number-pad"
              maxLength={6}
              style={styles.input}
            />
            <HelperText type="error" visible={!!errors.otp}>
              {errors.otp}
            </HelperText>
          </>
        )}

        <Button
          mode="contained"
          onPress={otpSent ? handleLogin : handleSendOTP}
          loading={loading}
          disabled={loading}
          style={styles.button}
        >
          {otpSent ? 'Login' : 'Send Verification Code'}
        </Button>

        {otpSent && (
          <Button
            mode="text"
            onPress={handleSendOTP}
            disabled={resendDisabled || loading}
            style={styles.resendButton}
          >
            {resendDisabled 
              ? `Resend code in ${resendTimer}s`
              : 'Resend verification code'}
          </Button>
        )}

        <View style={styles.registerContainer}>
          <Text>Don't have an account? </Text>
          <Button
            mode="text"
            onPress={() => navigation.navigate('Welcome')}
            style={styles.registerButton}
          >
            Register
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    textAlign: 'center',
    marginVertical: 24,
  },
  form: {
    padding: 16,
  },
  input: {
    marginBottom: 4,
  },
  button: {
    marginTop: 24,
    paddingVertical: 8,
  },
  resendButton: {
    marginTop: 8,
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  registerButton: {
    marginLeft: -8,
  },
});

export default LoginScreen;
