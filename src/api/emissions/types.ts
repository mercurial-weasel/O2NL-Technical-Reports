// types.ts
import { z } from 'zod';

export const EmissionSource = z.enum([
  'Materials',
  'Transport',
  'Equipment',
  'Site Operations',
  'Waste',
  'Energy',
  'Other'
]);

export const EmissionSubCategories: Record<z.infer<typeof EmissionSource>, string[]> = {
  'Materials': ['Concrete', 'Steel', 'Asphalt', 'Timber'],
  'Transport': ['Diesel Trucks', 'Electric Vehicles', 'Rail'],
  'Equipment': ['Excavators', 'Cranes', 'Generators'],
  'Site Operations': ['Lighting', 'Heating', 'Temporary Buildings'],
  'Waste': ['Construction Waste', 'Demolition Waste', 'Recycling'],
  'Energy': ['Grid Electricity', 'Solar', 'Diesel Generators'],
  'Other': ['Miscellaneous']
};

export const CarbonEmissionRecordSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  source: EmissionSource,
  subCategory: z.string(),
  amount: z.number().positive(),
  unit: z.string(),
  date: z.string().datetime(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  emissionFactor: z.number().positive(),
  notes: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional()
});

export const CarbonEmissionDataSchema = z.object({
  projectId: z.string(),
  emissions: z.array(CarbonEmissionRecordSchema),
  totalEmissions: z.number(),
  lastUpdated: z.string().datetime()
});

export type EmissionSourceType = z.infer<typeof EmissionSource>;
export type CarbonEmissionRecord = z.infer<typeof CarbonEmissionRecordSchema>;
export type CarbonEmissionData = z.infer<typeof CarbonEmissionDataSchema>;

