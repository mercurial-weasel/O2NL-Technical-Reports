import { Geo_LabGrading as PrismaGeoLabGrading } from '../../../types/prismaTypes';

// Re-export the Prisma types with potentially added functionality
export interface GeoLabGrading extends Omit<PrismaGeoLabGrading, 'createdAt' | 'updatedAt'> {}

export type LabGradingData = GeoLabGrading[];
