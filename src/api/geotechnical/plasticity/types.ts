export interface Atterbergs {
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
    remark_dot_test_remarks: string;
}

export interface AtterbergsResponse {
    data: Atterbergs[];
    meta: {
        total: number;
    };
}

export interface AtterbergsFilters {
    adit_id?: string;
    location_id?: string;
    sample_unique_id?: string;
}
