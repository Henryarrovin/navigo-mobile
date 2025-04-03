import { PathPoint } from "../types/mapTypes";

const METERS_PER_UNIT = 0.2;

const lowPass = (current: number, last: number, alpha: number) => alpha * current + (1 - alpha) * last;

// Calculate new position based on step length and heading (in degrees)
// export function calculateNewPosition(
//   currentPosition: PathPoint, 
//   stepLength: number, 
//   heading: number
// ): PathPoint {
//   // Convert heading from degrees to radians
//   const headingRad = (heading * Math.PI) / 180;
  
//   return {
//     x: currentPosition.x + stepLength * Math.sin(headingRad),
//     y: currentPosition.y + stepLength * Math.cos(headingRad)
//   };
// }
// export function calculateNewPosition(
//   currentPosition: PathPoint,
//   stepLengthMeters: number, // Expect input in meters
//   heading: number
// ): PathPoint {
//   const headingRad = (heading * Math.PI) / 180;
//   const stepLengthUnits = stepLengthMeters / METERS_PER_UNIT; // Convert to map units
  
//   return {
//     x: currentPosition.x + stepLengthUnits * Math.sin(headingRad),
//     y: currentPosition.y + stepLengthUnits * Math.cos(headingRad),
//   };
// }

export function calculateNewPosition(
  currentPosition: PathPoint,
  stepLengthMeters: number,
  heading: number
): PathPoint {
  const headingRad = (heading * Math.PI) / 180;
  const stepLengthUnits = stepLengthMeters / METERS_PER_UNIT;
  
  // Adjust for map coordinate system (Y might need to be inverted)
  return {
    x: currentPosition.x + stepLengthUnits * Math.sin(headingRad),
    y: currentPosition.y - stepLengthUnits * Math.cos(headingRad) // Note the minus sign
  };
}

// Calculate step length based on frequency and acceleration data
// export function calculateStepLength(
//   accelerationData: {x: number, y: number, z: number}[],
//   stepFrequency: number
// ): number {
//   // Simple implementation - can be enhanced with more sophisticated algorithms
//   const avgAcceleration = accelerationData.reduce((sum, acc) => {
//     return sum + Math.sqrt(acc.x**2 + acc.y**2 + acc.z**2);
//   }, 0) / accelerationData.length;
  
//   // Empirical formula to estimate step length based on acceleration
//   return 0.35 + (avgAcceleration * 0.15);
// }

export function calculateStepLength(
  accelerationData: { x: number; y: number; z: number }[],
  stepFrequency: number
): number {
  const avgAcceleration = accelerationData.reduce((sum, acc) => {
    return sum + Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2);
  }, 0) / accelerationData.length;

  // Return step length IN METERS (will be converted later)
  return 0.35 + avgAcceleration * 0.15; // Empirical formula (in meters)
}

// Detect steps from accelerometer data using peak detection
// export function detectSteps(accelerationData: {x: number, y: number, z: number}[]): number {
//   const threshold = 1.2; // Adjust based on testing
//   let stepCount = 0;
//   let aboveThreshold = false;
  
//   accelerationData.forEach(acc => {
//     const magnitude = Math.sqrt(acc.x**2 + acc.y**2 + acc.z**2);
//     if (magnitude > threshold && !aboveThreshold) {
//       stepCount++;
//       aboveThreshold = true;
//     } else if (magnitude <= threshold) {
//       aboveThreshold = false;
//     }
//   });
  
//   return stepCount;
// }

// export function detectSteps(accelerationData: {x: number, y: number, z: number}[]): number {
//   const threshold = 1.2; // Adjust based on testing
//   let stepCount = 0;
//   let aboveThreshold = false;
//   let lastMagnitude = 0;
//   let peakCount = 0;
  
//   // Apply smoothing and peak detection
//   accelerationData.forEach(acc => {
//     const magnitude = Math.sqrt(acc.x**2 + acc.y**2 + acc.z**2);
//     const smoothed = lowPass(magnitude, lastMagnitude, 0.8);
//     lastMagnitude = smoothed;
    
//     // Detect peaks
//     if (smoothed > threshold && !aboveThreshold) {
//       peakCount++;
//       if (peakCount >= 3) { // Require multiple consecutive peaks to count as step
//         stepCount++;
//         peakCount = 0;
//       }
//       aboveThreshold = true;
//     } else if (smoothed <= threshold) {
//       aboveThreshold = false;
//     }
//   });
  
//   return stepCount;
// }

export function detectSteps(accelerationData: {x: number, y: number, z: number}[]): number {
  const threshold = 1.2;
  let stepCount = 0;
  let lastMagnitude = 0;
  let wasAbove = false;
  let peakCount = 0;
  let minPeakDistance = 3; // Minimum samples between steps

  accelerationData.forEach((acc, i) => {
    const magnitude = Math.sqrt(acc.x**2 + acc.y**2 + acc.z**2);
    const smoothed = lowPass(magnitude, lastMagnitude, 0.8);
    lastMagnitude = smoothed;

    if (smoothed > threshold) {
      if (!wasAbove && peakCount >= minPeakDistance) {
        stepCount++;
        peakCount = 0;
      }
      wasAbove = true;
      peakCount = 0;
    } else {
      wasAbove = false;
      peakCount++;
    }
  });

  return stepCount;
}
