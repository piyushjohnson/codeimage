import {useI18n} from '@codeimage/locale';
import {
  Box,
  Button,
  Dialog,
  DialogPanelContent,
  DialogPanelFooter,
  DialogProps,
  FieldLabel,
  FieldLabelHint,
  FlexField,
  HStack,
  Link,
  PortalHostContext,
  RangeField,
  SegmentedField,
  SegmentedFieldItem,
  TextField,
  useSnackbarStore,
  VStack,
} from '@codeimage/ui';
import {Transition} from 'solid-headless';
import {Component, createEffect, createSignal, onMount, Show} from 'solid-js';
import {useModality} from '../../core/hooks/isMobile';
import {useWebshare} from '../../core/hooks/use-webshare';
import {
  ExportExtension,
  ExportMode,
  useExportImage,
} from '../../hooks/use-export-image';
import {useHotkey} from '../../hooks/use-hotkey';
import {AppLocaleEntries} from '../../i18n';
import {DownloadIcon} from '../Icons/Download';
import {ExclamationIcon} from '../Icons/Exclamation';
import {HintIcon} from '../Icons/Hint';

interface ExportButtonProps {
  canvasRef: HTMLElement | undefined;
}

export const ExportButton: Component<ExportButtonProps> = props => {
  const snackbarStore = useSnackbarStore();
  const [isOpen, setIsOpen] = createSignal(false);
  const [t] = useI18n<AppLocaleEntries>();
  const modality = useModality();

  const [data, notify] = useExportImage();

  const label = () =>
    data.loading ? t('toolbar.exportLoading') : t('toolbar.export');

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
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
    'Control+s': event => {
      event.preventDefault();
      openModal();
    },
  });

  return (
    <>
      <Button
        variant={'solid'}
        theme={'primary'}
        disabled={data.loading}
        onClick={() => openModal()}
      >
        <DownloadIcon />

        <Box as={'span'} marginLeft={2}>
          {label()}
        </Box>
      </Button>

      <PortalHostContext>
        <ExportDialog
          size={'md'}
          isOpen={isOpen()}
          fullScreen={modality === 'mobile'}
          onClose={closeModal}
          onConfirm={payload => {
            notify({
              options: {
                extension: payload.extension,
                fileName:
                  payload.type === 'export' ? payload.fileName : undefined,
                mode: payload.type,
                pixelRatio: payload.pixelRatio,
                quality: payload.quality,
              },
              ref: props.canvasRef,
            });

            closeModal();
          }}
        />
      </PortalHostContext>
    </>
  );
};

export interface ExportDialogProps extends DialogProps {
  onConfirm: (
    payload:
      | {
          type: ExportMode.export;
          fileName: string;
          extension: ExportExtension;
          pixelRatio: number;
          quality: number;
        }
      | {
          type: ExportMode.share;
          message: string;
          extension: ExportExtension;
          pixelRatio: number;
          quality: number;
        },
  ) => void;
}

export function ExportDialog(props: DialogProps & ExportDialogProps) {
  const [t] = useI18n<AppLocaleEntries>();
  const [supportWebShare] = useWebshare();
  const [mode, setMode] = createSignal<ExportMode>(ExportMode.share);
  const [extension, setExtension] = createSignal<ExportExtension>(
    ExportExtension.png,
  );

  const [quality, setQuality] = createSignal<number>(100);

  const [devicePixelRatio, setDevicePixelRatio] = createSignal<number>(
    Math.round(window.devicePixelRatio),
  );

  const [fileName, setFileName] = createSignal<string>('');

  const modeItems = () =>
    [
      {label: t('export.shareMode'), value: ExportMode.share},
      {label: t('export.exportMode'), value: ExportMode.export},
    ] as SegmentedFieldItem<ExportMode>[];

  const extensionItems: SegmentedFieldItem<ExportExtension>[] = [
    {label: 'PNG', value: ExportExtension.png},
    {label: 'SVG', value: ExportExtension.svg},
    {label: 'JPEG', value: ExportExtension.jpeg},
  ];

  const onConfirm = () => {
    props.onClose?.();

    const selectedMode = mode();

    if (selectedMode !== ExportMode.export && selectedMode !== ExportMode.share)
      return;

    const selectedExtension = extension();

    const name = selectedMode === ExportMode.export ? 'Download' : 'Share';
    umami.trackEvent(
      `${name} ${selectedExtension.toUpperCase()}`,
      selectedMode,
    );

    props.onConfirm({
      type: selectedMode,
      extension: selectedExtension,
      fileName: fileName(),
      pixelRatio: devicePixelRatio(),
      message: '',
      quality: quality() / 100,
    });
  };

  onMount(() => {
    if (!supportWebShare()) {
      setMode(ExportMode.export);
    }
  });

  return (
    <Transition appear show={props.isOpen ?? false}>
      <Dialog {...props} isOpen size={'md'} title={t('export.title')}>
        <DialogPanelContent>
          <VStack spacing={'6'}>
            <Show when={supportWebShare()}>
              <FlexField size={'lg'}>
                <SegmentedField
                  value={mode()}
                  onChange={setMode}
                  items={modeItems()}
                />
                <Show when={mode() === 'share'}>
                  <Box marginTop={1}>
                    <FieldLabelHint
                      size={'sm'}
                      weight={'normal'}
                      icon={() => <HintIcon size={'sm'} />}
                    >
                      {t('export.shareHint')}
                      &nbsp;
                      <Link
                        size={'sm'}
                        underline
                        weight={'medium'}
                        target={'_blank'}
                        href={
                          'https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share'
                        }
                      >
                        Web Share API
                      </Link>
                    </FieldLabelHint>
                  </Box>
                </Show>
              </FlexField>
            </Show>

            <Show when={mode() === 'export'}>
              <FlexField size={'md'}>
                <FieldLabel size={'sm'} for={'fileName'}>
                  {t('export.fileName')}
                </FieldLabel>
                <TextField
                  placeholder={t('export.fileNamePlaceholder')}
                  id={'fileName'}
                  value={fileName()}
                  onChange={setFileName}
                  size={'sm'}
                  type={'text'}
                />
              </FlexField>
            </Show>

            <FlexField size={'md'}>
              <FieldLabel size={'sm'}>{t('export.extensionType')}</FieldLabel>
              <SegmentedField
                value={extension()}
                onChange={setExtension}
                items={extensionItems}
              />
              <Show when={extension() === 'jpeg'}>
                <Box marginTop={1}>
                  <FieldLabelHint
                    size={'sm'}
                    weight={'normal'}
                    icon={() => <ExclamationIcon size={'sm'} />}
                  >
                    {t('export.noOpacitySupportedWithThisExtension')}
                    &nbsp;
                  </FieldLabelHint>
                </Box>
              </Show>
            </FlexField>

            <Show when={extension() === 'jpeg'}>
              <FlexField size={'md'}>
                <FieldLabel size={'sm'}>
                  {t('export.quality')}
                  <Box as={'span'} marginLeft={3}>
                    <FieldLabelHint>{quality()}%</FieldLabelHint>
                  </Box>
                </FieldLabel>
                <RangeField
                  value={quality()}
                  onChange={setQuality}
                  max={100}
                  min={70}
                  step={2}
                />
              </FlexField>
            </Show>

            <FlexField size={'md'}>
              <FieldLabel size={'sm'}>
                {t('export.pixelRatio')}
                <Box as={'span'} marginLeft={3}>
                  <FieldLabelHint>{devicePixelRatio()}x</FieldLabelHint>
                </Box>
              </FieldLabel>
              <RangeField
                value={devicePixelRatio()}
                onChange={setDevicePixelRatio}
                max={3}
                min={1}
                step={1}
              />
            </FlexField>
          </VStack>
        </DialogPanelContent>
        <DialogPanelFooter>
          <HStack spacing={'2'} justifyContent={'flexEnd'}>
            <Button
              block
              size={'md'}
              type="button"
              variant={'solid'}
              theme={'secondary'}
              onClick={() => props.onClose?.()}
            >
              {t('common.close')}
            </Button>

            <Button
              block
              size={'md'}
              type="submit"
              variant={'solid'}
              onClick={onConfirm}
            >
              {t('common.confirm')}
            </Button>
          </HStack>
        </DialogPanelFooter>
      </Dialog>
    </Transition>
  );
}
