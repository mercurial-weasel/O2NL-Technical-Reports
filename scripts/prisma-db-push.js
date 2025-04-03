// This is a wrapper script to ensure dotenv-flow is loaded before running Prisma commands
import { execSync } from 'child_process';
import 'dotenv-flow/config';
import { setupDatabaseEnvironment } from './setup-database-env.js';

// Setup database environment variables based on VITE_DATABASE_SELECTION
const dbEnv = setupDatabaseEnvironment();

try {
  console.log(`Running prisma db push with ${process.env.NODE_ENV} environment`);
  console.log(`Database selection: ${dbEnv.databaseSelection}`);
  console.log(`DATABASE_URL configured: ${!!process.env.DATABASE_URL}`);
  console.log(`DIRECT_URL configured: ${!!process.env.DIRECT_URL}`);
  
  // Additional options can be passed to the db push command
  // Extract any additional arguments
  const additionalArgs = process.argv.slice(2).join(' ');
  
  // Run the Prisma command with the environment variables now set
  execSync(`npx prisma db push ${additionalArgs}`, { 
    stdio: 'inherit',
    env: process.env
  });
  
  console.log(`Database push completed successfully`);
} catch (error) {
  console.error('Error during db push:', error);
  process.exit(1);
}
