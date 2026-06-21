import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/tokens.css';

export const topbar = style({
  height: '56px',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.md,
  padding: `0 ${vars.space.xl}`,
  borderBottom: `1px solid ${vars.color.border}`,
});

export const backBtn = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  fontSize: vars.font.size.sm,
  color: vars.color.textMuted,
  transition: `color ${vars.transition.fast}`,
  ':hover': {
    color: vars.color.text,
  },
});

export const topbarTitle = style({
  fontFamily: vars.font.heading,
  fontSize: vars.font.size.lg,
  fontWeight: '700',
  letterSpacing: '-0.02em',
});

export const content = style({
  flex: 1,
  display: 'flex',
  overflow: 'hidden',
});

// ── Two-column layout ─────────────────────────────────────

export const leftCol = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  borderRight: `1px solid ${vars.color.border}`,
  overflow: 'hidden',
});

export const rightCol = style({
  width: '420px',
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  padding: vars.space.xl,
  gap: vars.space.lg,
  overflowY: 'auto',
});

// ── Left col: repo section ────────────────────────────────

export const repoHeader = style({
  padding: `${vars.space.lg} ${vars.space.xl}`,
  borderBottom: `1px solid ${vars.color.border}`,
  flexShrink: 0,
});

export const repoTitle = style({
  fontFamily: vars.font.heading,
  fontSize: vars.font.size.md,
  fontWeight: '700',
  letterSpacing: '-0.01em',
  marginBottom: '2px',
});

export const repoDesc = style({
  fontSize: vars.font.size.sm,
  color: vars.color.textMuted,
});

export const repoBody = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
  padding: vars.space.xl,
  overflow: 'hidden',
});

export const connectBanner = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.md,
  padding: vars.space.md,
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
});

export const connectBannerText = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  fontSize: vars.font.size.sm,
  color: vars.color.textMuted,
});

export const githubConnected = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  fontSize: vars.font.size.xs,
  fontWeight: '500',
  color: vars.color.success,
  flexShrink: 0,
});

export const repoSearch = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  padding: `8px ${vars.space.md}`,
  backgroundColor: vars.color.bg,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  color: vars.color.textMuted,
  flexShrink: 0,
  transition: `border-color ${vars.transition.fast}`,
  ':focus-within': {
    borderColor: vars.color.accent,
  },
});

export const repoSearchInput = style({
  flex: 1,
  background: 'none',
  border: 'none',
  outline: 'none',
  fontSize: vars.font.size.sm,
  color: vars.color.text,
  '::placeholder': {
    color: vars.color.textSubtle,
  },
});

export const repoList = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '1px',
  overflowY: 'auto',
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  backgroundColor: vars.color.border,
  selectors: {
    '&::-webkit-scrollbar': {
      width: '4px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      background: vars.color.border,
      borderRadius: vars.radius.full,
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: vars.color.borderHover,
    },
  },
});

export const repoListEmpty = style({
  padding: vars.space.xl,
  textAlign: 'center',
  fontSize: vars.font.size.sm,
  color: vars.color.textSubtle,
  backgroundColor: vars.color.bg,
});

export const repoItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  padding: `10px ${vars.space.md}`,
  fontSize: vars.font.size.sm,
  color: vars.color.textMuted,
  cursor: 'pointer',
  transition: `background-color ${vars.transition.fast}`,
  textAlign: 'left',
  backgroundColor: vars.color.bg,
  ':hover': {
    backgroundColor: vars.color.surfaceHover,
    color: vars.color.text,
  },
});

export const repoItemActive = style({
  backgroundColor: 'rgba(240,228,104,0.06)',
  color: vars.color.text,
  boxShadow: `inset 3px 0 0 ${vars.color.accent}`,
});

export const repoItemName = style({
  flex: 1,
  fontFamily: vars.font.mono,
  fontSize: '12px',
});

export const repoPrivateBadge = style({
  fontSize: '10px',
  fontWeight: '500',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: vars.color.textSubtle,
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  padding: '2px 6px',
  flexShrink: 0,
});

// ── Right col: project details ────────────────────────────

export const rightTitle = style({
  fontFamily: vars.font.heading,
  fontSize: vars.font.size.md,
  fontWeight: '700',
  letterSpacing: '-0.01em',
});

export const selectedRepoHint = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  padding: `8px ${vars.space.md}`,
  backgroundColor: 'rgba(240,228,104,0.04)',
  border: `1px solid rgba(240,228,104,0.12)`,
  borderRadius: vars.radius.md,
  fontFamily: vars.font.mono,
  fontSize: '12px',
  color: vars.color.accent,
});

export const formError = style({
  padding: `10px ${vars.space.md}`,
  backgroundColor: 'rgba(255, 92, 92, 0.08)',
  border: `1px solid rgba(255, 92, 92, 0.2)`,
  borderRadius: vars.radius.md,
  fontSize: vars.font.size.sm,
  color: vars.color.danger,
});

export const resourcesSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
});

export const resourcesLabel = style({
  fontSize: vars.font.size.xs,
  fontWeight: '500',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: vars.color.textMuted,
});

export const footer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
  marginTop: 'auto',
});
