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
  overflowY: 'auto',
  padding: vars.space.xl,
  display: 'flex',
  justifyContent: 'center',
});

export const card = style({
  width: '100%',
  maxWidth: '560px',
});

export const section = style({
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  overflow: 'hidden',
});

export const sectionGit = style({
  marginTop: vars.space.md,
});

export const sectionTitleRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  marginBottom: '2px',
});

export const optionalBadge = style({
  fontSize: '10px',
  fontWeight: '500',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: vars.color.textSubtle,
  backgroundColor: vars.color.bg,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  padding: '2px 6px',
});

export const tokenHint = style({
  display: 'flex',
  gap: vars.space.sm,
  padding: vars.space.md,
  backgroundColor: 'rgba(240, 228, 104, 0.04)',
  border: `1px solid rgba(240, 228, 104, 0.12)`,
  borderRadius: vars.radius.md,
  fontSize: vars.font.size.xs,
  color: vars.color.textMuted,
  lineHeight: '1.6',
});

export const sectionHeader = style({
  padding: `${vars.space.lg} ${vars.space.xl}`,
  borderBottom: `1px solid ${vars.color.border}`,
});

export const sectionTitle = style({
  fontFamily: vars.font.heading,
  fontSize: vars.font.size.md,
  fontWeight: '700',
  letterSpacing: '-0.01em',
  marginBottom: '2px',
});

export const sectionDesc = style({
  fontSize: vars.font.size.sm,
  color: vars.color.textMuted,
});

export const sectionBody = style({
  padding: vars.space.xl,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.lg,
});

export const row = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: vars.space.md,
});

export const frameworkGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: vars.space.sm,
});

export const frameworkLabel = style({
  fontSize: vars.font.size.xs,
  fontWeight: '500',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: vars.color.textMuted,
  marginBottom: vars.space.sm,
  display: 'block',
});

export const frameworkOption = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space.sm,
  padding: vars.space.md,
  backgroundColor: vars.color.bg,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  cursor: 'pointer',
  transition: `all ${vars.transition.fast}`,
  ':hover': {
    borderColor: vars.color.borderHover,
    backgroundColor: vars.color.surfaceHover,
  },
});

export const frameworkOptionActive = style({
  borderColor: vars.color.accent,
  backgroundColor: 'rgba(240, 228, 104, 0.05)',
  boxShadow: `0 0 0 1px ${vars.color.accent}`,
});

export const frameworkIcon = style({
  width: '28px',
  height: '28px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
});

export const frameworkName = style({
  fontSize: vars.font.size.xs,
  fontWeight: '500',
  color: vars.color.textMuted,
});

export const frameworkNameActive = style({
  color: vars.color.text,
});

export const footer = style({
  display: 'flex',
  gap: vars.space.md,
  marginTop: vars.space.lg,
});

export const formError = style({
  padding: `10px ${vars.space.md}`,
  backgroundColor: 'rgba(255, 92, 92, 0.08)',
  border: `1px solid rgba(255, 92, 92, 0.2)`,
  borderRadius: vars.radius.md,
  fontSize: vars.font.size.sm,
  color: vars.color.danger,
});

// ── GitHub connect banner ─────────────────────────────────

export const connectBanner = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.md,
  padding: vars.space.md,
  backgroundColor: vars.color.bg,
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
});

// ── Repo picker ───────────────────────────────────────────

export const repoSearch = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  padding: `8px ${vars.space.md}`,
  backgroundColor: vars.color.bg,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  color: vars.color.textMuted,
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
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  maxHeight: '240px',
  overflowY: 'auto',
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  backgroundColor: vars.color.bg,
});

export const repoListEmpty = style({
  padding: vars.space.lg,
  textAlign: 'center',
  fontSize: vars.font.size.sm,
  color: vars.color.textSubtle,
});

export const repoItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  padding: `9px ${vars.space.md}`,
  fontSize: vars.font.size.sm,
  color: vars.color.textMuted,
  cursor: 'pointer',
  transition: `background-color ${vars.transition.fast}`,
  textAlign: 'left',
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
