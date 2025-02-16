import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, Platform } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import GoogleMapReact from 'google-map-react';

const MapMarker = ({ text }) => (
  <View style={styles.markerContainer}>
    <View style={styles.marker}>
      <Ionicons name="location" size={24} color="#007AFF" />
    </View>
    <Text style={styles.markerText}>{text}</Text>
  </View>
);

export default function CalculateScreen() {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [distance, setDistance] = useState(null);
  const [currentLocation, setCurrentLocation] = useState({
    lat: 40.7128,
    lng: -74.0060
  });
  const [mapBounds, setMapBounds] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        const newLocation = {
          lat: location.coords.latitude,
          lng: location.coords.longitude
        };
        setCurrentLocation(newLocation);
      }
    })();
  }, []);

  useEffect(() => {
    if (origin && destination) {
      const bounds = {
        ne: {
          lat: Math.max(origin.latitude, destination.latitude),
          lng: Math.max(origin.longitude, destination.longitude)
        },
        sw: {
          lat: Math.min(origin.latitude, destination.latitude),
          lng: Math.min(origin.longitude, destination.longitude)
        }
      };
      setMapBounds(bounds);
    }
  }, [origin, destination]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleCalculate = () => {
    if (origin && destination) {
      const dist = calculateDistance(
        origin.latitude,
        origin.longitude,
        destination.latitude,
        destination.longitude
      );
      setDistance(dist);
    }
  };

  const handleMapChange = ({ center, bounds, zoom }) => {
    setCurrentLocation(center);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.mapContainer}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY }}
          defaultCenter={currentLocation}
          center={currentLocation}
          defaultZoom={12}
          onChange={handleMapChange}
          options={{
            fullscreenControl: false,
            zoomControl: true,
            gestureHandling: 'greedy'
          }}
        >
          {origin && (
            <MapMarker
              lat={origin.latitude}
              lng={origin.longitude}
              text="Pickup"
            />
          )}
          {destination && (
            <MapMarker
              lat={destination.latitude}
              lng={destination.longitude}
              text="Dropoff"
            />
          )}
        </GoogleMapReact>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.inputContainer}>
          <GooglePlacesAutocomplete
            placeholder="Enter pickup location"
            onPress={(data, details = null) => {
              const location = {
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
              };
              setOrigin(location);
              setCurrentLocation({
                lat: location.latitude,
                lng: location.longitude
              });
            }}
            styles={autocompleteStyles}
            fetchDetails={true}
            query={{
              key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY,
              language: 'en',
            }}
          />
          <GooglePlacesAutocomplete
            placeholder="Enter destination"
            onPress={(data, details = null) => {
              const location = {
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
              };
              setDestination(location);
            }}
            styles={autocompleteStyles}
            fetchDetails={true}
            query={{
              key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY,
              language: 'en',
            }}
          />
        </View>

        <Pressable
          style={[styles.calculateButton, (!origin || !destination) && styles.calculateButtonDisabled]}
          onPress={handleCalculate}
          disabled={!origin || !destination}
        >
          <Text style={styles.calculateButtonText}>Calculate Fare</Text>
        </Pressable>

        {distance && (
          <View style={styles.resultContainer}>
            <Text style={styles.distanceText}>
              Distance: {distance.toFixed(2)} km
            </Text>
            <Text style={styles.fareText}>
              Estimated Fare: ${(distance * 2.5).toFixed(2)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.5,
  },
  searchContainer: {
    position: 'absolute',
    width: '100%',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    top: 40,
    margin: 10,
    marginHorizontal: 20,
    width: Dimensions.get('window').width - 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputContainer: {
    marginBottom: 10,
  },
  calculateButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  calculateButtonDisabled: {
    backgroundColor: '#ccc',
  },
  calculateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  distanceText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  fareText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
  },
  markerContainer: {
    position: 'absolute',
    transform: 'translate(-50%, -100%)',
    alignItems: 'center',
  },
  marker: {
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  markerText: {
    marginTop: 4,
    color: '#333',
    fontSize: 12,
    fontWeight: '500',
    backgroundColor: 'white',
    padding: 4,
    borderRadius: 4,
  },
});

const autocompleteStyles = {
  container: {
    flex: 0,
    marginBottom: 10,
  },
  textInput: {
    height: 50,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 15,
    fontSize: 16,
  },
  description: {
    fontSize: 14,
  },
};