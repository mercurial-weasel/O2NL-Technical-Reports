import { z } from 'zod';

export const DustChildSchema = z.object({
  id: z.string().uuid(),
  deviceName: z.string(),
  dateTime: z.string().datetime(),
  dustLevel: z.number(),
  unit: z.string(),
  pm10: z.number().min(0).max(50),
  pm2_5: z.number().min(0).max(25),
  temperature: z.number().min(15).max(35),
  humidity: z.number().min(30).max(70),
  windSpeed: z.number().min(0).max(20),
  windDirection: z.number().min(0).max(360),
  complianceStatus: z.string(),
  staff: z.string(),
  remarks: z.string().optional()
});

export const DustParentSchema = z.object({
  id: z.string().uuid(),
  deviceName: z.string(),
  deviceModel: z.string().optional(),
  serialNumber: z.string().optional(),
  manufacturer: z.string().optional(),
  organisation: z.string().optional(),
  remarks: z.string().optional(),
  timeStamp: z.string().datetime().optional(),
  deviceStatus: z.string().optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  childRecords: z.array(DustChildSchema)
});

export const DustDataSchema = z.object({
  devices: z.array(DustParentSchema),
  lastUpdated: z.string().datetime(),
  totalReadings: z.number()
});

export type DustChild = z.infer<typeof DustChildSchema>;
export type DustParent = z.infer<typeof DustParentSchema>;
export type DustData = z.infer<typeof DustDataSchema>;