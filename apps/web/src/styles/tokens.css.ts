import { createGlobalTheme } from '@vanilla-extract/css';

export const vars = createGlobalTheme(':root', {
  color: {
    accent: '#f0e468',
    accentHover: '#e8d94a',
    bg: '#0a0a0a',
    surface: '#111111',
    surfaceHover: '#181818',
    border: '#202020',
    borderHover: '#2e2e2e',
    text: '#ebebeb',
    textMuted: '#666666',
    textSubtle: '#444444',
    danger: '#ff5c5c',
    success: '#4dff91',
    warning: '#f0a500',
  },
  space: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '40px',
    xxl: '64px',
  },
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    full: '9999px',
  },
  font: {
    sans: '"DM Sans", -apple-system, BlinkMacSystemFont, sans-serif',
    heading: '"Syne", sans-serif',
    mono: '"Martian Mono", "JetBrains Mono", monospace',
    size: {
      xs: '11px',
      sm: '13px',
      md: '15px',
      lg: '18px',
      xl: '24px',
      xxl: '30px',
    },
  },
  transition: {
    fast: '120ms ease',
    normal: '200ms ease',
  },
});
