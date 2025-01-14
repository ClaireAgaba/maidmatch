import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { AdminLoginScreen } from '../screens/AdminLoginScreen';
import { MaidSignupScreen } from '../screens/MaidSignupScreen';
import { HomeOwnerSignupScreen } from '../screens/HomeOwnerSignupScreen';
import { MaidDashboardScreen } from '../screens/MaidDashboardScreen';
import { HomeOwnerDashboardScreen } from '../screens/HomeOwnerDashboardScreen';
import { AdminDashboardScreen } from '../screens/AdminDashboardScreen';
import { AdminApprovalsScreen } from '../screens/AdminApprovalsScreen';
import { MessagesScreen } from '../screens/MessagesScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { AccountSettingsScreen } from '../screens/AccountSettingsScreen';
import { AvailableMaidsScreen } from '../screens/AvailableMaidsScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Auth Screens */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
        <Stack.Screen name="MaidSignup" component={MaidSignupScreen} />
        <Stack.Screen name="HomeOwnerSignup" component={HomeOwnerSignupScreen} />

        {/* Dashboard Screens */}
        <Stack.Screen name="MaidDashboard" component={MaidDashboardScreen} />
        <Stack.Screen name="HomeOwnerDashboard" component={HomeOwnerDashboardScreen} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
        <Stack.Screen name="AdminApprovals" component={AdminApprovalsScreen} />

        {/* Common Screens */}
        <Stack.Screen name="Messages" component={MessagesScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />
        <Stack.Screen name="AvailableMaids" component={AvailableMaidsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
