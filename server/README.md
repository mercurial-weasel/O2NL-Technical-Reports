# O2NL Dashboard Backend Server

This is the backend API server for the O2NL Dashboard application. It provides API endpoints for various data services including geotechnical test data.

## Prerequisites

- Node.js (version 16.x or later)
- npm (version 8.x or later)

## Installation

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

## Running the Server

### Development Mode

To run the server in development mode with hot-reloading:

```bash
npm run dev
```

This will start the server on port 3001 (default) or the port specified in the `PORT` environment variable.

### Production Mode

To build and run the server for production:

```bash
npm run build
npm start
```

## Database Configuration

The application supports two database environments: DEV and PROD. You can select which database to use by setting the `VITE_DATABASE_SELECTION` environment variable.

### Environment Configuration

The application uses dotenv-flow for loading environment variables. This means you can have multiple .env files:

- `.env`: Base environment variables for all environments
- `.env.local`: Local overrides (not committed to version control)
- `.env.development`: Development-specific variables (loaded when NODE_ENV=development)
- `.env.production`: Production-specific variables (loaded when NODE_ENV=production)
- `.env.test`: Test-specific variables (loaded when NODE_ENV=test)

### Running with Specific Environment

All scripts in package.json have been updated to use the appropriate NODE_ENV:

```bash
# Development environment
npm run dev  # Sets NODE_ENV=development

# Production environment
npm run build  # Sets NODE_ENV=production

# Test environment
npm run test  # Sets NODE_ENV=test
```

### Database Migration Commands

The following commands have been added to manage database migrations:

```bash
# Development migrations
npm run prisma:migrate:dev  # Create and apply migrations for development

# Production migrations
npm run prisma:migrate:prod  # Apply existing migrations in production

# Deploy to specific database
npm run prisma:deploy:dev  # Deploy to development database
npm run prisma:deploy:prod  # Deploy to production database
```

### Database Selection

- `VITE_DATABASE_SELECTION=DEV` (default) - Uses the development database
- `VITE_DATABASE_SELECTION=PROD` - Uses the production database

You can also specify the database when running the Prisma deployment script:

```bash
npm run prisma:deploy -- --db=DEV
# or
npm run prisma:deploy -- --db=PROD
```

### Environment Variables

For each database environment, set the following variables in your `.env` file:

```
# DEV DATABASE
DEV_DATABASE_URL="postgresql://username:password@host:port/database?pgbouncer=true"
DEV_DIRECT_URL="postgresql://username:password@host:port/database"
VITE_DEV_SUPABASE_URL="https://your-dev-project.supabase.co"
VITE_DEV_SUPABASE_ANON_KEY="your-dev-anon-key"

# PROD DATABASE
PROD_DATABASE_URL="postgresql://username:password@host:port/database?pgbouncer=true"
PROD_DIRECT_URL="postgresql://username:password@host:port/database"
VITE_PROD_SUPABASE_URL="https://your-prod-project.supabase.co"
VITE_PROD_SUPABASE_ANON_KEY="your-prod-anon-key"
```

## API Documentation

The API is documented using Swagger/OpenAPI:

- **Development**: When running the server locally, visit http://localhost:3001/api-docs
- **Production**: Visit https://your-production-url.com/api-docs

You can also access the raw Swagger JSON at `/api-docs.json`.

## API Endpoints

The server exposes the following API endpoints:

### Geotechnical Data

- **GET /api/geotechnical/psd**: Get all particle size distribution test data
- **GET /api/geotechnical/psd/:id**: Get particle size distribution test by ID
- **GET /api/geotechnical/psd/location/:locationId**: Get particle size distribution tests by location ID

### Health Check

- **GET /health**: Health check endpoint that returns status and database configuration

## Setting Up for Local Development with Frontend

The frontend application is configured to proxy API requests to this server during development. Make sure the `proxy` field in the frontend's package.json points to the correct server URL (e.g., `"proxy": "http://localhost:3001"`).

To run both frontend and backend together:

1. Start the backend server:
   ```bash
   cd server
   npm run dev
   ```

2. In a separate terminal, start the frontend:
   ```bash
   cd ..  # Go back to project root
   npm run dev
   ```

## Troubleshooting

- **Port already in use**: If you get an error saying the port is already in use, you can change the port by setting the PORT environment variable:
  ```bash
  PORT=3002 npm run dev
  ```

- **Connection refused from frontend**: Ensure the server is running and that the proxy setting in frontend's package.json matches the server's URL.

- **Database connection issues**: Check that the correct database URL is being used based on your `VITE_DATABASE_SELECTION` setting. You can see which database is being used in the server startup logs.
