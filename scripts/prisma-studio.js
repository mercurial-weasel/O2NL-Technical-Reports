// This is a wrapper script to ensure dotenv-flow is loaded before running Prisma commands
import { execSync } from 'child_process';
import 'dotenv-flow/config';
import { setupDatabaseEnvironment } from './setup-database-env.js';

// Setup database environment variables based on VITE_DATABASE_SELECTION
const dbEnv = setupDatabaseEnvironment();

try {
  console.log(`Running prisma studio with ${process.env.NODE_ENV} environment`);
  console.log(`Database selection: ${dbEnv.databaseSelection}`);
  console.log(`DATABASE_URL configured: ${!!process.env.DATABASE_URL}`);
  console.log(`DIRECT_URL configured: ${!!process.env.DIRECT_URL}`);
  
  // Run Prisma Studio
  execSync('npx prisma studio', { 
    stdio: 'inherit',
    env: process.env
  });
} catch (error) {
  console.error('Error starting Prisma Studio:', error);
  process.exit(1);
}
