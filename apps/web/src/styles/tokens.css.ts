import { createGlobalTheme } from '@vanilla-extract/css';

export const vars = createGlobalTheme(':root', {
  color: {
    primary: '#6366f1',
    primaryHover: '#4f46e5',
    bg: '#0a0a0a',
    surface: '#141414',
    surfaceHover: '#1e1e1e',
    border: '#2a2a2a',
    text: '#e5e5e5',
    textMuted: '#888888',
    danger: '#ef4444',
    dangerHover: '#dc2626',
    success: '#22c55e',
    warning: '#f59e0b',
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
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: '"JetBrains Mono", "Fira Code", monospace',
    size: {
      xs: '11px',
      sm: '13px',
      md: '15px',
      lg: '18px',
      xl: '24px',
      xxl: '32px',
    },
  },
  transition: {
    fast: '120ms ease',
    normal: '200ms ease',
  },
});
