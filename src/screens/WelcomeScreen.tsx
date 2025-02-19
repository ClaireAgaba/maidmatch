import React from 'react';
import { StyleSheet, View, Dimensions, Image } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import type { RootStackScreenProps } from '../navigation/types';

type Props = RootStackScreenProps<'Welcome'>;

const { width, height } = Dimensions.get('window');

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/wel.jpg')}
          style={styles.image}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', theme.colors.background]}
          style={styles.gradient}
        />
      </View>

      <View style={styles.contentContainer}>
        <Text variant="displaySmall" style={[styles.title, { color: theme.colors.primary }]}>
          MaidMatch
        </Text>

        <Text variant="titleLarge" style={styles.subtitle}>
          Connect with trusted household help
        </Text>

        <Text variant="bodyLarge" style={styles.description}>
          Find reliable maids for temporary or permanent employment. Safe, secure, and convenient.
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('MaidRegistration')}
            style={styles.button}
          >
            Register as Maid
          </Button>

          <Button
            mode="contained"
            onPress={() => navigation.navigate('HomeOwnerSignup')}
            style={styles.button}
          >
            Register as Home Owner
          </Button>

          <Button
            mode="outlined"
            onPress={() => navigation.navigate('Login')}
            style={styles.button}
          >
            I already have an account
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.navigate('AdminLogin')}
            style={styles.adminButton}
            labelStyle={styles.adminButtonLabel}
          >
            Admin Login
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    height: height * 0.5,
    width: width,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 10,
    textAlign: 'center',
    opacity: 0.9,
  },
  description: {
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.7,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    maxWidth: 400,
  },
  button: {
    marginVertical: 8,
    width: '100%',
  },
  adminButton: {
    marginTop: 8,
  },
  adminButtonLabel: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default WelcomeScreen;
