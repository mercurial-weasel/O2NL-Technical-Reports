import { PrismaClient } from '@prisma/client';
import { seedPSDData } from './seed-data/geotechnical_psd.js';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');
  
  try {
    // Seed PSD data
    await seedPSDData(prisma);
    
    // Add other seed operations here
    
    console.log('Database seeding completed successfully.');
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
