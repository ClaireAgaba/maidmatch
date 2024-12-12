import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper';
import { theme } from './src/theme';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { MaidSignupScreen } from './src/screens/MaidSignupScreen';
import { HomeOwnerSignupScreen } from './src/screens/HomeOwnerSignupScreen';
import { MaidDashboardScreen } from './src/screens/MaidDashboardScreen';
import { HomeOwnerDashboardScreen } from './src/screens/HomeOwnerDashboardScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { AccountSettingsScreen } from './src/screens/AccountSettingsScreen';
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
            headerRight: () => (
              <IconButton
                icon="cog"
                iconColor={theme.colors.surface}
                onPress={() => navigation.navigate('Settings')}
              />
            ),
          }}
        >
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ title: 'Choose Account Type' }}
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
            name="Settings"
            component={SettingsScreen}
            options={{ title: 'Settings' }}
          />
          <Stack.Screen
            name="AccountSettings"
            component={AccountSettingsScreen}
            options={{ title: 'Account Settings' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
