<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { EgPopover, EgTooltip } from '@eds/desktop-components';
import DevInspectPanelHost from './inspect/DevInspectPanelHost.vue';
import InspectDetailPanel from './inspect/InspectDetailPanel.vue';
import ShellDebugDevLauncherTrigger from './ShellDebugDevLauncherTrigger.vue';
import {
  clearInspectSelection,
  developerInspectActive,
  inspectPinnedInfo,
  setDeveloperInspectActive,
} from './inspect/developerInspectSession';
import { markShellDebugUiInteraction } from './installShellDebugFloatLayerGuard';
import { closeShellDebugLauncherPopovers } from './shellDebugLauncherPopovers';
import { useBusinessAnchoredLayerBlocksDevIdleHint } from './useBusinessAnchoredLayerBlocksDevIdleHint';
import { SHELL_DEBUG_POPOVER_MAX_HEIGHT } from './shellDebugPopover.constants';

const DEV_INSPECT_POPOVER_WIDTH = 360;
const DEV_HINT_POPOVER_EST_WIDTH = 220;
const POPOVER_MAX_HEIGHT = SHELL_DEBUG_POPOVER_MAX_HEIGHT;
const BOUNDARY_MARGIN = 8;
const INSPECT_SCROLL_EPSILON = 2;

type PopoverAlign = 'center' | 'end';

type DevInspectAnchor = {
  openPanel: () => void;
  close: () => void;
};

const popoverAlign = ref<PopoverAlign>('end');
const hintPopoverAlign = ref<PopoverAlign>('end');
const triggerRef = ref<HTMLElement | null>(null);
const devInspectAnchorRef = ref<DevInspectAnchor | null>(null);
const devInspectPanelDismissed = ref(false);

let inspectScrollSlot: HTMLElement | null = null;
let inspectScrollPopover: HTMLElement | null = null;
let inspectScrollListener: (() => void) | undefined;
let inspectScrollResizeObserver: ResizeObserver | undefined;

const panelTitle = computed(() => inspectPinnedInfo.value?.label ?? '');
const pinnedInfo = computed(() => inspectPinnedInfo.value);
const businessAnchoredLayerBlocksDevHint = useBusinessAnchoredLayerBlocksDevIdleHint();
const showIdleHintTooltip = computed(
  () => !developerInspectActive.value && !businessAnchoredLayerBlocksDevHint.value,
);

const devInspectPanelOpen = computed(
  () =>
    developerInspectActive.value
    && pinnedInfo.value != null
    && !devInspectPanelDismissed.value,
);

function resolvePopoverAlign(popoverWidth: number): PopoverAlign {
  const metrics = triggerRef.value?.querySelector('[data-eds-trigger-metrics]');
  if (!(metrics instanceof HTMLElement)) {
    return 'end';
  }
  const rect = metrics.getBoundingClientRect();
  const endAlignedLeft = rect.right - popoverWidth;
  const boundaryLeft = BOUNDARY_MARGIN;
  const boundaryRight = window.innerWidth - BOUNDARY_MARGIN;

  if (endAlignedLeft >= boundaryLeft && rect.right <= boundaryRight) {
    return 'end';
  }

  const centerLeft = rect.left + (rect.width - popoverWidth) / 2;
  if (centerLeft >= boundaryLeft && centerLeft + popoverWidth <= boundaryRight) {
    return 'center';
  }

  return 'end';
}

function syncPopoverAlign() {
  popoverAlign.value = resolvePopoverAlign(DEV_INSPECT_POPOVER_WIDTH);
  hintPopoverAlign.value = resolvePopoverAlign(DEV_HINT_POPOVER_EST_WIDTH);
}

function openDevInspectAnchorPanel() {
  devInspectAnchorRef.value?.openPanel();
}

function closeDevInspectAnchorPanel() {
  devInspectAnchorRef.value?.close();
}

function showDevInspectPanelAfterPin() {
  if (!inspectPinnedInfo.value) return;
  devInspectPanelDismissed.value = false;
  markShellDebugUiInteraction(400);
  syncPopoverAlign();
  nextTick(() => {
    openDevInspectAnchorPanel();
    bindInspectScrollChrome();
    resetInspectScrollPosition();
  });
}

function onLauncherPointerDown(event: PointerEvent) {
  event.stopPropagation();
  markShellDebugUiInteraction(400);
}

function onTriggerClick(event: MouseEvent) {
  event.preventDefault();
  event.stopPropagation();
  markShellDebugUiInteraction(400);

  if (developerInspectActive.value) {
    closeDevInspectAnchorPanel();
    setDeveloperInspectActive(false);
    clearInspectSelection();
    devInspectPanelDismissed.value = false;
    return;
  }

  closeShellDebugLauncherPopovers();
  clearInspectSelection();
  devInspectPanelDismissed.value = false;
  setDeveloperInspectActive(true);
}

function closeDevPanel() {
  devInspectPanelDismissed.value = true;
  closeDevInspectAnchorPanel();
  unbindInspectScrollChrome();
}

function syncInspectDividerScrollState() {
  const slot = inspectScrollSlot;
  const popover = inspectScrollPopover;
  if (!slot || !popover) return;

  const { scrollTop, scrollHeight, clientHeight } = slot;
  const canScroll = scrollHeight - clientHeight > INSPECT_SCROLL_EPSILON;
  const scrolled = scrollTop > INSPECT_SCROLL_EPSILON;

  popover.classList.toggle('shell-debug-dev-inspect-scrolled', canScroll && scrolled);
  slot.classList.toggle('shell-debug-dev-inspect-scroll-fade-bottom', canScroll);
}

function unbindInspectScrollChrome() {
  if (inspectScrollSlot && inspectScrollListener) {
    inspectScrollSlot.removeEventListener('scroll', inspectScrollListener);
  }
  inspectScrollResizeObserver?.disconnect();
  inspectScrollResizeObserver = undefined;
  const slot = inspectScrollSlot;
  inspectScrollSlot = null;
  inspectScrollPopover?.classList.remove('shell-debug-dev-inspect-scrolled');
  slot?.classList.remove('shell-debug-dev-inspect-scroll-fade-bottom');
  inspectScrollPopover = null;
  inspectScrollListener = undefined;
}

function bindInspectScrollChrome() {
  unbindInspectScrollChrome();

  nextTick(() => {
    const panel = document.querySelector('[data-dev-inspect-panel].shell-debug-dev-inspect-popover');
    if (!(panel instanceof HTMLElement)) return;

    const slot = panel.closest('[class*="contentSlotWithTopTool"]');
    const popover = panel.closest('.eds-popover');
    if (!(slot instanceof HTMLElement) || !(popover instanceof HTMLElement)) return;

    inspectScrollSlot = slot;
    inspectScrollPopover = popover;
    inspectScrollListener = () => syncInspectDividerScrollState();
    slot.addEventListener('scroll', inspectScrollListener, { passive: true });
    inspectScrollResizeObserver = new ResizeObserver(() => syncInspectDividerScrollState());
    inspectScrollResizeObserver.observe(slot);
    syncInspectDividerScrollState();
  });
}

function resetInspectScrollPosition() {
  if (!inspectScrollSlot) return;
  inspectScrollSlot.scrollTop = 0;
  syncInspectDividerScrollState();
}

watch(
  () => inspectPinnedInfo.value,
  (info) => {
    if (!info || !developerInspectActive.value) return;
    showDevInspectPanelAfterPin();
  },
  { flush: 'sync' },
);

watch(devInspectPanelOpen, (open) => {
  if (open) {
    nextTick(() => {
      openDevInspectAnchorPanel();
      bindInspectScrollChrome();
    });
    return;
  }
  closeDevInspectAnchorPanel();
  unbindInspectScrollChrome();
});

onMounted(() => {
  syncPopoverAlign();
});

onBeforeUnmount(() => {
  unbindInspectScrollChrome();
});
</script>

<template>
  <div
    ref="triggerRef"
    @pointerenter="markShellDebugUiInteraction(800)"
  >
    <EgTooltip
      v-if="showIdleHintTooltip"
      placement="top"
      :align="hintPopoverAlign"
      trigger="hover"
      :wrap-tooltip="false"
      :close-on-scroll="false"
      teleport-to="body"
      boundary-selector="body"
    >
      <ShellDebugDevLauncherTrigger
        :developer-inspect-active="developerInspectActive"
        :dev-inspect-panel-open="devInspectPanelOpen"
        @launcher-pointerdown="onLauncherPointerDown"
        @trigger-click="onTriggerClick"
      />

      <template #content>
        <EgPopover
          placement="top"
          :align="hintPopoverAlign"
          width-mode="adaptive"
          height-mode="adaptive"
        >
          <div
            class="shell-debug-dev-inspect-hint"
            data-dev-inspect-panel
          >
            <InspectDetailPanel :info="null" embedded />
          </div>
        </EgPopover>
      </template>
    </EgTooltip>

    <EgTooltip
      v-else
      ref="devInspectAnchorRef"
      placement="top"
      :align="popoverAlign"
      trigger="click"
      :click-toggle="false"
      :wrap-tooltip="false"
      :close-on-scroll="false"
      teleport-to="body"
      boundary-selector="body"
    >
      <ShellDebugDevLauncherTrigger
        :developer-inspect-active="developerInspectActive"
        :dev-inspect-panel-open="devInspectPanelOpen"
        @launcher-pointerdown="onLauncherPointerDown"
        @trigger-click="onTriggerClick"
      />

      <template #content>
        <DevInspectPanelHost
          v-if="devInspectPanelOpen && pinnedInfo"
          :panel-title="panelTitle"
          :pinned-info="pinnedInfo"
          :popover-align="popoverAlign"
          :width="DEV_INSPECT_POPOVER_WIDTH"
          :max-height="POPOVER_MAX_HEIGHT"
          @close="closeDevPanel"
        />
      </template>
    </EgTooltip>
  </div>
</template>
