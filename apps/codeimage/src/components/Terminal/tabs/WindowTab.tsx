import {LanguageIconDefinition} from '@codeimage/config';
import {Text} from '@codeimage/ui';
import {createSortable, maybeTransformStyle} from '@thisbeyond/solid-dnd';
import {assignInlineVars} from '@vanilla-extract/dynamic';
import {Ref, Show, VoidProps} from 'solid-js';
import {exportExclude as _exportExclude} from '../../../core/directives/exportExclude';
import {createRef} from '../../../core/helpers/create-ref';
import {CloseIcon} from '../../Icons/CloseIcon';
import * as styles from './Tab.css';
import {TabIcon} from './TabIcon/TabIcon';
import {TabName} from './TabName/TabName';

const exportExclude = _exportExclude;

export interface WindowTabProps {
  readonly ref: Ref<HTMLDivElement>;
  readonly id: string;
  readonly index: number;
  readonly tabName?: string | null;
  readonly tabIcon?: LanguageIconDefinition['content'];
  readonly readonlyTab: boolean;
  readonly accentMode: boolean;
  readonly active: boolean;
  readonly onTabChange: (value: string) => void;
  readonly onClick?: () => void;
  readonly onClose?: (() => void) | null;
}

export function WindowTab(props: VoidProps<WindowTabProps>) {
  const sortable = createSortable(props.id);

  return (
    <div
      use:sortable
      use:exportExclude={!props.tabName?.length}
      ref={createRef(props, sortable.ref)}
      class={styles.tab({
        accent: props.accentMode,
        active: props.active,
      })}
      data-active-drag={sortable.isActiveDraggable}
      data-host-index={props.index}
      data-accent-visible={props.accentMode}
      style={assignInlineVars({
        [styles.tabVars.tabIndex]: String(props.index),
      })}
      data-active={props.active}
      onMouseDown={() => props.onClick?.()}
    >
      <Show when={props.tabIcon}>{icon => <TabIcon content={icon} />}</Show>
      <div class={styles.tabTextContent}>
        <Show
          fallback={
            <Text size={'sm'} class={styles.fallbackText}>
              {props.tabName || 'Untitled'}
            </Text>
          }
          when={!props.readonlyTab}
        >
          <TabName
            readonly={props.readonlyTab && !props.active}
            value={props.tabName ?? ''}
            onValueChange={value => props.onTabChange?.(value)}
          />
        </Show>
      </div>
      <Show when={props.onClose}>
        {onClose => (
          <CloseIcon
            class={styles.tabCloseIcon}
            onClick={evt => {
              onClose();
              evt.stopPropagation();
              evt.preventDefault();
            }}
            size={'xs'}
            stroke-width={3}
            data-export-exclude={true}
          />
        )}
      </Show>
    </div>
  );
}