import { GeoMDD as PrismaGeoMDD, GeoMDDResult as PrismaGeoMDDResult } from '../../../types/prismaTypes';

// Re-export the Prisma types with potentially added functionality
export interface MDDResult extends PrismaGeoMDDResult {}

export interface GeoMDD extends Omit<PrismaGeoMDD, 'mdd_results' | 'createdAt' | 'updatedAt'> {
  mdd_results: MDDResult[];
}

export type MDDData = GeoMDD[];
