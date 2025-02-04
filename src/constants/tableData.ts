export interface MaterialStats {
  Material_ID: string;
  Count: number;
  Mode: string | number;
  Mean_Peak_Shear: number;
  Minimum_Peak_Shear: number;
  Peak_Shear_Q1: number;
  Peak_Shear_Q2: number;
  Peak_Shear_Q3: number;
  Maximum_Peak_Shear: number;
  Peak_Shear_St_Dev: number;
  Peak_Shear_Range: number;
}

export const materialStats: MaterialStats[] = [
  {
    Material_ID: "Unidentified",
    Count: 12,
    Mode: 47,
    Mean_Peak_Shear: 38.2,
    Minimum_Peak_Shear: 10.77,
    Peak_Shear_Q1: 24.75,
    Peak_Shear_Q2: 37.69,
    Peak_Shear_Q3: 47,
    Maximum_Peak_Shear: 87.5,
    Peak_Shear_St_Dev: 19.4,
    Peak_Shear_Range: 76.7
  },
  {
    Material_ID: "Alluvium",
    Count: 206,
    Mode: 19,
    Mean_Peak_Shear: 42.5,
    Minimum_Peak_Shear: 8.08,
    Peak_Shear_Q1: 23,
    Peak_Shear_Q2: 34,
    Peak_Shear_Q3: 49.75,
    Maximum_Peak_Shear: 171.0,
    Peak_Shear_St_Dev: 29.8,
    Peak_Shear_Range: 162.9
  },
  {
    Material_ID: "Colluvium",
    Count: 157,
    Mode: 37.69,
    Mean_Peak_Shear: 56.7,
    Minimum_Peak_Shear: 10.77,
    Peak_Shear_Q1: 32.3,
    Peak_Shear_Q2: 48.46,
    Peak_Shear_Q3: 75.38,
    Maximum_Peak_Shear: 148.1,
    Peak_Shear_St_Dev: 30.6,
    Peak_Shear_Range: 137.3
  },
  {
    Material_ID: "Engineered Fill",
    Count: 4,
    Mode: "N/A",
    Mean_Peak_Shear: 70.7,
    Minimum_Peak_Shear: 27,
    Peak_Shear_Q1: 57.225,
    Peak_Shear_Q2: 74.03,
    Peak_Shear_Q3: 87.49,
    Maximum_Peak_Shear: 107.7,
    Peak_Shear_St_Dev: 33.6,
    Peak_Shear_Range: 80.7
  },
  {
    Material_ID: "Soil M'tngsner",
    Count: 4,
    Mode: "N/A",
    Mean_Peak_Shear: 69.7,
    Minimum_Peak_Shear: 47.11,
    Peak_Shear_Q1: 48.1225,
    Peak_Shear_Q2: 68.65,
    Peak_Shear_Q3: 90.185,
    Maximum_Peak_Shear: 94.2,
    Peak_Shear_St_Dev: 25.4,
    Peak_Shear_Range: 47.1
  },
  {
    Material_ID: "Non-eng Fill",
    Count: 12,
    Mode: 117,
    Mean_Peak_Shear: 125.1,
    Minimum_Peak_Shear: 38.66,
    Peak_Shear_Q1: 67.995,
    Peak_Shear_Q2: 117,
    Peak_Shear_Q3: 193.0775,
    Maximum_Peak_Shear: 206.1,
    Peak_Shear_St_Dev: 63.2,
    Peak_Shear_Range: 167.4
  },
  {
    Material_ID: "Not Logged",
    Count: 1,
    Mode: "N/A",
    Mean_Peak_Shear: 3.1,
    Minimum_Peak_Shear: 3.05,
    Peak_Shear_Q1: 3.05,
    Peak_Shear_Q2: 3.05,
    Peak_Shear_Q3: 3.05,
    Maximum_Peak_Shear: 3.1,
    Peak_Shear_St_Dev: 0.0,
    Peak_Shear_Range: 0.0
  },
  {
    Material_ID: "TSoil",
    Count: 6,
    Mode: 65,
    Mean_Peak_Shear: 72.8,
    Minimum_Peak_Shear: 34,
    Peak_Shear_Q1: 65,
    Peak_Shear_Q2: 70,
    Peak_Shear_Q3: 83.25,
    Maximum_Peak_Shear: 111.8,
    Peak_Shear_St_Dev: 25.8,
    Peak_Shear_Range: 77.8
  }
];