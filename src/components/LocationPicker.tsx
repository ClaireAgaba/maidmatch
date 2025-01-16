import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, HelperText } from 'react-native-paper';
import * as Location from 'expo-location';

interface LocationPickerProps {
  onLocationSelect: (location: string) => void;
  error?: string;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelect,
  error
}) => {
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<string | null>(null);

  const getLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const address = await reverseGeocode(location.coords);
      
      setCurrentLocation(address);
      onLocationSelect(address);
    } catch (err) {
      console.error('Error getting location:', err);
      alert('Failed to get location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reverseGeocode = async (coords: { latitude: number; longitude: number }) => {
    try {
      const [result] = await Location.reverseGeocodeAsync(coords);
      if (result) {
        return `${result.street || ''}, ${result.subregion || ''}, ${result.city || ''}, ${result.region || ''}`.trim();
      }
      return 'Location not found';
    } catch (err) {
      console.error('Error reverse geocoding:', err);
      return 'Failed to get address';
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <View style={styles.container}>
      <Button
        mode="outlined"
        onPress={getLocation}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        {currentLocation || 'Detect Location'}
      </Button>
      {error && <HelperText type="error">{error}</HelperText>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  button: {
    marginVertical: 4,
  },
});
