# O2NL Dashboard

## Environment Setup

This project uses a comprehensive environment setup with `dotenv-flow` to manage environment variables across different environments.

### Environment Files Structure

The environment configuration follows this hierarchy:

1. `.env` - Base environment variables for all environments
2. `.env.development` - Development-specific variables (loaded when NODE_ENV=development)
3. `.env.production` - Production-specific variables (loaded when NODE_ENV=production)
4. `.env.test` - Test-specific variables (loaded when NODE_ENV=test)
5. `.env.local` - Local overrides, not committed to version control

Variables are loaded in the above order, with later files overriding values from earlier ones.

### Required Environment Variables

Here are the key environment variables needed:

```env
# Basic Configuration
PORT=5174
VITE_API_BASE_URL=http://localhost:3001

# Database Selection (DEV or PROD)
VITE_DATABASE_SELECTION=DEV

# Feature Flags
VITE_USE_MOCK_DATA=true
VITE_DEBUG_ACCESS_RIGHTS=false
VITE_BYPASS_AUTHENTICATION=false
VITE_ENABLE_EXPERIMENTAL_FEATURES=false

# Authentication
VITE_CLERK_PUBLISHABLE_KEY=your_key_here
CLERK_SECRET_KEY=your_secret_here
CLERK_API_URL=https://api.clerk.com
CLERK_JWKS_URL=your_jwks_url_here

# DEV Database (Supabase)
VITE_DEV_SUPABASE_URL=https://your-project.supabase.co
VITE_DEV_SUPABASE_ANON_KEY=your_anon_key_here
DEV_DATABASE_URL=postgresql://username:password@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true
DEV_DIRECT_URL=postgresql://username:password@aws-0-region.pooler.supabase.com:5432/postgres

# PROD Database (Supabase)
VITE_PROD_SUPABASE_URL=https://your-prod-project.supabase.co
VITE_PROD_SUPABASE_ANON_KEY=your_prod_anon_key_here
PROD_DATABASE_URL=postgresql://username:password@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true
PROD_DIRECT_URL=postgresql://username:password@aws-0-region.pooler.supabase.com:5432/postgres
```

### Connection Types

- **DATABASE_URL** - Uses pooled connections (port 6543) for regular app connections
- **DIRECT_URL** - Uses direct connections (port 5432) for migrations and admin tasks

### Setting Up Your Environment

1. Copy `.env.example` to `.env` for base settings
2. Create `.env.local` for your local overrides (not committed to git)
3. Set proper values for database credentials in `.env.local`

## Database Management

The project supports two database environments: DEV and PROD. You select which database to use by setting the `VITE_DATABASE_SELECTION` environment variable.

### Testing Database Connections

Before running migrations, you can test your database connections:

```bash
# Test the current database connection (based on VITE_DATABASE_SELECTION)
npm run db:test-connection

# Connect to Supabase and test connectivity
npm run db:connect-supabase

# View the current database environment setup
npm run db:setup-env
```

### Prisma Commands

The project includes several scripts for managing the database with Prisma:

```bash
# Generate Prisma client after schema changes
npm run prisma:generate

# Merge Prisma schema files (automatically run by other commands)
npm run prisma:merge

# Development migrations (creates and applies migrations)
npm run prisma:migrate:dev

# Production migrations (applies existing migrations)
npm run prisma:migrate:prod

# Push schema changes directly to the database (no migration files)
npm run prisma:push

# Reset the database (WARNING: Deletes all data)
npm run prisma:reset

# Launch Prisma Studio (database GUI)
npm run prisma:studio
```

### Database Migrations

Migrations in this project use Prisma's migration system with some custom enhancements:

#### Creating Development Migrations

When developing, create migrations with:

```bash
npm run prisma:migrate:dev
```

This will:
1. Detect schema changes
2. Create a migration file in `/prisma/migrations`
3. Apply the migration to your database
4. Regenerate the Prisma client

#### Applying Migrations in Production

For production deployments, use:

```bash
npm run prisma:migrate:prod
```

This will apply any pending migrations without generating new migration files.

#### Important Migration Notes

- Always use the `DIRECT_URL` for migrations (automatically handled by our scripts)
- Ensure your IP is allowlisted in Supabase before running migrations
- Use `npm run prisma:push` during early development for quick schema changes
- Switch to proper migrations with `prisma:migrate:dev` when your schema stabilizes

#### Resetting the Database

If you need to completely reset your database:

```bash
npm run prisma:reset
```

**WARNING**: This will delete all data in the database and recreate the schema.

### Supabase Configuration

This project uses Supabase as the database provider. When setting up a new Supabase project, make sure to:

1. Configure the connection pooler settings
2. Add your development IP addresses to the allowlist
3. Use the correct connection strings:
   - `DATABASE_URL` - Use the pooled connection string (port 6543)
   - `DIRECT_URL` - Use the direct connection string (port 5432)

## Running the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm run preview
```

## Troubleshooting

### "Cannot connect to database" errors

1. Check that your IP is allowlisted in the Supabase dashboard
2. Verify your database credentials in `.env.local`
3. Run `npm run db:test-connection` to test connectivity
4. Check that you're using the correct `DIRECT_URL` for migrations

### "prisma generate" errors

1. Make sure your schema is valid with `npx prisma validate`
2. Check that `DATABASE_URL` is set correctly
3. Try running `npm run prisma:merge` then `npm run prisma:generate` separately

### Other common issues

- **Environment Variables Not Loading**: Make sure you're using the correct NODE_ENV setting
- **Missing Dependencies**: Run `npm install` to ensure all dependencies are installed
- **Cross-ENV Not Found**: Run `npm run predev` to install cross-env if it's missing
