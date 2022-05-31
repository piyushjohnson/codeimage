import {useI18n} from '@codeimage/locale';
import {getRootEditorStore} from '@codeimage/store/editor/createEditors';
import {copyToClipboard$} from '@codeimage/store/effects/onCopyToClipboard';
import {onThemeChange$} from '@codeimage/store/effects/onThemeChange';
import {setScale} from '@codeimage/store/frame';
import {connectStoreWithQueryParams} from '@codeimage/store/plugins/connect-store-with-query-params';
import {Box, LoadingOverlay, PortalHost, SnackbarHost} from '@codeimage/ui';
import {initEffects} from '@ngneat/effects';
import {createEffect, createSignal, on, Show} from 'solid-js';
import {BottomBar} from './components/BottomBar/BottomBar';
import {ExportableCanvas} from './components/Canvas/ExportableCanvas';
import {Footer} from './components/Footer/Footer';
import {FrameHandler} from './components/Frame/FrameHandler';
import {KeyboardShortcuts} from './components/KeyboardShortcuts/KeyboardShortcuts';
import {EditorSidebar} from './components/PropertyEditor/EditorSidebar';
import {SidebarPopoverHost} from './components/PropertyEditor/SidebarPopoverHost';
import {Canvas} from './components/Scaffold/Canvas/Canvas';
import {Scaffold} from './components/Scaffold/Scaffold';
import {Sidebar} from './components/Scaffold/Sidebar/Sidebar';
import {ThemeSwitcher} from './components/ThemeSwitcher/ThemeSwitcher';
import {Toolbar} from './components/Toolbar/Toolbar';
import {useModality} from './core/hooks/isMobile';
import {useEffects} from './core/store/use-effect';
import {uiStore} from './state/ui';
import './theme/global.css';

initEffects();

export function App() {
  document.querySelector('#launcher')?.remove();
  const [frameRef, setFrameRef] = createSignal<HTMLElement>();
  const [portalHostRef, setPortalHostRef] = createSignal<HTMLElement>();
  const modality = useModality();
  const [, {locale}] = useI18n();
  connectStoreWithQueryParams();
  useEffects([onThemeChange$, copyToClipboard$]);
  createEffect(on(() => uiStore.locale, locale));
  const {ready} = getRootEditorStore();

  return (
    <Scaffold>
      <PortalHost id={'floating-portal-popover'} />
      <SidebarPopoverHost />
      <SnackbarHost />

      <Show when={modality === 'full'}>
        <Sidebar position={'left'}>
          <EditorSidebar />
        </Sidebar>
      </Show>

      <PortalHost ref={setPortalHostRef} />

      <Canvas>
        <Toolbar canvasRef={frameRef()} />
        <Show when={modality === 'full'}>
          <Box paddingLeft={4} paddingTop={3}>
            <KeyboardShortcuts />
          </Box>
        </Show>

        <FrameHandler hidden={false} onScaleChange={setScale}>
          <Show
            when={ready()}
            fallback={
              <div style={{height: '400px', width: '600px'}}>
                <LoadingOverlay overlay={true} size={'lg'} />
              </div>
            }
          >
            <ExportableCanvas />
          </Show>
        </FrameHandler>

        <Footer />
      </Canvas>

      <Show
        when={modality === 'full'}
        fallback={<BottomBar portalHostRef={portalHostRef()} />}
      >
        <Sidebar position={'right'}>
          <ThemeSwitcher orientation={'vertical'} />
        </Sidebar>
      </Show>
    </Scaffold>
  );
}

export default App;
