const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const dotenvFlow = require('dotenv-flow');

// Load environment variables with dotenv-flow
// This will load .env, .env.local, .env.[NODE_ENV], etc.
dotenvFlow.config({
  node_env: process.env.NODE_ENV || 'development',
  default_node_env: 'development'
});

// Parse command line arguments
const shouldSeed = process.argv.includes('--seed');
const databaseArg = process.argv.find(arg => arg.startsWith('--db='));
const databaseSelection = databaseArg ? databaseArg.replace('--db=', '') : (process.env.VITE_DATABASE_SELECTION || 'DEV');

// Set the correct DATABASE_URL and DIRECT_URL based on selection
if (databaseSelection === 'DEV') {
  process.env.DATABASE_URL = process.env.DEV_DATABASE_URL;
  process.env.DIRECT_URL = process.env.DEV_DIRECT_URL;
  console.log('Using DEV database configuration');
} else if (databaseSelection === 'PROD') {
  process.env.DATABASE_URL = process.env.PROD_DATABASE_URL;
  process.env.DIRECT_URL = process.env.PROD_DIRECT_URL;
  console.log('Using PROD database configuration');
} else {
  console.error(`Invalid database selection: ${databaseSelection}. Must be 'DEV' or 'PROD'. Defaulting to DEV.`);
  process.env.DATABASE_URL = process.env.DEV_DATABASE_URL;
  process.env.DIRECT_URL = process.env.DEV_DIRECT_URL;
}

// Database URL must be set in the environment
if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is not set');
  console.error(`Database selection was: ${databaseSelection}`);
  console.error(`DEV_DATABASE_URL: ${process.env.DEV_DATABASE_URL ? 'Set' : 'Not set'}`);
  console.error(`PROD_DATABASE_URL: ${process.env.PROD_DATABASE_URL ? 'Set' : 'Not set'}`);
  process.exit(1);
}

console.log(`Starting Prisma deployment for ${databaseSelection} database with NODE_ENV=${process.env.NODE_ENV}...`);

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
  execSync('npx prisma generate', { stdio: 'inherit', env: process.env });
} catch (error) {
  console.error('Error generating Prisma client:', error);
  process.exit(1);
}

// Deploy migrations
try {
  console.log('Deploying migrations...');
  execSync('npx prisma migrate deploy', { stdio: 'inherit', env: process.env });
} catch (error) {
  console.error('Error deploying migrations:', error);
  process.exit(1);
}

// Run seed if requested
if (shouldSeed) {
  try {
    console.log('Seeding database...');
    execSync('npx prisma db seed', { stdio: 'inherit', env: process.env });
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

console.log(`Prisma deployment to ${databaseSelection} database completed successfully!`);
