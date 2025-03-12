import { z } from 'zod';

// Define the MDD result item schema
export const MDDResultSchema = z.object({
  test_no: z.number(),
  water_content: z.number(),
  dry_density: z.number()
});

// Define the MDD test data schema
export const TestDataSchema = z.object({
  test_type_method: z.string(),
  test_type_name: z.string(),
  display_name: z.string(),
  ags_code: z.string(),
  adit_id: z.string(),
  location_id: z.string(),
  depth_to: z.number(),
  sample_reference: z.string(),
  sample_type: z.string(),
  date_sampled: z.string(),
  sample_unique_id: z.string(),
  test_no: z.number(),
  shear_vane_method: z.string(),
  date_tested: z.string(),
  date_checked: z.string(),
  date_approved: z.string(),
  natural_water_content: z.number(),
  optimum_dry_density: z.number(),
  bulk_density: z.number(),
  water_content: z.number(),
  solid_density: z.number(),
  air_voids: z.number(),
  shear_strength: z.number().nullable(),
  remark_dot_test_remarks: z.string(),
  mdd_results: z.array(MDDResultSchema)
});

// Export types
export interface MDDResult {
  test_no: number;
  water_content: number;
  dry_density: number;
}

export interface TestData {
  test_type_method: string;
  test_type_name: string;
  display_name: string;
  ags_code: string;
  adit_id: string;
  location_id: string;
  depth_to: number;
  sample_reference: string;
  sample_type: string;
  date_sampled: string;
  sample_unique_id: string;
  test_no: number;
  shear_vane_method: string;
  date_tested: string;
  date_checked: string;
  date_approved: string;
  natural_water_content: number;
  optimum_dry_density: number;
  bulk_density: number;
  water_content: number;
  solid_density: number;
  air_voids: number;
  shear_strength: number | null;
  remark_dot_test_remarks: string;
  mdd_results: MDDResult[];
}

// Define schema for API responses
export const MDDDataSchema = z.array(TestDataSchema);
export type MDDData = z.infer<typeof MDDDataSchema>;
