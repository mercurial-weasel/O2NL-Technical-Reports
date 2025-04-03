import 'dotenv-flow/config';
import { setupDatabaseEnvironment } from './setup-database-env.js';

// Force test environment
process.env.NODE_ENV = 'test';

// Setup database environment variables based on test configuration
setupDatabaseEnvironment();

console.log('Test environment setup completed');
console.log(`Using database: ${process.env.DATABASE_URL ? 'Configured' : 'Not configured'}`);
console.log(`Environment: ${process.env.NODE_ENV}`);
console.log(`Database selection: ${process.env.VITE_DATABASE_SELECTION}`);
