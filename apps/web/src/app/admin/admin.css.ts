import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/tokens.css';

// ── Layout ────────────────────────────────────────────────
export const layout = style({
  display: 'flex',
  height: '100vh',
  overflow: 'hidden',
  backgroundColor: vars.color.bg,
});

export const sidebar = style({
  width: '220px',
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: vars.color.surface,
  borderRight: `1px solid ${vars.color.border}`,
});

export const sidebarHeader = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  padding: `18px ${vars.space.lg}`,
  borderBottom: `1px solid ${vars.color.border}`,
});

export const logo = style({
  fontFamily: vars.font.mono,
  fontSize: '13px',
  fontWeight: '700',
  letterSpacing: '0.18em',
  color: vars.color.accent,
});

export const adminBadge = style({
  fontSize: '9px',
  fontFamily: vars.font.mono,
  letterSpacing: '0.1em',
  color: vars.color.bg,
  backgroundColor: vars.color.accent,
  padding: '2px 5px',
  borderRadius: vars.radius.sm,
  fontWeight: '700',
});

export const nav = style({
  flex: 1,
  padding: `${vars.space.sm} ${vars.space.sm}`,
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
});

export const navItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  padding: `9px ${vars.space.md}`,
  borderRadius: vars.radius.md,
  fontSize: vars.font.size.sm,
  fontWeight: '500',
  color: vars.color.textMuted,
  transition: `all ${vars.transition.fast}`,
  cursor: 'pointer',
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

export const navIcon = style({
  width: '16px',
  height: '16px',
  flexShrink: 0,
  opacity: 0.7,
});

export const sidebarFooter = style({
  padding: vars.space.md,
  borderTop: `1px solid ${vars.color.border}`,
});

export const backLink = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  padding: `8px ${vars.space.md}`,
  borderRadius: vars.radius.md,
  fontSize: vars.font.size.sm,
  color: vars.color.textMuted,
  transition: `all ${vars.transition.fast}`,
  ':hover': {
    color: vars.color.text,
    backgroundColor: vars.color.surfaceHover,
  },
});

export const main = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

export const topbar = style({
  height: '56px',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  padding: `0 ${vars.space.xl}`,
  borderBottom: `1px solid ${vars.color.border}`,
});

export const topbarTitle = style({
  fontFamily: vars.font.heading,
  fontSize: vars.font.size.lg,
  fontWeight: '700',
  letterSpacing: '-0.02em',
  color: vars.color.text,
});

export const content = style({
  flex: 1,
  overflowY: 'auto',
  padding: vars.space.xl,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xl,
});

// ── Stat cards ────────────────────────────────────────────
export const statsGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: vars.space.md,
});

export const statCard = style({
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  padding: vars.space.lg,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
});

export const statLabel = style({
  fontSize: vars.font.size.xs,
  color: vars.color.textMuted,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
});

export const statValue = style({
  fontFamily: vars.font.mono,
  fontSize: '28px',
  fontWeight: '700',
  color: vars.color.text,
  lineHeight: 1,
});

export const statValueAccent = style({
  color: vars.color.accent,
});

export const statValueDanger = style({
  color: vars.color.danger,
});

export const statValueSuccess = style({
  color: vars.color.success,
});

// ── Table ─────────────────────────────────────────────────
export const section = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
});

export const sectionTitle = style({
  fontFamily: vars.font.heading,
  fontSize: vars.font.size.md,
  fontWeight: '700',
  letterSpacing: '-0.02em',
  color: vars.color.text,
});

export const table = style({
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  overflow: 'hidden',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
});

export const tableHeader = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 100px 80px 80px 1fr',
  padding: `${vars.space.sm} ${vars.space.lg}`,
  borderBottom: `1px solid ${vars.color.border}`,
});

export const tableHeaderCell = style({
  fontSize: vars.font.size.xs,
  color: vars.color.textMuted,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  fontWeight: '500',
});

export const tableRow = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 100px 80px 80px 1fr',
  padding: `${vars.space.md} ${vars.space.lg}`,
  alignItems: 'center',
  borderBottom: `1px solid ${vars.color.border}`,
  transition: `background ${vars.transition.fast}`,
  selectors: {
    '&:last-child': { borderBottom: 'none' },
    '&:hover': { backgroundColor: vars.color.surfaceHover },
  },
});

export const tableCell = style({
  fontSize: vars.font.size.sm,
  color: vars.color.text,
});

export const tableCellMono = style({
  fontFamily: vars.font.mono,
  fontSize: '12px',
  color: vars.color.textMuted,
});

export const tableCellMuted = style({
  fontSize: vars.font.size.xs,
  color: vars.color.textMuted,
});

export const badge = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '5px',
  fontSize: '11px',
  fontWeight: '500',
  padding: '3px 8px',
  borderRadius: vars.radius.full,
});

export const badgeOnline = style({
  color: vars.color.success,
  backgroundColor: 'rgba(77,255,145,0.08)',
});

export const badgeOffline = style({
  color: vars.color.textMuted,
  backgroundColor: vars.color.surfaceHover,
});

export const dot = style({
  width: '6px',
  height: '6px',
  borderRadius: vars.radius.full,
  flexShrink: 0,
});

export const dotOnline = style({
  backgroundColor: vars.color.success,
});

export const dotOffline = style({
  backgroundColor: vars.color.textSubtle,
});

export const emptyState = style({
  padding: `${vars.space.xl} ${vars.space.lg}`,
  textAlign: 'center',
  color: vars.color.textMuted,
  fontSize: vars.font.size.sm,
});
