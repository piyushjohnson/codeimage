import {themeVars} from '@codeimage/ui';
import {style} from '@vanilla-extract/css';

export const button = style({
  borderRadius: themeVars.borderRadius.full,
  minWidth: 0,
  appearance: 'none',
  border: 'none',
  width: '24px',
  height: '24px',
  lineHeight: '24px',
  textAlign: 'center',
  padding: 0,
  backgroundColor: 'transparent',
  color: 'white',
  cursor: 'pointer',
  ':disabled': {
    cursor: 'not-allowed',
    opacity: '.25',
  },
  ':focus': {
    backgroundColor: 'rgba(255,255,255, .05)',
  },
  selectors: {
    '&:not(:disabled):active': {
      backgroundColor: 'rgba(255,255,255, .25)',
    },
    '&:not(:disabled):hover': {
      backgroundColor: 'rgba(255,255,255, .10)',
    },
  },
});