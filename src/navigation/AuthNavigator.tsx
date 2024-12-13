import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View, DeviceEventEmitter } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { authService } from '../services/authService';

// Screens
import LoginScreen from '../screens/LoginScreen';
import MaidDashboardScreen from '../screens/MaidDashboardScreen';
import HomeownerDashboardScreen from '../screens/HomeownerDashboardScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import PendingApprovalScreen from '../screens/PendingApprovalScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import AccountSettingsScreen from '../screens/AccountSettingsScreen';
import MessagesScreen from '../screens/MessagesScreen';
import HelpScreen from '../screens/HelpScreen';
import UserDetailsScreen from '../screens/UserDetailsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: {
    role?: 'admin' | 'maid' | 'homeowner';
    isFirstLogin?: boolean;
    verificationStatus?: 'pending' | 'verified' | 'rejected';
  } | null;
}

const AdminTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#1a73e8',
      tabBarInactiveTintColor: 'gray',
    }}
  >
    <Tab.Screen
      name="Dashboard"
      component={AdminDashboardScreen}
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="view-dashboard" size={24} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Help"
      component={HelpScreen}
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="help-circle" size={24} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Logout"
      component={ChangePasswordScreen}
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="logout" size={24} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

const UserTabs = ({ role }: { role: 'maid' | 'homeowner' }) => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#1a73e8',
      tabBarInactiveTintColor: 'gray',
    }}
  >
    <Tab.Screen
      name="Dashboard"
      component={role === 'maid' ? MaidDashboardScreen : HomeownerDashboardScreen}
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="view-dashboard" size={24} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Messages"
      component={MessagesScreen}
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="message" size={24} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={UserDetailsScreen}
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="account" size={24} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Settings"
      component={AccountSettingsScreen}
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="cog" size={24} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Help"
      component={HelpScreen}
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="help-circle" size={24} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

export const AuthNavigator = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    user: null,
  });

  useEffect(() => {
    console.log('AuthNavigator mounted');
    checkAuthStatus();

    const subscription = DeviceEventEmitter.addListener('authStateChanged', () => {
      console.log('Auth state change detected');
      checkAuthStatus();
    });

    return () => {
      console.log('AuthNavigator unmounting');
      subscription.remove();
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log('Checking auth status...');
      const authenticated = await authService.isAuthenticated();
      console.log('Is authenticated:', authenticated);

      if (authenticated) {
        const user = await authService.getCurrentUser();
        console.log('Current user:', user);

        setAuthState({
          isLoading: false,
          isAuthenticated: true,
          user,
        });
      } else {
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          user: null,
        });
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setAuthState({
        isLoading: false,
        isAuthenticated: false,
        user: null,
      });
    }
  };

  if (authState.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!authState.isAuthenticated ? (
        <AuthStack />
      ) : authState.user?.role === 'admin' ? (
        <AdminTabs />
      ) : (
        <UserTabs role={authState.user?.role as 'maid' | 'homeowner'} />
      )}
    </NavigationContainer>
  );
};
