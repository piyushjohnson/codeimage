import {getActiveEditorStore} from '@codeimage/store/editor/createActiveEditor';
import {frame$} from '@codeimage/store/frame';
import {terminal$} from '@codeimage/store/terminal';
import {Show} from 'solid-js';
import {fromObservableObject} from '../../core/hooks/from-observable-object';
import {CustomEditor} from '../CustomEditor/CustomEditor';
import {Frame} from '../Frame/Frame';
import {DynamicTerminal} from '../Terminal/dynamic/DynamicTerminal';

export function ExportableCanvas() {
  const frame = fromObservableObject(frame$);
  const terminal = fromObservableObject(terminal$);
  return (
    <Frame
      radius={0}
      padding={frame.padding}
      background={frame.background}
      opacity={frame.opacity}
      visible={frame.visible}
    >
      <DynamicTerminal
        type={terminal.type}
        readonlyTab={false}
        tabName={terminal.tabName}
        showTab={true}
        shadow={terminal.shadow}
        background={terminal.background}
        accentVisible={terminal.accentVisible}
        darkMode={terminal.darkMode}
        textColor={terminal.textColor}
        showHeader={terminal.showHeader}
        showGlassReflection={terminal.showGlassReflection}
        showWatermark={terminal.showWatermark}
        opacity={terminal.opacity}
        alternativeTheme={terminal.alternativeTheme}
      >
        <Show when={getActiveEditorStore().editor()}>
          <CustomEditor />
        </Show>
      </DynamicTerminal>
    </Frame>
  );
}
