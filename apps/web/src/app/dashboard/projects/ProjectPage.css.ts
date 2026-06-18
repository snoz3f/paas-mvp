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

// ── Tabs ──────────────────────────────────────────────────
export const tabs = style({
  display: 'flex',
  gap: '2px',
  borderBottom: `1px solid ${vars.color.border}`,
  marginBottom: `-${vars.space.sm}`,
});

export const tab = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  padding: `${vars.space.sm} ${vars.space.md}`,
  fontSize: vars.font.size.sm,
  color: vars.color.textMuted,
  borderBottom: '2px solid transparent',
  marginBottom: '-1px',
  transition: `color ${vars.transition.fast}`,
  ':hover': { color: vars.color.text },
});

export const tabActive = style({
  color: vars.color.text,
  borderBottomColor: vars.color.accent,
});

export const tabCount = style({
  fontSize: vars.font.size.xs,
  color: vars.color.textSubtle,
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.full,
  padding: `0 6px`,
  lineHeight: '18px',
  fontFamily: vars.font.mono,
});

// ── Deployments ───────────────────────────────────────────
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

// ── App grid ──────────────────────────────────────────────
export const appGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: vars.space.md,
});

export const appCard = style({
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  padding: vars.space.lg,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
  cursor: 'pointer',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
  transition: `border-color ${vars.transition.fast}, background-color ${vars.transition.fast}`,
  ':hover': {
    borderColor: vars.color.borderHover,
    backgroundColor: vars.color.surfaceHover,
  },
});

export const appCardHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.sm,
});

export const appCardName = style({
  fontFamily: vars.font.heading,
  fontSize: vars.font.size.md,
  fontWeight: '700',
  letterSpacing: '-0.02em',
});

export const appCardRepo = style({
  fontSize: vars.font.size.xs,
  color: vars.color.textMuted,
  fontFamily: vars.font.mono,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const appCardFramework = style({
  fontSize: vars.font.size.xs,
  color: vars.color.textSubtle,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  fontWeight: '500',
});

export const autoBadge = style({
  fontSize: '10px',
  color: vars.color.success,
  border: `1px solid ${vars.color.success}`,
  borderRadius: vars.radius.full,
  padding: '1px 7px',
  opacity: 0.8,
  flexShrink: 0,
});

// ── Service grid ──────────────────────────────────────────
export const serviceGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: vars.space.md,
});

export const serviceCard = style({
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  padding: vars.space.lg,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
});

export const serviceCardTitle = style({
  fontFamily: vars.font.heading,
  fontSize: vars.font.size.sm,
  fontWeight: '700',
  letterSpacing: '-0.01em',
});

export const serviceCardHeader = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
});

export const serviceCardInfo = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.md,
});

export const serviceCardName = style({
  fontSize: vars.font.size.sm,
  fontWeight: '600',
  color: vars.color.text,
});

export const serviceCardVersion = style({
  fontSize: vars.font.size.xs,
  color: vars.color.textMuted,
  fontFamily: vars.font.mono,
  marginTop: '2px',
});

export const serviceCardRight = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
});

export const serviceDeleteBtn = style({
  color: vars.color.textSubtle,
  transition: `color ${vars.transition.fast}`,
  padding: '2px',
  ':hover': { color: vars.color.danger },
});

export const serviceCardMeta = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  paddingTop: vars.space.sm,
  borderTop: `1px solid ${vars.color.border}`,
});

export const serviceMetaRow = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const serviceMetaLabel = style({
  fontSize: vars.font.size.xs,
  color: vars.color.textMuted,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  fontWeight: '500',
});

export const serviceMetaValue = style({
  fontSize: vars.font.size.xs,
  color: vars.color.text,
  fontFamily: vars.font.mono,
});

export const serviceEnvKeyRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.md,
});

export const serviceEnvKeyInput = style({
  flex: 1,
  padding: `6px ${vars.space.sm}`,
  fontSize: vars.font.size.xs,
  fontFamily: vars.font.mono,
  color: vars.color.text,
  backgroundColor: vars.color.bg,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  outline: 'none',
  transition: `border-color ${vars.transition.fast}`,
  ':focus': {
    borderColor: vars.color.accent,
  },
});

export const serviceCardActions = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: vars.space.sm,
  paddingTop: vars.space.xs,
});

// ── Service type selector ─────────────────────────────────
export const serviceTypeSelect = style({
  display: 'flex',
  gap: vars.space.sm,
});

export const serviceTypeBtn = style({
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
  ':hover': {
    borderColor: vars.color.borderHover,
    color: vars.color.text,
  },
});

export const serviceTypeBtnActive = style({
  borderColor: vars.color.accent,
  color: vars.color.text,
  backgroundColor: 'rgba(240,228,104,0.06)',
});

// ── Resources card ────────────────────────────────────────
export const resourcesCard = style({
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  overflow: 'hidden',
});

export const resourcesHeader = style({
  padding: `${vars.space.lg} ${vars.space.xl}`,
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
  paddingTop: vars.space.sm,
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
