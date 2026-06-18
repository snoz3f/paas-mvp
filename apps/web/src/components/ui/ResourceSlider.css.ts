import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/tokens.css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
});

export const labelRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const label = style({
  fontSize: vars.font.size.xs,
  fontWeight: '500',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: vars.color.textMuted,
});

export const value = style({
  fontSize: vars.font.size.xs,
  fontWeight: '600',
  fontFamily: vars.font.mono,
  color: '#f0e468',
});

export const slider = style({
  width: '100%',
  height: '4px',
  appearance: 'none',
  WebkitAppearance: 'none',
  backgroundColor: vars.color.border,
  borderRadius: vars.radius.full,
  outline: 'none',
  cursor: 'pointer',
  transition: `background-color ${vars.transition.fast}`,
  ':disabled': {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  '::-webkit-slider-thumb': {
    appearance: 'none',
    WebkitAppearance: 'none',
    width: '14px',
    height: '14px',
    borderRadius: '9999px',
    backgroundColor: '#f0e468',
    cursor: 'pointer',
    border: '2px solid #0a0a0a',
    boxShadow: '0 0 0 1px #f0e468',
    transition: `transform 120ms ease, box-shadow 120ms ease`,
  },
  '::-moz-range-thumb': {
    width: '14px',
    height: '14px',
    borderRadius: '9999px',
    backgroundColor: '#f0e468',
    cursor: 'pointer',
    border: '2px solid #0a0a0a',
    boxShadow: '0 0 0 1px #f0e468',
  },
});
