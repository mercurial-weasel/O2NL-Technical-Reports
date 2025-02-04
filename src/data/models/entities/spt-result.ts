import { z } from 'zod';

export const SPTResultSchema = z.object({
  id: z.string(),
  point_id: z.string(),
  material: z.string(),
  top: z.number().or(z.string().transform(val => parseFloat(val))),
  num_test_blow_count: z.number().int().nonnegative(),
  total_blow_count: z.number().int().nonnegative(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional()
});

export type SPTResult = z.infer<typeof SPTResultSchema>;