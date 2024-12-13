import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, List } from 'react-native';
import { Text, TextInput, Button, useTheme, Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { authService } from '../services/authService';

interface RegistrationData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  password: string;
  confirmPassword: string;
  role: 'maid' | 'homeowner';
  passportPhoto?: string;
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  numberOfKids: number;
  nextOfKin: {
    fullName: string;
    phone: string;
    relationship: 'brother' | 'sister' | 'cousin' | 'mother' | 'father' | 'aunt' | 'uncle';
  };
}

interface ValidationErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  password?: string;
  confirmPassword?: string;
  passportPhoto?: string;
  maritalStatus?: string;
  numberOfKids?: string;
  nextOfKin?: {
    fullName?: string;
    phone?: string;
    relationship?: string;
  };
}

export function RegisterScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RegistrationData>({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    password: '',
    confirmPassword: '',
    role: 'maid',
    maritalStatus: 'single',
    numberOfKids: 0,
    nextOfKin: {
      fullName: '',
      phone: '',
      relationship: 'brother',
    },
  });
  const [errors, setErrors] = useState<ValidationErrors>({});

  const relationshipOptions = [
    { label: 'Brother', value: 'brother' },
    { label: 'Sister', value: 'sister' },
    { label: 'Cousin', value: 'cousin' },
    { label: 'Mother', value: 'mother' },
    { label: 'Father', value: 'father' },
    { label: 'Aunt', value: 'aunt' },
    { label: 'Uncle', value: 'uncle' },
  ];

  const maritalStatusOptions = [
    { label: 'Single', value: 'single' },
    { label: 'Married', value: 'married' },
    { label: 'Divorced', value: 'divorced' },
    { label: 'Widowed', value: 'widowed' },
  ];

  const validateStep1 = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.passportPhoto) {
      newErrors.passportPhoto = 'Passport photo is required';
    }

    if (!formData.maritalStatus) {
      newErrors.maritalStatus = 'Please select marital status';
    }

    if (formData.numberOfKids < 0) {
      newErrors.numberOfKids = 'Number of kids cannot be negative';
    }

    // Validate next of kin
    if (!formData.nextOfKin.fullName.trim()) {
      newErrors.nextOfKin = { ...newErrors.nextOfKin, fullName: 'Next of kin name is required' };
    }

    if (!formData.nextOfKin.phone.trim()) {
      newErrors.nextOfKin = { ...newErrors.nextOfKin, phone: 'Next of kin phone is required' };
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.nextOfKin.phone)) {
      newErrors.nextOfKin = { ...newErrors.nextOfKin, phone: 'Invalid phone number' };
    }

    if (!formData.nextOfKin.relationship) {
      newErrors.nextOfKin = { ...newErrors.nextOfKin, relationship: 'Please select a relationship' };
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please allow access to your photo library to upload a passport photo.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setFormData({ ...formData, passportPhoto: result.assets[0].uri });
        setErrors({ ...errors, passportPhoto: undefined });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep2()) {
      return;
    }

    try {
      await authService.register(formData);
      Alert.alert('Success', 'Registration successful! Please login.');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', 'Registration failed. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        {step === 1 ? 'Bio Data' : 'Account Security'}
      </Text>

      {step === 1 ? (
        <View>
          <View style={styles.photoSection}>
            <Avatar.Image
              size={120}
              source={
                formData.passportPhoto
                  ? { uri: formData.passportPhoto }
                  : require('../assets/default-avatar.png')
              }
            />
            <Button
              mode="outlined"
              onPress={handlePickImage}
              style={styles.photoButton}
            >
              Upload Passport Photo
            </Button>
            {errors.passportPhoto && (
              <Text style={styles.errorText}>{errors.passportPhoto}</Text>
            )}
          </View>

          <TextInput
            label="Full Name"
            value={formData.fullName}
            onChangeText={(text) => setFormData({ ...formData, fullName: text })}
            error={!!errors.fullName}
            style={styles.input}
          />
          {errors.fullName && (
            <Text style={styles.errorText}>{errors.fullName}</Text>
          )}

          <TextInput
            label="Email"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            error={!!errors.email}
            style={styles.input}
          />
          {errors.email && (
            <Text style={styles.errorText}>{errors.email}</Text>
          )}

          <TextInput
            label="Phone Number"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            keyboardType="phone-pad"
            error={!!errors.phone}
            style={styles.input}
          />
          {errors.phone && (
            <Text style={styles.errorText}>{errors.phone}</Text>
          )}

          <TextInput
            label="Location"
            value={formData.location}
            onChangeText={(text) => setFormData({ ...formData, location: text })}
            error={!!errors.location}
            style={styles.input}
          />
          {errors.location && (
            <Text style={styles.errorText}>{errors.location}</Text>
          )}

          <Text variant="titleMedium" style={styles.sectionTitle}>Personal Information</Text>

          <List.Section>
            <List.Subheader>Marital Status</List.Subheader>
            {maritalStatusOptions.map((option) => (
              <List.Item
                key={option.value}
                title={option.label}
                onPress={() => setFormData({
                  ...formData,
                  maritalStatus: option.value
                })}
                left={props => (
                  <List.Icon
                    {...props}
                    icon={formData.maritalStatus === option.value ? 'radiobox-marked' : 'radiobox-blank'}
                  />
                )}
              />
            ))}
          </List.Section>
          {errors.maritalStatus && (
            <Text style={styles.errorText}>{errors.maritalStatus}</Text>
          )}

          <TextInput
            label="Number of Kids"
            value={formData.numberOfKids.toString()}
            onChangeText={(text) => {
              const number = parseInt(text) || 0;
              setFormData({ ...formData, numberOfKids: number });
            }}
            keyboardType="numeric"
            error={!!errors.numberOfKids}
            style={styles.input}
          />
          {errors.numberOfKids && (
            <Text style={styles.errorText}>{errors.numberOfKids}</Text>
          )}

          <Text variant="titleMedium" style={styles.sectionTitle}>Next of Kin</Text>

          <TextInput
            label="Next of Kin Full Name"
            value={formData.nextOfKin.fullName}
            onChangeText={(text) => setFormData({
              ...formData,
              nextOfKin: { ...formData.nextOfKin, fullName: text }
            })}
            error={!!errors.nextOfKin?.fullName}
            style={styles.input}
          />
          {errors.nextOfKin?.fullName && (
            <Text style={styles.errorText}>{errors.nextOfKin.fullName}</Text>
          )}

          <TextInput
            label="Next of Kin Phone Number"
            value={formData.nextOfKin.phone}
            onChangeText={(text) => setFormData({
              ...formData,
              nextOfKin: { ...formData.nextOfKin, phone: text }
            })}
            keyboardType="phone-pad"
            error={!!errors.nextOfKin?.phone}
            style={styles.input}
          />
          {errors.nextOfKin?.phone && (
            <Text style={styles.errorText}>{errors.nextOfKin.phone}</Text>
          )}

          <List.Section>
            <List.Subheader>Relationship</List.Subheader>
            {relationshipOptions.map((option) => (
              <List.Item
                key={option.value}
                title={option.label}
                onPress={() => setFormData({
                  ...formData,
                  nextOfKin: { ...formData.nextOfKin, relationship: option.value }
                })}
                left={props => (
                  <List.Icon
                    {...props}
                    icon={formData.nextOfKin.relationship === option.value ? 'radiobox-marked' : 'radiobox-blank'}
                  />
                )}
              />
            ))}
          </List.Section>
          {errors.nextOfKin?.relationship && (
            <Text style={styles.errorText}>{errors.nextOfKin.relationship}</Text>
          )}

          <Button
            mode="contained"
            onPress={handleNext}
            style={styles.button}
          >
            Next
          </Button>
        </View>
      ) : (
        <View>
          <TextInput
            label="Password"
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            secureTextEntry
            error={!!errors.password}
            style={styles.input}
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}

          <TextInput
            label="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
            secureTextEntry
            error={!!errors.confirmPassword}
            style={styles.input}
          />
          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}

          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={handleBack}
              style={[styles.button, styles.backButton]}
            >
              Back
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={[styles.button, styles.submitButton]}
            >
              Register
            </Button>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    marginBottom: 24,
    fontWeight: 'bold',
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  photoButton: {
    marginTop: 8,
  },
  input: {
    marginBottom: 8,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 8,
  },
  button: {
    marginTop: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  backButton: {
    flex: 1,
    marginRight: 8,
  },
  submitButton: {
    flex: 1,
    marginLeft: 8,
  },
});
