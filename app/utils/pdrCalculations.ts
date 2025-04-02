import { PathPoint } from "../types/mapTypes";

// Calculate new position based on step length and heading (in degrees)
export function calculateNewPosition(
  currentPosition: PathPoint, 
  stepLength: number, 
  heading: number
): PathPoint {
  // Convert heading from degrees to radians
  const headingRad = (heading * Math.PI) / 180;
  
  return {
    x: currentPosition.x + stepLength * Math.sin(headingRad),
    y: currentPosition.y + stepLength * Math.cos(headingRad)
  };
}

// Calculate step length based on frequency and acceleration data
export function calculateStepLength(
  accelerationData: {x: number, y: number, z: number}[],
  stepFrequency: number
): number {
  // Simple implementation - can be enhanced with more sophisticated algorithms
  const avgAcceleration = accelerationData.reduce((sum, acc) => {
    return sum + Math.sqrt(acc.x**2 + acc.y**2 + acc.z**2);
  }, 0) / accelerationData.length;
  
  // Empirical formula to estimate step length based on acceleration
  return 0.35 + (avgAcceleration * 0.15);
}

// Detect steps from accelerometer data using peak detection
export function detectSteps(accelerationData: {x: number, y: number, z: number}[]): number {
  const threshold = 1.2; // Adjust based on testing
  let stepCount = 0;
  let aboveThreshold = false;
  
  accelerationData.forEach(acc => {
    const magnitude = Math.sqrt(acc.x**2 + acc.y**2 + acc.z**2);
    if (magnitude > threshold && !aboveThreshold) {
      stepCount++;
      aboveThreshold = true;
    } else if (magnitude <= threshold) {
      aboveThreshold = false;
    }
  });
  
  return stepCount;
}