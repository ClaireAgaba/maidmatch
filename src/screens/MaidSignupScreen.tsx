import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Button, TextInput, SegmentedButtons, Text, List, Portal, Modal, useTheme } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';

type Props = NativeStackScreenProps<RootStackParamList, 'MaidSignup'>;

type Language = {
  name: string;
  proficiency: 'Basic' | 'Intermediate' | 'Fluent';
};

type FormData = {
  // Bio Data
  fullName: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  nationality: string;
  tribe: string;
  languages: Language[];
  
  // Contact Information
  phoneNumber: string;
  email: string;
  currentAddress: string;
  
  // Emergency Contact
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;
  
  // Qualifications
  educationLevel: string;
  professionalTraining: string;
  workExperience: string;
  
  // Medical History
  medicalHistory: string;
  
  // Documents
  identificationDoc: string;
  medicalCertificate: string;
  policeClearance: string;
  lcLetter: string;
  educationProof: string;
};

export function MaidSignupScreen({ navigation }: Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    dateOfBirth: new Date(),
    gender: 'female',
    nationality: '',
    tribe: '',
    languages: [],
    phoneNumber: '',
    email: '',
    currentAddress: '',
    emergencyContactName: '',
    emergencyContactRelation: '',
    emergencyContactPhone: '',
    educationLevel: '',
    professionalTraining: '',
    workExperience: '',
    medicalHistory: '',
    identificationDoc: '',
    medicalCertificate: '',
    policeClearance: '',
    lcLetter: '',
    educationProof: '',
  });

  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [newLanguage, setNewLanguage] = useState({ name: '', proficiency: 'Basic' as const });

  const handleAddLanguage = () => {
    if (newLanguage.name) {
      setFormData({
        ...formData,
        languages: [...formData.languages, newLanguage],
      });
      setNewLanguage({ name: '', proficiency: 'Basic' });
      setShowLanguageModal(false);
    }
  };

  const handleDocumentPick = async (docType: keyof Pick<FormData, 'identificationDoc' | 'medicalCertificate' | 'policeClearance' | 'lcLetter' | 'educationProof'>) => {
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
            <Text variant="titleLarge" style={styles.stepTitle}>Bio Data</Text>
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
            <TextInput
              label="Nationality"
              value={formData.nationality}
              onChangeText={(text) => setFormData({ ...formData, nationality: text })}
              style={styles.input}
            />
            <TextInput
              label="Tribe"
              value={formData.tribe}
              onChangeText={(text) => setFormData({ ...formData, tribe: text })}
              style={styles.input}
            />
            <Button onPress={() => setShowLanguageModal(true)} mode="outlined" style={styles.input}>
              Add Language
            </Button>
            {formData.languages.map((lang, index) => (
              <List.Item
                key={index}
                title={lang.name}
                description={`Proficiency: ${lang.proficiency}`}
              />
            ))}
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
              label="Email (Optional)"
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
            <Text variant="titleMedium" style={styles.subsectionTitle}>Emergency Contact</Text>
            <TextInput
              label="Emergency Contact Name"
              value={formData.emergencyContactName}
              onChangeText={(text) => setFormData({ ...formData, emergencyContactName: text })}
              style={styles.input}
            />
            <TextInput
              label="Relationship"
              value={formData.emergencyContactRelation}
              onChangeText={(text) => setFormData({ ...formData, emergencyContactRelation: text })}
              style={styles.input}
            />
            <TextInput
              label="Emergency Contact Phone"
              value={formData.emergencyContactPhone}
              onChangeText={(text) => setFormData({ ...formData, emergencyContactPhone: text })}
              keyboardType="phone-pad"
              style={styles.input}
            />
          </View>
        );
      case 3:
        return (
          <View>
            <Text variant="titleLarge" style={styles.stepTitle}>Qualifications</Text>
            <TextInput
              label="Highest Level of Education"
              value={formData.educationLevel}
              onChangeText={(text) => setFormData({ ...formData, educationLevel: text })}
              style={styles.input}
            />
            <TextInput
              label="Professional Training"
              value={formData.professionalTraining}
              onChangeText={(text) => setFormData({ ...formData, professionalTraining: text })}
              multiline
              numberOfLines={3}
              style={styles.input}
            />
            <TextInput
              label="Work Experience"
              value={formData.workExperience}
              onChangeText={(text) => setFormData({ ...formData, workExperience: text })}
              multiline
              numberOfLines={4}
              style={styles.input}
            />
          </View>
        );
      case 4:
        return (
          <View>
            <Text variant="titleLarge" style={styles.stepTitle}>Medical History</Text>
            <TextInput
              label="Medical History"
              value={formData.medicalHistory}
              onChangeText={(text) => setFormData({ ...formData, medicalHistory: text })}
              multiline
              numberOfLines={4}
              style={styles.input}
            />
          </View>
        );
      case 5:
        return (
          <View>
            <Text variant="titleLarge" style={styles.stepTitle}>Document Attachments</Text>
            <Button 
              mode="outlined" 
              onPress={() => handleDocumentPick('identificationDoc')}
              style={styles.input}
            >
              Upload Identification {formData.identificationDoc ? '✓' : ''}
            </Button>
            <Button 
              mode="outlined" 
              onPress={() => handleDocumentPick('medicalCertificate')}
              style={styles.input}
            >
              Upload Medical Certificate {formData.medicalCertificate ? '✓' : ''}
            </Button>
            <Button 
              mode="outlined" 
              onPress={() => handleDocumentPick('policeClearance')}
              style={styles.input}
            >
              Upload Police Clearance {formData.policeClearance ? '✓' : ''}
            </Button>
            <Button 
              mode="outlined" 
              onPress={() => handleDocumentPick('lcLetter')}
              style={styles.input}
            >
              Upload LC Letter {formData.lcLetter ? '✓' : ''}
            </Button>
            <Button 
              mode="outlined" 
              onPress={() => handleDocumentPick('educationProof')}
              style={styles.input}
            >
              Upload Education Proof {formData.educationProof ? '✓' : ''}
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
    navigation.navigate('MaidDashboard');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.progressContainer}>
        {[1, 2, 3, 4, 5].map((step) => (
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
        {currentStep < 5 ? (
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

      <Portal>
        <Modal
          visible={showLanguageModal}
          onDismiss={() => setShowLanguageModal(false)}
          contentContainerStyle={styles.modal}
        >
          <Text variant="titleMedium" style={styles.modalTitle}>Add Language</Text>
          <TextInput
            label="Language Name"
            value={newLanguage.name}
            onChangeText={(text) => setNewLanguage({ ...newLanguage, name: text })}
            style={styles.input}
          />
          <SegmentedButtons
            value={newLanguage.proficiency}
            onValueChange={value => setNewLanguage({ ...newLanguage, proficiency: value as 'Basic' | 'Intermediate' | 'Fluent' })}
            buttons={[
              { value: 'Basic', label: 'Basic' },
              { value: 'Intermediate', label: 'Intermediate' },
              { value: 'Fluent', label: 'Fluent' },
            ]}
            style={styles.input}
          />
          <Button mode="contained" onPress={handleAddLanguage}>
            Add
          </Button>
        </Modal>
      </Portal>
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
  subsectionTitle: {
    marginTop: 16,
    marginBottom: 8,
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
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    marginBottom: 16,
  },
});
