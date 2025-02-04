import { z } from 'zod';

export type Discipline = 'Geo' | 'Env' | 'Project' | 'Other';
export type System = 'Portal' | 'GIS';
export type Priority = 1 | 2 | 3 | 4 | 5;
export type Status = 'pending' | 'in-progress' | 'complete';

export const RoadmapItemSchema = z.object({
  id: z.string(),
  dashboardName: z.string(),
  discipline: z.enum(['Geo', 'Env', 'Project', 'Other']),
  subCategory: z.string(),
  priority: z.number().min(1).max(5),
  system: z.enum(['Portal', 'GIS']),
  sme: z.string(),
  implementer: z.string(),
  targetDate: z.string(),
  status: z.enum(['pending', 'in-progress', 'complete'])
});

export type RoadmapItem = z.infer<typeof RoadmapItemSchema>;