import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Card, Avatar, Title, Paragraph, Button, Chip, Searchbar, useTheme } from 'react-native-paper';
import type { RootStackScreenProps } from '../navigation/types';

type Props = RootStackScreenProps<'AvailableMaids'>;

interface Maid {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  experience: string;
  location: string;
  specialties: string[];
  hourlyRate: number;
  availability: 'available' | 'busy' | 'offline';
}

const MOCK_MAIDS: Maid[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: 'https://i.pravatar.cc/150?img=1',
    rating: 4.8,
    experience: '5 years',
    location: 'Kampala Central',
    specialties: ['Deep Cleaning', 'Laundry', 'Cooking'],
    hourlyRate: 15,
    availability: 'available',
  },
  {
    id: '2',
    name: 'Mary Williams',
    avatar: 'https://i.pravatar.cc/150?img=2',
    rating: 4.6,
    experience: '3 years',
    location: 'Nakawa',
    specialties: ['House Cleaning', 'Pet Care', 'Organizing'],
    hourlyRate: 12,
    availability: 'available',
  },
  {
    id: '3',
    name: 'Grace Nakato',
    avatar: 'https://i.pravatar.cc/150?img=3',
    rating: 4.9,
    experience: '7 years',
    location: 'Makindye',
    specialties: ['Deep Cleaning', 'Child Care', 'Cooking'],
    hourlyRate: 18,
    availability: 'busy',
  },
];

const AvailableMaidsScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);

  const allSpecialties = Array.from(
    new Set(MOCK_MAIDS.flatMap(maid => maid.specialties))
  );

  const filteredMaids = MOCK_MAIDS.filter(maid => {
    const matchesSearch = maid.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      maid.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSpecialties = selectedSpecialties.length === 0 ||
      selectedSpecialties.some(specialty => maid.specialties.includes(specialty));
    
    return matchesSearch && matchesSpecialties;
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const handleBookMaid = (maidId: string) => {
    navigation.navigate('BookingScreen', { maidId });
  };

  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties(prev =>
      prev.includes(specialty)
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    );
  };

  const getAvailabilityColor = (availability: Maid['availability']) => {
    switch (availability) {
      case 'available':
        return theme.colors.primary;
      case 'busy':
        return theme.colors.error;
      case 'offline':
        return theme.colors.backdrop;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search by name or location"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      <ScrollView horizontal style={styles.filtersContainer}>
        {allSpecialties.map(specialty => (
          <Chip
            key={specialty}
            selected={selectedSpecialties.includes(specialty)}
            onPress={() => toggleSpecialty(specialty)}
            style={styles.filterChip}
            mode="outlined"
          >
            {specialty}
          </Chip>
        ))}
      </ScrollView>

      <ScrollView style={styles.maidsContainer}>
        {filteredMaids.map(maid => (
          <Card key={maid.id} style={styles.maidCard}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.maidHeader}>
                {maid.avatar ? (
                  <Avatar.Image size={60} source={{ uri: maid.avatar }} />
                ) : (
                  <Avatar.Text size={60} label={getInitials(maid.name)} />
                )}
                <View style={styles.maidInfo}>
                  <Title>{maid.name}</Title>
                  <Paragraph style={styles.location}>{maid.location}</Paragraph>
                  <View style={styles.ratingContainer}>
                    <Paragraph>⭐ {maid.rating.toFixed(1)}</Paragraph>
                    <Chip
                      mode="flat"
                      style={[
                        styles.availabilityChip,
                        { backgroundColor: getAvailabilityColor(maid.availability) }
                      ]}
                    >
                      {maid.availability}
                    </Chip>
                  </View>
                </View>
              </View>

              <View style={styles.specialtiesContainer}>
                {maid.specialties.map(specialty => (
                  <Chip
                    key={specialty}
                    style={styles.specialtyChip}
                    textStyle={styles.specialtyText}
                  >
                    {specialty}
                  </Chip>
                ))}
              </View>

              <View style={styles.detailsContainer}>
                <Paragraph>Experience: {maid.experience}</Paragraph>
                <Paragraph>Rate: ${maid.hourlyRate}/hr</Paragraph>
              </View>

              <Button
                mode="contained"
                onPress={() => handleBookMaid(maid.id)}
                disabled={maid.availability !== 'available'}
                style={[
                  styles.bookButton,
                  { backgroundColor: theme.colors.primary }
                ]}
              >
                Book Now
              </Button>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchBar: {
    elevation: 0,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  filterChip: {
    marginRight: 8,
  },
  maidsContainer: {
    padding: 16,
  },
  maidCard: {
    marginBottom: 16,
    elevation: 2,
  },
  cardContent: {
    padding: 16,
  },
  maidHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  maidInfo: {
    marginLeft: 16,
    flex: 1,
  },
  location: {
    opacity: 0.7,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  availabilityChip: {
    height: 24,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  specialtyChip: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  specialtyText: {
    fontSize: 12,
  },
  detailsContainer: {
    marginBottom: 16,
  },
  bookButton: {
    marginTop: 8,
  },
});

export default AvailableMaidsScreen;
