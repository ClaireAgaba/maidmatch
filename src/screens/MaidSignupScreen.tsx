import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { TextInput, Button, Text, HelperText, RadioButton, List, Portal, Dialog } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import { useNavigation } from '@react-navigation/native';
import { authService } from '../services/authService';
import { referenceDataService } from '../services/referenceDataService';

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
  district: string;
  tribe: string;
  languages: string[];
  
  // Contact Information
  phoneNumber: string;
  email: string;
  currentAddress: string;
  
  // Emergency Contact
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;
  
  // Medical History
  bloodType: string;
  allergies: string[];
  chronicConditions: string[];
  vaccinations: string[];
  additionalInfo: string;
  
  // Documents
  identificationDoc: string;
  medicalCertificate: string;
  policeClearance: string;
  lcLetter: string;
  educationProof: string;
  referenceLetter: string;
  workPermit: string;
};

export function MaidSignupScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [currentStep, setCurrentStep] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [nationalityExpanded, setNationalityExpanded] = useState(false);
  const [districtExpanded, setDistrictExpanded] = useState(false);
  const [tribeExpanded, setTribeExpanded] = useState(false);
  const [languagesExpanded, setLanguagesExpanded] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    dateOfBirth: new Date(),
    gender: 'female',
    nationality: '',
    district: '',
    tribe: '',
    languages: [],
    phoneNumber: '',
    email: '',
    currentAddress: '',
    emergencyContactName: '',
    emergencyContactRelation: '',
    emergencyContactPhone: '',
    bloodType: '',
    allergies: [],
    chronicConditions: [],
    vaccinations: [],
    additionalInfo: '',
    identificationDoc: '',
    medicalCertificate: '',
    policeClearance: '',
    lcLetter: '',
    educationProof: '',
    referenceLetter: '',
    workPermit: '',
  });

  const [referenceData, setReferenceData] = useState({
    districts: [],
    tribes: [],
    languages: [],
    relationships: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showMedicalDialog, setShowMedicalDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nationalities = [
    { id: 'UG', name: 'Uganda' },
    { id: 'KE', name: 'Kenya' },
    { id: 'TZ', name: 'Tanzania' },
    { id: 'RW', name: 'Rwanda' },
    { id: 'BI', name: 'Burundi' },
    { id: 'SS', name: 'South Sudan' },
  ];

  const validateForm = () => {
    if (!formData.nationality) {
      setError('Please select a nationality');
      return false;
    }
    if (!formData.district) {
      setError('Please select a district');
      return false;
    }
    if (!formData.tribe) {
      setError('Please select a tribe');
      return false;
    }
    if (formData.languages.length === 0) {
      setError('Please select at least one language');
      return false;
    }
    return true;
  };

  useEffect(() => {
    loadReferenceData();
  }, []);

  const loadReferenceData = async () => {
    try {
      const data = await referenceDataService.getAllReferenceData();
      setReferenceData(data);
    } catch (error) {
      console.error('Error loading reference data:', error);
    }
  };

  const handleDocumentPick = async (docType: keyof Pick<FormData, 'identificationDoc' | 'medicalCertificate' | 'policeClearance' | 'lcLetter' | 'educationProof' | 'referenceLetter' | 'workPermit'>) => {
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

  const handleSubmit = async () => {
    try {
      if (!validateForm()) {
        return;
      }
      setIsSubmitting(true);
      
      // Validate mandatory fields
      const mandatoryFields = [
        'fullName',
        'dateOfBirth',
        'gender',
        'phoneNumber',
        'currentAddress',
        'emergencyContactName',
        'emergencyContactRelation',
        'emergencyContactPhone',
        'bloodType',
      ];

      const missingFields = mandatoryFields.filter(field => !formData[field as keyof FormData]);
      
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all mandatory fields: ${missingFields.join(', ')}`);
      }

      // Validate documents
      const requiredDocs = [
        'identificationDoc',
        'medicalCertificate',
        'policeClearance',
        'lcLetter',
        'educationProof',
        'referenceLetter',
        'workPermit'
      ];

      const missingDocs = requiredDocs.filter(doc => !formData[doc as keyof FormData]);
      
      if (missingDocs.length > 0) {
        throw new Error(`Please upload all required documents: ${missingDocs.join(', ')}`);
      }

      // Create form data for file upload
      const formDataToSend = new FormData();
      
      // Add all text fields
      Object.keys(formData).forEach(key => {
        if (typeof formData[key as keyof FormData] === 'string' || formData[key as keyof FormData] instanceof Date) {
          formDataToSend.append(key, formData[key as keyof FormData].toString());
        } else if (typeof formData[key as keyof FormData] === 'object') {
          formDataToSend.append(key, JSON.stringify(formData[key as keyof FormData]));
        }
      });

      // Register user
      await authService.register({
        ...formData,
        role: 'maid',
        verificationStatus: 'pending'
      });

      // Show success message and navigate to login
      Alert.alert(
        'Registration Successful',
        'Thank you for submitting your application. It has been submitted for verification. You will receive a notification once your account is verified.',
        [
          {
            text: 'OK',
            onPress: () => navigation.replace('Login')
          }
        ]
      );
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setIsSubmitting(false);
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
            <Button
              mode="outlined"
              onPress={() => setShowDatePicker(true)}
              style={styles.input}
            >
              Date of Birth: {formData.dateOfBirth.toLocaleDateString()}
            </Button>
            {showDatePicker && (
              <DateTimePicker
                value={formData.dateOfBirth}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setFormData(prev => ({ ...prev, dateOfBirth: selectedDate }));
                  }
                }}
              />
            )}
            <Text style={styles.sectionTitle}>Gender *</Text>
            <RadioButton.Group
              onValueChange={value => setFormData({ ...formData, gender: value as 'male' | 'female' | 'other' })}
              value={formData.gender}
            >
              <View style={styles.radioGroup}>
                <RadioButton.Item label="Female" value="female" />
                <RadioButton.Item label="Male" value="male" />
                <RadioButton.Item label="Other" value="other" />
              </View>
            </RadioButton.Group>
            <Text style={styles.sectionTitle}>Nationality *</Text>
            <List.Accordion
              title={formData.nationality ? nationalities.find(n => n.id === formData.nationality)?.name || 'Select Nationality' : 'Select Nationality'}
              expanded={nationalityExpanded}
              onPress={() => setNationalityExpanded(!nationalityExpanded)}
              style={[styles.dropdown, !formData.nationality && styles.mandatoryField]}
            >
              {nationalities.map((nationality) => (
                <List.Item
                  key={nationality.id}
                  title={nationality.name}
                  onPress={() => {
                    setFormData(prev => ({ ...prev, nationality: nationality.id }));
                    setNationalityExpanded(false);
                  }}
                  right={props => 
                    formData.nationality === nationality.id ? (
                      <List.Icon {...props} icon="check" />
                    ) : null
                  }
                />
              ))}
            </List.Accordion>
            <Text style={styles.sectionTitle}>District *</Text>
            <List.Accordion
              title={formData.district ? referenceData.districts.find(d => d._id === formData.district)?.name || 'Select District' : 'Select District'}
              expanded={districtExpanded}
              onPress={() => setDistrictExpanded(!districtExpanded)}
              style={[styles.dropdown, !formData.district && styles.mandatoryField]}
            >
              {referenceData.districts
                .filter(district => district.isActive)
                .map((district) => (
                  <List.Item
                    key={district._id}
                    title={district.name}
                    onPress={() => {
                      setFormData(prev => ({ ...prev, district: district._id }));
                      setDistrictExpanded(false);
                    }}
                    right={props => 
                      formData.district === district._id ? (
                        <List.Icon {...props} icon="check" />
                      ) : null
                    }
                  />
                ))}
            </List.Accordion>
            <Text style={styles.sectionTitle}>Tribe *</Text>
            <List.Accordion
              title={formData.tribe ? referenceData.tribes.find(t => t._id === formData.tribe)?.name || 'Select Tribe' : 'Select Tribe'}
              expanded={tribeExpanded}
              onPress={() => setTribeExpanded(!tribeExpanded)}
              style={[styles.dropdown, !formData.tribe && styles.mandatoryField]}
            >
              {referenceData.tribes
                .filter(tribe => tribe.isActive)
                .map((tribe) => (
                  <List.Item
                    key={tribe._id}
                    title={tribe.name}
                    onPress={() => {
                      setFormData(prev => ({ ...prev, tribe: tribe._id }));
                      setTribeExpanded(false);
                    }}
                    right={props => 
                      formData.tribe === tribe._id ? (
                        <List.Icon {...props} icon="check" />
                      ) : null
                    }
                  />
                ))}
            </List.Accordion>
            <Text style={styles.sectionTitle}>Languages *</Text>
            <List.Accordion
              title={formData.languages.length > 0 
                ? `${formData.languages.length} Language${formData.languages.length > 1 ? 's' : ''} Selected`
                : 'Select Languages'}
              expanded={languagesExpanded}
              onPress={() => setLanguagesExpanded(!languagesExpanded)}
              style={[styles.dropdown, formData.languages.length === 0 && styles.mandatoryField]}
            >
              {referenceData.languages
                .filter(language => language.isActive)
                .map((language) => (
                  <List.Item
                    key={language._id}
                    title={language.name}
                    onPress={() => {
                      setFormData(prev => ({
                        ...prev,
                        languages: prev.languages.includes(language._id)
                          ? prev.languages.filter(id => id !== language._id)
                          : [...prev.languages, language._id]
                      }));
                    }}
                    right={props => 
                      formData.languages.includes(language._id) ? (
                        <List.Icon {...props} icon="check" />
                      ) : null
                    }
                  />
                ))}
            </List.Accordion>
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
              style={styles.input}
            />
            <Text variant="titleMedium" style={styles.subsectionTitle}>Emergency Contact</Text>
            <TextInput
              label="Emergency Contact Name"
              value={formData.emergencyContactName}
              onChangeText={(text) => setFormData({ ...formData, emergencyContactName: text })}
              style={styles.input}
            />
            <List.Section>
              <List.Subheader>Relationship</List.Subheader>
              {referenceData.relationships.map((relationship: any) => (
                <List.Item
                  key={relationship._id}
                  title={relationship.name}
                  onPress={() => setFormData({ ...formData, emergencyContactRelation: relationship._id })}
                  right={() => formData.emergencyContactRelation === relationship._id ? <List.Icon icon="check" /> : null}
                />
              ))}
            </List.Section>
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
            <Text variant="titleLarge" style={styles.stepTitle}>Medical History</Text>
            <Text style={styles.sectionTitle}>Blood Type *</Text>
            <RadioButton.Group
              onValueChange={value => setFormData({ ...formData, bloodType: value })}
              value={formData.bloodType}
            >
              <View style={styles.bloodTypeContainer}>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                  <RadioButton.Item key={type} label={type} value={type} />
                ))}
              </View>
            </RadioButton.Group>
            <TextInput
              label="Allergies (comma separated)"
              value={formData.allergies.join(', ')}
              onChangeText={(text) => setFormData({ ...formData, allergies: text.split(',').map(t => t.trim()) })}
              style={styles.input}
            />
            <TextInput
              label="Chronic Conditions (comma separated)"
              value={formData.chronicConditions.join(', ')}
              onChangeText={(text) => setFormData({ ...formData, chronicConditions: text.split(',').map(t => t.trim()) })}
              style={styles.input}
            />
            <TextInput
              label="Vaccinations (comma separated)"
              value={formData.vaccinations.join(', ')}
              onChangeText={(text) => setFormData({ ...formData, vaccinations: text.split(',').map(t => t.trim()) })}
              style={styles.input}
            />
            <TextInput
              label="Additional Information"
              value={formData.additionalInfo}
              onChangeText={(text) => setFormData({ ...formData, additionalInfo: text })}
              multiline
              style={styles.input}
            />
          </View>
        );
      case 4:
        return (
          <View>
            <Text variant="titleLarge" style={styles.stepTitle}>Required Documents</Text>
            <Text variant="bodyMedium" style={styles.note}>All documents are mandatory</Text>
            
            <List.Item
              title="National ID/Passport"
              description={formData.identificationDoc ? "Uploaded" : "Required"}
              right={() => (
                <Button
                  mode="contained"
                  onPress={() => handleDocumentPick('identificationDoc')}
                >
                  Upload
                </Button>
              )}
            />
            
            <List.Item
              title="Medical Certificate"
              description={formData.medicalCertificate ? "Uploaded" : "Required"}
              right={() => (
                <Button
                  mode="contained"
                  onPress={() => handleDocumentPick('medicalCertificate')}
                >
                  Upload
                </Button>
              )}
            />
            
            <List.Item
              title="Police Clearance"
              description={formData.policeClearance ? "Uploaded" : "Required"}
              right={() => (
                <Button
                  mode="contained"
                  onPress={() => handleDocumentPick('policeClearance')}
                >
                  Upload
                </Button>
              )}
            />
            
            <List.Item
              title="LC Letter"
              description={formData.lcLetter ? "Uploaded" : "Required"}
              right={() => (
                <Button
                  mode="contained"
                  onPress={() => handleDocumentPick('lcLetter')}
                >
                  Upload
                </Button>
              )}
            />
            
            <List.Item
              title="Education Certificates"
              description={formData.educationProof ? "Uploaded" : "Required"}
              right={() => (
                <Button
                  mode="contained"
                  onPress={() => handleDocumentPick('educationProof')}
                >
                  Upload
                </Button>
              )}
            />
            
            <List.Item
              title="Reference Letter"
              description={formData.referenceLetter ? "Uploaded" : "Required"}
              right={() => (
                <Button
                  mode="contained"
                  onPress={() => handleDocumentPick('referenceLetter')}
                >
                  Upload
                </Button>
              )}
            />
            
            <List.Item
              title="Work Permit"
              description={formData.workPermit ? "Uploaded" : "Required"}
              right={() => (
                <Button
                  mode="contained"
                  onPress={() => handleDocumentPick('workPermit')}
                >
                  Upload
                </Button>
              )}
            />
          </View>
        );
      case 5:
        return (
          <ScrollView>
            <Text variant="titleLarge" style={styles.stepTitle}>Review Your Information</Text>
            <Text variant="bodyMedium" style={styles.note}>Please review all your information before submission</Text>
            
            <List.Section title="Personal Information">
              <List.Item title="Full Name" description={formData.fullName} />
              <List.Item title="Date of Birth" description={formData.dateOfBirth.toLocaleDateString()} />
              <List.Item title="Gender" description={formData.gender} />
              <List.Item title="Nationality" description={formData.nationality} />
              <List.Item title="District" description={formData.district} />
              <List.Item title="Tribe" description={formData.tribe} />
            </List.Section>
            
            <List.Section title="Contact Information">
              <List.Item title="Phone Number" description={formData.phoneNumber} />
              <List.Item title="Email" description={formData.email || 'Not provided'} />
              <List.Item title="Current Address" description={formData.currentAddress} />
            </List.Section>
            
            <List.Section title="Emergency Contact">
              <List.Item title="Name" description={formData.emergencyContactName} />
              <List.Item title="Relation" description={formData.emergencyContactRelation} />
              <List.Item title="Phone" description={formData.emergencyContactPhone} />
            </List.Section>
            
            <List.Section title="Medical Information">
              <List.Item title="Blood Type" description={formData.bloodType} />
              <List.Item title="Allergies" description={formData.allergies.join(', ') || 'None'} />
              <List.Item title="Chronic Conditions" description={formData.chronicConditions.join(', ') || 'None'} />
              <List.Item title="Vaccinations" description={formData.vaccinations.join(', ') || 'None'} />
              <List.Item title="Additional Information" description={formData.additionalInfo || 'None'} />
            </List.Section>
            
            <List.Section title="Documents">
              <List.Item title="National ID/Passport" description={formData.identificationDoc ? 'Uploaded' : 'Missing'} />
              <List.Item title="Medical Certificate" description={formData.medicalCertificate ? 'Uploaded' : 'Missing'} />
              <List.Item title="Police Clearance" description={formData.policeClearance ? 'Uploaded' : 'Missing'} />
              <List.Item title="LC Letter" description={formData.lcLetter ? 'Uploaded' : 'Missing'} />
              <List.Item title="Education Certificates" description={formData.educationProof ? 'Uploaded' : 'Missing'} />
              <List.Item title="Reference Letter" description={formData.referenceLetter ? 'Uploaded' : 'Missing'} />
              <List.Item title="Work Permit" description={formData.workPermit ? 'Uploaded' : 'Missing'} />
            </List.Section>
          </ScrollView>
        );
      default:
        return null;
    }
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
            style={[styles.navigationButton, styles.submitButton]}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Submit Application
          </Button>
        )}
      </View>

      <Portal>
        <Dialog
          visible={showMedicalDialog}
          onDismiss={() => setShowMedicalDialog(false)}
        >
          <Dialog.Title>Medical History</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogLabel}>Blood Type *</Text>
            <RadioButton.Group
              onValueChange={value => 
                setFormData(prev => ({
                  ...prev,
                  bloodType: value
                }))
              }
              value={formData.bloodType}
            >
              <View style={styles.bloodTypeContainer}>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                  <RadioButton.Item key={type} label={type} value={type} />
                ))}
              </View>
            </RadioButton.Group>

            <TextInput
              label="Allergies (comma separated)"
              value={formData.allergies.join(', ')}
              onChangeText={text => 
                setFormData(prev => ({
                  ...prev,
                  allergies: text.split(',').map(t => t.trim())
                }))
              }
              style={styles.dialogInput}
            />

            <TextInput
              label="Chronic Conditions (comma separated)"
              value={formData.chronicConditions.join(', ')}
              onChangeText={text => 
                setFormData(prev => ({
                  ...prev,
                  chronicConditions: text.split(',').map(t => t.trim())
                }))
              }
              style={styles.dialogInput}
            />

            <TextInput
              label="Vaccinations (comma separated)"
              value={formData.vaccinations.join(', ')}
              onChangeText={text => 
                setFormData(prev => ({
                  ...prev,
                  vaccinations: text.split(',').map(t => t.trim())
                }))
              }
              style={styles.dialogInput}
            />

            <TextInput
              label="Additional Information"
              value={formData.additionalInfo}
              onChangeText={text => 
                setFormData(prev => ({
                  ...prev,
                  additionalInfo: text
                }))
              }
              multiline
              numberOfLines={3}
              style={styles.dialogInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowMedicalDialog(false)}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      {error && <HelperText type="error" visible={!!error}>{error}</HelperText>}
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
  submitButton: {
    marginTop: 24,
    marginBottom: 32,
    paddingVertical: 8,
  },
  note: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bloodTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dropdown: {
    backgroundColor: '#f5f5f5',
    marginBottom: 12,
    borderRadius: 4,
  },
  uploadButton: {
    marginVertical: 8,
  },
  medicalButton: {
    marginVertical: 16,
  },
  dialogLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  dialogInput: {
    marginVertical: 8,
  },
  mandatoryField: {
    borderColor: '#BA1A1A',
    borderWidth: 1,
  },
});
