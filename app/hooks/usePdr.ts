import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../features/store';
import { updateStep, updateHeading, startTracking, stopTracking, updatePositionWithPdr } from '../features/mapSlice';
import { calculateStepLength, detectSteps } from '../utils/pdrCalculations';
import { Accelerometer, Gyroscope, Magnetometer } from 'expo-sensors';

const lowPass = (current: number, last: number, alpha: number) => alpha * current + (1 - alpha) * last;

const usePdr = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isTracking = useSelector((state: RootState) => state.map.isTracking);
  const [currentHeading, setCurrentHeading] = useState(0);
  
  const lastAccelerationData = useRef<{x: number, y: number, z: number}[]>([]);
  const lastSmoothedAcc = useRef({ x: 0, y: 0, z: 0 });
  const lastUpdateTime = useRef(0);

  const processSensorData = () => {
    if (lastAccelerationData.current.length === 0) return;

    // Smooth acceleration data
    const smoothedAcceleration = lastAccelerationData.current.reduce((acc, curr) => ({
      x: lowPass(curr.x, acc.x, 0.8),
      y: lowPass(curr.y, acc.y, 0.8),
      z: lowPass(curr.z, acc.z, 0.8),
    }), lastSmoothedAcc.current);

    // Detect steps
    const stepsDetected = detectSteps(lastAccelerationData.current);
    if (stepsDetected > 0) {
      const stepLengthMeters = calculateStepLength(lastAccelerationData.current, stepsDetected);
      
      dispatch(updateStep({ timestamp: Date.now() }));
      dispatch(updatePositionWithPdr({ 
        stepLength: stepLengthMeters,
        heading: currentHeading,
      }));
    }

    // Update for next iteration
    lastSmoothedAcc.current = smoothedAcceleration;
    lastAccelerationData.current = [];
  };

  useEffect(() => {
    let subscriptions: { remove: () => void }[] = [];
    
    if (isTracking) {
      // Accelerometer
      Accelerometer.setUpdateInterval(10);
      const accSub = Accelerometer.addListener(data => {
        const now = Date.now();
        lastAccelerationData.current.push({
          x: data.x || 0,
          y: data.y || 0,
          z: data.z || 0
        });
        
        if (now - lastUpdateTime.current > 100) {
          processSensorData();
          lastUpdateTime.current = now;
        }
      });

      // Magnetometer
      Magnetometer.setUpdateInterval(50);
      const magSub = Magnetometer.addListener(data => {
        if (data.x && data.y) {
          const heading = Math.atan2(data.y, data.x) * (180 / Math.PI);
          setCurrentHeading((heading + 360) % 360);
        }
      });

      // Gyroscope
      Gyroscope.setUpdateInterval(50);
      const gyroSub = Gyroscope.addListener(data => {
        if (data.z !== null) {
          const dt = 0.1;
          const alpha = 0.98;
          const gyroHeading = currentHeading + (data.z * dt);
          const fusedHeading = alpha * gyroHeading + (1-alpha) * currentHeading;
          
          setCurrentHeading((fusedHeading + 360) % 360);
          dispatch(updateHeading({
            heading: (fusedHeading + 360) % 360,
            timestamp: Date.now()
          }));
        }
      });

      subscriptions = [accSub, magSub, gyroSub];
    }
    
    return () => {
      subscriptions.forEach(sub => sub.remove());
    };
  }, [isTracking, currentHeading]);

  const startPdrTracking = () => {
    dispatch(startTracking());
  };
  
  const stopPdrTracking = () => {
    dispatch(stopTracking());
  };
  
  return {
    startPdrTracking,
    stopPdrTracking
  };
};

export default usePdr;
