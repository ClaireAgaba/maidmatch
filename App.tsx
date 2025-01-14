import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper';
import { theme } from './src/theme';
import { MaidDashboardScreen } from './src/screens/MaidDashboardScreen';
import { HomeOwnerDashboardScreen } from './src/screens/HomeOwnerDashboardScreen';
import { AdminDashboardScreen } from './src/screens/AdminDashboardScreen';
import { RootStackParamList } from './src/navigation/types';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Simple interface selector screen
function InterfaceSelector({ navigation }) {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>MaidMatch</Text>
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => navigation.navigate('MaidDashboard')}
        >
          Maid Interface
        </Button>
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => navigation.navigate('HomeOwnerDashboard')}
        >
          Home Owner Interface
        </Button>
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => navigation.navigate('AdminDashboard')}
        >
          Admin Interface
        </Button>
      </View>
    </View>
  );
}

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="InterfaceSelector"
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.primary,
            },
            headerTintColor: theme.colors.surface,
          }}
        >
          <Stack.Screen
            name="InterfaceSelector"
            component={InterfaceSelector}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MaidDashboard"
            component={MaidDashboardScreen}
            options={{ title: 'Maid Dashboard' }}
          />
          <Stack.Screen
            name="HomeOwnerDashboard"
            component={HomeOwnerDashboardScreen}
            options={{ title: 'Home Owner Dashboard' }}
          />
          <Stack.Screen
            name="AdminDashboard"
            component={AdminDashboardScreen}
            options={{ title: 'Admin Dashboard' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  title: {
    marginBottom: 40,
    color: theme.colors.primary,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  button: {
    marginVertical: 10,
  },
});
