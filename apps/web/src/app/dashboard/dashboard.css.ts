import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/tokens.css';

// ── Layout ────────────────────────────────────────────────
export const layout = style({
  display: 'flex',
  height: '100vh',
  overflow: 'hidden',
  backgroundColor: vars.color.bg,
});

// ── Sidebar ───────────────────────────────────────────────
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
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
});

export const userEmail = style({
  fontSize: vars.font.size.xs,
  color: vars.color.textMuted,
  padding: `0 ${vars.space.xs}`,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const logoutBtn = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  padding: `8px ${vars.space.md}`,
  borderRadius: vars.radius.md,
  fontSize: vars.font.size.sm,
  color: vars.color.textMuted,
  transition: `all ${vars.transition.fast}`,
  ':hover': {
    color: vars.color.danger,
    backgroundColor: 'rgba(255, 92, 92, 0.06)',
  },
});

// ── Main ──────────────────────────────────────────────────
export const main = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
});

export const topbar = style({
  height: '56px',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
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
});
