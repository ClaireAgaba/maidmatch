import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Button, TextInput, SegmentedButtons, Text, Portal, Modal, useTheme } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';

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
};

export function HomeOwnerSignupScreen({ navigation }: Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    dateOfBirth: new Date(),
    gender: 'female',
    phoneNumber: '',
    email: '',
    currentAddress: '',
    identificationDoc: '',
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
            <Text variant="titleLarge" style={styles.stepTitle}>Document Verification</Text>
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

  const handleSubmit = () => {
    // TODO: Implement form submission
    console.log('Form submitted:', formData);
    navigation.navigate('HomeOwnerDashboard');
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
          >
            Previous
          </Button>
        )}
        {currentStep < 3 ? (
          <Button
            mode="contained"
            onPress={() => setCurrentStep(currentStep + 1)}
            style={styles.navigationButton}
          >
            Next
          </Button>
        ) : (
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.navigationButton}
          >
            Submit
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
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e0e0e0',
  },
  progressStepCompleted: {
    backgroundColor: '#6200ee',
  },
  stepTitle: {
    marginBottom: 16,
  },
  description: {
    marginBottom: 16,
    color: '#666',
  },
  input: {
    marginBottom: 16,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 24,
  },
  navigationButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});
