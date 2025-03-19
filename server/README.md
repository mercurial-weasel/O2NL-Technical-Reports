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

- **GET /health**: Simple health check endpoint that returns status "ok" when the server is running

## Environment Variables

- `PORT`: Port number for the server (default: 3001)
- `NODE_ENV`: Environment (development, production)
- `DATABASE_URL`: PostgreSQL connection string
- `DIRECT_URL`: Direct PostgreSQL connection string (used for migrations)

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
