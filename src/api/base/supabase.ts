import { createClient } from '@supabase/supabase-js';

// Get database selection from environment variable
const databaseSelection = import.meta.env.VITE_DATABASE_SELECTION;

// Log environment variable availability for debugging
console.log('Environment variables available:');
console.log('VITE_DATABASE_SELECTION:', import.meta.env.VITE_DATABASE_SELECTION);
console.log('VITE_DEV_SUPABASE_URL exists:', !!import.meta.env.VITE_DEV_SUPABASE_URL);
console.log('VITE_DEV_SUPABASE_ANON_KEY exists:', !!import.meta.env.VITE_DEV_SUPABASE_ANON_KEY);
console.log('VITE_PROD_SUPABASE_URL exists:', !!import.meta.env.VITE_PROD_SUPABASE_URL);
console.log('VITE_PROD_SUPABASE_ANON_KEY exists:', !!import.meta.env.VITE_PROD_SUPABASE_ANON_KEY);

// Initialize variables for Supabase URL and Anon Key
let supabaseUrl = '';
let supabaseAnonKey = '';

// Select the appropriate database credentials based on the database selection
if (databaseSelection === 'DEV') {
  supabaseUrl = import.meta.env.VITE_DEV_SUPABASE_URL;
  supabaseAnonKey = import.meta.env.VITE_DEV_SUPABASE_ANON_KEY;
  console.log('Using DEV database configuration');
} else if (databaseSelection === 'PROD') {
  supabaseUrl = import.meta.env.VITE_PROD_SUPABASE_URL;
  supabaseAnonKey = import.meta.env.VITE_PROD_SUPABASE_ANON_KEY;
  console.log('Using PROD database configuration');
} else {
  console.error(`Invalid database selection: ${databaseSelection}. Must be 'DEV' or 'PROD'.`);
  // Fallback to DEV values as default
  console.log('Falling back to DEV database configuration');
}

// Validate configuration
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration in environment variables');
}

// Log the Supabase URL for debugging
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key (first 10 chars):', supabaseAnonKey?.substring(0, 10) + '...');

// Create a single instance of the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Log initialization for debugging
console.log('Supabase client initialized');
