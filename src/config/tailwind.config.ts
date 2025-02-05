import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#6CC24A',
          secondary: '#0077FF',
          tertiary: '#F2CD00',
        },
        background: {
          base: '#161616',     // Reduced brightness by ~15%
          darker: '#111111',    // Reduced brightness by ~20%
          card: {
            from: '#1F1F1F',    // Reduced brightness, increased contrast
            to: '#191919',      // Reduced brightness, increased contrast
          },
          header: {
            from: '#242424',    // Reduced brightness
            via: '#1F1F1F',     // Reduced brightness
            to: '#1A1A1A',      // Reduced brightness
          }
        },
        border: {
          primary: '#2B2B2B',   // Slightly darker for better contrast
          header: '#363636',    // Adjusted for balance
          divider: '#242424',   // Adjusted for consistency
        },
        text: {
          primary: '#FFFFFF',   // Kept white for maximum contrast
          secondary: '#ABABAB', // Slightly brighter for better readability
          muted: '#7A7A7A',     // Adjusted for hierarchy
        }
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.24)',
        'card-hover': '0 6px 8px -1px rgba(0, 0, 0, 0.36), 0 4px 6px -1px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
} as Config;