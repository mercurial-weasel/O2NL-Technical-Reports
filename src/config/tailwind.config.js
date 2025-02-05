/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#6CC24A',    // Green
          secondary: '#0077FF',  // Blue
          tertiary: '#F2CD00',   // Yellow
        },
        background: {
          base: '#161616',       // Dark base
          darker: '#111111',     // Darker shade
          card: {
            from: '#1F1F1F',     // Card gradient start
            to: '#191919',       // Card gradient end
          },
          header: {
            from: '#242424',     // Header gradient start
            via: '#1F1F1F',      // Header gradient middle
            to: '#1A1A1A',       // Header gradient end
          }
        },
        border: {
          primary: '#2B2B2B',    // Primary border
          header: '#363636',     // Header border
          divider: '#242424',    // Divider border
        },
        text: {
          primary: '#FFFFFF',    // Primary text
          secondary: '#ABABAB',  // Secondary text
          muted: '#7A7A7A',     // Muted text
        }
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.24)',
        'card-hover': '0 6px 8px -1px rgba(0, 0, 0, 0.36), 0 4px 6px -1px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
}