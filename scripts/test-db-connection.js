import pkg from 'pg';
import 'dotenv-flow/config';
import { setupDatabaseEnvironment } from './setup-database-env.js';

const { Client } = pkg; // Fix named import issue with CommonJS module

// Setup database environment
const dbEnv = setupDatabaseEnvironment();

async function testConnection() {
  console.log('Testing database connection...');
  console.log(`Database Selection: ${dbEnv.databaseSelection}`);
  console.log(`Database URL: ${process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@')}`);
  console.log(`Direct URL: ${process.env.DIRECT_URL?.replace(/:[^:@]+@/, ':****@')}`);
  
  // Create a client using the DIRECT_URL
  const client = new Client({
    connectionString: process.env.DIRECT_URL
  });

  try {
    // Attempt connection
    await client.connect();
    console.log('Connected to the database successfully!');
    
    // Run a test query
    const result = await client.query('SELECT current_database() as database, current_schema() as schema');
    console.log('Database information:', result.rows[0]);
    
    // Try to get table list
    const tableResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      LIMIT 5
    `);
    console.log('Sample tables:', tableResult.rows.map(row => row.table_name));
    
    await client.end();
    console.log('Connection closed successfully.');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    
    if (error.code === 'ENOTFOUND') {
      console.error('\nHost not found. This could be because:');
      console.error('1. The hostname is incorrect in your connection string');
      console.error('2. You may need to use a different hostname for direct connections');
      console.error('\nCheck the connection string format in Supabase dashboard');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\nConnection refused. This could be because:');
      console.error('1. Your IP is not whitelisted in Supabase');
      console.error('2. The port might be blocked by a firewall');
    } else if (error.code === '28P01') {
      console.error('\nAuthentication failed. Check your username and password.');
    }
  }
}

testConnection();
