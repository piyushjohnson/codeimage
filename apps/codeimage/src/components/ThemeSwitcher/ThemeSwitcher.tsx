import {useI18n} from '@codeimage/locale';
import {getRootEditorStore} from '@codeimage/store/editor/createEditors';
import {updateTheme} from '@codeimage/store/effects/onThemeChange';
import {terminal$} from '@codeimage/store/terminal';
import {CustomTheme} from '@codeimage/theme';
import {
  Box,
  FadeInOutWithScaleTransition,
  FlexField,
  TextField,
} from '@codeimage/ui';
import {appEnvironment} from '@core/configuration';
import {fromObservableObject} from '@core/hooks/from-observable-object';
import {useModality} from '@core/hooks/isMobile';
import {dispatch} from '@ngneat/effects';
import {assignInlineVars} from '@vanilla-extract/dynamic';
import {
  createMemo,
  createSelector,
  createSignal,
  For,
  ParentComponent,
  Show,
} from 'solid-js';
import {AppLocaleEntries} from '../../i18n';
import {CustomEditorPreview} from '../CustomEditor/CustomEditorPreview';
import {CheckCircle} from '../Icons/CheckCircle';
import {EmptyCircle} from '../Icons/EmptyCircle';
import {TerminalHost} from '../Terminal/TerminalHost';
import {ThemeBox} from './ThemeBox';
import * as styles from './ThemeSwitcher.css';
import {gridSize, ThemeSwitcherVariant} from './ThemeSwitcher.css';

function useFilteredThemes() {
  const {themes} = appEnvironment;
  const [search, setSearch] = createSignal('');

  const filteredThemes = createMemo(() => {
    const value = search();
    if (!value || !(value.length > 2)) return themes;
    return themes.filter(theme =>
      theme.properties.label.toLowerCase().includes(value.toLowerCase()),
    );
  });

  return [themes, filteredThemes, search, setSearch] as const;
}

export const ThemeSwitcher: ParentComponent<ThemeSwitcherVariant> = props => {
  const terminal = fromObservableObject(terminal$);
  const {options} = getRootEditorStore();
  const modality = useModality();
  const [t] = useI18n<AppLocaleEntries>();
  const [themes, filteredThemes, search, setSearch] = useFilteredThemes();
  const filteredThemeIds = () => filteredThemes().map(theme => theme.id);
  const isSelected = createSelector(() => options.themeId);

  const onSelectTheme = (theme: CustomTheme) => {
    dispatch(updateTheme({theme}));
    umami.trackEvent(theme.id, `theme-change`);
  };

  const exampleCode =
    '// Just a code example \n' +
    'export function Preview() {\n' +
    ' const [count, setCount] = \n' +
    '   createSignal(0);\n' +
    '}';

  return (
    <Box
      class={styles.grid({
        orientation: props.orientation,
      })}
      style={assignInlineVars({
        [gridSize]: filteredThemes().length.toString(),
      })}
    >
      <Show when={modality === 'full'}>
        <FlexField size={'lg'}>
          <TextField
            type={'text'}
            placeholder={t('themeSwitcher.search')}
            value={search()}
            onChange={setSearch}
          />
        </FlexField>
      </Show>
      <For each={themes}>
        {theme => (
          <FadeInOutWithScaleTransition
            show={filteredThemeIds().includes(theme.id)}
          >
            <Box>
              <ThemeBox
                theme={theme}
                selected={isSelected(theme.id)}
                onClick={() => onSelectTheme(theme)}
              >
                <TerminalHost
                  themeClass={styles.themeBoxTerminalHost}
                  tabName={'Untitled'}
                  textColor={theme.properties.terminal.text}
                  background={theme.properties.terminal.main}
                  darkMode={theme.properties.darkMode}
                  accentVisible={false}
                  shadow={/*@once*/ terminal.shadow}
                  showTab={false}
                  readonlyTab={true}
                  showHeader={false}
                  showWatermark={false}
                  showGlassReflection={terminal.showGlassReflection}
                  opacity={100}
                  themeId={theme.id}
                  alternativeTheme={terminal.alternativeTheme}
                >
                  <CustomEditorPreview
                    themeId={theme.id}
                    languageId={/*@once*/ 'typescript'}
                    code={/*@once*/ exampleCode}
                  />
                </TerminalHost>
              </ThemeBox>

              <Box display={'flex'} justifyContent={'center'} marginTop={4}>
                <Show
                  when={isSelected(theme.id)}
                  fallback={
                    <EmptyCircle
                      cursor={'pointer'}
                      onClick={() => dispatch(updateTheme({theme}))}
                      size={'md'}
                      opacity={0.35}
                    />
                  }
                >
                  <CheckCircle size={'md'} />
                </Show>
              </Box>
            </Box>
          </FadeInOutWithScaleTransition>
        )}
      </For>
    </Box>
  );
};
