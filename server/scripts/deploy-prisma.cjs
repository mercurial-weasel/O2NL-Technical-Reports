const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Parse command line arguments
const shouldSeed = process.argv.includes('--seed');

// Database URL must be set in the environment
if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is not set');
  process.exit(1);
}

console.log('Starting Prisma deployment...');

// Run the schema merge
try {
  console.log('Merging Prisma schemas...');
  execSync('npm run prisma:merge', { stdio: 'inherit' });
} catch (error) {
  console.error('Error merging Prisma schemas:', error);
  process.exit(1);
}

// Generate Prisma client
try {
  console.log('Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
} catch (error) {
  console.error('Error generating Prisma client:', error);
  process.exit(1);
}

// Deploy migrations
try {
  console.log('Deploying migrations...');
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
} catch (error) {
  console.error('Error deploying migrations:', error);
  process.exit(1);
}

// Run seed if requested
if (shouldSeed) {
  try {
    console.log('Seeding database...');
    execSync('npx prisma db seed', { stdio: 'inherit' });
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

console.log('Prisma deployment completed successfully!');
