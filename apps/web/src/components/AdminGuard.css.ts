import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/tokens.css';

export const loading = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  backgroundColor: vars.color.bg,
  color: vars.color.textMuted,
  fontFamily: vars.font.sans,
  fontSize: vars.font.size.sm,
});
