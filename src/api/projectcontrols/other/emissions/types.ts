import { z } from 'zod';

export const EmissionRecordSchema = z.object({
  category: z.string(),
  yearMonth: z.string(),
  amount: z.number(),
  carbonEstimateKgCO2e: z.number()
});

export const CategoryConversionSchema = z.object({
  category: z.string(),
  conversionFactor: z.number()
});

export type EmissionRecord = z.infer<typeof EmissionRecordSchema>;
export type CategoryConversion = z.infer<typeof CategoryConversionSchema>;

export const EmissionsDataSchema = z.object({
  records: z.array(EmissionRecordSchema),
  totalCarbonEstimate: z.number(),
  lastUpdated: z.string().datetime()
});

export type EmissionsData = z.infer<typeof EmissionsDataSchema>;