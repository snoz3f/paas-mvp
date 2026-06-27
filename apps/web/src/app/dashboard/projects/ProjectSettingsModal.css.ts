import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/tokens.css';

export const overlay = style({
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0,0,0,0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 100,
});

export const modal = style({
  width: '100%',
  maxWidth: '440px',
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.lg,
  padding: vars.space.xl,
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
});

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const title = style({
  fontFamily: vars.font.heading,
  fontSize: vars.font.size.lg,
  fontWeight: '700',
  letterSpacing: '-0.02em',
});

export const closeBtn = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 28,
  height: 28,
  borderRadius: vars.radius.sm,
  color: vars.color.textMuted,
  transition: `all ${vars.transition.fast}`,
  ':hover': { color: vars.color.text, backgroundColor: vars.color.surfaceHover },
});

export const form = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
});

export const danger = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.md,
  padding: vars.space.lg,
  border: `1px solid rgba(255,92,92,0.2)`,
  borderRadius: vars.radius.md,
  backgroundColor: 'rgba(255,92,92,0.04)',
});

export const dangerText = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '3px',
});

export const dangerLabel = style({
  fontSize: vars.font.size.sm,
  fontWeight: '500',
  color: vars.color.text,
});

export const dangerDesc = style({
  fontSize: vars.font.size.xs,
  color: vars.color.textMuted,
});
