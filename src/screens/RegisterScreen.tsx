import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.title}>
        Choose Account Type
      </Text>
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('MaidSignup')}
          style={styles.button}
        >
          I'm a Maid
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('HomeOwnerSignup')}
          style={styles.button}
        >
          I'm a Home Owner
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 400,
  },
  button: {
    marginVertical: 10,
  },
});
