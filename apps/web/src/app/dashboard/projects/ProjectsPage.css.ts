import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/tokens.css';

export const topbar = style({
  height: '56px',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `0 ${vars.space.xl}`,
  borderBottom: `1px solid ${vars.color.border}`,
});

export const topbarTitle = style({
  fontFamily: vars.font.heading,
  fontSize: vars.font.size.lg,
  fontWeight: '700',
  letterSpacing: '-0.02em',
});

export const content = style({
  flex: 1,
  overflowY: 'auto',
  padding: vars.space.xl,
});

export const newBtn = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.xs,
  padding: `8px ${vars.space.md}`,
  backgroundColor: vars.color.accent,
  color: '#0a0a0a',
  borderRadius: vars.radius.md,
  fontSize: vars.font.size.sm,
  fontWeight: '600',
  transition: `background-color ${vars.transition.fast}`,
  ':hover': {
    backgroundColor: vars.color.accentHover,
  },
});

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: vars.space.lg,
});

export const empty = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space.lg,
  padding: vars.space.xxl,
  textAlign: 'center',
});

export const emptyIcon = style({
  width: '48px',
  height: '48px',
  color: vars.color.textSubtle,
});

export const emptyTitle = style({
  fontFamily: vars.font.heading,
  fontSize: vars.font.size.xl,
  fontWeight: '700',
  letterSpacing: '-0.02em',
  color: vars.color.text,
});

export const emptyText = style({
  fontSize: vars.font.size.sm,
  color: vars.color.textMuted,
  maxWidth: '320px',
  lineHeight: '1.6',
});

export const skeleton = style({
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  height: '140px',
  animationName: 'pulse',
  animationDuration: '1.5s',
  animationTimingFunction: 'ease-in-out',
  animationIterationCount: 'infinite',
});
