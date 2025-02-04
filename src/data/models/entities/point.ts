import { z } from 'zod';

export const PointSchema = z.object({
  id: z.string(),
  point_id: z.string(),
  zone: z.string(),
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional()
});

export type Point = z.infer<typeof PointSchema>;