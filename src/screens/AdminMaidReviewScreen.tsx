import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Linking } from 'react-native';
import { Text, Card, Button, Avatar, Chip, useTheme, Portal, Modal, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import type { RootStackScreenProps } from '../navigation/types';

// API Configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
const API_ENDPOINTS = {
  ADMIN_MAID_APPLICATIONS: '/api/admin/maid-applications',
};

type Props = RootStackScreenProps<'AdminMaidReview'>;

interface MaidApplication {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  numberOfChildren: number;
  nationality: string;
  tribe?: string;
  location: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  educationLevel: string;
  languages: string[];
  skills: string[];
  nextOfKin: {
    name: string;
    contact: string;
    relationship: string;
  };
  medicalHistory: {
    allergies: string;
    chronicDiseases: string;
    others: string;
  };
  documents: {
    profilePhoto: string;
    idCard: string;
    medicalCertificate: string;
    policeLetter: string;
    referenceLetter: string;
    educationCertificates: string[];
  };
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const AdminMaidReviewScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { token, user } = useAuth();
  const [applications, setApplications] = useState<MaidApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<MaidApplication | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [processingAction, setProcessingAction] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.ADMIN_MAID_APPLICATIONS}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        setError('Your session has expired. Please login again.');
        navigation.replace('AdminLogin');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }

      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError(error.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (application: MaidApplication) => {
    setSelectedApplication(application);
    setShowDetailsModal(true);
  };

  const handleViewDocument = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error opening document:', error);
    }
  };

  const handleApplicationAction = async (applicationId: string, action: 'approve' | 'reject') => {
    setProcessingAction(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.ADMIN_MAID_APPLICATIONS}/${applicationId}/${action}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to ${action} application`);
      }

      // Update local state
      setApplications(prev =>
        prev.map(app =>
          app.id === applicationId
            ? { ...app, status: action === 'approve' ? 'approved' : 'rejected' }
            : app
        )
      );

      setShowDetailsModal(false);
    } catch (error) {
      console.error(`Error ${action}ing application:`, error);
      setError(error.message || `Failed to ${action} application`);
    } finally {
      setProcessingAction(false);
    }
  };

  const ApplicationDetailsModal = () => {
    if (!selectedApplication) return null;

    return (
      <Portal>
        <Modal
          visible={showDetailsModal}
          onDismiss={() => setShowDetailsModal(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <ScrollView style={styles.modalScroll}>
            <Card style={styles.detailCard}>
              <Card.Title
                title={`${selectedApplication.firstName} ${selectedApplication.lastName}`}
                subtitle="Personal Information"
                left={(props) => (
                  <Avatar.Image
                    {...props}
                    source={{ uri: selectedApplication.documents.profilePhoto }}
                    size={40}
                  />
                )}
              />
              <Card.Content>
                <View style={styles.detailRow}>
                  <Text variant="labelLarge">Date of Birth:</Text>
                  <Text>{new Date(selectedApplication.dateOfBirth).toLocaleDateString()}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text variant="labelLarge">Gender:</Text>
                  <Text>{selectedApplication.gender}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text variant="labelLarge">Marital Status:</Text>
                  <Text>{selectedApplication.maritalStatus}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text variant="labelLarge">Children:</Text>
                  <Text>{selectedApplication.numberOfChildren}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text variant="labelLarge">Nationality:</Text>
                  <Text>{selectedApplication.nationality}</Text>
                </View>
                {selectedApplication.tribe && (
                  <View style={styles.detailRow}>
                    <Text variant="labelLarge">Tribe:</Text>
                    <Text>{selectedApplication.tribe}</Text>
                  </View>
                )}
              </Card.Content>
            </Card>

            <Card style={styles.detailCard}>
              <Card.Title title="Skills & Experience" />
              <Card.Content>
                <View style={styles.detailRow}>
                  <Text variant="labelLarge">Education:</Text>
                  <Text>{selectedApplication.educationLevel}</Text>
                </View>
                <Text variant="labelLarge" style={styles.sectionLabel}>
                  Languages:
                </Text>
                <View style={styles.chipContainer}>
                  {selectedApplication.languages.map((lang) => (
                    <Chip key={lang} style={styles.chip}>
                      {lang}
                    </Chip>
                  ))}
                </View>
                <Text variant="labelLarge" style={styles.sectionLabel}>
                  Skills:
                </Text>
                <View style={styles.chipContainer}>
                  {selectedApplication.skills.map((skill) => (
                    <Chip key={skill} style={styles.chip}>
                      {skill}
                    </Chip>
                  ))}
                </View>
              </Card.Content>
            </Card>

            <Card style={styles.detailCard}>
              <Card.Title title="Documents" />
              <Card.Content>
                <Button
                  mode="outlined"
                  onPress={() => handleViewDocument(selectedApplication.documents.idCard)}
                  style={styles.documentButton}
                >
                  View ID Card
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => handleViewDocument(selectedApplication.documents.medicalCertificate)}
                  style={styles.documentButton}
                >
                  View Medical Certificate
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => handleViewDocument(selectedApplication.documents.policeLetter)}
                  style={styles.documentButton}
                >
                  View Police Clearance
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => handleViewDocument(selectedApplication.documents.referenceLetter)}
                  style={styles.documentButton}
                >
                  View Reference Letter
                </Button>
                {selectedApplication.documents.educationCertificates.map((cert, index) => (
                  <Button
                    key={index}
                    mode="outlined"
                    onPress={() => handleViewDocument(cert)}
                    style={styles.documentButton}
                  >
                    View Education Certificate {index + 1}
                  </Button>
                ))}
              </Card.Content>
            </Card>

            <View style={styles.actionButtons}>
              <Button
                mode="outlined"
                onPress={() => setShowDetailsModal(false)}
                style={[styles.actionButton, { borderColor: theme.colors.error }]}
                textColor={theme.colors.error}
              >
                Close
              </Button>
              {selectedApplication.status === 'pending' && (
                <>
                  <Button
                    mode="contained"
                    onPress={() => handleApplicationAction(selectedApplication.id, 'reject')}
                    style={[styles.actionButton, { backgroundColor: theme.colors.error }]}
                    loading={processingAction}
                    disabled={processingAction}
                  >
                    Reject
                  </Button>
                  <Button
                    mode="contained"
                    onPress={() => handleApplicationAction(selectedApplication.id, 'approve')}
                    style={styles.actionButton}
                    loading={processingAction}
                    disabled={processingAction}
                  >
                    Approve
                  </Button>
                </>
              )}
            </View>
          </ScrollView>
        </Modal>
      </Portal>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text variant="bodyLarge" style={{ color: theme.colors.error }}>
          {error}
        </Text>
        <Button mode="contained" onPress={fetchApplications} style={{ marginTop: 16 }}>
          Retry
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Maid Applications
      </Text>
      <ScrollView>
        {applications.map((application) => (
          <Card key={application.id} style={styles.applicationCard}>
            <Card.Title
              title={`${application.firstName} ${application.lastName}`}
              subtitle={`Applied on ${new Date(application.createdAt).toLocaleDateString()}`}
              left={(props) => (
                <Avatar.Image
                  {...props}
                  source={{ uri: application.documents.profilePhoto }}
                  size={40}
                />
              )}
              right={(props) => (
                <Chip
                  mode="flat"
                  style={[
                    styles.statusChip,
                    {
                      backgroundColor:
                        application.status === 'approved'
                          ? theme.colors.primary
                          : application.status === 'rejected'
                          ? theme.colors.error
                          : theme.colors.secondary,
                    },
                  ]}
                >
                  {application.status.toUpperCase()}
                </Chip>
              )}
            />
            <Card.Content>
              <View style={styles.cardRow}>
                <Text variant="bodyMedium">Age: {calculateAge(application.dateOfBirth)}</Text>
                <Text variant="bodyMedium">Education: {application.educationLevel}</Text>
              </View>
              <View style={styles.chipContainer}>
                {application.skills.slice(0, 3).map((skill) => (
                  <Chip key={skill} style={styles.chip}>
                    {skill}
                  </Chip>
                ))}
                {application.skills.length > 3 && (
                  <Chip>+{application.skills.length - 3} more</Chip>
                )}
              </View>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => handleViewDetails(application)}>View Details</Button>
            </Card.Actions>
          </Card>
        ))}
      </ScrollView>
      <ApplicationDetailsModal />
    </View>
  );
};

const calculateAge = (dateOfBirth: string) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
  },
  applicationCard: {
    marginBottom: 16,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  statusChip: {
    marginRight: 16,
  },
  modalContainer: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 8,
    maxHeight: '90%',
  },
  modalScroll: {
    flex: 1,
  },
  detailCard: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionLabel: {
    marginTop: 16,
    marginBottom: 8,
  },
  documentButton: {
    marginVertical: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default AdminMaidReviewScreen;
