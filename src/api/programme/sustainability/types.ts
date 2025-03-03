import { z } from 'zod';

// Status and trend enums
export const StatusSchema = z.enum(['green', 'orange', 'red']);
export const TrendSchema = z.enum(['up', 'down', 'unchanged']);

// Risk schema
export const RiskSchema = z.object({
  description: z.string(),
  category: z.string(),
  likelihood: z.number().min(1).max(5),
  consequence: z.number().min(1).max(5)
});

// Task schema
export const TaskSchema = z.object({
  description: z.string(),
  completion: z.number().min(0).max(100),
  status: z.enum(['on track', 'at risk', 'delayed']),
  critical_path: z.boolean()
});

// KPI schema
export const KPISchema = z.object({
  name: z.string(),
  target: z.number(),
  actual: z.number(),
  unit: z.string(),
  trend: TrendSchema,
  status: StatusSchema
});

// Monthly Sustainability record schema
export const SustainabilityMonthlyRecordSchema = z.object({
  id: z.string(),
  month: z.string().regex(/^\d{4}-\d{2}$/), // YYYY-MM format
  discipline: z.literal('Sustainability'),
  status: StatusSchema,
  trend: TrendSchema,
  keyIssue: z.string(),
  keyRisks: z.array(RiskSchema),
  tasksToComplete: z.array(TaskSchema),
  dependencies: z.array(z.string()),
  kpis: z.array(KPISchema),
  metrics: z.record(z.string(), z.number()),
  lastUpdated: z.string().datetime(),
  createdAt: z.string().datetime()
});

// Collection of monthly records
export const SustainabilityRecordsSchema = z.array(SustainabilityMonthlyRecordSchema);

// Export types
export type Status = z.infer<typeof StatusSchema>;
export type Trend = z.infer<typeof TrendSchema>;
export type Risk = z.infer<typeof RiskSchema>;
export type Task = z.infer<typeof TaskSchema>;
export type KPI = z.infer<typeof KPISchema>;
export type SustainabilityMonthlyRecord = z.infer<typeof SustainabilityMonthlyRecordSchema>;
export type SustainabilityRecords = z.infer<typeof SustainabilityRecordsSchema>;