// This is a wrapper script to ensure dotenv-flow is loaded before running Prisma commands
import { execSync } from 'child_process';
import 'dotenv-flow/config';
import { setupDatabaseEnvironment } from './setup-database-env.js';
import pkg from 'pg';

const { Client } = pkg;

// Setup database environment variables based on VITE_DATABASE_SELECTION
const dbEnv = setupDatabaseEnvironment();

// Get command line arguments
const args = process.argv.slice(2);
const command = args[0] || 'dev'; // Default to 'dev' if no command is provided

// Test connection before attempting migration
async function testDatabaseConnection() {
  // For migrations, we should use DIRECT_URL which bypasses the connection pooler
  const client = new Client({
    connectionString: process.env.DIRECT_URL
  });

  try {
    await client.connect();
    console.log('Database connection test successful (using direct connection)');
    await client.end();
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error.message);
    return false;
  }
}

async function runMigration() {
  try {
    console.log(`Running prisma migrate ${command} with ${process.env.NODE_ENV} environment`);
    console.log(`Database selection: ${dbEnv.databaseSelection}`);
    console.log(`DATABASE_URL configured: ${!!process.env.DATABASE_URL} (pooled connection)`);
    console.log(`DIRECT_URL configured: ${!!process.env.DIRECT_URL} (direct connection for migrations)`);
    
    // Test connection first using DIRECT_URL
    const connectionSuccess = await testDatabaseConnection();
    if (!connectionSuccess) {
      console.error('Database connection failed. Migration aborted.');
      console.log('Possible solutions:');
      console.log('1. Check if your IP address is allowlisted in Supabase');
      console.log('2. Verify that your database credentials are correct');
      console.log('3. Make sure DIRECT_URL is set correctly and points to port 5432');
      process.exit(1);
    }

    // Run the appropriate Prisma command
    if (command === 'dev') {
      const migrationName = args[1] || `migration_${Date.now()}`;
      console.log(`Creating migration named: ${migrationName}`);
      execSync(`npx prisma migrate dev --name ${migrationName}`, { 
        stdio: 'inherit',
        env: process.env
      });
    } else if (command === 'deploy') {
      execSync('npx prisma migrate deploy', { 
        stdio: 'inherit',
        env: process.env
      });
    } else if (command === 'reset') {
      // Warning for reset command
      console.log('WARNING: The reset command will DELETE ALL DATA in the database.');
      console.log(`Database URL: ${process.env.DATABASE_URL ? '(set)' : '(not set)'}`);
      console.log(`Direct URL: ${process.env.DIRECT_URL ? '(set)' : '(not set)'}`);
      
      // Extract any additional arguments
      const additionalArgs = args.slice(1).join(' ');
      execSync(`npx prisma migrate reset ${additionalArgs}`, { 
        stdio: 'inherit',
        env: process.env
      });
    } else {
      // For other commands, pass through all arguments
      execSync(`npx prisma migrate ${args.join(' ')}`, { 
        stdio: 'inherit',
        env: process.env
      });
    }
    
    console.log(`Migration command '${command}' completed successfully`);
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
}

runMigration();
