import { z } from 'zod';
import { BaseSchema } from '../common';

export const GeotechnicalSchema = BaseSchema.extend({
  depth: z.number(),
  material_type: z.string(),
  moisture_content: z.number(),
  density: z.number().optional(),
  strength: z.number().optional(),
  notes: z.string().optional(),
});

export type GeotechnicalData = z.infer<typeof GeotechnicalSchema>;