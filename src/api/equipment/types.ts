import { z } from 'zod';

// Base equipment status schema
export const EquipmentStatusSchema = z.object({
  equipmentId: z.string(),
  serialNumber: z.string(),
  easting: z.number(),
  northing: z.number(),
  lastUpdated: z.object({
    date: z.string(),
    time: z.string()
  }),
  elevation: z.number(),
  status: z.enum(['operational', 'maintenance', 'fault', 'offline']),
  keyMetrics: z.string(),
  unit: z.string(),
  measurementType: z.string(),
  alert: z.object({
    date: z.string(),
    time: z.string(),
    comments: z.string()
  }).optional()
});

// Equipment type schema
export const EquipmentTypeSchema = z.object({
  typeId: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.enum(['heavy', 'light', 'specialized', 'monitoring']),
  equipment: z.array(EquipmentStatusSchema)
});

// Complete equipment data schema
export const EquipmentDataSchema = z.object({
  lastUpdated: z.string(),
  equipmentTypes: z.array(EquipmentTypeSchema)
});

// Export types
export type EquipmentStatus = z.infer<typeof EquipmentStatusSchema>;
export type EquipmentType = z.infer<typeof EquipmentTypeSchema>;
export type EquipmentData = z.infer<typeof EquipmentDataSchema>;