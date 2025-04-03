import { execSync } from 'child_process';
import 'dotenv-flow/config';
import path from 'path';
import { fileURLToPath } from 'url';
import { setupDatabaseEnvironment } from './setup-database-env.js';

// Get the directory name correctly in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup database environment variables based on VITE_DATABASE_SELECTION
setupDatabaseEnvironment();

/**
 * Deploy Prisma schema to Supabase
 */
async function deployPrisma() {
  try {
    console.log(`Running Prisma migrations to deploy schema for ${process.env.NODE_ENV} environment...`);
    console.log(`Using database: ${process.env.DATABASE_URL ? 'Configured' : 'Not configured'}`);
    
    // First, merge all model files into schema.prisma
    execSync('npm run prisma:merge', { stdio: 'inherit' });
    
    // Generate Prisma client
    console.log('Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    // For Supabase, db push is more reliable than migrations
    console.log('Pushing schema to database...');
    execSync('npx prisma db push', { stdio: 'inherit' });
    
    console.log('Schema deployed successfully!');
    
    // Optionally seed the database
    const shouldSeed = process.argv.includes('--seed');
    if (shouldSeed) {
      console.log('Seeding the database...');
      execSync('node prisma/seed.js', { stdio: 'inherit' });
      console.log('Database seeded successfully!');
    }
  } catch (error) {
    console.error('Error deploying Prisma schema:', error);
    process.exit(1);
  }
}

// Execute the deployment
deployPrisma();
