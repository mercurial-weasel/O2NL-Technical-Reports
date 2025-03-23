// This file contains Data Transfer Object types for the application

// PSD DTOs
export interface SieveItemDTO {
  sieve_size_mm: number;
  percent_passing: number;
}

export interface ParticleSizeDistributionTestDTO {
  id?: string;
  adit_id: string;
  location_id: string;
  depth_to: number;
  sample_reference: string;
  sample_type: string;
  date_sampled: string;
  sample_unique_id: string;
  test_no: number;
  date_tested: string;
  date_checked: string;
  date_approved: string;
  remark_dot_test_remarks: string;
  average_water_content: string;
  superseeding_note?: string;
  particle_size_result: SieveItemDTO[];
  chainage: number;
  distance_to_alignment: number;
  angle_to_alignment_deg_cc: number;
  construction_subzone: string;
  x_coordinate: number;
  y_coordinate: number;
}

export type PSDDataDTO = ParticleSizeDistributionTestDTO[];

// Atterbergs DTOs
export interface AtterbergsDTO {
  id?: string;
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
  date_tested: string;
  date_checked: string;
  date_approved: string;
  liquid_limit: number;
  plastic_limit: number;
  plasticity_index: number;
  water_content: number;
  remark_dot_test_remarks?: string;
  chainage: number;
  distance_to_alignment: number;
  angle_to_alignment_deg_cc: number;
  construction_subzone: string;
  x_coordinate: number;
  y_coordinate: number;
  latLng?: [number, number]; // WGS84 coordinates [lat, lng] for mapping
}

export interface AtterbergsResponseDTO {
  data: AtterbergsDTO[];
  meta: {
    total: number;
  };
}

export interface AtterbergsFiltersDTO {
  adit_id?: string;
  location_id?: string;
  sample_unique_id?: string;
  construction_subzone?: string;
}

// Staff DTOs
export interface StaffFTEDTO {
  id?: string;
  disciplineManager: string;
  team: string;
  location: string;
  nopType: string;
  org: string;
  projectRoleTitle: string;
  jobCode: string;
  phase: string;
  name: string;
  status: string;
  lastUpdatedConf: string;
  resourceOptions: string;
  taitokoLevinSiteBased: string;
  pricingPGProfDirectWorks: string;
  fteAve: number;
  requiredStart: string; // ISO string for API
  requiredFinish: string; // ISO string for API
  monthlyFTE: { [month: string]: number }; // Structured monthly data
  createdAt?: string;
  updatedAt?: string;
}

// Also add a conversion type to match the current interface format
export interface LegacyStaffFTEDTO {
  Discipline_Manager: string;
  Team: string;
  Location: string;
  NOP_Type: string;
  Org: string;
  Project_Role_Title: string;
  Job_Code: string;
  Phase: string;
  Name: string;
  Status: string;
  Last_updated_conf: string;
  Resource_Options: string;
  Taitoko_Levin_Site_Based_: string;
  Pricing_P_G___Prof___Direct_Works: string;
  FTE__AVE_: number;
  Required_Start: Date;
  Required_Finish: Date;
  // Monthly fields will be dynamically accessed
  [key: string]: string | number | Date; // Allow dynamic month columns
}

// Add other DTOs here as needed
