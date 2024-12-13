import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Button, DataTable, Searchbar, Chip, Portal, Modal, List, useTheme, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { adminService } from '../services/adminService';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type VerificationStatus = 'pending' | 'verified' | 'rejected';

interface MaidApplication {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  submittedAt: string;
  verificationStatus: VerificationStatus;
  documents: {
    identificationDoc: string;
    medicalCertificate: string;
    policeClearance: string;
    lcLetter: string;
    educationProof: string;
    referenceLetter: string;
    workPermit: string;
  };
  medicalHistory: {
    bloodType: string;
    vaccinations: {
      covid19: boolean;
      tuberculosis: boolean;
      hepatitisB: boolean;
    };
    physicalDisabilities?: string;
    mentalHealthConditions?: string;
  };
}

interface DashboardStats {
  pendingVerifications: number;
  totalMaids: number;
  totalHomeowners: number;
  activeJobs: number;
  completedJobs: number;
  totalEarnings: number;
  recentComplaints: number;
}

export function AdminDashboardScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [applications, setApplications] = useState<MaidApplication[]>([]);
  const [selectedMaid, setSelectedMaid] = useState<MaidApplication | null>(null);
  const [viewingDocuments, setViewingDocuments] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, applicationsData] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getPendingApplications()
      ]);
      setStats(statsData);
      setApplications(applicationsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (maidId: string, status: VerificationStatus) => {
    try {
      await adminService.updateVerificationStatus(maidId, status);
      // Refresh applications list
      const updatedApplications = await adminService.getPendingApplications();
      setApplications(updatedApplications);
      setSelectedMaid(null);
    } catch (error) {
      console.error('Error updating verification status:', error);
    }
  };

  const renderStats = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsContainer}>
      <Card style={styles.statCard}>
        <Card.Content>
          <Text variant="titleMedium">Pending Verifications</Text>
          <Text variant="displaySmall" style={styles.statNumber}>{stats?.pendingVerifications || 0}</Text>
        </Card.Content>
      </Card>

      <Card style={styles.statCard}>
        <Card.Content>
          <Text variant="titleMedium">Total Maids</Text>
          <Text variant="displaySmall" style={styles.statNumber}>{stats?.totalMaids || 0}</Text>
        </Card.Content>
      </Card>

      <Card style={styles.statCard}>
        <Card.Content>
          <Text variant="titleMedium">Total Homeowners</Text>
          <Text variant="displaySmall" style={styles.statNumber}>{stats?.totalHomeowners || 0}</Text>
        </Card.Content>
      </Card>

      <Card style={styles.statCard}>
        <Card.Content>
          <Text variant="titleMedium">Active Jobs</Text>
          <Text variant="displaySmall" style={styles.statNumber}>{stats?.activeJobs || 0}</Text>
        </Card.Content>
      </Card>

      <Card style={styles.statCard}>
        <Card.Content>
          <Text variant="titleMedium">Revenue</Text>
          <Text variant="displaySmall" style={styles.statNumber}>
            ${stats?.totalEarnings?.toLocaleString() || '0'}
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );

  const renderApplicationsTable = () => (
    <Card style={styles.tableCard}>
      <Card.Content>
        <Text variant="titleLarge" style={styles.sectionTitle}>Pending Verifications</Text>
        <Searchbar
          placeholder="Search by name or email"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
        
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Name</DataTable.Title>
            <DataTable.Title>Submitted</DataTable.Title>
            <DataTable.Title>Status</DataTable.Title>
            <DataTable.Title>Actions</DataTable.Title>
          </DataTable.Header>

          {applications
            .filter(app => 
              app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
              app.email.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((application) => (
              <DataTable.Row key={application._id}>
                <DataTable.Cell>{application.fullName}</DataTable.Cell>
                <DataTable.Cell>
                  {new Date(application.submittedAt).toLocaleDateString()}
                </DataTable.Cell>
                <DataTable.Cell>
                  <Chip
                    icon={application.verificationStatus === 'pending' ? 'clock' : 'check'}
                    mode="outlined"
                  >
                    {application.verificationStatus}
                  </Chip>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Button
                    mode="contained"
                    onPress={() => setSelectedMaid(application)}
                  >
                    Review
                  </Button>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
        </DataTable>
      </Card.Content>
    </Card>
  );

  const renderMaidDetailsModal = () => (
    <Portal>
      <Modal
        visible={!!selectedMaid}
        onDismiss={() => setSelectedMaid(null)}
        contentContainerStyle={styles.modalContent}
      >
        {selectedMaid && (
          <ScrollView>
            <Text variant="headlineSmall" style={styles.modalTitle}>
              Application Review: {selectedMaid.fullName}
            </Text>

            <Card style={styles.sectionCard}>
              <Card.Content>
                <Text variant="titleMedium">Personal Information</Text>
                <List.Item title="Email" description={selectedMaid.email} />
                <List.Item title="Phone" description={selectedMaid.phone} />
              </Card.Content>
            </Card>

            <Card style={styles.sectionCard}>
              <Card.Content>
                <Text variant="titleMedium">Medical Information</Text>
                <List.Item title="Blood Type" description={selectedMaid.medicalHistory.bloodType} />
                <List.Item 
                  title="Vaccinations"
                  description={`COVID-19: ${selectedMaid.medicalHistory.vaccinations.covid19 ? '✓' : '✗'}
TB: ${selectedMaid.medicalHistory.vaccinations.tuberculosis ? '✓' : '✗'}
Hepatitis B: ${selectedMaid.medicalHistory.vaccinations.hepatitisB ? '✓' : '✗'}`}
                />
                {selectedMaid.medicalHistory.physicalDisabilities && (
                  <List.Item 
                    title="Physical Disabilities"
                    description={selectedMaid.medicalHistory.physicalDisabilities}
                  />
                )}
                {selectedMaid.medicalHistory.mentalHealthConditions && (
                  <List.Item 
                    title="Mental Health Conditions"
                    description={selectedMaid.medicalHistory.mentalHealthConditions}
                  />
                )}
              </Card.Content>
            </Card>

            <Card style={styles.sectionCard}>
              <Card.Content>
                <Text variant="titleMedium">Documents</Text>
                <Button
                  mode="contained"
                  onPress={() => setViewingDocuments(true)}
                  icon="file-document"
                  style={styles.viewDocsButton}
                >
                  View Documents
                </Button>
              </Card.Content>
            </Card>

            <View style={styles.actionButtons}>
              <Button
                mode="contained"
                onPress={() => handleVerification(selectedMaid._id, 'verified')}
                icon="check"
                style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
              >
                Approve
              </Button>
              <Button
                mode="contained"
                onPress={() => handleVerification(selectedMaid._id, 'rejected')}
                icon="close"
                style={[styles.actionButton, { backgroundColor: theme.colors.error }]}
              >
                Reject
              </Button>
            </View>
          </ScrollView>
        )}
      </Modal>
    </Portal>
  );

  const renderDocumentsModal = () => (
    <Portal>
      <Modal
        visible={viewingDocuments}
        onDismiss={() => setViewingDocuments(false)}
        contentContainerStyle={styles.modalContent}
      >
        {selectedMaid && (
          <ScrollView>
            <Text variant="headlineSmall" style={styles.modalTitle}>
              Documents: {selectedMaid.fullName}
            </Text>

            {Object.entries(selectedMaid.documents).map(([docType, url]) => (
              <Card key={docType} style={styles.documentCard}>
                <Card.Content>
                  <List.Item
                    title={docType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    left={props => <List.Icon {...props} icon="file-document" />}
                    right={props => (
                      <Button
                        mode="contained"
                        onPress={() => {
                          // Handle document viewing/download
                        }}
                      >
                        View
                      </Button>
                    )}
                  />
                </Card.Content>
              </Card>
            ))}
          </ScrollView>
        )}
      </Modal>
    </Portal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>Admin Dashboard</Text>
        <IconButton
          icon="cog"
          size={24}
          onPress={() => navigation.navigate('Settings')}
        />
      </View>

      {renderStats()}
      {renderApplicationsTable()}
      {renderMaidDetailsModal()}
      {renderDocumentsModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  statCard: {
    marginRight: 16,
    minWidth: 160,
  },
  statNumber: {
    marginTop: 8,
    fontWeight: 'bold',
  },
  tableCard: {
    flex: 1,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  searchBar: {
    marginBottom: 16,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  modalTitle: {
    marginBottom: 16,
  },
  sectionCard: {
    marginVertical: 8,
  },
  viewDocsButton: {
    marginTop: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  documentCard: {
    marginVertical: 8,
  },
});
