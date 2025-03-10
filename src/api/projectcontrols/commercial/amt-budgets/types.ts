import { z } from 'zod';

export const AMTBudgetItemSchema = z.object({
  ID: z.number(),
  WORKSTREAM: z.string(),
  HOURS1: z.number(),
  TOTAL1: z.number(),
  HOURS2: z.number(),
  TOTAL2: z.number(),
  HOURS_DIFF: z.number(),
  TOTAL_DIFF: z.number()
});

export const BudgetSummarySchema = z.object({
  TOTAL_LABOUR: z.object({
    HOURS1: z.number(),
    TOTAL1: z.number(),
    HOURS2: z.number(),
    TOTAL2: z.number(),
    HOURS_DIFF: z.number(),
    TOTAL_DIFF: z.number()
  }),
  TOTAL_EXPENSES: z.object({
    TOTAL1: z.number(),
    TOTAL2: z.number(),
    TOTAL_DIFF: z.number()
  }),
  TOTAL_ALL: z.object({
    HOURS1: z.number(),
    TOTAL1: z.number(),
    HOURS2: z.number(),
    TOTAL2: z.number(),
    HOURS_DIFF: z.number(),
    TOTAL_DIFF: z.number()
  })
});

export const MonthlyBudgetDataSchema = z.object({
  AMTBudgetTrackingData: z.array(AMTBudgetItemSchema),
  summary: BudgetSummarySchema
});

export const AMTBudgetDataSchema = z.record(z.string(), MonthlyBudgetDataSchema);

export type AMTBudgetItem = z.infer<typeof AMTBudgetItemSchema>;
export type BudgetSummary = z.infer<typeof BudgetSummarySchema>;
export type MonthlyBudgetData = z.infer<typeof MonthlyBudgetDataSchema>;
export type AMTBudgetData = z.infer<typeof AMTBudgetDataSchema>;