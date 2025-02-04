// Define text colors directly since we can't import Tailwind colors at runtime
export const colors = {
  // Brand Colors
  brand: {
    primary: '#6CC24A',    // Main green
    secondary: '#0077FF',  // Blue accent
    tertiary: '#F2CD00',  // Yellow accent
  },
  
  // Background Colors
  background: {
    base: '#161616',      // Reduced brightness dark gray
    darker: '#111111',    // Deeper dark gray
    card: {
      from: '#1F1F1F',    // Enhanced contrast
      to: '#191919',      // Enhanced contrast
    },
    header: {
      from: '#242424',    // Balanced dark gray
      via: '#1F1F1F',     // Mid-tone
      to: '#1A1A1A',      // Darker shade
    }
  },
  
  // Border Colors
  border: {
    primary: '#2B2B2B',   // Enhanced contrast border
    header: '#363636',    // Balanced gray border
    divider: '#242424',   // Subtle divider
  },
  
  // Text Colors
  text: {
    primary: '#FFFFFF',    // Crisp white text
    secondary: '#ABABAB',  // Enhanced readability
    muted: '#7A7A7A',     // Balanced muted text
  },
  
  // Overlay Colors
  overlay: {
    light: 'rgba(255, 255, 255, 0.04)',  // Subtle light overlay
    hover: 'rgba(255, 255, 255, 0.06)',   // Enhanced hover effect
  }
} as const;

// Common gradients
export const gradients = {
  card: 'bg-gradient-to-br from-background-card-from to-background-card-to',
  header: 'bg-gradient-to-b from-background-header-from via-background-header-via to-background-header-to',
  heroBackground: 'bg-gradient-to-b from-background-base via-background-darker to-background-base',
} as const;

// Enhanced shadows for better depth
export const shadows = {
  header: 'shadow-[0_2px_8px_0_rgba(0,0,0,0.25),0_4px_16px_0_rgba(0,0,0,0.15)]',
  card: 'shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.24)]',
  button: {
    primary: 'shadow-[0_2px_4px_0_rgba(0,0,0,0.35)]',
    hover: 'shadow-[0_4px_8px_0_rgba(0,0,0,0.45)]',
  }
} as const;