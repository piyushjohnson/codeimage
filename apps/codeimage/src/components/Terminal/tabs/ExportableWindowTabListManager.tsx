import {getRootEditorStore} from '@codeimage/store/editor/createEditors';
import {createMemo, For, VoidProps} from 'solid-js';
import {createTabIcon} from '../../../hooks/use-tab-icon';
import {BaseWindowTab} from './BaseWindowTab';
import * as styles from './Tab.css';

export interface WindowTabListManager {
  accent: boolean;
}

export function ExportableWindowTabListManager(
  props: VoidProps<WindowTabListManager>,
) {
  const {editors, isActive} = getRootEditorStore();

  return (
    <div
      class={styles.wrapper({
        multi: editors.length > 0,
        accent: props.accent,
      })}
      data-accent-visible={props.accent}
    >
      <div class={styles.tabListWrapper}>
        <For each={editors}>
          {(editor, index) => {
            const icon = createTabIcon(
              () => editor.tab.tabName ?? null,
              () => editor.languageId,
              true,
            );

            const active = () => isActive(editor.id);

            const zIndex = createMemo(() => {
              if (active()) {
                return 20;
              } else {
                return 20 - (index() + 1);
              }
            });

            return (
              <BaseWindowTab
                id={editor.id}
                index={zIndex()}
                tabName={editor.tab.tabName}
                tabIcon={icon()?.content}
                accentMode={props.accent}
                active={active() && editors.length > 1}
              />
            );
          }}
        </For>
      </div>
    </div>
  );
}
