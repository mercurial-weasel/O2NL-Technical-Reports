import { z } from 'zod';

export const RiskLevel = z.enum(['Green', 'Amber', 'Red']);
export type RiskLevel = z.infer<typeof RiskLevel>;

export const RiskChange = z.enum(['Unknown', 'Unchanged', 'Up', 'Down']);
export type RiskChange = z.infer<typeof RiskChange>;

export const ConsentAssessmentSchema = z.object({
  id: z.string().uuid(),
  designChange: z.string(),
  proposedConsentPathway: z.string(),
  currentRiskLevel: RiskLevel,
  comments: z.string().optional(),
  timestamp: z.string().datetime(),
  riskChange: RiskChange
});

export const ConsentMonthSchema = z.object({
  monthYear: z.string().regex(/^\d{4}-\d{2}$/),
  assessments: z.array(ConsentAssessmentSchema),
  metadata: z.object({
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime().optional(),
    totalAssessments: z.number(),
    riskLevelSummary: z.object({
      green: z.number(),
      amber: z.number(),
      red: z.number()
    })
  })
});

export type ConsentAssessment = z.infer<typeof ConsentAssessmentSchema>;
export type ConsentMonth = z.infer<typeof ConsentMonthSchema>;