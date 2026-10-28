<script setup lang="ts">
import { EgPopover } from '@eds/desktop-components';
import type { ElementInspectInfo } from './buildElementInspectInfo';
import InspectDetailPanel from './InspectDetailPanel.vue';
import styles from '../ShellDebugLauncherAnchored.module.css';

type PopoverAlign = 'center' | 'end';

defineProps<{
  panelTitle: string;
  pinnedInfo: ElementInspectInfo;
  popoverAlign: PopoverAlign;
  width: number;
  maxHeight: number;
}>();

const emit = defineEmits<{
  close: [];
}>();
</script>

<template>
  <EgPopover
    placement="top"
    :align="popoverAlign"
    width-mode="fixed"
    :width="width"
    height-mode="adaptive"
    :max-height="maxHeight"
    top-tool
    :top-tool-title="panelTitle"
    top-tool-closable
    @top-tool-close="emit('close')"
  >
    <div
      class="shell-debug-popover-content shell-debug-dev-inspect-popover"
      :class="styles.popoverContent"
      data-dev-inspect-panel
      data-shell-debug-ui
    >
      <InspectDetailPanel :info="pinnedInfo" embedded />
    </div>
  </EgPopover>
</template>
