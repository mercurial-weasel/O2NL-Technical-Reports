import { PrismaClient } from '@prisma/client';
import { seedPSDData } from './seed-data/geotechnical_psd';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');
  
  // Seed PSD data
  await seedPSDData(prisma);
  
  // Add other seed operations here
  
  console.log('Database seeding completed.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
