import {LanguageIconDefinition} from '@codeimage/config';
import {FadeInOutTransition, themeVars} from '@codeimage/ui';
import {assignInlineVars} from '@vanilla-extract/dynamic';
import clsx from 'clsx';
import {WithRef} from 'solid-headless/dist/types/utils/dynamic-prop';
import {FlowComponent} from 'solid-js';
import {TerminalState} from '../../state/terminal';
import * as styles from './terminal.css';
import {TerminalGlassReflection} from './TerminalGlassReflection';

export interface BaseTerminalProps
  extends Omit<TerminalState, 'type'>,
    WithRef<'div'> {
  showTab: boolean;
  readonlyTab: boolean;
  tabIcon?: LanguageIconDefinition['content'];
  onTabChange?: (tab: string) => void;
}

export interface TerminalHostProps extends BaseTerminalProps {
  theme: string;
}

export const TerminalHost: FlowComponent<TerminalHostProps> = props => {
  const background = () => {
    if (props.alternativeTheme) {
      return `rgba(${styles.terminalVars.headerColor}, .70)`;
    }
    const opacity = (props.opacity ?? 100) / 100;
    if (props.opacity !== 100) {
      return `rgba(0,0,0, ${opacity})`;
    }
    return props.background;
  };

  return (
    <div
      class={clsx(styles.wrapper, props.theme)}
      data-theme-mode={props.darkMode ? 'dark' : 'light'}
      style={assignInlineVars({
        [styles.terminalVars.backgroundColor]: background(),
        [styles.terminalVars.textColor]: props.textColor,
        [styles.terminalVars.boxShadow]: props.shadow ?? themeVars.boxShadow.lg,
      })}
    >
      <FadeInOutTransition show={props.showGlassReflection}>
        <TerminalGlassReflection />
      </FadeInOutTransition>

      {props.children}
    </div>
  );
};
