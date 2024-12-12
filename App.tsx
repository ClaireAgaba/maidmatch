import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper';
import { theme } from './src/theme';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { MaidSignupScreen } from './src/screens/MaidSignupScreen';
import { HomeOwnerSignupScreen } from './src/screens/HomeOwnerSignupScreen';
import { RootStackParamList } from './src/navigation/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{
            headerShown: true,
            headerBackTitle: 'Back',
          }}>
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
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
