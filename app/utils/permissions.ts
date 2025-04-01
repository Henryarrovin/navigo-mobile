import { Accelerometer } from 'expo-sensors';
import * as Location from 'expo-location';

export const requestPermissions = async () => {
  const { status: motionStatus } = await Accelerometer.requestPermissionsAsync();
  const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();

  if (motionStatus !== 'granted') {
    throw new Error('Motion sensors permission required');
  }

  if (locationStatus !== 'granted') {
    console.warn('Location permission not granted - reduced accuracy');
  }

  return true;
};