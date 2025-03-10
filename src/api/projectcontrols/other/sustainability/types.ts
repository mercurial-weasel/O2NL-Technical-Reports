import { z } from 'zod';

export const SustainabilityTheme = z.enum([
  'Emissions',
  'Energy',
  'Water',
  'Waste / Recovery',
  'Materials',
  'Sustainable Procurement',
  'Nature',
  'Legacy',
  'General',
  'Resilience'
]);

export const SustainabilityStatus = z.enum([
  'Proposed',
  'Pending',
  'Delayed',
  'Implemented'
]);

export const SustainabilityPriority = z.enum([
  '5 - Very High',
  '4 - High',
  '3 - Medium',
  '2 - Low',
  '1 - Very Low'
]);

export const SustainabilityProcessType = z.enum([
  'Process',
  'Outcome',
  'Process / Outcome'
]);

export const SustainabilityRequirement = z.enum([
  'Must',
  'Should'
]);

export const SustainabilityInitiativeSchema = z.object({
  id: z.string(),
  theme: SustainabilityTheme,
  outcome: z.string(),
  status: SustainabilityStatus,
  priority: SustainabilityPriority,
  target: z.string(),
  measure: z.string().optional(),
  dataType: z.string().optional(),
  unit: z.string().optional(),
  parameters: z.string().optional(),
  reportingApproach: z.string().optional(),
  processOrOutcome: SustainabilityProcessType,
  mustOrShould: SustainabilityRequirement,
  measurementMethod: z.string().optional(),
  notes: z.string().optional(),
  measureOwner: z.string().optional(),
  evidence: z.string().optional(),
  targetDate: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional()
});

export type SustainabilityInitiative = z.infer<typeof SustainabilityInitiativeSchema>;