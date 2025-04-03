/**
 * This module sets up the DATABASE_URL and DIRECT_URL environment variables
 * based on the VITE_DATABASE_SELECTION value.
 */
import dotenvFlow from 'dotenv-flow';
import { fileURLToPath } from 'url';
import path from 'path';

export function setupDatabaseEnvironment() {
  try {
    // Get the current file's directory for proper path resolution
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const rootDir = path.resolve(__dirname, '..');
    
    // Determine NODE_ENV from VITE_USER_NODE_ENV or from command line --mode
    const mode = process.env.VITE_USER_NODE_ENV || process.env.MODE || process.env.NODE_ENV || 'development';
    process.env.NODE_ENV = mode;
    
    console.log('==== Database Environment Setup ====');
    console.log(`NODE_ENV: ${mode}`);
    
    // Load environment variables based on mode
    const envFiles = dotenvFlow.listDotenvFiles(rootDir, { node_env: mode });
    console.log('Looking for env files:', envFiles);
    
    dotenvFlow.config({
      path: rootDir,
      node_env: mode,
      default_node_env: 'development'
    });
    
    // Get database selection from environment variable
    const databaseSelection = process.env.VITE_DATABASE_SELECTION || 'DEV';
    console.log(`Database Selection: ${databaseSelection}`);
    
    // Log currently loaded environment variables (database-related only)
    console.log('Available environment variables:');
    console.log(`  DEV_DATABASE_URL: ${process.env.DEV_DATABASE_URL ? 'Set' : 'Not set'}`);
    console.log(`  DEV_DIRECT_URL: ${process.env.DEV_DIRECT_URL ? 'Set' : 'Not set'}`);
    console.log(`  PROD_DATABASE_URL: ${process.env.PROD_DATABASE_URL ? 'Set' : 'Not set'}`);
    console.log(`  PROD_DIRECT_URL: ${process.env.PROD_DIRECT_URL ? 'Set' : 'Not set'}`);
    
    // Set the correct DATABASE_URL and DIRECT_URL based on selection
    if (databaseSelection === 'DEV') {
      process.env.DATABASE_URL = process.env.DEV_DATABASE_URL; // Pooled connection (port 6543)
      process.env.DIRECT_URL = process.env.DEV_DIRECT_URL;     // Direct connection (port 5432) for migrations
      console.log('Using DEV database configuration');
    } else if (databaseSelection === 'PROD') {
      process.env.DATABASE_URL = process.env.PROD_DATABASE_URL; // Pooled connection (port 6543)
      process.env.DIRECT_URL = process.env.PROD_DIRECT_URL;     // Direct connection (port 5432) for migrations
      console.log('Using PROD database configuration');
    } else {
      console.error(`Invalid database selection: ${databaseSelection}. Must be 'DEV' or 'PROD'. Defaulting to DEV.`);
      process.env.DATABASE_URL = process.env.DEV_DATABASE_URL;
      process.env.DIRECT_URL = process.env.DEV_DIRECT_URL;
    }
    
    // Validate that the DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      console.error('ERROR: DATABASE_URL environment variable is not set after selection');
      console.error(`Database selection was: ${databaseSelection}`);
      console.error(`DEV_DATABASE_URL: ${process.env.DEV_DATABASE_URL ? 'Set' : 'Not set'}`);
      console.error(`PROD_DATABASE_URL: ${process.env.PROD_DATABASE_URL ? 'Set' : 'Not set'}`);
      
      // Load environment variables from .env.local as a fallback
      try {
        console.log('Attempting to load from .env.local as fallback...');
        dotenvFlow.config({
          path: rootDir,
          node_env: process.env.NODE_ENV || 'development',
          default_node_env: 'development',
          files: ['.env.local']
        });
        
        // Try setting the URLs again
        if (databaseSelection === 'DEV') {
          process.env.DATABASE_URL = process.env.DEV_DATABASE_URL;
          process.env.DIRECT_URL = process.env.DEV_DIRECT_URL;
        } else if (databaseSelection === 'PROD') {
          process.env.DATABASE_URL = process.env.PROD_DATABASE_URL;
          process.env.DIRECT_URL = process.env.PROD_DIRECT_URL;
        }
        
        console.log('After fallback:');
        console.log(`  DEV_DATABASE_URL: ${process.env.DEV_DATABASE_URL ? 'Set' : 'Not set'}`);
        console.log(`  PROD_DATABASE_URL: ${process.env.PROD_DATABASE_URL ? 'Set' : 'Not set'}`);
        console.log(`  DATABASE_URL: ${process.env.DATABASE_URL ? 'Set' : 'Not set'}`);
      } catch (fallbackError) {
        console.error('Failed to load fallback configuration:', fallbackError);
      }
    }
    
    // Final validation after fallback attempt
    if (!process.env.DATABASE_URL) {
      console.error('CRITICAL ERROR: Unable to set DATABASE_URL from any configuration source');
    } else {
      // Mask the password in the URL for logging
      const maskedUrl = process.env.DATABASE_URL.replace(/(postgres:\/\/[^:]+:)([^@]+)(@.+)/g, '$1*****$3');
      console.log(`DATABASE_URL set to: ${maskedUrl}`);
      
      if (process.env.DIRECT_URL) {
        const maskedDirectUrl = process.env.DIRECT_URL.replace(/(postgres:\/\/[^:]+:)([^@]+)(@.+)/g, '$1*****$3');
        console.log(`DIRECT_URL set to: ${maskedDirectUrl}`);
      }
    }
    
    console.log('====================================');
    
    return {
      databaseSelection,
      databaseUrl: process.env.DATABASE_URL,
      directUrl: process.env.DIRECT_URL,
      envFiles
    };
  } catch (error) {
    console.error('Error setting up database environment:', error);
    return {
      error: error.message,
      databaseSelection: process.env.VITE_DATABASE_SELECTION || 'DEV',
      databaseUrl: process.env.DATABASE_URL,
      directUrl: process.env.DIRECT_URL
    };
  }
}

// Allow this module to be run directly for testing
if (process.argv[1] && process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = setupDatabaseEnvironment();
  console.log('Database Environment Setup Complete:');
  console.log('Node Environment:', process.env.NODE_ENV);
  console.log('Database Selection:', result.databaseSelection);
  console.log('Database URL configured:', !!result.databaseUrl);
  console.log('Direct URL configured:', !!result.directUrl);
  console.log('Environment files loaded:', result.envFiles?.join(', ') || 'unknown');
}
