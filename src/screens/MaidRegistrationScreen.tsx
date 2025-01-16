import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Platform, Linking, Image } from 'react-native';
import { 
  Text, 
  TextInput, 
  Button, 
  useTheme, 
  HelperText, 
  Checkbox, 
  RadioButton, 
  Avatar,
  Portal,
  Modal,
  Card,
  Chip,
} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import type { RootStackScreenProps } from '../navigation/types';
import { MaidRegistrationFormData } from '../types/registration';
import {
  EDUCATION_LEVELS,
  LANGUAGES,
  SKILLS,
  RELATIONSHIPS,
  EA_COUNTRIES,
  UGANDAN_TRIBES,
  MARITAL_STATUS,
  GENDER,
} from '../constants/registrationOptions';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

// API Configuration
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  title: {
    textAlign: 'center',
    marginVertical: 24,
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 16,
  },
  input: {
    marginBottom: 8,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  uploadButton: {
    marginVertical: 8,
  },
  documentNote: {
    fontStyle: 'italic',
    marginBottom: 8,
    opacity: 0.7,
  },
  submitButtonContainer: {
    marginVertical: 24,
    alignItems: 'center',
  },
  submitButton: {
    width: '100%',
    marginBottom: 8,
  },
  submitError: {
    textAlign: 'center',
    marginTop: 8,
  },
  photoPreview: {
    alignItems: 'center',
    marginVertical: 16,
  },
  documentStatus: {
    marginTop: 4,
    marginBottom: 8,
  },
  modalContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 8,
    maxHeight: '90%',
  },
  previewScroll: {
    padding: 16,
  },
  previewTitle: {
    textAlign: 'center',
    marginBottom: 24,
  },
  previewCard: {
    marginBottom: 16,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionLabel: {
    marginTop: 16,
    marginBottom: 8,
  },
  previewActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
    paddingBottom: 24,
  },
  previewButton: {
    minWidth: 120,
  },
  locationButton: {
    marginVertical: 8,
  },
  locationText: {
    textAlign: 'center',
    marginBottom: 8,
  },
});

const MaidRegistrationScreen: React.FC<RootStackScreenProps<'MaidRegistration'>> = ({ navigation, route }) => {
  const theme = useTheme();
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  const [formData, setFormData] = useState<MaidRegistrationFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    numberOfChildren: 0,
    nationality: '',
    tribe: '',
    location: {
      address: '',
      district: '',
      city: '',
      country: '',
    },
    educationLevel: '',
    languages: [],
    skills: [],
    profilePhoto: '',
    nextOfKin: {
      name: '',
      relationship: '',
      phoneNumber: '',
      address: '',
    },
    medicalHistory: {
      allergies: '',
      chronicDiseases: '',
      bloodType: '',
      vaccinations: [],
      others: '',
    },
    documents: {
      nationalId: '',
      medicalCertificate: '',
      policeClearance: '',
      referenceLetter: '',
      educationCertificates: [],
    },
  });

  const [errors, setErrors] = useState<Partial<Record<keyof MaidRegistrationFormData, string>>>({});

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        const address = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        
        if (address[0]) {
          setFormData(prev => ({
            ...prev,
            location: {
              address: `${address[0].street || ''} ${address[0].city || ''} ${address[0].region || ''}`.trim(),
              district: address[0].district || '',
              city: address[0].city || '',
              country: address[0].country || '',
            },
          }));
        }
      }
    })();
  }, []);

  const handlePhotoUpload = async () => {
    try {
      // Request media library permissions
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photo library to upload a profile photo.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Settings',
              onPress: () => Linking.openSettings()
            }
          ]
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (result.canceled) {
        return;
      }

      if (!result.assets || !result.assets[0]) {
        throw new Error('No image selected');
      }

      const selectedAsset = result.assets[0];

      // Check file size (limit to 2MB)
      const response = await fetch(selectedAsset.uri);
      const blob = await response.blob();
      if (blob.size > MAX_FILE_SIZE) {
        Alert.alert(
          'File Too Large',
          'Please select an image smaller than 2MB',
          [{ text: 'OK' }]
        );
        return;
      }

      setFormData(prev => ({ ...prev, profilePhoto: selectedAsset.uri }));
    } catch (error) {
      console.error('Photo upload error:', error);
      Alert.alert(
        'Upload Failed',
        'Failed to upload photo. Please try again or choose a different photo.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleDocumentUpload = async (documentType: keyof MaidRegistrationFormData['documents']) => {
    try {
      console.log('Starting document upload for:', documentType);
      
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf'],
        multiple: documentType === 'educationCertificates',
      });

      console.log('Document picker result:', result);

      if (result.canceled) {
        console.log('Document picker cancelled');
        return;
      }

      // Handle multiple files for education certificates
      if (documentType === 'educationCertificates' && result.assets) {
        const validFiles = [];
        for (const asset of result.assets) {
          try {
            const response = await fetch(asset.uri);
            const blob = await response.blob();
            
            if (blob.size > MAX_FILE_SIZE) {
              Alert.alert(
                'File Too Large',
                `File "${asset.name}" is larger than 2MB. Please choose a smaller file.`
              );
              continue;
            }
            
            validFiles.push(asset.uri);
          } catch (error) {
            console.error('Error processing file:', error);
            Alert.alert('Error', `Failed to process file "${asset.name}"`);
          }
        }

        if (validFiles.length > 0) {
          setFormData(prev => ({
            ...prev,
            documents: {
              ...prev.documents,
              educationCertificates: [...prev.documents.educationCertificates, ...validFiles],
            },
          }));
        }
        return;
      }

      // Handle single file upload
      if (result.assets?.[0]) {
        const file = result.assets[0];
        try {
          const response = await fetch(file.uri);
          const blob = await response.blob();
          
          if (blob.size > MAX_FILE_SIZE) {
            Alert.alert(
              'File Too Large',
              'File size must be less than 2MB. Please choose a smaller file.'
            );
            return;
          }

          setFormData(prev => ({
            ...prev,
            documents: {
              ...prev.documents,
              [documentType]: file.uri,
            },
          }));

          console.log(`Document ${documentType} uploaded successfully:`, file.uri);
        } catch (error) {
          console.error('Error processing file:', error);
          Alert.alert('Error', 'Failed to process the selected file');
        }
      }
    } catch (error) {
      console.error('Document upload error:', error);
      Alert.alert(
        'Upload Failed',
        'Failed to upload document. Please try again or choose a different file.'
      );
    }
  };

  const validateForm = () => {
    console.log('Validating form data:', formData);
    const errors: { [key: string]: string } = {};

    // Basic info validation
    if (!formData.firstName) errors.firstName = 'First name is required';
    if (!formData.lastName) errors.lastName = 'Last name is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.phoneNumber) errors.phoneNumber = 'Phone number is required';
    if (!formData.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
    if (!formData.gender) errors.gender = 'Gender is required';
    if (!formData.nationality) errors.nationality = 'Nationality is required';

    // Location validation
    if (!formData.location.address || !formData.location.district || 
        !formData.location.city || !formData.location.country) {
      errors.location = 'All location fields are required';
    }

    // Document validation
    console.log('Validating documents:', formData.documents);
    const documentErrors: string[] = [];
    
    if (!formData.documents.nationalId) documentErrors.push('National ID');
    if (!formData.documents.medicalCertificate) documentErrors.push('Medical Certificate');
    if (!formData.documents.policeClearance) documentErrors.push('Police Clearance');
    if (!formData.documents.referenceLetter) documentErrors.push('Reference Letter');
    if (formData.documents.educationCertificates.length === 0) {
      documentErrors.push('Education Certificates');
    }

    if (documentErrors.length > 0) {
      errors.documents = `Missing required documents: ${documentErrors.join(', ')}`;
    }

    console.log('Validation errors:', errors);
    return errors;
  };

  const handleSubmit = async () => {
    console.log('handleSubmit called');
    
    console.log('Starting form validation');
    const errors = validateForm();
    setErrors(errors);
    if (Object.keys(errors).length > 0) {
      console.log('Form validation failed');
      Alert.alert(
        'Missing Information',
        'Please fill in all required fields and upload all required documents.',
        [{ text: 'OK' }]
      );
      return;
    }

    console.log('Form validation passed, showing preview');
    setShowPreview(true);
  };

  const handleConfirmSubmit = async () => {
    console.log('handleConfirmSubmit called');
    
    // Check authentication before actual submission
    if (!token || !user) {
      console.log('No token or user found, redirecting to login');
      setShowPreview(false);
      navigation.navigate('Login', {
        redirectTo: 'MaidRegistration',
        formData: formData
      });
      return;
    }

    setShowPreview(false);
    setLoading(true);
    setError('');

    try {
      const apiUrl = `${API_BASE_URL}${API_ENDPOINTS.MAID_REGISTRATION}`;
      console.log('API URL:', apiUrl);
      console.log('Token present:', !!token);
      
      const formDataObj = new FormData();
      
      // Append basic info
      formDataObj.append('firstName', formData.firstName);
      formDataObj.append('lastName', formData.lastName);
      formDataObj.append('dateOfBirth', formData.dateOfBirth);
      formDataObj.append('gender', formData.gender);
      formDataObj.append('maritalStatus', formData.maritalStatus);
      formDataObj.append('numberOfChildren', formData.numberOfChildren.toString());
      formDataObj.append('nationality', formData.nationality);
      formDataObj.append('tribe', formData.tribe || '');
      formDataObj.append('location', JSON.stringify({
        address: formData.location.address,
        district: formData.location.district,
        city: formData.location.city,
        country: formData.location.country
      }));
      formDataObj.append('educationLevel', formData.educationLevel);
      formDataObj.append('languages', JSON.stringify(formData.languages));
      formDataObj.append('skills', JSON.stringify(formData.skills));
      formDataObj.append('nextOfKin', JSON.stringify(formData.nextOfKin));
      formDataObj.append('medicalHistory', JSON.stringify(formData.medicalHistory));

      // Append photo
      if (formData.profilePhoto) {
        const photoName = formData.profilePhoto.split('/').pop() || 'photo.jpg';
        const photoUri = Platform.OS === 'ios' ? formData.profilePhoto.replace('file://', '') : formData.profilePhoto;
        formDataObj.append('photo', {
          uri: photoUri,
          type: 'image/jpeg',
          name: photoName,
        });
      }

      // Append documents
      if (formData.documents.nationalId) {
        const nationalIdName = formData.documents.nationalId.split('/').pop() || 'national_id.pdf';
        const nationalIdUri = Platform.OS === 'ios' ? formData.documents.nationalId.replace('file://', '') : formData.documents.nationalId;
        formDataObj.append('national_id', {
          uri: nationalIdUri,
          type: 'application/pdf',
          name: nationalIdName,
        });
      }

      if (formData.documents.medicalCertificate) {
        const medicalCertName = formData.documents.medicalCertificate.split('/').pop() || 'medical_certificate.pdf';
        const medicalCertUri = Platform.OS === 'ios' ? formData.documents.medicalCertificate.replace('file://', '') : formData.documents.medicalCertificate;
        formDataObj.append('medical_certificate', {
          uri: medicalCertUri,
          type: 'application/pdf',
          name: medicalCertName,
        });
      }

      if (formData.documents.policeClearance) {
        const policeClearanceName = formData.documents.policeClearance.split('/').pop() || 'police_clearance.pdf';
        const policeClearanceUri = Platform.OS === 'ios' ? formData.documents.policeClearance.replace('file://', '') : formData.documents.policeClearance;
        formDataObj.append('police_clearance', {
          uri: policeClearanceUri,
          type: 'application/pdf',
          name: policeClearanceName,
        });
      }

      if (formData.documents.referenceLetter) {
        const referenceLetterName = formData.documents.referenceLetter.split('/').pop() || 'reference_letter.pdf';
        const referenceLetterUri = Platform.OS === 'ios' ? formData.documents.referenceLetter.replace('file://', '') : formData.documents.referenceLetter;
        formDataObj.append('reference_letter', {
          uri: referenceLetterUri,
          type: 'application/pdf',
          name: referenceLetterName,
        });
      }

      if (formData.documents.educationCertificates && formData.documents.educationCertificates.length > 0) {
        formData.documents.educationCertificates.forEach((uri, index) => {
          const certName = uri.split('/').pop() || `education_certificate_${index + 1}.pdf`;
          const certUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
          formDataObj.append('education_certificates', {
            uri: certUri,
            type: 'application/pdf',
            name: certName,
          });
        });
      }

      console.log('Sending request...');
      console.log('FormData entries:', Array.from(formDataObj.entries()).map(([key, value]) => {
        if (typeof value === 'object') {
          return `${key}: ${JSON.stringify(value)}`;
        }
        return `${key}: ${value}`;
      }));
      
      const response = await axios.post(apiUrl, formDataObj, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        timeout: 30000, // 30 second timeout
      });

      console.log('Response status:', response.status);
      console.log('Response data:', response.data);

      setLoading(false);
      Alert.alert(
        'Success',
        'Registration submitted successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home'),
          },
        ],
      );
    } catch (error) {
      console.error('Submission error:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
          },
        });
      }
      setLoading(false);
      setError(error.message);
      Alert.alert('Error', `Failed to submit registration: ${error.message}`);
    }
  };

  const PreviewModal = () => {
    if (!showPreview) return null;
    
    return (
      <Portal>
        <Modal
          visible={showPreview}
          onDismiss={() => setShowPreview(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <ScrollView style={styles.previewScroll}>
            <Text variant="headlineMedium" style={styles.previewTitle}>
              Review Your Application
            </Text>

            <Card style={styles.previewCard}>
              <Card.Title
                title="Personal Information"
                left={(props) => (
                  <Avatar.Image
                    {...props}
                    source={{ uri: formData.profilePhoto }}
                    size={40}
                  />
                )}
              />
              <Card.Content>
                <View style={styles.previewRow}>
                  <Text variant="labelLarge">Name:</Text>
                  <Text>{`${formData.firstName} ${formData.lastName}`}</Text>
                </View>
                <View style={styles.previewRow}>
                  <Text variant="labelLarge">Date of Birth:</Text>
                  <Text>{formData.dateOfBirth}</Text>
                </View>
                <View style={styles.previewRow}>
                  <Text variant="labelLarge">Gender:</Text>
                  <Text>{formData.gender}</Text>
                </View>
                <View style={styles.previewRow}>
                  <Text variant="labelLarge">Marital Status:</Text>
                  <Text>{formData.maritalStatus}</Text>
                </View>
                <View style={styles.previewRow}>
                  <Text variant="labelLarge">Children:</Text>
                  <Text>{formData.numberOfChildren}</Text>
                </View>
                <View style={styles.previewRow}>
                  <Text variant="labelLarge">Nationality:</Text>
                  <Text>{formData.nationality}</Text>
                </View>
                {formData.tribe && (
                  <View style={styles.previewRow}>
                    <Text variant="labelLarge">Tribe:</Text>
                    <Text>{formData.tribe}</Text>
                  </View>
                )}
              </Card.Content>
            </Card>

            <Card style={styles.previewCard}>
              <Card.Title title="Skills & Experience" />
              <Card.Content>
                <View style={styles.previewRow}>
                  <Text variant="labelLarge">Education:</Text>
                  <Text>{formData.educationLevel}</Text>
                </View>
                <Text variant="labelLarge" style={styles.sectionLabel}>Languages:</Text>
                <View style={styles.chipContainer}>
                  {formData.languages.map((lang) => (
                    <Chip key={lang} style={styles.chip}>{lang}</Chip>
                  ))}
                </View>
                <Text variant="labelLarge" style={styles.sectionLabel}>Skills:</Text>
                <View style={styles.chipContainer}>
                  {formData.skills.map((skill) => (
                    <Chip key={skill} style={styles.chip}>{skill}</Chip>
                  ))}
                </View>
              </Card.Content>
            </Card>

            <Card style={styles.previewCard}>
              <Card.Title title="Next of Kin" />
              <Card.Content>
                <View style={styles.previewRow}>
                  <Text variant="labelLarge">Name:</Text>
                  <Text>{formData.nextOfKin.name}</Text>
                </View>
                <View style={styles.previewRow}>
                  <Text variant="labelLarge">Contact:</Text>
                  <Text>{formData.nextOfKin.phoneNumber}</Text>
                </View>
                <View style={styles.previewRow}>
                  <Text variant="labelLarge">Relationship:</Text>
                  <Text>{formData.nextOfKin.relationship}</Text>
                </View>
              </Card.Content>
            </Card>

            <Card style={styles.previewCard}>
              <Card.Title title="Medical History" />
              <Card.Content>
                {formData.medicalHistory.allergies && (
                  <View style={styles.previewRow}>
                    <Text variant="labelLarge">Allergies:</Text>
                    <Text>{formData.medicalHistory.allergies}</Text>
                  </View>
                )}
                {formData.medicalHistory.chronicDiseases && (
                  <View style={styles.previewRow}>
                    <Text variant="labelLarge">Chronic Diseases:</Text>
                    <Text>{formData.medicalHistory.chronicDiseases}</Text>
                  </View>
                )}
                {formData.medicalHistory.others && (
                  <View style={styles.previewRow}>
                    <Text variant="labelLarge">Other Medical Info:</Text>
                    <Text>{formData.medicalHistory.others}</Text>
                  </View>
                )}
              </Card.Content>
            </Card>

            <Card style={styles.previewCard}>
              <Card.Title title="Location" />
              <Card.Content>
                <View style={styles.previewRow}>
                  <Text variant="labelLarge">Address:</Text>
                  <Text>{formData.location.address}</Text>
                </View>
                <View style={styles.previewRow}>
                  <Text variant="labelLarge">District:</Text>
                  <Text>{formData.location.district}</Text>
                </View>
                <View style={styles.previewRow}>
                  <Text variant="labelLarge">City:</Text>
                  <Text>{formData.location.city}</Text>
                </View>
                <View style={styles.previewRow}>
                  <Text variant="labelLarge">Country:</Text>
                  <Text>{formData.location.country}</Text>
                </View>
              </Card.Content>
            </Card>

            <Card style={styles.previewCard}>
              <Card.Title title="Documents" />
              <Card.Content>
                <View style={styles.previewRow}>
                  <Text variant="labelLarge">National ID:</Text>
                  <Text>{formData.documents.nationalId ? '✓ Uploaded' : '✗ Missing'}</Text>
                </View>
                <View style={styles.previewRow}>
                  <Text variant="labelLarge">Medical Certificate:</Text>
                  <Text>{formData.documents.medicalCertificate ? '✓ Uploaded' : '✗ Missing'}</Text>
                </View>
                <View style={styles.previewRow}>
                  <Text variant="labelLarge">Police Clearance:</Text>
                  <Text>{formData.documents.policeClearance ? '✓ Uploaded' : '✗ Missing'}</Text>
                </View>
                <View style={styles.previewRow}>
                  <Text variant="labelLarge">Reference Letter:</Text>
                  <Text>{formData.documents.referenceLetter ? '✓ Uploaded' : '✗ Missing'}</Text>
                </View>
                <View style={styles.previewRow}>
                  <Text variant="labelLarge">Education Certificates:</Text>
                  <Text>{formData.documents.educationCertificates.length > 0 
                    ? `✓ ${formData.documents.educationCertificates.length} Uploaded` 
                    : '✗ Missing'}</Text>
                </View>
              </Card.Content>
            </Card>

            <View style={styles.previewActions}>
              <Button
                mode="outlined"
                onPress={() => setShowPreview(false)}
                style={styles.previewButton}
              >
                Edit
              </Button>
              <Button
                mode="contained"
                onPress={handleConfirmSubmit}
                style={styles.previewButton}
                loading={loading}
                disabled={loading}
              >
                Submit
              </Button>
            </View>
          </ScrollView>
        </Modal>
      </Portal>
    );
  };

  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      
      if (address[0]) {
        setFormData(prev => ({
          ...prev,
          location: {
            address: `${address[0].street || ''} ${address[0].city || ''} ${address[0].region || ''}`.trim(),
            district: address[0].district || '',
            city: address[0].city || '',
            country: address[0].country || '',
          },
        }));
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.form}>
          <Text variant="headlineMedium" style={styles.title}>Maid Registration</Text>

          {/* Bio Data Section */}
          <Text variant="titleMedium" style={styles.sectionTitle}>Bio Data</Text>
          
          <TextInput
            label="First Name"
            value={formData.firstName}
            onChangeText={(value) => setFormData(prev => ({ ...prev, firstName: value }))}
            mode="outlined"
            style={styles.input}
          />
          <HelperText type="error" visible={!!errors.firstName}>{errors.firstName}</HelperText>

          <TextInput
            label="Last Name"
            value={formData.lastName}
            onChangeText={(value) => setFormData(prev => ({ ...prev, lastName: value }))}
            mode="outlined"
            style={styles.input}
          />
          <HelperText type="error" visible={!!errors.lastName}>{errors.lastName}</HelperText>

          <TextInput
            label="Email"
            value={formData.email}
            onChangeText={(value) => setFormData(prev => ({ ...prev, email: value }))}
            mode="outlined"
            style={styles.input}
          />
          <HelperText type="error" visible={!!errors.email}>{errors.email}</HelperText>

          <TextInput
            label="Phone Number"
            value={formData.phoneNumber}
            onChangeText={(value) => setFormData(prev => ({ ...prev, phoneNumber: value }))}
            mode="outlined"
            style={styles.input}
          />
          <HelperText type="error" visible={!!errors.phoneNumber}>{errors.phoneNumber}</HelperText>

          <Button
            mode="outlined"
            onPress={handlePhotoUpload}
            style={styles.uploadButton}
          >
            {formData.profilePhoto ? 'Change Profile Photo' : 'Upload Profile Photo'}
          </Button>
          {formData.profilePhoto && (
            <View style={styles.photoPreview}>
              <Avatar.Image source={{ uri: formData.profilePhoto }} size={100} />
            </View>
          )}
          <HelperText type="error" visible={!!errors.profilePhoto}>{errors.profilePhoto}</HelperText>

          <Button
            mode="outlined"
            onPress={() => setShowDatePicker(true)}
            style={styles.uploadButton}
          >
            {formData.dateOfBirth ? 'Change Date of Birth' : 'Select Date of Birth'}
          </Button>
          {formData.dateOfBirth && (
            <Text style={{ textAlign: 'center', marginBottom: 8 }}>
              Date of Birth: {formData.dateOfBirth}
            </Text>
          )}
          {showDatePicker && (
            <DateTimePicker
              value={formData.dateOfBirth ? new Date(formData.dateOfBirth) : new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setFormData(prev => ({
                    ...prev,
                    dateOfBirth: selectedDate.toISOString().split('T')[0],
                  }));
                }
              }}
            />
          )}
          <HelperText type="error" visible={!!errors.dateOfBirth}>{errors.dateOfBirth}</HelperText>

          <Text>Gender</Text>
          <RadioButton.Group
            onValueChange={value => setFormData(prev => ({ ...prev, gender: value as typeof formData.gender }))}
            value={formData.gender}
          >
            {GENDER.map(gender => (
              <View key={gender} style={styles.radioItem}>
                <RadioButton value={gender} />
                <Text>{gender}</Text>
              </View>
            ))}
          </RadioButton.Group>

          <Text>Marital Status</Text>
          <RadioButton.Group
            onValueChange={value => setFormData(prev => ({ ...prev, maritalStatus: value as typeof formData.maritalStatus }))}
            value={formData.maritalStatus}
          >
            {MARITAL_STATUS.map(status => (
              <View key={status} style={styles.radioItem}>
                <RadioButton value={status} />
                <Text>{status}</Text>
              </View>
            ))}
          </RadioButton.Group>

          <TextInput
            label="Number of Children"
            value={formData.numberOfChildren.toString()}
            onChangeText={(value) => {
              const num = parseInt(value) || 0;
              setFormData(prev => ({ ...prev, numberOfChildren: num }));
            }}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />

          <Text>Nationality</Text>
          <RadioButton.Group
            onValueChange={value => setFormData(prev => ({ ...prev, nationality: value as typeof formData.nationality }))}
            value={formData.nationality}
          >
            {EA_COUNTRIES.map(country => (
              <View key={country} style={styles.radioItem}>
                <RadioButton value={country} />
                <Text>{country}</Text>
              </View>
            ))}
          </RadioButton.Group>

          {formData.nationality === 'Uganda' && (
            <>
              <Text>Tribe</Text>
              <RadioButton.Group
                onValueChange={value => setFormData(prev => ({ ...prev, tribe: value }))}
                value={formData.tribe || ''}
              >
                {UGANDAN_TRIBES.map(tribe => (
                  <View key={tribe} style={styles.radioItem}>
                    <RadioButton value={tribe} />
                    <Text>{tribe}</Text>
                  </View>
                ))}
              </RadioButton.Group>
            </>
          )}

          {/* Location Section */}
          <Text variant="titleMedium" style={styles.sectionTitle}>Location Information</Text>
          
          <TextInput
            label="Street Address"
            value={formData.location.address}
            onChangeText={(value) => setFormData(prev => ({
              ...prev,
              location: { ...prev.location, address: value }
            }))}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="District"
            value={formData.location.district}
            onChangeText={(value) => setFormData(prev => ({
              ...prev,
              location: { ...prev.location, district: value }
            }))}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="City"
            value={formData.location.city}
            onChangeText={(value) => setFormData(prev => ({
              ...prev,
              location: { ...prev.location, city: value }
            }))}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Country"
            value={formData.location.country}
            onChangeText={(value) => setFormData(prev => ({
              ...prev,
              location: { ...prev.location, country: value }
            }))}
            mode="outlined"
            style={styles.input}
          />

          <Button
            mode="outlined"
            onPress={getCurrentLocation}
            style={styles.locationButton}
            icon="map-marker"
          >
            Use Current Location
          </Button>

          {formData.location.address && (
            <Text style={styles.locationText}>
              Current Location: {formData.location.address}, {formData.location.district}, {formData.location.city}, {formData.location.country}
            </Text>
          )}
          <HelperText type="error" visible={!!errors.location}>{errors.location}</HelperText>

          {/* Skills Section */}
          <Text variant="titleMedium" style={styles.sectionTitle}>Skills & Experience</Text>

          <Text>Education Level</Text>
          <RadioButton.Group
            onValueChange={value => setFormData(prev => ({ ...prev, educationLevel: value as typeof formData.educationLevel }))}
            value={formData.educationLevel}
          >
            {EDUCATION_LEVELS.map(level => (
              <View key={level} style={styles.radioItem}>
                <RadioButton value={level} />
                <Text>{level}</Text>
              </View>
            ))}
          </RadioButton.Group>

          <Text>Languages</Text>
          {LANGUAGES.map(lang => (
            <Checkbox.Item
              key={lang}
              label={lang}
              status={formData.languages.includes(lang) ? 'checked' : 'unchecked'}
              onPress={() => {
                setFormData(prev => ({
                  ...prev,
                  languages: prev.languages.includes(lang)
                    ? prev.languages.filter(l => l !== lang)
                    : [...prev.languages, lang],
                }));
              }}
            />
          ))}

          <Text>Skills</Text>
          {SKILLS.map(skill => (
            <Checkbox.Item
              key={skill}
              label={skill}
              status={formData.skills.includes(skill) ? 'checked' : 'unchecked'}
              onPress={() => {
                setFormData(prev => ({
                  ...prev,
                  skills: prev.skills.includes(skill)
                    ? prev.skills.filter(s => s !== skill)
                    : [...prev.skills, skill],
                }));
              }}
            />
          ))}

          {/* Next of Kin Section */}
          <Text variant="titleMedium" style={styles.sectionTitle}>Next of Kin</Text>
          
          <TextInput
            label="Name"
            value={formData.nextOfKin.name}
            onChangeText={(value) => setFormData(prev => ({
              ...prev,
              nextOfKin: { ...prev.nextOfKin, name: value },
            }))}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Contact"
            value={formData.nextOfKin.phoneNumber}
            onChangeText={(value) => setFormData(prev => ({
              ...prev,
              nextOfKin: { ...prev.nextOfKin, phoneNumber: value },
            }))}
            mode="outlined"
            keyboardType="phone-pad"
            style={styles.input}
          />

          <Text>Relationship</Text>
          <RadioButton.Group
            onValueChange={value => {
              setFormData(prev => ({
                ...prev,
                nextOfKin: { ...prev.nextOfKin, relationship: value as typeof formData.nextOfKin.relationship },
              }));
            }}
            value={formData.nextOfKin.relationship}
          >
            {RELATIONSHIPS.map(relationship => (
              <View key={relationship} style={styles.radioItem}>
                <RadioButton value={relationship} />
                <Text>{relationship}</Text>
              </View>
            ))}
          </RadioButton.Group>

          {/* Medical History Section */}
          <Text variant="titleMedium" style={styles.sectionTitle}>Medical History</Text>
          
          <TextInput
            label="Allergies"
            value={formData.medicalHistory.allergies}
            onChangeText={(value) => setFormData(prev => ({
              ...prev,
              medicalHistory: { ...prev.medicalHistory, allergies: value },
            }))}
            mode="outlined"
            multiline
            style={styles.input}
          />

          <TextInput
            label="Chronic Diseases"
            value={formData.medicalHistory.chronicDiseases}
            onChangeText={(value) => setFormData(prev => ({
              ...prev,
              medicalHistory: { ...prev.medicalHistory, chronicDiseases: value },
            }))}
            mode="outlined"
            multiline
            style={styles.input}
          />

          <TextInput
            label="Other Medical Information"
            value={formData.medicalHistory.others}
            onChangeText={(value) => setFormData(prev => ({
              ...prev,
              medicalHistory: { ...prev.medicalHistory, others: value },
            }))}
            mode="outlined"
            multiline
            style={styles.input}
          />

          {/* Documents Section */}
          <Text variant="titleMedium" style={styles.sectionTitle}>Documents</Text>
          <Text style={styles.documentNote}>Note: All documents must be in PDF format and less than 2MB in size</Text>
          
          <Button
            mode="outlined"
            onPress={() => handleDocumentUpload('nationalId')}
            style={styles.uploadButton}
          >
            {formData.documents.nationalId ? 'Change National ID' : 'Upload National ID'}
          </Button>
          {formData.documents.nationalId && (
            <Text style={styles.documentStatus}>National ID uploaded</Text>
          )}

          <Button
            mode="outlined"
            onPress={() => handleDocumentUpload('medicalCertificate')}
            style={styles.uploadButton}
          >
            {formData.documents.medicalCertificate ? 'Change Medical Certificate' : 'Upload Medical Certificate'}
          </Button>
          {formData.documents.medicalCertificate && (
            <Text style={styles.documentStatus}>Medical Certificate uploaded</Text>
          )}

          <Button
            mode="outlined"
            onPress={() => handleDocumentUpload('policeClearance')}
            style={styles.uploadButton}
          >
            {formData.documents.policeClearance ? 'Change Police Clearance' : 'Upload Police Clearance'}
          </Button>
          {formData.documents.policeClearance && (
            <Text style={styles.documentStatus}>Police Clearance uploaded</Text>
          )}

          <Button
            mode="outlined"
            onPress={() => handleDocumentUpload('referenceLetter')}
            style={styles.uploadButton}
          >
            {formData.documents.referenceLetter ? 'Change Reference Letter' : 'Upload Reference Letter'}
          </Button>
          {formData.documents.referenceLetter && (
            <Text style={styles.documentStatus}>Reference Letter uploaded</Text>
          )}

          <Button
            mode="outlined"
            onPress={() => handleDocumentUpload('educationCertificates')}
            style={styles.uploadButton}
          >
            Upload Education Certificates
          </Button>
          {formData.documents.educationCertificates.length > 0 && (
            <Text style={styles.documentStatus}>
              {formData.documents.educationCertificates.length} certificate(s) uploaded
            </Text>
          )}
          <HelperText type="error" visible={!!errors.documents}>{errors.documents}</HelperText>

          <View style={styles.submitButtonContainer}>
            <Button
              mode="contained"
              onPress={() => {
                console.log('Submit button pressed');
                handleSubmit();
              }}
              loading={loading}
              disabled={loading}
              style={styles.submitButton}
            >
              Preview & Submit
            </Button>
            {error && (
              <HelperText type="error" style={styles.submitError}>
                {error}
              </HelperText>
            )}
          </View>
        </View>
      </ScrollView>
      <PreviewModal />
    </View>
  );
};

export default MaidRegistrationScreen;
