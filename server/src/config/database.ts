import { PrismaClient } from '@prisma/client';
import dotenvFlow from 'dotenv-flow';

// Load environment variables with dotenv-flow
dotenvFlow.config({
  node_env: process.env.NODE_ENV || 'development',
  default_node_env: 'development',
});

// Setup database environment based on selection
function setupDatabaseEnvironment() {
  const databaseSelection = process.env.VITE_DATABASE_SELECTION || 'DEV';
  
  if (databaseSelection === 'DEV') {
    process.env.DATABASE_URL = process.env.DEV_DATABASE_URL;
    process.env.DIRECT_URL = process.env.DEV_DIRECT_URL;
    console.log('Database config: Using DEV database');
  } else if (databaseSelection === 'PROD') {
    process.env.DATABASE_URL = process.env.PROD_DATABASE_URL;
    process.env.DIRECT_URL = process.env.PROD_DIRECT_URL;
    console.log('Database config: Using PROD database');
  } else {
    console.error(`Invalid database selection: ${databaseSelection}. Must be 'DEV' or 'PROD'. Defaulting to DEV.`);
    process.env.DATABASE_URL = process.env.DEV_DATABASE_URL;
    process.env.DIRECT_URL = process.env.DEV_DIRECT_URL;
  }

  return databaseSelection;
}

// Set up the database environment
const databaseSelection = setupDatabaseEnvironment();

// Configure Prisma options
const prismaOptions = {
  datasources: {
    db: {
      // This will use the pooled connection via DATABASE_URL for regular app queries
      // Prisma will automatically use directUrl for migrations
      url: process.env.DATABASE_URL,
    },
  },
  // Only log in development mode
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'info', 'warn', 'error']
    : ['warn', 'error'],
};

// Create and export the Prisma client
export const prisma = new PrismaClient(prismaOptions);

// Export database information
export const databaseInfo = {
  selection: databaseSelection,
  url: process.env.DATABASE_URL ? 'Configured' : 'Not configured',
  env: process.env.NODE_ENV,
};
