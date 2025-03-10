// src/api/cost/pab/types.ts
import { z } from 'zod';

// Budget Types
export const BudgetItemSchema = z.object({
  id: z.string(),
  budgetItem: z.string(),
  shared: z.number().nullable(),
  nonShared: z.number().nullable(),
  total: z.number().nullable(),
  ref: z.string(),
  comments: z.string(),
  movementShared: z.number().nullable(),
  movementNonShared: z.number().nullable(),
  movementTotal: z.number().nullable(),
  highlight: z.boolean()
});

export const BudgetDataSchema = z.object({
  items: z.array(BudgetItemSchema)
});

// Cost Types
export const CostItemSchema = z.object({
  id: z.string(),
  budget: z.string(),
  shared: z.number().nullable(),
  nonShared: z.number().nullable(),
  total: z.number().nullable(),
  ref: z.string(),
  comments: z.string(),
  movementShared: z.number().nullable(),
  movementNonShared: z.number().nullable(),
  movementTotal: z.number().nullable(),
  highlight: z.boolean()
});

export const CostDataSchema = z.object({
  items: z.array(CostItemSchema)
});

// Cost Indicators
export const CostIndicatorSchema = z.object({
  id: z.string(),
  text: z.string(),
  indicator: z.string(),
  textColor: z.string().optional()
});

export const CostIndicatorsSchema = z.object({
  indicators: z.array(CostIndicatorSchema)
});

// Risk Indicators
export const RiskIndicatorSchema = z.object({
  id: z.string(),
  text: z.string(),
  indicator: z.string()
});

export const RiskIndicatorsSchema = z.object({
  indicators: z.array(RiskIndicatorSchema)
});

// Expenditure Types
export const ExpenditureDataSchema = z.object({
  months: z.array(z.string()),
  planned: z.object({
    monthly: z.array(z.number()),
    cumulative: z.array(z.number())
  }),
  actual: z.object({
    monthly: z.array(z.number().nullable()),
    cumulative: z.array(z.number().nullable())
  }),
  forecast: z.object({
    monthly: z.array(z.number().nullable()),
    cumulative: z.array(z.number().nullable())
  })
});

// Expenditure Indicators
export const ExpenditureIndicatorSchema = z.object({
  id: z.string(),
  text: z.string(),
  indicator: z.string(),
  textColor: z.string().optional()
});

export const ExpenditureIndicatorsSchema = z.object({
  indicators: z.array(ExpenditureIndicatorSchema)
});

// Funding Split Types
export const FundingShareSchema = z.object({
  id: z.string(),
  name: z.string(),
  value: z.number()
});

export const FundingSplitDataSchema = z.object({
  currentMonth: z.array(FundingShareSchema),
  projectSplit: z.array(FundingShareSchema)
});

// Limb1 Indicators
export const Limb1IndicatorSchema = z.object({
  id: z.string(),
  text: z.string(),
  indicator: z.string(),
  textColor: z.string().optional()
});

export const Limb1IndicatorsSchema = z.object({
  indicators: z.array(Limb1IndicatorSchema)
});

// Limb3 Indicators
export const Limb3IndicatorSchema = z.object({
  id: z.string(),
  text: z.string(),
  indicator: z.string(),
  textColor: z.string().optional()
});

export const Limb3IndicatorsSchema = z.object({
  indicators: z.array(Limb3IndicatorSchema)
});

// Monthly PAB Record
export const MonthlyPABRecordSchema = z.object({
  id: z.string(),
  monthYear: z.string(),
  budget: BudgetDataSchema,
  cost: CostDataSchema,
  costIndicators: CostIndicatorsSchema,
  riskIndicators: RiskIndicatorsSchema,
  expenditure: ExpenditureDataSchema,
  expenditureIndicators: ExpenditureIndicatorsSchema,
  fundingSplit: FundingSplitDataSchema,
  limb1Indicators: Limb1IndicatorsSchema,
  limb3Indicators: Limb3IndicatorsSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional()
});

// PAB Response
export const PABResponseSchema = z.object({
  currentMonth: MonthlyPABRecordSchema,
  availableMonths: z.array(z.string()),
  lastUpdated: z.string().datetime()
});

// Export Types
export type BudgetItem = z.infer<typeof BudgetItemSchema>;
export type BudgetData = z.infer<typeof BudgetDataSchema>;
export type CostItem = z.infer<typeof CostItemSchema>;
export type CostData = z.infer<typeof CostDataSchema>;
export type CostIndicator = z.infer<typeof CostIndicatorSchema>;
export type CostIndicators = z.infer<typeof CostIndicatorsSchema>;
export type RiskIndicator = z.infer<typeof RiskIndicatorSchema>;
export type RiskIndicators = z.infer<typeof RiskIndicatorsSchema>;
export type ExpenditureData = z.infer<typeof ExpenditureDataSchema>;
export type ExpenditureIndicator = z.infer<typeof ExpenditureIndicatorSchema>;
export type ExpenditureIndicators = z.infer<typeof ExpenditureIndicatorsSchema>;
export type FundingShare = z.infer<typeof FundingShareSchema>;
export type FundingSplitData = z.infer<typeof FundingSplitDataSchema>;
export type Limb1Indicator = z.infer<typeof Limb1IndicatorSchema>;
export type Limb1Indicators = z.infer<typeof Limb1IndicatorsSchema>;
export type Limb3Indicator = z.infer<typeof Limb3IndicatorSchema>;
export type Limb3Indicators = z.infer<typeof Limb3IndicatorsSchema>;
export type MonthlyPABRecord = z.infer<typeof MonthlyPABRecordSchema>;
export type PABResponse = z.infer<typeof PABResponseSchema>;