import { PrismaClient } from '@prisma/client';
import 'dotenv-flow/config';
import { setupDatabaseEnvironment } from '../scripts/setup-database-env.js';
import { seedPSDData } from './seed-data/geotechnical_psd.js';
import { atterbergsData } from './seed-data/geotechnical_atterbergs.js';

// Setup database environment variables
setupDatabaseEnvironment();

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  console.log(`Using database: ${process.env.DATABASE_URL ? 'Configured' : 'Not configured'}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Database selection: ${process.env.VITE_DATABASE_SELECTION}`);
  
  // Seed PSD data
  await seedPSDData(prisma);
  
  // Seed Atterbergs data
  console.log('Seeding Atterbergs data...');
  for (const item of atterbergsData) {
    try {
      await prisma.geo_Atterbergs.upsert({
        where: { id: item.id },
        update: item,
        create: item
      });
      console.log(`Created/updated Atterbergs data: ${item.id}`);
    } catch (error) {
      console.error(`Error seeding Atterbergs data ${item.id}:`, error);
    }
  }
  
  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
