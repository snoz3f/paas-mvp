import { keyframes, style } from '@vanilla-extract/css';
import { vars } from '@/styles/tokens.css';

// ── Layout ────────────────────────────────────────────────
export const root = style({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflow: 'hidden',
});

export const body = style({
  display: 'flex',
  flex: 1,
  overflow: 'hidden',
});

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

export const topbarActions = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
});

export const topbarLeft = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
});

export const backBtn = style({
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  fontSize: vars.font.size.sm,
  color: vars.color.textMuted,
  transition: `color ${vars.transition.fast}`,
  ':hover': { color: vars.color.text },
});

export const sep = style({
  fontSize: vars.font.size.sm,
  color: vars.color.textSubtle,
});

export const topbarTitle = style({
  fontFamily: vars.font.heading,
  fontSize: vars.font.size.lg,
  fontWeight: '700',
  letterSpacing: '-0.02em',
  color: vars.color.text,
});

// ── Project sidebar ───────────────────────────────────────
export const sidebar = style({
  width: '200px',
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  borderRight: `1px solid ${vars.color.border}`,
  padding: `${vars.space.lg} ${vars.space.sm}`,
  gap: vars.space.lg,
  overflowY: 'auto',
});

export const section = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
});

export const sectionHead = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${vars.space.xs} ${vars.space.sm}`,
  marginBottom: '2px',
});

export const sectionLabel = style({
  fontSize: vars.font.size.xs,
  fontWeight: '600',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: vars.color.textSubtle,
});

export const addBtn = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '20px',
  height: '20px',
  borderRadius: vars.radius.sm,
  color: vars.color.textMuted,
  transition: `all ${vars.transition.fast}`,
  ':hover': {
    color: vars.color.text,
    backgroundColor: vars.color.surfaceHover,
  },
});

export const sectionEmpty = style({
  fontSize: vars.font.size.xs,
  color: vars.color.textSubtle,
  padding: `${vars.space.xs} ${vars.space.sm}`,
});

export const navItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  padding: `7px ${vars.space.sm}`,
  borderRadius: vars.radius.md,
  fontSize: vars.font.size.sm,
  color: vars.color.textMuted,
  transition: `all ${vars.transition.fast}`,
  cursor: 'pointer',
  textAlign: 'left',
  ':hover': {
    color: vars.color.text,
    backgroundColor: vars.color.surfaceHover,
  },
});

export const navItemActive = style({
  color: vars.color.text,
  backgroundColor: vars.color.surfaceHover,
  boxShadow: `inset 2px 0 0 ${vars.color.accent}`,
});

export const navLabel = style({
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const appDot = style({
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  backgroundColor: vars.color.textSubtle,
  flexShrink: 0,
});

export const autoBadge = style({
  fontSize: '10px',
  color: vars.color.success,
  border: `1px solid ${vars.color.success}`,
  borderRadius: vars.radius.full,
  padding: '0 5px',
  opacity: 0.7,
  flexShrink: 0,
  lineHeight: '16px',
});

// ── Content area ──────────────────────────────────────────
export const content = style({
  flex: 1,
  overflowY: 'auto',
  padding: vars.space.xl,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
});

// ── Card ──────────────────────────────────────────────────
export const card = style({
  width: '100%',
  maxWidth: '520px',
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  padding: vars.space.xl,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.lg,
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
});

export const cardHeader = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
});

export const cardHeaderLeft = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.md,
});

export const cardHeaderRight = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
});

export const cardName = style({
  fontFamily: vars.font.heading,
  fontSize: vars.font.size.md,
  fontWeight: '700',
  letterSpacing: '-0.01em',
  color: vars.color.text,
});

export const cardSub = style({
  fontSize: vars.font.size.xs,
  color: vars.color.textMuted,
  fontFamily: vars.font.mono,
  marginTop: '3px',
});

export const deleteBtn = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4px',
  borderRadius: vars.radius.sm,
  color: vars.color.textSubtle,
  transition: `all ${vars.transition.fast}`,
  ':hover': {
    color: vars.color.danger,
    backgroundColor: 'rgba(255,92,92,0.08)',
  },
});

// ── Meta table ────────────────────────────────────────────
export const metaTable = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  paddingTop: vars.space.md,
  borderTop: `1px solid ${vars.color.border}`,
});

export const metaItem = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.md,
});

export const metaLabel = style({
  fontSize: vars.font.size.xs,
  fontWeight: '500',
  color: vars.color.textMuted,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  flexShrink: 0,
});

export const metaValue = style({
  fontSize: vars.font.size.xs,
  color: vars.color.text,
  fontFamily: vars.font.mono,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  maxWidth: '320px',
  textAlign: 'right',
});

export const metaLink = style({
  color: vars.color.accent,
  transition: `opacity ${vars.transition.fast}`,
  ':hover': { opacity: 0.75 },
});


// ── Add service form ──────────────────────────────────────
export const typeRow = style({
  display: 'flex',
  gap: vars.space.sm,
});

export const typeBtn = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  padding: `${vars.space.sm} ${vars.space.md}`,
  fontSize: vars.font.size.sm,
  color: vars.color.textMuted,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  backgroundColor: vars.color.bg,
  transition: `all ${vars.transition.fast}`,
  cursor: 'pointer',
  ':hover': {
    borderColor: vars.color.borderHover,
    color: vars.color.text,
  },
});

export const typeBtnActive = style({
  borderColor: vars.color.accent,
  color: vars.color.text,
  backgroundColor: 'rgba(240,228,104,0.06)',
});

export const envInput = style({
  flex: 1,
  padding: `5px ${vars.space.sm}`,
  fontSize: vars.font.size.xs,
  fontFamily: vars.font.mono,
  color: vars.color.text,
  backgroundColor: vars.color.bg,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  outline: 'none',
  transition: `border-color ${vars.transition.fast}`,
  ':focus': { borderColor: vars.color.accent },
});

export const formActions = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: vars.space.sm,
  paddingTop: vars.space.xs,
});

// ── Empty state ───────────────────────────────────────────
export const emptyState = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space.sm,
  textAlign: 'center',
  width: '100%',
  paddingBottom: '10vh',
});

export const emptyTitle = style({
  fontFamily: vars.font.heading,
  fontSize: vars.font.size.xl,
  fontWeight: '700',
  letterSpacing: '-0.03em',
  color: vars.color.text,
});

export const emptyHint = style({
  fontSize: vars.font.size.sm,
  color: vars.color.textMuted,
  lineHeight: '1.6',
});

export const kbd = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '18px',
  height: '18px',
  fontSize: '11px',
  fontFamily: vars.font.mono,
  color: vars.color.textMuted,
  border: `1px solid ${vars.color.border}`,
  borderRadius: '3px',
  verticalAlign: 'middle',
});

// ── Meta card (used by AppPage) ───────────────────────────
export const metaCard = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '1px',
  backgroundColor: vars.color.border,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  overflow: 'hidden',
  width: '100%',
  maxWidth: '520px',
});

// ── Resources card (used by AppPage) ─────────────────────
export const resourcesCard = style({
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  overflow: 'hidden',
  width: '100%',
  maxWidth: '520px',
});

export const resourcesHeader = style({
  padding: `${vars.space.md} ${vars.space.xl}`,
  borderBottom: `1px solid ${vars.color.border}`,
});

export const resourcesTitle = style({
  fontFamily: vars.font.heading,
  fontSize: vars.font.size.md,
  fontWeight: '700',
  letterSpacing: '-0.01em',
});

export const resourcesBody = style({
  padding: vars.space.xl,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.lg,
});

export const resourcesNote = style({
  fontSize: vars.font.size.xs,
  color: vars.color.textSubtle,
  lineHeight: '1.5',
});

export const resourcesFooter = style({
  display: 'flex',
  justifyContent: 'flex-end',
  paddingTop: vars.space.xs,
});

// ── Deployments (used by AppPage) ─────────────────────────
export const deploymentList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1px',
  backgroundColor: vars.color.border,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  overflow: 'hidden',
  width: '100%',
  maxWidth: '520px',
});

export const deploymentRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${vars.space.md} ${vars.space.xl}`,
  backgroundColor: vars.color.surface,
  cursor: 'pointer',
  transition: `background-color ${vars.transition.fast}`,
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

export const deploymentUrl = style({
  fontSize: vars.font.size.xs,
  color: vars.color.accent,
  fontFamily: vars.font.mono,
  transition: `opacity ${vars.transition.fast}`,
  ':hover': { opacity: 0.75 },
});

export const deploymentDate = style({
  fontSize: vars.font.size.xs,
  color: vars.color.textSubtle,
});

// ── Empty / skeleton (used by AppPage) ────────────────────
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

// ── Loading shimmer ───────────────────────────────────────
const shimmerAnim = keyframes({
  '0%':   { opacity: 0.4 },
  '50%':  { opacity: 0.8 },
  '100%': { opacity: 0.4 },
});

export const shimmer = style({
  display: 'inline-block',
  height: '1em',
  borderRadius: vars.radius.sm,
  backgroundColor: vars.color.border,
  animationName: shimmerAnim,
  animationDuration: '1.4s',
  animationTimingFunction: 'ease-in-out',
  animationIterationCount: 'infinite',
});
