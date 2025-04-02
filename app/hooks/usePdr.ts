import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../features/store';
import { updateStep, updateHeading, startTracking, stopTracking, updatePositionWithPdr } from '../features/mapSlice';
import { calculateStepLength, detectSteps } from '../utils/pdrCalculations';
import { Accelerometer, Gyroscope } from 'expo-sensors';

const usePdr = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  let lastAccelerationData: {x: number, y: number, z: number}[] = [];
  let lastUpdateTime = 0;
  
  const startPdrTracking = () => {
    dispatch(startTracking());
    
    try {
      // Start accelerometer
      Accelerometer.setUpdateInterval(60);
      const subscription = Accelerometer.addListener(data => {
        const now = Date.now();
        lastAccelerationData.push({
          x: data.x || 0,
          y: data.y || 0,
          z: data.z || 0
        });
        
        // Process data every 500ms
        if (now - lastUpdateTime > 500) {
          processSensorData();
          lastUpdateTime = now;
        }
      });
      
      // Start gyroscope
      Gyroscope.setUpdateInterval(100);
      const gyroSubscription = Gyroscope.addListener(data => {
        if (data.z !== null) {
          const heading = (Math.atan2(data.x, data.y) * 180 / Math.PI + 360) % 360;
          dispatch(updateHeading({ heading, timestamp: Date.now() }));
        }
      });
      
      return () => {
        subscription.remove();
        gyroSubscription.remove();
      };
    } catch (error) {
      console.error('Sensor access failed:', error);
      return mockSensors();
    }
  };
  
  const stopPdrTracking = () => {
    dispatch(stopTracking());
  };
  
  const processSensorData = () => {
    if (lastAccelerationData.length === 0) return;
    
    // Detect steps
    const stepsDetected = detectSteps(lastAccelerationData);
    if (stepsDetected > 0) {
      const stepLength = calculateStepLength(lastAccelerationData, stepsDetected);
      
      dispatch(updateStep({ timestamp: Date.now() }));
      dispatch(updatePositionWithPdr({ 
        stepLength,
        heading: lastHeading || 0
      }));
    }
    
    lastAccelerationData = [];
  };
  
  let lastHeading = 0;
  const mockSensors = () => {
    const mockInterval = setInterval(() => {
      lastHeading = (lastHeading + (Math.random() * 10 - 5)) % 360;
      dispatch(updateHeading({ heading: lastHeading, timestamp: Date.now() }));
      
      // Simulate steps every 1.5 seconds
      dispatch(updateStep({ timestamp: Date.now() }));
      dispatch(updatePositionWithPdr({ 
        stepLength: 0.7,
        heading: lastHeading
      }));
    }, 1500);
    
    return () => clearInterval(mockInterval);
  };
  
  return {
    startPdrTracking,
    stopPdrTracking
  };
};

export default usePdr;
