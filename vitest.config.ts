import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    include: ['src/tests/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/tests/',
        '**/*.d.ts',
      ],
      reportsDirectory: './coverage'
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@common': path.resolve(__dirname, './src/components/common'),
      '@components': path.resolve(__dirname, './src/components'),
      '@features': path.resolve(__dirname, './src/components/features'),
      '@features_environmental': path.resolve(__dirname, './src/components/features/environmental'),
      '@environmental_sensor_common': path.resolve(__dirname, './src/components/features/environmental/sensor_common'),
      '@environmental_dust': path.resolve(__dirname, './src/components/features/environmental/dust'),
      '@dashboards': path.resolve(__dirname, './src/components/Dashboards'),
      '@api': path.resolve(__dirname, './src/api'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@config': path.resolve(__dirname, './src/config'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@types': path.resolve(__dirname, './src/types'),
      '@tests': path.resolve(__dirname, './src/tests'),
      '@data': path.resolve(__dirname, './src/data'),
      '@routes': path.resolve(__dirname, './src/routes')
    }
  }
});