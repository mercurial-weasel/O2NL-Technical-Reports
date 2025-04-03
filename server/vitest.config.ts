import { defineConfig } from 'vitest/config';
import dotenvFlow from 'dotenv-flow';
import path from 'path';

// Load environment variables with dotenv-flow
dotenvFlow.config({
  node_env: 'test',
  default_node_env: 'development'
});

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./test/setup.ts'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
