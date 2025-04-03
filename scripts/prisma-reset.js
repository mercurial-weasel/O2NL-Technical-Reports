// This is a wrapper script to ensure dotenv-flow is loaded before running Prisma commands
import { execSync } from 'child_process';
import 'dotenv-flow/config';
import { setupDatabaseEnvironment } from './setup-database-env.js';
import pkg from 'pg';
import readline from 'readline';

const { Client } = pkg;

// Setup database environment variables based on VITE_DATABASE_SELECTION
const dbEnv = setupDatabaseEnvironment();

// Create readline interface for user confirmation
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Test connection before attempting reset
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

async function confirmReset() {
  return new Promise((resolve) => {
    console.log('\n⚠️ WARNING: This will DELETE ALL DATA in the database! ⚠️');
    console.log(`Database: ${dbEnv.databaseSelection}`);
    console.log(`Connection: ${process.env.DIRECT_URL?.replace(/:[^:@]+@/, ':****@')}\n`);
    
    rl.question('Are you sure you want to reset the database? (yes/no): ', (answer) => {
      resolve(answer.toLowerCase() === 'yes');
    });
  });
}

async function runReset() {
  try {
    console.log(`Running prisma migrate reset with ${process.env.NODE_ENV} environment`);
    console.log(`Database selection: ${dbEnv.databaseSelection}`);
    console.log(`DATABASE_URL configured: ${!!process.env.DATABASE_URL} (pooled connection)`);
    console.log(`DIRECT_URL configured: ${!!process.env.DIRECT_URL} (direct connection for migrations)`);
    
    // Test connection first using DIRECT_URL
    const connectionSuccess = await testDatabaseConnection();
    if (!connectionSuccess) {
      console.error('Database connection failed. Reset aborted.');
      console.log('Possible solutions:');
      console.log('1. Check if your IP address is allowlisted in Supabase');
      console.log('2. Verify that your database credentials are correct');
      console.log('3. Make sure DIRECT_URL is set correctly and points to port 5432');
      process.exit(1);
    }

    // Ask for confirmation
    const confirmed = await confirmReset();
    if (!confirmed) {
      console.log('Database reset canceled.');
      process.exit(0);
    }

    // Get any additional arguments
    const additionalArgs = process.argv.slice(2).join(' ');
    
    // Run prisma migrate reset
    console.log('Resetting database...');
    execSync(`npx prisma migrate reset --force ${additionalArgs}`, { 
      stdio: 'inherit',
      env: process.env
    });
    
    console.log(`Database reset completed successfully`);
  } catch (error) {
    console.error('Error during database reset:', error);
    process.exit(1);
  } finally {
    rl.close();
  }
}

runReset();
