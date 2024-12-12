import React from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { Card, Title, Text, Button, useTheme, List, Avatar, Divider } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export function SettingsScreen({ navigation }: Props) {
  const theme = useTheme();

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            // TODO: Implement account deletion
            navigation.navigate('Welcome');
          },
          style: 'destructive',
        },
      ],
    );
  };

  const handleSwitchAccountType = () => {
    Alert.alert(
      'Switch Account Type',
      'Are you sure you want to switch your account type? You will need to complete the registration process again.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Switch',
          onPress: () => {
            // TODO: Implement account type switching
            navigation.navigate('Welcome');
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Avatar.Icon 
          size={80} 
          icon="cog" 
          style={{ backgroundColor: theme.colors.primary }}
        />
        <Title style={styles.headerTitle}>Settings</Title>
      </View>

      <Card style={styles.section}>
        <Card.Content>
          <List.Section>
            <List.Subheader>Account Settings</List.Subheader>
            <List.Item
              title="Profile"
              description="Edit your personal information"
              left={props => <List.Icon {...props} icon="account" />}
              onPress={() => navigation.navigate('AccountSettings')}
            />
            <Divider />
            <List.Item
              title="Notifications"
              description="Manage your notification preferences"
              left={props => <List.Icon {...props} icon="bell" />}
              onPress={() => {/* TODO: Implement */}}
            />
            <Divider />
            <List.Item
              title="Privacy"
              description="Control your privacy settings"
              left={props => <List.Icon {...props} icon="shield" />}
              onPress={() => {/* TODO: Implement */}}
            />
          </List.Section>

          <List.Section>
            <List.Subheader>Account Type</List.Subheader>
            <List.Item
              title="Switch Account Type"
              description="Change between Maid and Home Owner"
              left={props => <List.Icon {...props} icon="swap-horizontal" />}
              onPress={handleSwitchAccountType}
            />
          </List.Section>

          <List.Section>
            <List.Subheader>Danger Zone</List.Subheader>
            <List.Item
              title="Delete Account"
              description="Permanently delete your account"
              left={props => <List.Icon {...props} icon="delete" color={theme.colors.error} />}
              onPress={handleDeleteAccount}
              titleStyle={{ color: theme.colors.error }}
            />
          </List.Section>
        </Card.Content>
      </Card>

      <View style={styles.footer}>
        <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
          App Version 1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 24,
  },
  headerTitle: {
    marginTop: 16,
  },
  section: {
    margin: 16,
    borderRadius: 12,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
});
