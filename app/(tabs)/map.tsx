import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { PermissionsAndroid } from 'react-native';
import * as Location from 'expo-location';

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

const MapPage = () => {
  const [region, setRegion] = useState<Region | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const getUserLocation = async () => {
    setLoading(true);
    const permissionGranted = await requestLocationPermission();
    
    if (permissionGranted) {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });
          const { latitude, longitude } = location.coords;
          
          setRegion({
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
          setLoading(false);
        } else {
          setError('Location permission denied');
          setLoading(false);
        }
      } catch (err) {
        setError('Error getting location');
        setLoading(false);
      }
    } else {
      setError('Permission denied');
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Map Page</Text>
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <MapView
          style={styles.map}
          region={region ?? undefined}
          showsUserLocation={true}
          followsUserLocation={true}
          loadingEnabled={true}
        >
          {region && <Marker coordinate={region} />}
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  map: {
    flex: 1,
    width: '100%',
  },
  loading: {
    fontSize: 18,
    color: 'gray',
  },
  error: {
    fontSize: 18,
    color: 'red',
  },
});

export default MapPage;
