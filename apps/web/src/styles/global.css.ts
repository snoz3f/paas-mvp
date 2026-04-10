import { globalKeyframes, globalStyle } from '@vanilla-extract/css';
import { vars } from './tokens.css';

globalStyle('*, *::before, *::after', {
  boxSizing: 'border-box',
  margin: 0,
  padding: 0,
});

globalStyle('html, body', {
  height: '100%',
  backgroundColor: vars.color.bg,
  color: vars.color.text,
  fontFamily: vars.font.sans,
  fontSize: vars.font.size.md,
  lineHeight: '1.6',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
});

globalStyle('#root', {
  height: '100%',
});

globalStyle('a', {
  color: 'inherit',
  textDecoration: 'none',
});

globalStyle('button', {
  cursor: 'pointer',
  border: 'none',
  background: 'none',
  font: 'inherit',
});

globalStyle('input, textarea, select', {
  font: 'inherit',
});

globalKeyframes('spin', {
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
});
