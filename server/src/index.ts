import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { json, urlencoded } from 'body-parser';
import dotenvFlow from 'dotenv-flow';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './config/swagger';
import apiRoutes from './api';
import { databaseInfo } from './config/database';

// Load environment variables with dotenv-flow
// This will load .env, .env.local, .env.development, etc. based on NODE_ENV
dotenvFlow.config({
  node_env: process.env.NODE_ENV || 'development',
  default_node_env: 'development'
});

// Initialize express app
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

// API routes
app.use('/api', apiRoutes);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpecs);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    database: {
      selection: databaseInfo.selection,
      url: databaseInfo.url,
      environment: databaseInfo.env
    }
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Using database selection: ${databaseInfo.selection}`);
  console.log(`Database connection: ${databaseInfo.url}`);
});
