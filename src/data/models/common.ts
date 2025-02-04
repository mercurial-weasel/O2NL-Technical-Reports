import { z } from 'zod';

export const BaseSchema = z.object({
  id: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
});

export type BaseModel = z.infer<typeof BaseSchema>;