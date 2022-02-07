import {createTheme, style} from '@vanilla-extract/css';
import {themeVars} from '../../theme/global.css';

export const [toolbarTheme, toolbarVars] = createTheme({
  backgroundColor: themeVars.backgroundColor.white,
});

export const wrapper = style([
  toolbarTheme,
  {
    position: 'fixed',
    backgroundColor: toolbarVars.backgroundColor,
    padding: '24px',
    width: '700px',
    color: themeVars.textColor.blue['900'],
    fontSize: '18px',
    fontWeight: 'bold',
    zIndex: 30,
    top: 25,
    boxShadow: themeVars.boxShadow['2xl'],
    borderRadius: themeVars.borderRadius.lg,
  },
]);