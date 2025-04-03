import express from 'express';
import dotenvFlow from 'dotenv-flow';
import cors from 'cors';
import helmet from 'helmet';

// Load environment variables with dotenv-flow
// This will load .env, .env.local, .env.development, etc. based on NODE_ENV
dotenvFlow.config({
  node_env: process.env.NODE_ENV || 'development',
  default_node_env: 'development'
});

// Initialize express app
const app = express();

// ... existing code ...

export default app;
