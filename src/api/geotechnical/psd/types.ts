import { z } from 'zod';

// Define the sieve item schema
export const SieveItemSchema = z.object({
  sieve_size_mm: z.number(),
  percent_passing: z.number()
});

// Define the particle size distribution test schema
export const ParticleSizeDistributionTestSchema = z.object({
  adit_id: z.string(),
  location_id: z.string(),
  depth_to: z.number(),
  sample_reference: z.string(),
  sample_type: z.string(),
  date_sampled: z.string(),
  sample_unique_id: z.string(),
  test_no: z.number(),
  date_tested: z.string(),
  date_checked: z.string(),
  date_approved: z.string(),
  remark_dot_test_remarks: z.string(),
  average_water_content: z.string(),
  superseeding_note: z.string().optional(),
  particle_size_result: z.array(SieveItemSchema)
});

// Export types
export type SieveItem = z.infer<typeof SieveItemSchema>;
export type ParticleSizeDistributionTest = z.infer<typeof ParticleSizeDistributionTestSchema>;

// Define schema for API responses
export const PSDDataSchema = z.array(ParticleSizeDistributionTestSchema);
export type PSDData = z.infer<typeof PSDDataSchema>;
