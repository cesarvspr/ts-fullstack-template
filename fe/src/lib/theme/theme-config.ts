export const lightTheme = {
  colors: {
    background: '#fafaf9',
    foreground: '#1c1917',
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    secondary: '#93c5fd',
    accent: '#8b5cf6',
    muted: '#f5f5f4',
    border: '#e7e5e4',
    card: '#ffffff',
    cardForeground: '#1c1917',
  },
  fonts: {
    sans: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif',
    mono: 'var(--font-geist-mono), monospace',
  },
  transitions: {
    fast: '0.2s ease',
    normal: '0.3s ease',
    slow: '0.5s ease',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  },
  radii: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    full: '9999px',
  },
  breakpoints: {
    xs: '480px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
};

export const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    background: '#0c0a09',
    foreground: '#fafaf9',
    primary: '#60a5fa',
    primaryHover: '#3b82f6',
    secondary: '#1d4ed8',
    accent: '#a78bfa',
    muted: '#1c1917',
    border: '#292524',
    card: '#1c1917',
    cardForeground: '#fafaf9',
  },
};

export type Theme = typeof lightTheme;
