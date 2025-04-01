import {
  AccelerometerMeasurement,
  GyroscopeMeasurement,
  MagnetometerMeasurement,
} from "expo-sensors";

export interface SensorData {
  accelerometer: { x: number; y: number; z: number };
  gyroscope: { x: number; y: number; z: number };
  magnetometer: { x: number; y: number; z: number };
  timestamp: number;
}

// export function prepareSensorData(
//   accelerometer: AccelerometerMeasurement,
//   gyroscope: GyroscopeMeasurement,
//   magnetometer: MagnetometerMeasurement
// ): SensorData {
//   return {
//     accelerometer: {
//       x: accelerometer?.x ?? 0,
//       y: accelerometer?.y ?? 0,
//       z: accelerometer?.z ?? 0,
//     },
//     gyroscope: {
//       x: gyroscope?.x ?? 0,
//       y: gyroscope?.y ?? 0,
//       z: gyroscope?.z ?? 0,
//     },
//     magnetometer: {
//       x: magnetometer?.x ?? 0,
//       y: magnetometer?.y ?? 0,
//       z: magnetometer?.z ?? 0,
//     },
//     timestamp: Date.now(),
//   };
// }
  
export function prepareSensorData(
  accelerometer: AccelerometerMeasurement,
  gyroscope: GyroscopeMeasurement,
  magnetometer: MagnetometerMeasurement
) {
  return {
    accelerometer: {
      x: (accelerometer?.x ?? 0) * 9.80665, // Convert g to m/s²
      y: (accelerometer?.y ?? 0) * 9.80665,
      z: (accelerometer?.z ?? 0) * 9.80665,
    },
    gyroscope: {
      x: gyroscope?.x ?? 0,
      y: gyroscope?.y ?? 0,
      z: gyroscope?.z ?? 0,
    },
    magnetometer: {
      x: magnetometer?.x ?? 0,
      y: magnetometer?.y ?? 0,
      z: magnetometer?.z ?? 0,
    },
    timestamp: Date.now(),
  };
}