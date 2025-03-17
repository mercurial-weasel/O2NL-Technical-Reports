export interface SieveItem {
    sieve_size_mm: number;
    percent_passing: number;
}

export interface ParticleSizeDistributionTest {
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
    particle_size_result: SieveItem[];
    chainage: number;
    distance_to_alignment: number;
    angle_to_alignment_deg_cc: number;
    construction_subzone: string;
    x_coordinate: number;
    y_coordinate: number;
}

export type PSDData = ParticleSizeDistributionTest[];
