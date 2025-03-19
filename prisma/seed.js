import { PrismaClient } from '@prisma/client';
import { seedPSDData } from './seed-data/geotechnical_psd.js';
import { atterbergsData } from './seed-data/geotechnical_atterbergs.js';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');
  
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
  
  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
