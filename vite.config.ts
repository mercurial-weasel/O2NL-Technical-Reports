import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenvFlow from 'dotenv-flow';
import path from 'path';

// Load environment variables with dotenv-flow
dotenvFlow.config({
  node_env: process.env.NODE_ENV || 'development',
  default_node_env: 'development'
});

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist', // Ensure output directory matches Amplify config
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@api': path.resolve(__dirname, './src/api'),
      '@config': path.resolve(__dirname, './src/config'),
      '@constants': path.resolve(__dirname, './src/constants'),

      '@components': path.resolve(__dirname, './src/components'),
      '@common': path.resolve(__dirname, './src/components/common'),

      '@dashboards': path.resolve(__dirname, './src/components/Dashboards'),
      '@dashboardGroups': path.resolve(__dirname, './src/components/DashboardGroups'),

      '@features': path.resolve(__dirname, './src/components/features'),
      '@FeaturesCommon': path.resolve(__dirname, './src/components/features/Common'),
      '@features_environmental': path.resolve(__dirname, './src/components/features/environmental'),
      '@features_ProjectControls': path.resolve(__dirname, './src/components/features/ProjectControls'),
      '@environmental_sensor_common': path.resolve(__dirname, './src/components/features/environmental/sensor_common'),
      '@environmental_dust': path.resolve(__dirname, './src/components/features/environmental/dust'),

      '@auth': path.resolve(__dirname, './src/auth'),
      '@data': path.resolve(__dirname, './src/data'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@types': path.resolve(__dirname, './src/types'),
      '@tests': path.resolve(__dirname, './src/tests'),
      '@routes': path.resolve(__dirname, './src/routes')
    }
  },
  server: {
    // Use the PORT from environment variables or default to 5173
    port: parseInt(process.env.PORT || '5173'),
    // Configure proxy for API requests
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});