// This is a wrapper script to ensure dotenv-flow is loaded before running Prisma commands
import { execSync } from 'child_process';
import 'dotenv-flow/config';
import { setupDatabaseEnvironment } from './setup-database-env.js';

// Setup database environment variables based on VITE_DATABASE_SELECTION
const dbEnv = setupDatabaseEnvironment();

try {
  console.log(`Running prisma generate with ${process.env.NODE_ENV} environment`);
  console.log(`Database selection: ${dbEnv.databaseSelection}`);
  console.log(`DATABASE_URL configured: ${!!process.env.DATABASE_URL}`);
  console.log(`DIRECT_URL configured: ${!!process.env.DIRECT_URL}`);
  
  // Generate the Prisma client
  execSync('npx prisma generate', { 
    stdio: 'inherit',
    env: process.env
  });
  
  console.log(`Prisma client generated successfully`);
} catch (error) {
  console.error('Error during generate:', error);
  process.exit(1);
}
