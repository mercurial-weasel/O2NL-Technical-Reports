import { z } from 'zod';

// Status and trend enums
export const StatusSchema = z.enum(['green', 'orange', 'red']);
export const TrendSchema = z.enum(['up', 'down', 'unchanged']);

// Discipline enum
export const DisciplineSchema = z.enum([
  'AMT',
  'Design',
  'Construction',
  'Legacy Outcomes',
  'Engineering',
  'Other'
]);

// Risk schema
export const RiskSchema = z.object({
  description: z.string(),
  likelihood: z.number().min(1).max(5),
  consequence: z.number().min(1).max(5),
  category: z.string(),
  owner: z.string().optional(),
  mitigations: z.array(z.string()).optional()
});

// Task schema
export const TaskSchema = z.object({
  description: z.string(),
  completion: z.number().min(0).max(100),
  status: z.enum(['on track', 'at risk', 'delayed']),
  critical_path: z.boolean(),
  owner: z.string().optional(),
  dueDate: z.string().datetime().optional()
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

// Monthly AMT record schema
export const AMTMonthlyRecordSchema = z.object({
  id: z.string().uuid(),
  month: z.string().regex(/^\d{4}-\d{2}$/), // YYYY-MM format
  discipline: DisciplineSchema,
  status: StatusSchema,
  trend: TrendSchema,
  keyIssue: z.string(),
  keyRisks: z.array(RiskSchema),
  tasksToComplete: z.array(TaskSchema),
  dependencies: z.array(z.string()),
  kpis: z.array(KPISchema),
  metrics: z.record(z.string(), z.number()),
  notes: z.string().optional(),
  lastUpdated: z.string().datetime(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional()
});

// Collection of monthly records
export const AMTRecordsSchema = z.array(AMTMonthlyRecordSchema);

// Export types
export type Status = z.infer<typeof StatusSchema>;
export type Trend = z.infer<typeof TrendSchema>;
export type Discipline = z.infer<typeof DisciplineSchema>;
export type Risk = z.infer<typeof RiskSchema>;
export type Task = z.infer<typeof TaskSchema>;
export type KPI = z.infer<typeof KPISchema>;
export type AMTMonthlyRecord = z.infer<typeof AMTMonthlyRecordSchema>;
export type AMTRecords = z.infer<typeof AMTRecordsSchema>;