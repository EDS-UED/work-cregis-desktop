<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {
  EgAnchoredPopover,
  EgIcon,
  EgTooltipPanel,
} from '@eds/desktop-components';
import {
  PREVIEW_WINDOW_MODE_ORDER,
  PREVIEW_WINDOW_PRESETS,
  applyPreviewWindowMode,
  initPreviewWindowMode,
  previewWindowSize,
  type PreviewWindowMode,
} from './previewWindowSize';
import styles from './ShellDebugWindowCapsule.module.css';
import { SHELL_DEBUG_POPOVER_CHROME_HEIGHT } from './shellDebugPopover.constants';

const WINDOW_POPOVER_WIDTH = 240;
const WINDOW_POPOVER_MAX_HEIGHT = 260;
const BOUNDARY_MARGIN = 8;

type PopoverAlign = 'center' | 'end';

const popoverAlign = ref<PopoverAlign>('end');
const triggerRef = ref<HTMLElement | null>(null);
const anchoredRef = ref<{ close?: () => void } | null>(null);

function resolvePopoverAlign(): PopoverAlign {
  const metrics = triggerRef.value?.querySelector('[data-eds-trigger-metrics]');
  if (!(metrics instanceof HTMLElement)) {
    return 'end';
  }

  const rect = metrics.getBoundingClientRect();
  const centerLeft = rect.left + (rect.width - WINDOW_POPOVER_WIDTH) / 2;
  const boundaryLeft = BOUNDARY_MARGIN;
  const boundaryRight = window.innerWidth - BOUNDARY_MARGIN;

  if (centerLeft < boundaryLeft || centerLeft + WINDOW_POPOVER_WIDTH > boundaryRight) {
    return 'end';
  }

  return 'center';
}

function syncPopoverAlign() {
  popoverAlign.value = resolvePopoverAlign();
}

function onTriggerClick(event: MouseEvent, active: boolean, open: () => void) {
  event.preventDefault();
  event.stopPropagation();
  if (active) {
    anchoredRef.value?.close?.();
    return;
  }
  syncPopoverAlign();
  open();
}

function chooseMode(mode: PreviewWindowMode) {
  applyPreviewWindowMode(mode);
}

onMounted(() => {
  initPreviewWindowMode();
  syncPopoverAlign();
});
</script>

<template>
  <div ref="triggerRef">
    <EgAnchoredPopover
      ref="anchoredRef"
      placement="top"
      :align="popoverAlign"
      width-mode="fixed"
      :width="WINDOW_POPOVER_WIDTH"
      height-mode="adaptive"
      :max-height="WINDOW_POPOVER_MAX_HEIGHT"
      top-tool
      top-tool-title="Window"
      top-tool-closable
      :close-on-scroll="false"
      teleport-to="body"
      boundary-selector="body"
    >
      <template #trigger="{ active, onClick }">
        <span data-eds-trigger-metrics :class="styles.triggerMetrics">
          <EgTooltipPanel
            :class="styles.launcherShell"
            panel-kind="popup"
            panel-radius="radius-full"
            width-mode="adaptive"
            height-mode="adaptive"
            :scrollable="false"
          >
            <button
              type="button"
              :class="styles.launcherButton"
              aria-label="Open window preferences"
              :aria-expanded="active"
              @click.stop.prevent="onTriggerClick($event, active, onClick)"
            >
              <span :class="styles.launcherIcon" aria-hidden="true">
                <EgIcon name="eds-window-flex" size="sm" />
              </span>
              <span :class="styles.launcherLabel">Wnd.</span>
            </button>
          </EgTooltipPanel>
        </span>
      </template>

      <template #default>
        <div
          class="shell-debug-window-popover-content"
          :class="styles.popoverContent"
          :style="{
            maxHeight: `${WINDOW_POPOVER_MAX_HEIGHT - SHELL_DEBUG_POPOVER_CHROME_HEIGHT}px`,
          }"
        >
          <button
            v-for="mode in PREVIEW_WINDOW_MODE_ORDER"
            :key="mode"
            type="button"
            :class="styles.actionRow"
            :aria-pressed="
              previewWindowSize.width === PREVIEW_WINDOW_PRESETS[mode].width &&
              previewWindowSize.height === PREVIEW_WINDOW_PRESETS[mode].height
            "
            @click="chooseMode(mode)"
          >
            <span :class="styles.actionLabel">{{ PREVIEW_WINDOW_PRESETS[mode].label }}</span>
            <span :class="styles.actionValue">
              {{
                previewWindowSize.width === PREVIEW_WINDOW_PRESETS[mode].width &&
                previewWindowSize.height === PREVIEW_WINDOW_PRESETS[mode].height
                  ? 'Active'
                  : PREVIEW_WINDOW_PRESETS[mode].sizeLabel
              }}
            </span>
          </button>
        </div>
      </template>
    </EgAnchoredPopover>
  </div>
</template>
