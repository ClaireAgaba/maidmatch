import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Avatar } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

interface DashboardHeaderProps {
  fullName: string;
  profilePicture?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ fullName, profilePicture }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.nameText}>{fullName}</Text>
        </View>
        
        {profilePicture ? (
          <Image
            source={{ uri: profilePicture }}
            style={styles.avatar}
          />
        ) : (
          <Avatar.Text
            size={40}
            label={getInitials(fullName)}
            style={styles.avatar}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default DashboardHeader;
