/**
 * ChainText Theme - Aston Martin Luxury Retro Design
 * Inspired by cinematic elegance and automotive excellence
 */

export const theme = {
  colors: {
    // Primary palette
    deepCharcoal: '#1C1C1C',
    brushedSilver: '#C0C0C0',
    accentGold: '#D4AF37',
    
    // Supporting colors
    richBlack: '#0A0A0A',
    carbonFiber: '#2A2A2A',
    platinum: '#E5E5E5',
    champagneGold: '#F0E68C',
    darkGold: '#B8942A',
    
    // Functional colors
    success: '#2ECC71',
    error: '#E74C3C',
    warning: '#F39C12',
    info: '#3498DB',
    
    // Glassmorphism
    glassLight: 'rgba(192, 192, 192, 0.1)',
    glassMedium: 'rgba(192, 192, 192, 0.15)',
    glassDark: 'rgba(28, 28, 28, 0.8)',
    glassAccent: 'rgba(212, 175, 55, 0.2)',
  },
  
  typography: {
    fontFamily: {
      primary: "'Playfair Display', 'Cormorant Garamond', serif",
      secondary: "'Inter', 'Helvetica Neue', sans-serif",
      mono: "'Fira Code', 'Courier New', monospace",
    },
    
    fontSize: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
    },
    
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      black: 900,
    },
    
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2,
    },
    
    letterSpacing: {
      tight: '-0.05em',
      normal: '0',
      wide: '0.05em',
      wider: '0.1em',
      widest: '0.15em',
    },
  },
  
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
    '4xl': '6rem',   // 96px
  },
  
  borderRadius: {
    none: '0',
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '1rem',      // 16px
    xl: '1.5rem',    // 24px
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px rgba(0, 0, 0, 0.2)',
    lg: '0 10px 25px rgba(0, 0, 0, 0.3)',
    xl: '0 20px 40px rgba(0, 0, 0, 0.4)',
    gold: '0 0 20px rgba(212, 175, 55, 0.3)',
    inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  
  transitions: {
    fast: '150ms ease-in-out',
    normal: '300ms ease-in-out',
    slow: '500ms ease-in-out',
    cinematic: '800ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  zIndex: {
    base: 0,
    dropdown: 10,
    sticky: 20,
    fixed: 30,
    modal: 40,
    popover: 50,
    tooltip: 60,
  },
};

export default theme;
