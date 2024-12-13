import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { Button, TextInput, SegmentedButtons, Text, ActivityIndicator } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import { authService } from '../services/authService';

type Props = NativeStackScreenProps<RootStackParamList, 'HomeOwnerSignup'>;

type FormData = {
  // Personal Data
  fullName: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  
  // Contact Information
  phoneNumber: string;
  email: string;
  currentAddress: string;
  
  // Documents
  identificationDoc: string;
  
  // Authentication
  password: string;
  confirmPassword: string;
};

export function HomeOwnerSignupScreen({ navigation }: Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    dateOfBirth: new Date(),
    gender: 'female',
    phoneNumber: '',
    email: '',
    currentAddress: '',
    identificationDoc: '',
    password: '',
    confirmPassword: '',
  });

  const handleDocumentPick = async (docType: keyof Pick<FormData, 'identificationDoc'>) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (result.type === 'success') {
        setFormData({
          ...formData,
          [docType]: result.uri,
        });
      }
    } catch (err) {
      console.error('Error picking document:', err);
      Alert.alert('Error', 'Failed to upload document. Please try again.');
    }
  };

  const validateForm = () => {
    if (!formData.fullName || !formData.email || !formData.phoneNumber || !formData.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const userData = {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        role: 'homeowner' as const,
        phone: formData.phoneNumber,
        // Additional profile data can be updated after registration
        profile: {
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          address: formData.currentAddress,
        }
      };

      await authService.register(userData);
      Alert.alert('Success', 'Registration successful!', [
        { text: 'OK', onPress: () => navigation.replace('HomeOwnerDashboard') }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <View>
            <Text variant="titleLarge" style={styles.stepTitle}>Personal Information</Text>
            <TextInput
              label="Full Name"
              value={formData.fullName}
              onChangeText={(text) => setFormData({ ...formData, fullName: text })}
              style={styles.input}
            />
            <Button onPress={() => setShowDatePicker(true)} mode="outlined" style={styles.input}>
              {formData.dateOfBirth.toLocaleDateString()}
            </Button>
            {showDatePicker && (
              <DateTimePicker
                value={formData.dateOfBirth}
                mode="date"
                onChange={(event, date) => {
                  setShowDatePicker(false);
                  if (date) setFormData({ ...formData, dateOfBirth: date });
                }}
              />
            )}
            <SegmentedButtons
              value={formData.gender}
              onValueChange={value => setFormData({ ...formData, gender: value as 'male' | 'female' | 'other' })}
              buttons={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' },
              ]}
              style={styles.input}
            />
          </View>
        );
      case 2:
        return (
          <View>
            <Text variant="titleLarge" style={styles.stepTitle}>Contact Information</Text>
            <TextInput
              label="Phone Number"
              value={formData.phoneNumber}
              onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
              keyboardType="phone-pad"
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
              label="Current Address"
              value={formData.currentAddress}
              onChangeText={(text) => setFormData({ ...formData, currentAddress: text })}
              multiline
              numberOfLines={3}
              style={styles.input}
            />
          </View>
        );
      case 3:
        return (
          <View>
            <Text variant="titleLarge" style={styles.stepTitle}>Security & Verification</Text>
            <TextInput
              label="Password"
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              secureTextEntry
              style={styles.input}
            />
            <TextInput
              label="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
              secureTextEntry
              style={styles.input}
            />
            <Text variant="bodyMedium" style={styles.description}>
              Please provide a valid form of identification (National ID, Passport, or Driver's License)
            </Text>
            <Button 
              mode="outlined" 
              onPress={() => handleDocumentPick('identificationDoc')}
              style={styles.input}
            >
              Upload Identification {formData.identificationDoc ? '✓' : ''}
            </Button>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.progressContainer}>
        {[1, 2, 3].map((step) => (
          <View
            key={step}
            style={[
              styles.progressStep,
              currentStep >= step && styles.progressStepCompleted,
            ]}
          />
        ))}
      </View>

      {renderStep()}

      <View style={styles.navigationButtons}>
        {currentStep > 1 && (
          <Button
            mode="outlined"
            onPress={() => setCurrentStep(currentStep - 1)}
            style={styles.navigationButton}
            disabled={loading}
          >
            Previous
          </Button>
        )}
        {currentStep < 3 ? (
          <Button
            mode="contained"
            onPress={() => setCurrentStep(currentStep + 1)}
            style={styles.navigationButton}
            disabled={loading}
          >
            Next
          </Button>
        ) : (
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.navigationButton}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="white" /> : 'Submit'}
          </Button>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    padding: 16,
  },
  progressStep: {
    width: 100,
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
  },
  progressStepCompleted: {
    backgroundColor: '#6200ee',
  },
  stepTitle: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  description: {
    marginVertical: 8,
    color: '#666',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 32,
  },
  navigationButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});
