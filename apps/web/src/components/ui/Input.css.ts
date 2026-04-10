import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/tokens.css';

export const wrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
});

export const label = style({
  fontSize: vars.font.size.xs,
  fontWeight: '500',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: vars.color.textMuted,
});

export const input = style({
  width: '100%',
  padding: `12px ${vars.space.md}`,
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  color: vars.color.text,
  fontSize: vars.font.size.md,
  outline: 'none',
  transition: `border-color ${vars.transition.fast}, box-shadow ${vars.transition.fast}`,
  '::placeholder': {
    color: vars.color.textSubtle,
  },
  ':focus': {
    borderColor: vars.color.accent,
    boxShadow: `0 0 0 3px rgba(240, 228, 104, 0.08)`,
  },
});

export const inputHasError = style({
  borderColor: vars.color.danger,
  ':focus': {
    borderColor: vars.color.danger,
    boxShadow: `0 0 0 3px rgba(255, 92, 92, 0.08)`,
  },
});

export const errorMsg = style({
  fontSize: vars.font.size.xs,
  color: vars.color.danger,
  marginTop: '2px',
});
