import { z } from 'zod';

export const SensorDataSchema = z.object({
  accelerometer: z.object({ 
    x: z.number(), 
    y: z.number(), 
    z: z.number() 
  }),
  gyroscope: z.object({ 
    x: z.number(), 
    y: z.number(), 
    z: z.number() 
  }),
  magnetometer: z.object({ 
    x: z.number(), 
    y: z.number(), 
    z: z.number() 
  }),
  timestamp: z.number(),
  calibration: z.boolean().optional()
});

export type SensorData = z.infer<typeof SensorDataSchema>;