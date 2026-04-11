import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/tokens.css';

// ── Topbar ────────────────────────────────────────────────
export const topbar = style({
  height: '56px',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `0 ${vars.space.xl}`,
  borderBottom: `1px solid ${vars.color.border}`,
});

export const topbarLeft = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.md,
});

export const backBtn = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  fontSize: vars.font.size.sm,
  color: vars.color.textMuted,
  transition: `color ${vars.transition.fast}`,
  ':hover': { color: vars.color.text },
});

export const topbarTitle = style({
  fontFamily: vars.font.heading,
  fontSize: vars.font.size.lg,
  fontWeight: '700',
  letterSpacing: '-0.02em',
});

export const topbarActions = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
});

// ── Content ───────────────────────────────────────────────
export const content = style({
  flex: 1,
  overflowY: 'auto',
  padding: vars.space.xl,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.lg,
});

// ── Meta card ─────────────────────────────────────────────
export const metaCard = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '1px',
  backgroundColor: vars.color.border,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  overflow: 'hidden',
});

export const metaItem = style({
  backgroundColor: vars.color.surface,
  padding: `${vars.space.lg} ${vars.space.xl}`,
});

export const metaLabel = style({
  fontSize: vars.font.size.xs,
  fontWeight: '500',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: vars.color.textMuted,
  marginBottom: vars.space.xs,
});

export const metaValue = style({
  fontSize: vars.font.size.sm,
  color: vars.color.text,
  fontFamily: vars.font.mono,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const metaLink = style({
  color: vars.color.accent,
  transition: `opacity ${vars.transition.fast}`,
  ':hover': { opacity: 0.75 },
});

// ── Deployments section ───────────────────────────────────
export const sectionTitle = style({
  fontFamily: vars.font.heading,
  fontSize: vars.font.size.md,
  fontWeight: '700',
  letterSpacing: '-0.01em',
  marginBottom: vars.space.md,
});

export const deploymentList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1px',
  backgroundColor: vars.color.border,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  overflow: 'hidden',
});

export const deploymentRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${vars.space.md} ${vars.space.xl}`,
  backgroundColor: vars.color.surface,
  transition: `background-color ${vars.transition.fast}`,
  cursor: 'pointer',
  ':hover': { backgroundColor: vars.color.surfaceHover },
});

export const deploymentLeft = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.lg,
});

export const deploymentId = style({
  fontFamily: vars.font.mono,
  fontSize: vars.font.size.xs,
  color: vars.color.textMuted,
});

export const deploymentRight = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.lg,
});

export const deploymentDate = style({
  fontSize: vars.font.size.xs,
  color: vars.color.textSubtle,
});

export const deploymentUrl = style({
  fontSize: vars.font.size.xs,
  color: vars.color.accent,
  fontFamily: vars.font.mono,
  transition: `opacity ${vars.transition.fast}`,
  ':hover': { opacity: 0.75 },
});

// ── Empty / skeleton ──────────────────────────────────────
export const empty = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space.md,
  padding: `${vars.space.xxl} 0`,
  textAlign: 'center',
});

export const emptyText = style({
  fontSize: vars.font.size.sm,
  color: vars.color.textMuted,
});

export const skeleton = style({
  height: '52px',
  backgroundColor: vars.color.surface,
  animationName: 'pulse',
  animationDuration: '1.5s',
  animationTimingFunction: 'ease-in-out',
  animationIterationCount: 'infinite',
});
