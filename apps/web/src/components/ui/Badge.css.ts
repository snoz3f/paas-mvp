import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/tokens.css';

export const base = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '5px',
  padding: '3px 8px',
  borderRadius: vars.radius.full,
  fontSize: vars.font.size.xs,
  fontWeight: '500',
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
});

export const dot = style({
  width: '5px',
  height: '5px',
  borderRadius: vars.radius.full,
  flexShrink: 0,
});

export const running = style({
  backgroundColor: 'rgba(77, 255, 145, 0.1)',
  color: vars.color.success,
});
export const runningDot = style({ backgroundColor: vars.color.success });

export const failed = style({
  backgroundColor: 'rgba(255, 92, 92, 0.1)',
  color: vars.color.danger,
});
export const failedDot = style({ backgroundColor: vars.color.danger });

export const queued = style({
  backgroundColor: 'rgba(240, 165, 0, 0.1)',
  color: vars.color.warning,
});
export const queuedDot = style({ backgroundColor: vars.color.warning });

export const stopped = style({
  backgroundColor: 'rgba(102, 102, 102, 0.15)',
  color: vars.color.textMuted,
});
export const stoppedDot = style({ backgroundColor: vars.color.textMuted });

export const building = style({
  backgroundColor: 'rgba(240, 228, 104, 0.1)',
  color: vars.color.accent,
});
export const buildingDot = style({ backgroundColor: vars.color.accent });
