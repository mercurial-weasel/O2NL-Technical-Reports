import { ParticleSizeDistributionTest as PrismaParticleSizeDistributionTest, SieveItem as PrismaSieveItem, PSDData as PrismaPSDData } from '../../types/prismaTypes';

// Re-export the Prisma types with potentially added functionality
export interface SieveItem extends PrismaSieveItem {}

export interface ParticleSizeDistributionTest extends Omit<PrismaParticleSizeDistributionTest, 'particle_size_result' | 'createdAt' | 'updatedAt'> {
  particle_size_result: SieveItem[];
}

export type PSDData = ParticleSizeDistributionTest[];
