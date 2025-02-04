import { z } from 'zod';
import { BaseSchema } from '../common';

export const MaterialSchema = BaseSchema.extend({
  name: z.string(),
  type: z.string(),
  color: z.string(),
  description: z.string().optional(),
});

export type MaterialData = z.infer<typeof MaterialSchema>;