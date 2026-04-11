import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/tokens.css';

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
  fontFamily: vars.font.mono,
  fontSize: vars.font.size.sm,
  color: vars.color.textMuted,
});

export const topbarActions = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
});

export const content = style({
  flex: 1,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  padding: vars.space.xl,
  gap: vars.space.lg,
});

// ── Meta row ──────────────────────────────────────────────
export const meta = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xl,
  flexShrink: 0,
});

export const metaItem = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
});

export const metaLabel = style({
  fontSize: vars.font.size.xs,
  fontWeight: '500',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: vars.color.textMuted,
});

export const metaValue = style({
  fontSize: vars.font.size.sm,
  fontFamily: vars.font.mono,
  color: vars.color.text,
});

export const metaLink = style({
  color: vars.color.accent,
  ':hover': { opacity: 0.75 },
  transition: `opacity ${vars.transition.fast}`,
});

// ── Tabs ──────────────────────────────────────────────────
export const tabs = style({
  display: 'flex',
  gap: '2px',
  borderBottom: `1px solid ${vars.color.border}`,
  flexShrink: 0,
});

export const tab = style({
  padding: `8px ${vars.space.lg}`,
  fontSize: vars.font.size.sm,
  fontWeight: '500',
  color: vars.color.textMuted,
  borderBottom: '2px solid transparent',
  marginBottom: '-1px',
  transition: `all ${vars.transition.fast}`,
  ':hover': { color: vars.color.text },
});

export const tabActive = style({
  color: vars.color.text,
  borderBottomColor: vars.color.accent,
});

// ── Terminal panel ────────────────────────────────────────
export const termPanel = style({
  flex: 1,
  minHeight: 0,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  overflow: 'hidden',
});

export const errorMsg = style({
  padding: vars.space.lg,
  fontSize: vars.font.size.sm,
  color: vars.color.danger,
});
