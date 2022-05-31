import {useI18n} from '@codeimage/locale';
import {Box, Button, useSnackbarStore} from '@codeimage/ui';
import {
  Component,
  createComponent,
  createEffect,
  createSignal,
  getOwner,
  onMount,
  untrack,
} from 'solid-js';
import {Dynamic, Portal} from 'solid-js/web';
import {
  ExportExtension,
  ExportMode,
  useExportImage,
} from '../../hooks/use-export-image';
import {useHotkey} from '../../hooks/use-hotkey';
import {AppLocaleEntries} from '../../i18n';
import {ExportableCanvas} from '../Canvas/ExportableCanvas';
import {ExternalLinkIcon} from '../Icons/ExternalLink';

interface ExportButtonProps {
  canvasRef: HTMLElement | undefined;
}

export const ExportInNewTabButton: Component<ExportButtonProps> = props => {
  const snackbarStore = useSnackbarStore();
  const [t] = useI18n<AppLocaleEntries>();
  const [ref, setRef] = createSignal<HTMLElement>();
  const fragment = document.createDocumentFragment();

  const [data, notify] = useExportImage();

  const label = () =>
    data.loading ? t('toolbar.loadingNewTab') : t('toolbar.openNewTab');

  onMount(() => {
    const exportable = document.createElement('div');
    exportable.id = 'exportable-image';
    exportable.style.width = '640px';
    exportable.style.height = '468.3px';
    setRef(exportable);
    fragment.appendChild(exportable);
    const cmp = createComponent(ExportableCanvas, {});
    createComponent(Portal, {
      mount: exportable,
      children: cmp,
    });

    const x = exportable.querySelectorAll('[data-export-exclude=true]');
    queueMicrotask(() => {
      console.log(x);
      exportable
        .querySelectorAll('[data-export-exclude=true]')
        .forEach(el => el.remove());
    });
  });

  function openInTab() {
    umami.trackEvent(`true`, 'export-new-tab');
    document.body.appendChild(fragment);
    queueMicrotask(() => {
      const el = ref()!;
      el.querySelectorAll('[data-export-exclude=true]').forEach(exclude =>
        exclude.remove(),
      );
      notify({
        ref: el,
        options: {
          extension: ExportExtension.png,
          mode: ExportMode.newTab,
          quality: 100,
          pixelRatio: Math.floor(window.devicePixelRatio),
        },
      });
    });

    setTimeout(() => {
      document.body.removeChild(fragment);
    }, 3000);
  }

  createEffect(() => {
    if (data.error) {
      snackbarStore.create({
        closeable: true,
        message: () => {
          const [t] = useI18n<AppLocaleEntries>();
          return <>{t('export.genericSaveError')}</>;
        },
      });
    }
  });

  useHotkey(document.body, {
    'Control+o': event => {
      event.preventDefault();
      openInTab();
    },
  });

  return (
    <Button
      variant={'solid'}
      theme={'primaryAlt'}
      disabled={data.loading}
      onClick={() => openInTab()}
    >
      <ExternalLinkIcon />

      <Box as={'span'} marginLeft={2}>
        {label()}
      </Box>
    </Button>
  );
};
