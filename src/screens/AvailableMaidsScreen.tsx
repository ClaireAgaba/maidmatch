import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Card, Avatar, Title, Paragraph, Button, Chip } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'AvailableMaids'>;

// Mock data - replace with actual API call
const MOCK_MAIDS = [
  {
    id: '1',
    name: 'Jane Doe',
    age: 28,
    experience: '5 years',
    languages: ['English', 'Swahili'],
    employmentTypes: ['temporary', 'permanent'],
    rating: 4.5,
    available: true,
    photo: 'https://example.com/photo1.jpg',
  },
  {
    id: '2',
    name: 'Mary Smith',
    age: 35,
    experience: '8 years',
    languages: ['English', 'Luganda'],
    employmentTypes: ['permanent'],
    rating: 4.8,
    available: true,
    photo: 'https://example.com/photo2.jpg',
  },
  // Add more mock data as needed
];

export function AvailableMaidsScreen({ route, navigation }: Props) {
  const { employmentType } = route.params;

  const availableMaids = MOCK_MAIDS.filter(maid => 
    maid.available && maid.employmentTypes.includes(employmentType)
  );

  const handleSendRequest = (maidId: string) => {
    // TODO: Implement send request functionality
    console.log('Send request to maid:', maidId);
  };

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>
        Available {employmentType === 'temporary' ? 'Temporary' : 'Permanent'} Maids
      </Title>
      
      {availableMaids.map((maid) => (
        <Card key={maid.id} style={styles.card} onPress={() => navigation.navigate('MaidDetails', { maidId: maid.id })}>
          <Card.Content>
            <View style={styles.header}>
              <Avatar.Image 
                size={60} 
                source={{ uri: maid.photo }}
                style={styles.avatar}
              />
              <View style={styles.headerText}>
                <Title>{maid.name}</Title>
                <Paragraph>{maid.age} years old • {maid.experience} experience</Paragraph>
              </View>
            </View>
            
            <View style={styles.chips}>
              {maid.languages.map((language) => (
                <Chip key={language} style={styles.chip}>{language}</Chip>
              ))}
              {maid.employmentTypes.map((type) => (
                <Chip key={type} style={styles.chip}>
                  {type === 'temporary' ? 'Temp' : 'Perm'}
                </Chip>
              ))}
            </View>

            <Paragraph style={styles.rating}>Rating: {maid.rating} ⭐</Paragraph>
          </Card.Content>
          
          <Card.Actions>
            <Button onPress={() => navigation.navigate('MaidDetails', { maidId: maid.id })}>
              View Profile
            </Button>
            <Button mode="contained" onPress={() => handleSendRequest(maid.id)}>
              Send Request
            </Button>
          </Card.Actions>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    margin: 16,
  },
  card: {
    margin: 16,
    marginTop: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  rating: {
    marginTop: 8,
  },
});
