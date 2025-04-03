// This file contains TypeScript types that match Prisma-generated models

import { 
  ParticleSizeDistributionTest as PrismaParticleSizeDistributionTest,
  SieveItem as PrismaSieveItem,
  PSDData as PrismaPSDData,
  Geo_Atterbergs as PrismaGeoAtterbergs,
  O2NL_Staff as PrismaO2NLStaff,
  Geo_MDD as PrismaGeoMDD,
  Geo_MDD_Result as PrismaGeoMDDResult,
  Geo_CBR as PrismaGeoCBR,
  Geo_LabGrading as PrismaGeoLabGrading  // Add new import
} from '@prisma/client';

// Re-export the types for use in the application
export type ParticleSizeDistributionTest = PrismaParticleSizeDistributionTest;
export type SieveItem = PrismaSieveItem;
export type PSDData = PrismaPSDData;

// Atterbergs types
export type GeoAtterbergs = PrismaGeoAtterbergs;

// Staff types
export type O2NLStaff = PrismaO2NLStaff;

// MDD types
export type GeoMDD = PrismaGeoMDD;
export type GeoMDDResult = PrismaGeoMDDResult;

// CBR types
export type GeoCBR = PrismaGeoCBR;

// LabGrading types
export type GeoLabGrading = PrismaGeoLabGrading;  // Add new export

// Add other Prisma-generated types here as needed
