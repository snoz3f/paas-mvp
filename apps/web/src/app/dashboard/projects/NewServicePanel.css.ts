import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/tokens.css';

export const panel = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.lg,
  width: '100%',
});

export const header = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.md,
});

export const backBtn = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 28,
  height: 28,
  borderRadius: vars.radius.md,
  color: vars.color.textMuted,
  transition: `all ${vars.transition.fast}`,
  ':hover': {
    color: vars.color.text,
    backgroundColor: vars.color.surfaceHover,
  },
});

export const title = style({
  fontFamily: vars.font.heading,
  fontSize: vars.font.size.lg,
  fontWeight: '700',
  letterSpacing: '-0.02em',
});

export const searchRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  padding: `9px ${vars.space.md}`,
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  transition: `border-color ${vars.transition.fast}`,
  ':focus-within': {
    borderColor: vars.color.accent,
  },
});

export const searchInput = style({
  flex: 1,
  background: 'none',
  border: 'none',
  outline: 'none',
  fontSize: vars.font.size.sm,
  color: vars.color.text,
  '::placeholder': { color: vars.color.textSubtle },
});

export const catalog = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xl,
});

export const category = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
});

export const categoryLabel = style({
  fontSize: vars.font.size.xs,
  fontWeight: '600',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: vars.color.textSubtle,
});

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
  gap: vars.space.md,
});

export const card = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  padding: vars.space.lg,
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  cursor: 'pointer',
  textAlign: 'left',
  transition: `all ${vars.transition.fast}`,
  ':hover': {
    borderColor: vars.color.borderHover,
    backgroundColor: vars.color.surfaceHover,
  },
});

export const cardSelected = style({
  borderColor: vars.color.accent,
  backgroundColor: 'rgba(240,228,104,0.05)',
  boxShadow: `0 0 0 1px ${vars.color.accent}`,
  ':hover': {
    borderColor: vars.color.accent,
    backgroundColor: 'rgba(240,228,104,0.05)',
  },
});

export const cardDisabled = style({
  opacity: 0.45,
  cursor: 'not-allowed',
  ':hover': {
    borderColor: vars.color.border,
    backgroundColor: vars.color.surface,
  },
});

export const cardIcon = style({
  marginBottom: '2px',
  flexShrink: 0,
});

export const cardName = style({
  fontSize: vars.font.size.sm,
  fontWeight: '600',
  color: vars.color.text,
});

export const cardDesc = style({
  fontSize: vars.font.size.xs,
  color: vars.color.textSubtle,
  lineHeight: '1.4',
});

export const soonBadge = style({
  position: 'absolute',
  top: vars.space.sm,
  right: vars.space.sm,
  fontSize: '10px',
  fontWeight: '500',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: vars.color.textSubtle,
  backgroundColor: vars.color.bg,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  padding: '2px 6px',
});

export const configPanel = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
  padding: vars.space.xl,
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  marginTop: vars.space.sm,
});

export const configHeader = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  paddingBottom: vars.space.md,
  borderBottom: `1px solid ${vars.color.border}`,
});

export const configName = style({
  fontFamily: vars.font.heading,
  fontSize: vars.font.size.md,
  fontWeight: '700',
  letterSpacing: '-0.01em',
});

export const configRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.md,
});

export const configLabel = style({
  fontSize: vars.font.size.xs,
  fontWeight: '500',
  color: vars.color.textMuted,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  flexShrink: 0,
  width: 60,
});

export const configInput = style({
  flex: 1,
  padding: `6px ${vars.space.md}`,
  fontSize: vars.font.size.xs,
  fontFamily: vars.font.mono,
  color: vars.color.text,
  backgroundColor: vars.color.bg,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  outline: 'none',
  transition: `border-color ${vars.transition.fast}`,
  ':focus': { borderColor: vars.color.accent },
});

export const configActions = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: vars.space.sm,
  paddingTop: vars.space.xs,
});
