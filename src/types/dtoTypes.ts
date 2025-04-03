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

// MDD DTOs
export interface GeoMDDResultDTO {
  id?: string;
  test_no: number;
  water_content: number;
  dry_density: number;
  mddId: string;
}

export interface GeoMDDDTO {
  id?: string;
  POINT_ID: string;
  SAMPLE_TOP: number;
  SAMPLE_REFERENCE: string;
  SAMPLE_TYPE: string;
  SAMPLE_ID: string;
  SPECIMEN_TOP: number;
  SPECIMEN_REFERENCE: string;
  ITEM: number;
  Description?: string;
  MC?: number;
  DryDensity?: number;
  Remarks?: string;
  Method: string;
  SpecimenGeoID?: string;
  LastModifiedDate?: string;
  NMC?: number;
  MethodName: string;
  AGScode?: string;
  DateSampled: string;
  ShearVaneMethod?: string;
  DateTested: string;
  DateChecked: string;
  BulkDensity?: number;
  SolidDensity?: number;
  AirVoids?: number;
  ShearStrengthPeakCorrected?: number;
  
  // Additional fields from updated schema
  type?: string;
  name?: string;
  chainage?: number;
  distance_to_alignment?: number;
  angle_to_alignment_deg_cc?: number;
  construction_subzone?: string;
  x?: number;
  y?: number;
  spatial_reference?: number;
  DepthBase?: number;
  RL?: number;
  SampleDepthRL?: number;
  Chainage?: number;
  O2NLstage?: string;
  SolidDensitySource?: string;
  location_id?: string;
  easting?: number;
  national_g?: string;
  northing?: number;
  local_datu?: string;
  geological_unit?: string;
  
  mdd_results?: GeoMDDResultDTO[];
  latLng?: [number, number]; // WGS84 coordinates [lat, lng] for mapping
}

export interface GeoMDDResponseDTO {
  data: GeoMDDDTO[];
  meta: {
    total: number;
  };
}

export interface GeoMDDFiltersDTO {
  POINT_ID?: string;
  SAMPLE_ID?: string;
  SPECIMEN_REFERENCE?: string;
}

// CBR DTOs
export interface GeoCBRDTO {
  id?: string;
  sample_id: string;
  investigation_id: string;
  full_investigation_id: string;
  depth_to: number;
  depth_bottom: number;
  RL?: number;
  sample_depth_RL?: number;
  chainage?: number;
  geocodes?: string;
  o2nl_stage?: string;
  lab_request?: string;
  surcharge_mass?: number;
  treatment?: string;
  bulk_density?: number;
  dry_density?: number;
  water_content_compacted?: number;
  water_content_plunger?: number;
  cbr_perc?: number;
  penetration?: string;
  swell_perc?: number;
  oversize_material_perc?: number;
  remarks?: string;
  geological_unit?: string;
  latLng?: [number, number]; // WGS84 coordinates [lat, lng] for mapping
}

export interface GeoCBRResponseDTO {
  data: GeoCBRDTO[];
  meta: {
    total: number;
  };
}

export interface GeoCBRFiltersDTO {
  sample_id?: string;
  investigation_id?: string;
  geological_unit?: string;
  o2nl_stage?: string;
}

// LabGrading DTOs
export interface GeoLabGradingDTO {
  id?: string;
  point_id: string;
  latitude: number;
  longitude: number;
  national_east: number;
  national_north: number;
  national_elevation: number;
  geology_description?: string;
  material_id?: string;
  sample_top?: number;
  sample_reference?: string;
  sample_id?: string;
  item: number;
  perc_passing: number;
  latLng?: [number, number]; // WGS84 coordinates [lat, lng] for mapping
}

export interface GeoLabGradingResponseDTO {
  data: GeoLabGradingDTO[];
  meta: {
    total: number;
  };
}

export interface GeoLabGradingFiltersDTO {
  point_id?: string;
  sample_id?: string;
  material_id?: string;
  geology_description?: string;
}

// Add other DTOs here as needed
