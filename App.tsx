import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper';
import { theme } from './src/theme';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { MaidSignupScreen } from './src/screens/MaidSignupScreen';
import { HomeOwnerSignupScreen } from './src/screens/HomeOwnerSignupScreen';
import { MaidDashboardScreen } from './src/screens/MaidDashboardScreen';
import { HomeOwnerDashboardScreen } from './src/screens/HomeOwnerDashboardScreen';
import { AdminLoginScreen } from './src/screens/AdminLoginScreen';
import { AdminDashboardScreen } from './src/screens/AdminDashboardScreen';
import { RootStackParamList } from './src/navigation/types';
import { IconButton } from 'react-native-paper';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.primary,
            },
            headerTintColor: theme.colors.surface,
          }}
        >
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: 'Login' }}
          />
          <Stack.Screen
            name="AdminLogin"
            component={AdminLoginScreen}
            options={{ title: 'Admin Login' }}
          />
          <Stack.Screen
            name="MaidSignup"
            component={MaidSignupScreen}
            options={{ title: 'Maid Registration' }}
          />
          <Stack.Screen
            name="HomeOwnerSignup"
            component={HomeOwnerSignupScreen}
            options={{ title: 'Home Owner Registration' }}
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
