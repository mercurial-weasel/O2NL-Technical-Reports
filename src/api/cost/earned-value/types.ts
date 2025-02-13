import { z } from 'zod';

export const ProgressSchema = z.object({
  Month: z.string(),
  Planned: z.number(),
  Earned: z.number()
});

export const ProjectElementSchema = z.object({
  Discipline: z.string(),
  Element: z.string(),
  'Direct Costs': z.number(),
  'Limb 2': z.number(),
  Total: z.number(),
  'No of Months': z.number(),
  'Plan Start': z.string(),
  'Plan Finish': z.string(),
  'Percent Wgt of Budget': z.number(),
  Progress: z.array(ProgressSchema)
});

export const EarnedValueDataSchema = z.object({
  data: z.array(ProjectElementSchema)
});

export type Progress = z.infer<typeof ProgressSchema>;
export type ProjectElement = z.infer<typeof ProjectElementSchema>;
export type EarnedValueData = z.infer<typeof EarnedValueDataSchema>;

export interface EarnedValueMetrics {
  plannedValue: number;
  earnedValue: number;
  actualCost: number;
  costVariance: number;
  cpi: number;
}

export interface LineItemData {
  discipline: string;
  element: string;
  directCosts: number;
  limb2: number;
  total: number;
  percentOfBudget: number;
  selectedMonthPlanned: number;
  selectedMonthToDate: number;
  selectedMonthWeighting: number;
  selectedMonthSlippage: number;
  isHeader?: boolean;
}