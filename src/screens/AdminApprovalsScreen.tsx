import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { 
  Card, 
  Text, 
  Button, 
  useTheme, 
  ActivityIndicator,
  Avatar,
  Chip,
  Divider
} from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { API_BASE_URL, API_ENDPOINTS, getAuthHeaders } from '../config/api';
import { useAuth } from '../contexts/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminApprovals'>;

interface PendingMaid {
  id: string;
  firstName: string;
  lastName: string;
  profilePhoto: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  nationality: string;
  educationLevel: string;
  languages: string[];
  skills: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const AdminApprovalsScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pendingMaids, setPendingMaids] = useState<PendingMaid[]>([]);

  const fetchPendingMaids = async () => {
    if (!token) {
      navigation.replace('AdminLogin');
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.PENDING_APPROVALS}`,
        {
          headers: getAuthHeaders(token),
        }
      );

      if (response.status === 401) {
        navigation.replace('AdminLogin');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch pending maids');
      }

      const data = await response.json();
      setPendingMaids(data);
    } catch (error) {
      console.error('Error fetching pending maids:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!token) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.APPROVE_USER(id)}`,
        {
          method: 'POST',
          headers: getAuthHeaders(token),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to approve maid');
      }

      // Refresh the list
      fetchPendingMaids();
    } catch (error) {
      console.error('Error approving maid:', error);
    }
  };

  const handleReject = async (id: string) => {
    if (!token) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.REJECT_USER(id)}`,
        {
          method: 'POST',
          headers: getAuthHeaders(token),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to reject maid');
      }

      // Refresh the list
      fetchPendingMaids();
    } catch (error) {
      console.error('Error rejecting maid:', error);
    }
  };

  useEffect(() => {
    fetchPendingMaids();
  }, [token]);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchPendingMaids();
            }}
          />
        }
      >
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Pending Maid Applications ({pendingMaids.length})
        </Text>

        {pendingMaids.map((maid) => (
          <Card key={maid.id} style={styles.card} mode="outlined">
            <Card.Title
              title={`${maid.firstName} ${maid.lastName}`}
              subtitle={`Applied on ${new Date(maid.createdAt).toLocaleDateString()}`}
              left={(props) => (
                <Avatar.Image
                  {...props}
                  source={{ uri: maid.profilePhoto }}
                  size={40}
                />
              )}
            />
            <Card.Content>
              <View style={styles.detailRow}>
                <Text variant="labelLarge">Age:</Text>
                <Text>{new Date().getFullYear() - new Date(maid.dateOfBirth).getFullYear()}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text variant="labelLarge">Gender:</Text>
                <Text>{maid.gender}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text variant="labelLarge">Education:</Text>
                <Text>{maid.educationLevel}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text variant="labelLarge">Languages:</Text>
                <View style={styles.chipContainer}>
                  {maid.languages.map((lang) => (
                    <Chip key={lang} style={styles.chip}>{lang}</Chip>
                  ))}
                </View>
              </View>
              <View style={styles.detailRow}>
                <Text variant="labelLarge">Skills:</Text>
                <View style={styles.chipContainer}>
                  {maid.skills.map((skill) => (
                    <Chip key={skill} style={styles.chip}>{skill}</Chip>
                  ))}
                </View>
              </View>
            </Card.Content>
            <Divider style={styles.divider} />
            <Card.Actions>
              <Button 
                mode="contained" 
                onPress={() => handleApprove(maid.id)}
                style={[styles.actionButton, styles.approveButton]}
              >
                Approve
              </Button>
              <Button 
                mode="contained" 
                onPress={() => handleReject(maid.id)}
                style={[styles.actionButton, styles.rejectButton]}
              >
                Reject
              </Button>
            </Card.Actions>
          </Card>
        ))}

        {pendingMaids.length === 0 && (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyText}>No pending applications</Text>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  chip: {
    marginRight: 4,
    marginBottom: 4,
  },
  divider: {
    marginVertical: 8,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#f44336',
  },
  emptyCard: {
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.6,
  },
});

export default AdminApprovalsScreen;
