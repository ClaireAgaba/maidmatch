import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { authService } from '../services/authService';
import { useNavigation } from '@react-navigation/native';

const PendingApprovalScreen = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/pending-approval.png')}
        style={styles.image}
      />
      
      <Text style={styles.title}>Verification Pending</Text>
      
      <Text style={styles.message}>
        Your account is currently under review. We'll notify you via email and SMS once your account has been verified.
      </Text>
      
      <Text style={styles.submessage}>
        This usually takes 24-48 hours. If you haven't heard from us after this period, please contact our support team.
      </Text>
      
      <Button
        mode="outlined"
        onPress={handleLogout}
        style={styles.button}
      >
        Logout
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
    color: '#666',
  },
  submessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
    color: '#888',
  },
  button: {
    width: '80%',
  },
});

export default PendingApprovalScreen;
