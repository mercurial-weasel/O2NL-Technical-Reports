import pkg from 'pg';
import 'dotenv-flow/config';
import { setupDatabaseEnvironment } from './setup-database-env.js';

const { Client } = pkg;

// Setup database environment
const dbEnv = setupDatabaseEnvironment();

console.log('Connecting to Supabase database...');
console.log(`DATABASE_URL: ${process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@')}`);
console.log(`DIRECT_URL: ${process.env.DIRECT_URL?.replace(/:[^:@]+@/, ':****@')}`);

async function testConnection() {
  try {
    console.log('\nTesting database connection using DATABASE_URL ...');
    // Use the DIRECT_URL for connection tests
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      throw new Error('DIRECT_URL is not defined');
    }
    
    // Parse URL to display connection info
    const urlPattern = /postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/;
    const match = connectionString.match(urlPattern);
    
    if (!match) {
      throw new Error('Invalid database URL format');
    }
    
    const [, username, password, host, port, database] = match;
    
    // Show connection info (mask password)
    console.log(`Database connection info:`);
    console.log(`Host: ${host}`);
    console.log(`Port: ${port}`);
    console.log(`Database: ${database}`);
    console.log(`Username: ${username}`);

    // Create a PostgreSQL client
    const client = new Client({ connectionString });
    
    // Connect and run a test query
    await client.connect();
    console.log('Connected to database successfully!');
    
    const result = await client.query('SELECT current_database() as database, current_schema() as schema');
    console.log('Database information:', result.rows[0]);
    
    await client.end();
    console.log('Database connection closed.');
    
    return true;
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    console.error('\nTroubleshooting steps:');
    console.error('1. Check that your IP is allowlisted in Supabase');
    console.error('   - Go to https://supabase.com and sign in');
    console.error('   - Select your project');
    console.error('   - Go to Project Settings > Database');
    console.error('   - Under "Connection Pooling", add your IP address');
    console.error('2. Verify your database credentials in .env.local are correct');
    console.error('3. Make sure your database is running and accessible');
    return false;
  }
}

// Execute the test
testConnection();
