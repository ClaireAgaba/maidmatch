import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Button, useTheme, IconButton, ActivityIndicator } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { API_BASE_URL, API_ENDPOINTS, getAuthHeaders } from '../config/api';
import { useAuth } from '../contexts/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminDashboard'>;

interface SystemStats {
  users: {
    maids: {
      active: number;
      pending: number;
    };
    homeowners: {
      active: number;
      pending: number;
    };
  };
}

const AdminDashboardScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { token, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SystemStats>({
    users: {
      maids: { active: 0, pending: 0 },
      homeowners: { active: 0, pending: 0 }
    }
  });

  useEffect(() => {
    if (!token) {
      navigation.replace('Welcome');
      return;
    }
    fetchStats();
  }, [token]);

  const fetchStats = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.ADMIN_STATS}`,
        {
          headers: getAuthHeaders(token || ''),
        }
      );

      if (response.status === 401) {
        await logout();
        navigation.replace('AdminLogin');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Welcome' }],
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>Admin Dashboard</Text>
        <IconButton
          icon="logout"
          mode="contained"
          onPress={handleLogout}
        />
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.card} mode="outlined">
          <Card.Title title="User Statistics" />
          <Card.Content>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text variant="titleLarge">{stats.users.maids.active}</Text>
                <Text>Active Maids</Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="titleLarge">{stats.users.maids.pending}</Text>
                <Text>Pending Maids</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={() => navigation.navigate('AdminApprovals')}
          style={styles.button}
          icon="account-check"
        >
          Pending Approvals ({stats.users.maids.pending})
        </Button>

        <Button
          mode="outlined"
          onPress={() => navigation.navigate('AdminReferenceData')}
          style={styles.button}
          icon="database"
        >
          Manage Reference Data
        </Button>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 4,
  },
  title: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  button: {
    marginBottom: 16,
  },
});

export default AdminDashboardScreen;
