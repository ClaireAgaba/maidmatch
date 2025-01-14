import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { theme } from './src/theme';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <AppNavigator />
    </PaperProvider>
  );
}
