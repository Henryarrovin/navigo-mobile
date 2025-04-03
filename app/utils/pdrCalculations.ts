import { PathPoint } from "../types/mapTypes";

const METERS_PER_UNIT = 0.2;

const lowPass = (current: number, last: number, alpha: number) => alpha * current + (1 - alpha) * last;

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
    y: currentPosition.y - stepLengthUnits * Math.cos(headingRad)
  };
}

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
