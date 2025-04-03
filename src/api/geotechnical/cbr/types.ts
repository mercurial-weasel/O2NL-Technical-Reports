import { GeoCBR as PrismaGeoCBR } from '../../../types/prismaTypes';

// Re-export the Prisma types with potentially added functionality
export interface GeoCBR extends Omit<PrismaGeoCBR, 'createdAt' | 'updatedAt'> {}

export type CBRData = GeoCBR[];
