import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/tokens.css';

export const card = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
  padding: vars.space.lg,
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  transition: `border-color ${vars.transition.fast}, box-shadow ${vars.transition.fast}`,
  cursor: 'pointer',
  ':hover': {
    borderColor: vars.color.borderHover,
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  },
});

export const header = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: vars.space.sm,
});

export const name = style({
  fontFamily: vars.font.heading,
  fontSize: vars.font.size.lg,
  fontWeight: '700',
  letterSpacing: '-0.02em',
  color: vars.color.text,
});

export const repoUrl = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  fontSize: vars.font.size.xs,
  color: vars.color.textMuted,
  fontFamily: vars.font.mono,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const footer = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingTop: vars.space.md,
  borderTop: `1px solid ${vars.color.border}`,
});

export const date = style({
  fontSize: vars.font.size.xs,
  color: vars.color.textSubtle,
});

export const noDeployment = style({
  fontSize: vars.font.size.xs,
  color: vars.color.textSubtle,
  fontStyle: 'italic',
});
