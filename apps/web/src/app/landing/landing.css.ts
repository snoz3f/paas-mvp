import { keyframes, style } from '@vanilla-extract/css';
import { vars } from '@/styles/tokens.css';

const blink = keyframes({
  '0%, 100%': { opacity: 1 },
  '50%': { opacity: 0 },
});

const fadeUp = keyframes({
  from: { opacity: 0, transform: 'translateY(16px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});

// ── Page shell ────────────────────────────────────────────
export const page = style({
  minHeight: '100vh',
  backgroundColor: vars.color.bg,
  overflowX: 'hidden',
});

export const dotGrid = style({
  position: 'fixed',
  inset: 0,
  backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.045) 1px, transparent 1px)`,
  backgroundSize: '28px 28px',
  maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 70%)',
  WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 70%)',
  pointerEvents: 'none',
  zIndex: 0,
});

export const glow = style({
  position: 'fixed',
  top: '-20%',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '900px',
  height: '500px',
  background: 'radial-gradient(ellipse at center, rgba(240,228,104,0.06) 0%, transparent 65%)',
  pointerEvents: 'none',
  zIndex: 0,
});

// ── Navbar ────────────────────────────────────────────────
export const nav = style({
  position: 'sticky',
  top: 0,
  zIndex: 50,
  height: '60px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `0 ${vars.space.xl}`,
  borderBottom: `1px solid rgba(255,255,255,0.04)`,
  backgroundColor: 'rgba(10,10,10,0.85)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
});

export const navBrand = style({
  display: 'flex',
  alignItems: 'baseline',
  gap: '1px',
  textDecoration: 'none',
});

export const navBrandName = style({
  fontFamily: vars.font.mono,
  fontSize: '14px',
  fontWeight: '700',
  letterSpacing: '0.2em',
  color: vars.color.accent,
});

export const navCursor = style({
  fontFamily: vars.font.mono,
  fontSize: '14px',
  color: vars.color.accent,
  animation: `${blink} 1.1s step-end infinite`,
});

export const navLinks = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xl,
});

export const navLink = style({
  fontSize: vars.font.size.sm,
  color: vars.color.textMuted,
  transition: `color ${vars.transition.fast}`,
  ':hover': { color: vars.color.text },
});

export const navActions = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
});

export const navBtnGhost = style({
  display: 'inline-flex',
  alignItems: 'center',
  padding: `7px ${vars.space.md}`,
  fontSize: vars.font.size.sm,
  fontWeight: '500',
  color: vars.color.textMuted,
  borderRadius: vars.radius.md,
  transition: `color ${vars.transition.fast}`,
  ':hover': { color: vars.color.text },
});

export const navBtnPrimary = style({
  display: 'inline-flex',
  alignItems: 'center',
  padding: `7px ${vars.space.md}`,
  fontSize: vars.font.size.sm,
  fontWeight: '600',
  color: '#0a0a0a',
  backgroundColor: vars.color.accent,
  borderRadius: vars.radius.md,
  transition: `background-color ${vars.transition.fast}`,
  ':hover': { backgroundColor: vars.color.accentHover },
});

// ── Hero ──────────────────────────────────────────────────
export const hero = style({
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  padding: `120px ${vars.space.xl} 100px`,
  gap: vars.space.lg,
});

export const heroBadge = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.xs,
  padding: `5px 12px`,
  backgroundColor: 'rgba(240,228,104,0.07)',
  border: `1px solid rgba(240,228,104,0.15)`,
  borderRadius: vars.radius.full,
  fontSize: vars.font.size.xs,
  fontWeight: '600',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: vars.color.accent,
  animation: `${fadeUp} 0.5s ease both`,
});

export const heroBadgeDot = style({
  width: '6px',
  height: '6px',
  borderRadius: vars.radius.full,
  backgroundColor: vars.color.success,
  boxShadow: `0 0 6px ${vars.color.success}`,
});

export const heroTitle = style({
  fontFamily: vars.font.heading,
  fontSize: 'clamp(44px, 7vw, 88px)',
  fontWeight: '700',
  letterSpacing: '-0.04em',
  lineHeight: '1.0',
  color: vars.color.text,
  maxWidth: '820px',
  animation: `${fadeUp} 0.5s 0.08s ease both`,
});

export const heroAccent = style({
  color: vars.color.accent,
});

export const heroSub = style({
  fontSize: 'clamp(15px, 2vw, 18px)',
  color: vars.color.textMuted,
  maxWidth: '520px',
  lineHeight: '1.7',
  animation: `${fadeUp} 0.5s 0.16s ease both`,
});

export const heroActions = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.md,
  flexWrap: 'wrap',
  justifyContent: 'center',
  animation: `${fadeUp} 0.5s 0.24s ease both`,
});

export const heroBtnPrimary = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.sm,
  padding: `13px 28px`,
  fontSize: vars.font.size.md,
  fontWeight: '600',
  color: '#0a0a0a',
  backgroundColor: vars.color.accent,
  borderRadius: vars.radius.md,
  transition: `background-color ${vars.transition.fast}, transform ${vars.transition.fast}`,
  ':hover': {
    backgroundColor: vars.color.accentHover,
    transform: 'translateY(-1px)',
  },
});

export const heroBtnGhost = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.sm,
  padding: `13px 28px`,
  fontSize: vars.font.size.md,
  fontWeight: '500',
  color: vars.color.textMuted,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  transition: `all ${vars.transition.fast}`,
  ':hover': {
    color: vars.color.text,
    borderColor: vars.color.borderHover,
    backgroundColor: vars.color.surfaceHover,
  },
});

export const heroCode = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.md,
  padding: `10px ${vars.space.md}`,
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  fontFamily: vars.font.mono,
  fontSize: vars.font.size.sm,
  color: vars.color.textMuted,
  animation: `${fadeUp} 0.5s 0.32s ease both`,
});

export const heroCodePrompt = style({
  color: vars.color.accent,
  userSelect: 'none',
});

export const heroCodeText = style({
  color: vars.color.text,
});

// ── Section shell ─────────────────────────────────────────
export const section = style({
  position: 'relative',
  zIndex: 1,
  maxWidth: '1100px',
  margin: '0 auto',
  padding: `80px ${vars.space.xl}`,
});

export const sectionLabel = style({
  fontSize: vars.font.size.xs,
  fontWeight: '600',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: vars.color.accent,
  marginBottom: vars.space.sm,
});

export const sectionTitle = style({
  fontFamily: vars.font.heading,
  fontSize: 'clamp(28px, 4vw, 44px)',
  fontWeight: '700',
  letterSpacing: '-0.03em',
  color: vars.color.text,
  marginBottom: vars.space.md,
  lineHeight: '1.15',
});

export const sectionSub = style({
  fontSize: vars.font.size.md,
  color: vars.color.textMuted,
  maxWidth: '520px',
  lineHeight: '1.7',
  marginBottom: vars.space.xxl,
});

// ── Features grid ─────────────────────────────────────────
export const featuresGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: vars.space.md,
});

export const featureCard = style({
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  padding: vars.space.lg,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
  transition: `border-color ${vars.transition.normal}, box-shadow ${vars.transition.normal}`,
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
  ':hover': {
    borderColor: vars.color.borderHover,
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03), 0 0 0 1px rgba(240,228,104,0.04), 0 8px 24px rgba(0,0,0,0.3)',
  },
});

export const featureIcon = style({
  width: '36px',
  height: '36px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(240,228,104,0.07)',
  border: `1px solid rgba(240,228,104,0.12)`,
  borderRadius: vars.radius.md,
  color: vars.color.accent,
  marginBottom: vars.space.xs,
  flexShrink: 0,
});

export const featureTitle = style({
  fontSize: vars.font.size.md,
  fontWeight: '600',
  color: vars.color.text,
  letterSpacing: '-0.01em',
});

export const featureDesc = style({
  fontSize: vars.font.size.sm,
  color: vars.color.textMuted,
  lineHeight: '1.65',
});

// ── Divider ───────────────────────────────────────────────
export const divider = style({
  height: '1px',
  backgroundColor: vars.color.border,
  maxWidth: '1100px',
  margin: '0 auto',
});

// ── Pricing ───────────────────────────────────────────────
export const pricingGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: vars.space.md,
  alignItems: 'start',
});

export const pricingCard = style({
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  padding: vars.space.xl,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
});

export const pricingCardFeatured = style({
  backgroundColor: vars.color.surface,
  border: `1px solid rgba(240,228,104,0.25)`,
  borderRadius: vars.radius.lg,
  padding: vars.space.xl,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
  boxShadow: `
    inset 0 1px 0 rgba(255,255,255,0.03),
    0 0 0 1px rgba(240,228,104,0.04),
    0 16px 48px rgba(0,0,0,0.4)
  `,
  position: 'relative',
});

export const pricingBadge = style({
  position: 'absolute',
  top: '-12px',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'inline-flex',
  alignItems: 'center',
  padding: `4px 12px`,
  backgroundColor: vars.color.accent,
  borderRadius: vars.radius.full,
  fontSize: vars.font.size.xs,
  fontWeight: '700',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#0a0a0a',
  whiteSpace: 'nowrap',
});

export const pricingName = style({
  fontSize: vars.font.size.sm,
  fontWeight: '600',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: vars.color.textMuted,
});

export const pricingPrice = style({
  display: 'flex',
  alignItems: 'baseline',
  gap: vars.space.xs,
});

export const pricingAmount = style({
  fontFamily: vars.font.heading,
  fontSize: vars.font.size.xxl,
  fontWeight: '700',
  letterSpacing: '-0.03em',
  color: vars.color.text,
});

export const pricingAmountAccent = style({
  fontFamily: vars.font.heading,
  fontSize: vars.font.size.xxl,
  fontWeight: '700',
  letterSpacing: '-0.03em',
  color: vars.color.accent,
});

export const pricingPeriod = style({
  fontSize: vars.font.size.sm,
  color: vars.color.textMuted,
});

export const pricingDesc = style({
  fontSize: vars.font.size.sm,
  color: vars.color.textMuted,
  lineHeight: '1.6',
  paddingBottom: vars.space.md,
  borderBottom: `1px solid ${vars.color.border}`,
});

export const pricingFeatures = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
  flex: 1,
});

export const pricingFeatureRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  fontSize: vars.font.size.sm,
  color: vars.color.textMuted,
});

export const pricingCheck = style({
  color: vars.color.success,
  flexShrink: 0,
});

export const pricingBtn = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  padding: `11px ${vars.space.lg}`,
  fontSize: vars.font.size.sm,
  fontWeight: '600',
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  color: vars.color.text,
  backgroundColor: 'transparent',
  transition: `all ${vars.transition.fast}`,
  marginTop: 'auto',
  ':hover': {
    backgroundColor: vars.color.surfaceHover,
    borderColor: vars.color.borderHover,
  },
});

export const pricingBtnPrimary = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  padding: `11px ${vars.space.lg}`,
  fontSize: vars.font.size.sm,
  fontWeight: '600',
  borderRadius: vars.radius.md,
  color: '#0a0a0a',
  backgroundColor: vars.color.accent,
  transition: `background-color ${vars.transition.fast}`,
  marginTop: 'auto',
  ':hover': { backgroundColor: vars.color.accentHover },
});

// ── CTA ───────────────────────────────────────────────────
export const ctaSection = style({
  position: 'relative',
  zIndex: 1,
  maxWidth: '1100px',
  margin: '0 auto',
  padding: `0 ${vars.space.xl} 100px`,
});

export const ctaCard = style({
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  padding: `${vars.space.xxl} ${vars.space.xl}`,
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space.lg,
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
  background: `
    radial-gradient(ellipse 60% 80% at 50% 120%, rgba(240,228,104,0.04) 0%, transparent 60%),
    ${vars.color.surface}
  `,
});

export const ctaTitle = style({
  fontFamily: vars.font.heading,
  fontSize: 'clamp(28px, 4vw, 44px)',
  fontWeight: '700',
  letterSpacing: '-0.03em',
  color: vars.color.text,
  lineHeight: '1.15',
});

export const ctaSub = style({
  fontSize: vars.font.size.md,
  color: vars.color.textMuted,
  maxWidth: '420px',
  lineHeight: '1.7',
});

// ── Footer ────────────────────────────────────────────────
export const footer = style({
  position: 'relative',
  zIndex: 1,
  borderTop: `1px solid ${vars.color.border}`,
  padding: `${vars.space.xl} ${vars.space.xl}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  maxWidth: '1100px',
  margin: '0 auto',
  gap: vars.space.lg,
  flexWrap: 'wrap',
});

export const footerBrand = style({
  fontFamily: vars.font.mono,
  fontSize: '13px',
  fontWeight: '700',
  letterSpacing: '0.2em',
  color: vars.color.accent,
});

export const footerLinks = style({
  display: 'flex',
  gap: vars.space.lg,
});

export const footerLink = style({
  fontSize: vars.font.size.sm,
  color: vars.color.textSubtle,
  transition: `color ${vars.transition.fast}`,
  ':hover': { color: vars.color.textMuted },
});

export const footerCopy = style({
  fontSize: vars.font.size.sm,
  color: vars.color.textSubtle,
});
