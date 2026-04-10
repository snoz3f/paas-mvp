import { keyframes, style } from '@vanilla-extract/css';
import { vars } from '@/styles/tokens.css';

const blink = keyframes({
  '0%, 100%': { opacity: 1 },
  '50%': { opacity: 0 },
});

export const page = style({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: vars.space.lg,
  position: 'relative',
  background: `
    radial-gradient(ellipse 120% 60% at 50% -5%, rgba(240, 228, 104, 0.07) 0%, transparent 55%),
    ${vars.color.bg}
  `,
});

export const dotGrid = style({
  position: 'fixed',
  inset: 0,
  backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)`,
  backgroundSize: '28px 28px',
  maskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 20%, transparent 75%)',
  WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 20%, transparent 75%)',
  pointerEvents: 'none',
  zIndex: 0,
});

export const card = style({
  position: 'relative',
  zIndex: 1,
  width: '100%',
  maxWidth: '400px',
  background: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  padding: '44px 40px',
  boxShadow: `
    0 0 0 1px rgba(255,255,255,0.03) inset,
    0 32px 80px rgba(0,0,0,0.5),
    0 0 60px rgba(240, 228, 104, 0.03)
  `,
});

export const brand = style({
  display: 'flex',
  alignItems: 'baseline',
  gap: '1px',
  marginBottom: '32px',
});

export const brandName = style({
  fontFamily: vars.font.mono,
  fontSize: '15px',
  fontWeight: '700',
  letterSpacing: '0.2em',
  color: vars.color.accent,
});

export const cursor = style({
  fontFamily: vars.font.mono,
  fontSize: '15px',
  fontWeight: '700',
  color: vars.color.accent,
  animation: `${blink} 1.1s step-end infinite`,
});

export const title = style({
  fontFamily: vars.font.heading,
  fontSize: vars.font.size.xxl,
  fontWeight: '700',
  letterSpacing: '-0.03em',
  color: vars.color.text,
  marginBottom: vars.space.xs,
  lineHeight: '1.2',
});

export const subtitle = style({
  fontSize: vars.font.size.sm,
  color: vars.color.textMuted,
  marginBottom: '28px',
  lineHeight: '1.5',
});

export const form = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
});

export const formError = style({
  padding: `10px ${vars.space.md}`,
  backgroundColor: 'rgba(255, 92, 92, 0.08)',
  border: `1px solid rgba(255, 92, 92, 0.2)`,
  borderRadius: vars.radius.md,
  fontSize: vars.font.size.sm,
  color: vars.color.danger,
});

export const footer = style({
  marginTop: vars.space.lg,
  fontSize: vars.font.size.sm,
  color: vars.color.textMuted,
  textAlign: 'center',
});

export const link = style({
  color: vars.color.accent,
  fontWeight: '500',
  transition: `opacity ${vars.transition.fast}`,
  ':hover': {
    opacity: 0.75,
  },
});

export const divider = style({
  height: '1px',
  backgroundColor: vars.color.border,
  margin: `${vars.space.lg} 0`,
});
