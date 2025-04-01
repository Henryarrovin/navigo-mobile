export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface SensorData {
  accelerometer: Vector3D;
  gyroscope: Vector3D;
  magnetometer: Vector3D;
  timestamp: number;
}

export interface PDRData {
  position: {
    x: number;
    y: number;
  };
  heading: number;
  rotation: number;
  stepCount: number;
  distance: string;
  positionHistory: Array<{ x: number; y: number }>;
}

export interface PDRHookReturn {
  position: { x: number; y: number };
  heading: number;
  steps: number;
  distance: string;
  error: string | null;
  isLoading: boolean;
}