import { style, globalStyle } from '@vanilla-extract/css';
import { vars } from '@/styles/tokens.css';

export const wrapper = style({
  width: '100%',
  height: '100%',
  backgroundColor: '#0d0d0d',
  borderRadius: vars.radius.md,
  overflow: 'hidden',
});

// xterm инжектит свои стили — переопределяем через globalStyle
globalStyle(`${wrapper} .xterm`, {
  height: '100%',
  padding: vars.space.md,
});

globalStyle(`${wrapper} .xterm-viewport`, {
  backgroundColor: 'transparent !important',
});
