import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/tokens.css';

export const base = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space.sm,
  width: '100%',
  padding: `14px ${vars.space.lg}`,
  borderRadius: vars.radius.md,
  fontSize: vars.font.size.sm,
  fontWeight: '600',
  letterSpacing: '0.02em',
  transition: `all ${vars.transition.fast}`,
  position: 'relative',
  overflow: 'hidden',
  ':disabled': {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
});

export const primary = style({
  backgroundColor: vars.color.accent,
  color: '#0a0a0a',
  ':hover': {
    backgroundColor: vars.color.accentHover,
  },
  ':active': {
    transform: 'scale(0.99)',
  },
});

export const ghost = style({
  backgroundColor: 'transparent',
  color: vars.color.text,
  border: `1px solid ${vars.color.border}`,
  ':hover': {
    backgroundColor: vars.color.surfaceHover,
    borderColor: vars.color.borderHover,
  },
});

export const danger = style({
  backgroundColor: 'rgba(255,92,92,0.1)',
  color: vars.color.danger,
  border: `1px solid rgba(255,92,92,0.2)`,
  ':hover': {
    backgroundColor: 'rgba(255,92,92,0.18)',
    borderColor: 'rgba(255,92,92,0.35)',
  },
});

export const auto = style({
  width: 'auto',
  padding: `14px ${vars.space.lg}`,
});

export const sm = style({
  width: 'auto',
  padding: `7px ${vars.space.md}`,
  fontSize: vars.font.size.sm,
});

export const spinner = style({
  width: '14px',
  height: '14px',
  border: '2px solid rgba(10,10,10,0.3)',
  borderTopColor: '#0a0a0a',
  borderRadius: vars.radius.full,
  animationName: 'spin',
  animationDuration: '0.6s',
  animationTimingFunction: 'linear',
  animationIterationCount: 'infinite',
});

export const spinnerDanger = style({
  width: '14px',
  height: '14px',
  border: `2px solid rgba(255,92,92,0.2)`,
  borderTopColor: vars.color.danger,
  borderRadius: vars.radius.full,
  animationName: 'spin',
  animationDuration: '0.6s',
  animationTimingFunction: 'linear',
  animationIterationCount: 'infinite',
});
