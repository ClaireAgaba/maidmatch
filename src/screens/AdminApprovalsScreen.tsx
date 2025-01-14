import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { 
  Surface, 
  Text, 
  useTheme, 
  Searchbar, 
  SegmentedButtons,
  Card,
  Chip,
  Button,
  Portal,
  Modal,
  List,
  Divider
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { mockPendingApprovals } from '../data/adminMockData';
import { PendingApproval } from '../types/admin';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminApprovals'>;

export function AdminApprovalsScreen({ navigation }: Props) {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState<'all' | 'maid' | 'homeowner'>('all');
  const [selectedUser, setSelectedUser] = useState<PendingApproval | null>(null);
  const [viewingDocuments, setViewingDocuments] = useState(false);

  const filteredApprovals = mockPendingApprovals.filter(approval => {
    const matchesSearch = 
      approval.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      approval.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = userTypeFilter === 'all' || approval.userType === userTypeFilter;
    return matchesSearch && matchesType;
  });

  const handleApprove = (userId: string) => {
    // TODO: Implement approval logic
    setSelectedUser(null);
  };

  const handleReject = (userId: string) => {
    // TODO: Implement rejection logic
    setSelectedUser(null);
  };

  const renderUserCard = (approval: PendingApproval) => (
    <Card 
      key={approval.id} 
      style={styles.userCard}
      mode="outlined"
    >
      <Card.Content style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View>
            <Text variant="titleMedium">{approval.fullName}</Text>
            <Text variant="bodyMedium" style={styles.emailText}>{approval.email}</Text>
          </View>
          <Chip 
            icon={approval.userType === 'maid' ? 'account-tie' : 'home'}
            mode="flat"
            style={[
              styles.typeChip,
              { backgroundColor: theme.colors.secondaryContainer }
            ]}
          >
            {approval.userType === 'maid' ? 'Maid' : 'Homeowner'}
          </Chip>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="phone" size={20} color={theme.colors.onSurface} />
            <Text variant="bodyMedium" style={styles.detailText}>{approval.phone}</Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="map-marker" size={20} color={theme.colors.onSurface} />
            <Text variant="bodyMedium" style={styles.detailText}>
              {approval.location.area}, {approval.location.city}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="clock" size={20} color={theme.colors.onSurface} />
            <Text variant="bodyMedium" style={styles.detailText}>
              Submitted {new Date(approval.submittedAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View style={styles.cardActions}>
          <Button 
            mode="contained"
            onPress={() => setSelectedUser(approval)}
            style={styles.reviewButton}
          >
            Review Application
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  const renderDetailsModal = () => (
    <Portal>
      <Modal
        visible={!!selectedUser}
        onDismiss={() => setSelectedUser(null)}
        contentContainerStyle={[
          styles.modalContent,
          { backgroundColor: theme.colors.background }
        ]}
      >
        <ScrollView>
          <View style={styles.modalHeader}>
            <Text variant="headlineSmall" style={styles.modalTitle}>
              Application Review
            </Text>
            <Chip 
              icon={selectedUser?.userType === 'maid' ? 'account-tie' : 'home'}
              mode="flat"
            >
              {selectedUser?.userType === 'maid' ? 'Maid' : 'Homeowner'}
            </Chip>
          </View>

          <Card style={styles.sectionCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Personal Information
              </Text>
              <List.Item 
                title="Full Name"
                description={selectedUser?.fullName}
                left={props => <List.Icon {...props} icon="account" />}
              />
              <List.Item 
                title="Email"
                description={selectedUser?.email}
                left={props => <List.Icon {...props} icon="email" />}
              />
              <List.Item 
                title="Phone"
                description={selectedUser?.phone}
                left={props => <List.Icon {...props} icon="phone" />}
              />
              <List.Item 
                title="Location"
                description={`${selectedUser?.location.area}, ${selectedUser?.location.city}`}
                left={props => <List.Icon {...props} icon="map-marker" />}
              />
            </Card.Content>
          </Card>

          <Card style={styles.sectionCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Documents
              </Text>
              {selectedUser?.documents.map(doc => (
                <List.Item
                  key={doc.id}
                  title={doc.type.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                  description={doc.status}
                  left={props => <List.Icon {...props} icon="file-document" />}
                  right={() => (
                    <Button 
                      mode="contained-tonal"
                      onPress={() => {/* TODO: View document */}}
                    >
                      View
                    </Button>
                  )}
                />
              ))}
            </Card.Content>
          </Card>

          <View style={styles.modalActions}>
            <Button
              mode="contained"
              onPress={() => handleApprove(selectedUser!.id)}
              icon="check"
              style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
            >
              Approve
            </Button>
            <Button
              mode="contained"
              onPress={() => handleReject(selectedUser!.id)}
              icon="close"
              style={[styles.actionButton, { backgroundColor: theme.colors.error }]}
            >
              Reject
            </Button>
          </View>
        </ScrollView>
      </Modal>
    </Portal>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface style={styles.header} elevation={1}>
        <Text variant="headlineSmall" style={styles.title}>User Approvals</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          {mockPendingApprovals.length} pending applications
        </Text>
      </Surface>

      <View style={styles.filters}>
        <Searchbar
          placeholder="Search by name or email"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
        
        <SegmentedButtons
          value={userTypeFilter}
          onValueChange={value => setUserTypeFilter(value as typeof userTypeFilter)}
          buttons={[
            { value: 'all', label: 'All' },
            { value: 'maid', label: 'Maids' },
            { value: 'homeowner', label: 'Homeowners' }
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      <ScrollView style={styles.content}>
        {filteredApprovals.map(renderUserCard)}
      </ScrollView>

      {renderDetailsModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  title: {
    fontWeight: 'bold',
  },
  subtitle: {
    opacity: 0.7,
    marginTop: 4,
  },
  filters: {
    padding: 16,
  },
  searchBar: {
    marginBottom: 16,
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  userCard: {
    marginBottom: 16,
  },
  cardContent: {
    gap: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  emailText: {
    opacity: 0.7,
  },
  typeChip: {
    minWidth: 100,
    alignItems: 'center',
  },
  detailsContainer: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    opacity: 0.7,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  reviewButton: {
    minWidth: 150,
  },
  modalContent: {
    margin: 20,
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontWeight: 'bold',
  },
  sectionCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 24,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
  },
});
