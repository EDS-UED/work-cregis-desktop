<script setup lang="ts">
import { EgPopover } from '@eds/desktop-components';
import type { ElementInspectInfo } from './buildElementInspectInfo';
import InspectDetailPanel from './InspectDetailPanel.vue';
import { markShellDebugUiInteraction } from '../installShellDebugFloatLayerGuard';
import styles from '../ShellDebugLauncherAnchored.module.css';
import hostStyles from './devInspectPanelHost.module.css';

type PopoverAlign = 'center' | 'end';

defineProps<{
  panelTitle: string;
  pinnedInfo: ElementInspectInfo;
  popoverAlign: PopoverAlign;
  width: number;
  maxHeight: number;
  panelStyle: Record<string, string>;
}>();

const emit = defineEmits<{
  close: [];
}>();
</script>

<template>
  <Teleport to="body">
    <div
      data-dev-inspect-teleport-host
      data-shell-debug-ui
      class="desktopTokens"
      :class="hostStyles.teleportHost"
      :style="panelStyle"
    >
      <EgPopover
        placement="top"
        :align="popoverAlign"
        width-mode="fixed"
        :width="width"
        height-mode="adaptive"
        :max-height="maxHeight"
        :micro-float="false"
        :active="true"
        top-tool
        :top-tool-title="panelTitle"
        top-tool-closable
        @top-tool-close="emit('close')"
      >
        <div
          class="shell-debug-popover-content shell-debug-dev-inspect-popover"
          :class="styles.popoverContent"
          data-dev-inspect-panel
          @pointerdown.stop="markShellDebugUiInteraction()"
        >
          <InspectDetailPanel :info="pinnedInfo" embedded />
        </div>
      </EgPopover>
    </div>
  </Teleport>
</template>
