import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/tokens.css';

// ── Shell ─────────────────────────────────────────────────
export const shell = style({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflow: 'hidden',
});

export const topbar = style({
  height: '56px',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.md,
  padding: `0 ${vars.space.xl}`,
  borderBottom: `1px solid ${vars.color.border}`,
});

export const topbarLeft = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
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

export const breadcrumbSep = style({
  color: vars.color.textSubtle,
  fontSize: vars.font.size.sm,
});

export const topbarTitle = style({
  fontFamily: vars.font.heading,
  fontSize: vars.font.size.sm,
  fontWeight: '600',
  color: vars.color.text,
  letterSpacing: '-0.01em',
});

// ── Two-column body ───────────────────────────────────────
export const body = style({
  flex: 1,
  display: 'flex',
  overflow: 'hidden',
});

// ── Settings nav ──────────────────────────────────────────
export const nav = style({
  width: '200px',
  flexShrink: 0,
  padding: `${vars.space.xl} ${vars.space.md}`,
  borderRight: `1px solid ${vars.color.border}`,
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  overflowY: 'auto',
});

export const navItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  padding: `7px ${vars.space.md}`,
  borderRadius: vars.radius.md,
  fontSize: vars.font.size.sm,
  color: vars.color.textMuted,
  cursor: 'pointer',
  transition: `color ${vars.transition.fast}, background ${vars.transition.fast}`,
  userSelect: 'none',
  ':hover': {
    color: vars.color.text,
    backgroundColor: vars.color.surfaceHover,
  },
});

export const navItemActive = style({
  color: vars.color.text,
  backgroundColor: vars.color.surface,
  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.04)',
});

export const navItemIcon = style({
  width: '16px',
  height: '16px',
  flexShrink: 0,
  opacity: 0.6,
});

export const navDivider = style({
  height: '1px',
  backgroundColor: vars.color.border,
  margin: `${vars.space.sm} ${vars.space.md}`,
});

export const navItemDanger = style({
  color: 'rgba(255,92,92,0.6)',
  ':hover': {
    color: vars.color.danger,
    backgroundColor: 'rgba(255,92,92,0.06)',
  },
});

// ── Content panel ─────────────────────────────────────────
export const content = style({
  flex: 1,
  overflowY: 'auto',
  padding: vars.space.xl,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xl,
  maxWidth: '680px',
});

// ── Section ───────────────────────────────────────────────
export const sectionHeading = style({
  marginBottom: vars.space.lg,
});

export const sectionTitle = style({
  fontFamily: vars.font.heading,
  fontSize: vars.font.size.lg,
  fontWeight: '700',
  letterSpacing: '-0.03em',
  color: vars.color.text,
  marginBottom: '4px',
});

export const sectionDesc = style({
  fontSize: vars.font.size.sm,
  color: vars.color.textMuted,
  lineHeight: '1.6',
});

export const card = style({
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  padding: vars.space.lg,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
  marginBottom: vars.space.md,
});

export const formRow = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: vars.space.md,
});

export const saveRow = style({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: vars.space.sm,
  paddingTop: vars.space.sm,
  borderTop: `1px solid ${vars.color.border}`,
  marginTop: vars.space.sm,
});

export const successMsg = style({
  fontSize: vars.font.size.sm,
  color: vars.color.success,
});

// ── Git token status ──────────────────────────────────────
export const tokenStatus = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  padding: `${vars.space.sm} ${vars.space.md}`,
  borderRadius: vars.radius.md,
  fontSize: vars.font.size.sm,
  fontWeight: '500',
});

export const tokenStatusActive = style({
  backgroundColor: 'rgba(77,255,145,0.06)',
  border: `1px solid rgba(77,255,145,0.15)`,
  color: vars.color.success,
});

export const tokenStatusNone = style({
  backgroundColor: vars.color.bg,
  border: `1px solid ${vars.color.border}`,
  color: vars.color.textMuted,
});

export const tokenHintIcon = style({
  flexShrink: 0,
  marginTop: '2px',
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
  lineHeight: '1.7',
});

// ── Env vars ──────────────────────────────────────────────
export const envTable = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
});

export const envRow = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr auto',
  gap: vars.space.sm,
  alignItems: 'center',
});

export const envInput = style({
  backgroundColor: vars.color.bg,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  padding: `6px ${vars.space.sm}`,
  fontSize: vars.font.size.sm,
  fontFamily: vars.font.mono,
  color: vars.color.text,
  width: '100%',
  transition: `border-color ${vars.transition.fast}, box-shadow ${vars.transition.fast}`,
  ':focus': {
    outline: 'none',
    borderColor: vars.color.accent,
    boxShadow: '0 0 0 3px rgba(240,228,104,0.08)',
  },
  '::placeholder': { color: vars.color.textSubtle },
});

export const envRemoveBtn = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '28px',
  height: '28px',
  borderRadius: vars.radius.sm,
  color: vars.color.textSubtle,
  transition: `color ${vars.transition.fast}, background ${vars.transition.fast}`,
  flexShrink: 0,
  ':hover': {
    color: vars.color.danger,
    backgroundColor: 'rgba(255,92,92,0.08)',
  },
});

export const envAddBtn = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  fontSize: vars.font.size.sm,
  color: vars.color.textMuted,
  padding: `6px 0`,
  transition: `color ${vars.transition.fast}`,
  ':hover': { color: vars.color.accent },
});

export const envHeader = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr auto',
  gap: vars.space.sm,
  paddingBottom: vars.space.xs,
  marginBottom: vars.space.xs,
  borderBottom: `1px solid ${vars.color.border}`,
});

export const envHeaderLabel = style({
  fontSize: vars.font.size.xs,
  fontWeight: '500',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: vars.color.textSubtle,
});

// ── Services ──────────────────────────────────────────────
export const serviceList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
});

export const serviceRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.md,
  padding: `10px ${vars.space.md}`,
  backgroundColor: vars.color.bg,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
});

export const serviceInfo = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.md,
});

export const serviceIcon = style({
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(240,228,104,0.07)',
  border: `1px solid rgba(240,228,104,0.12)`,
  borderRadius: vars.radius.sm,
  color: vars.color.accent,
  flexShrink: 0,
  fontSize: vars.font.size.xs,
  fontFamily: vars.font.mono,
  fontWeight: '700',
});

export const serviceDetails = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
});

export const serviceName = style({
  fontSize: vars.font.size.sm,
  fontWeight: '500',
  color: vars.color.text,
});

export const serviceEnvKey = style({
  fontSize: vars.font.size.xs,
  fontFamily: vars.font.mono,
  color: vars.color.textMuted,
});

export const serviceStatus = style({
  fontSize: vars.font.size.xs,
  fontWeight: '500',
  letterSpacing: '0.06em',
});

export const serviceStatusRunning = style({ color: vars.color.success });
export const serviceStatusProvisioning = style({ color: vars.color.warning });
export const serviceStatusFailed = style({ color: vars.color.danger });

export const addServiceRow = style({
  display: 'grid',
  gridTemplateColumns: '1fr 80px 1fr auto',
  gap: vars.space.sm,
  alignItems: 'end',
});

export const addServiceSelect = style({
  backgroundColor: vars.color.bg,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  padding: `7px ${vars.space.sm}`,
  fontSize: vars.font.size.sm,
  color: vars.color.text,
  width: '100%',
  transition: `border-color ${vars.transition.fast}`,
  ':focus': {
    outline: 'none',
    borderColor: vars.color.accent,
    boxShadow: '0 0 0 3px rgba(240,228,104,0.08)',
  },
});

export const addServiceLabel = style({
  fontSize: vars.font.size.xs,
  fontWeight: '500',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: vars.color.textMuted,
  marginBottom: '6px',
});

export const addServiceField = style({
  display: 'flex',
  flexDirection: 'column',
});

export const serviceNote = style({
  fontSize: vars.font.size.xs,
  color: vars.color.textSubtle,
  lineHeight: '1.6',
  marginTop: vars.space.xs,
});

export const formGap = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
});

export const serviceActions = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

// ── Danger zone ───────────────────────────────────────────
export const dangerCard = style({
  backgroundColor: vars.color.surface,
  border: `1px solid rgba(255,92,92,0.2)`,
  borderRadius: vars.radius.lg,
  padding: vars.space.lg,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.lg,
});

export const dangerInfo = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

export const dangerTitle = style({
  fontSize: vars.font.size.sm,
  fontWeight: '600',
  color: vars.color.text,
});

export const dangerDesc = style({
  fontSize: vars.font.size.sm,
  color: vars.color.textMuted,
  lineHeight: '1.5',
});

// ── Delete confirm dialog ─────────────────────────────────
export const dialogOverlay = style({
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0,0,0,0.7)',
  backdropFilter: 'blur(4px)',
  zIndex: 100,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const dialogCard = style({
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  padding: vars.space.xl,
  width: '400px',
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.lg,
  boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
});

export const dialogTitle = style({
  fontFamily: vars.font.heading,
  fontSize: vars.font.size.lg,
  fontWeight: '700',
  letterSpacing: '-0.03em',
  color: vars.color.text,
});

export const dialogDesc = style({
  fontSize: vars.font.size.sm,
  color: vars.color.textMuted,
  lineHeight: '1.6',
});

export const dialogConfirmInput = style({
  backgroundColor: vars.color.bg,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  padding: `8px ${vars.space.sm}`,
  fontSize: vars.font.size.sm,
  fontFamily: vars.font.mono,
  color: vars.color.text,
  width: '100%',
  transition: `border-color ${vars.transition.fast}`,
  ':focus': {
    outline: 'none',
    borderColor: vars.color.danger,
    boxShadow: '0 0 0 3px rgba(255,92,92,0.08)',
  },
});

export const dialogActions = style({
  display: 'flex',
  gap: vars.space.sm,
  justifyContent: 'flex-end',
});
