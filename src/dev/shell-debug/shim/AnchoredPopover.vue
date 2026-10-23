<script setup lang="ts">
/**
 * Dev 替换 EDS `AnchoredPopover.vue`（vite alias）。
 * 长时 onBeforeOpen（如批选 AML 二次确认）会触发 prepDeferredLoading → EgTooltip disabled；
 * 须在清 loading 后 nextTick 再 openPanel，否则 openNow 因 disabled 直接 return。
 */
import { computed, nextTick, ref } from 'vue';
import {
  EgTooltip,
  type TooltipAlign,
  type TooltipPlacement,
} from '@eds/desktop-components/molecules/tooltip';
import { closeAllAnchoredTooltips } from '@eds/desktop-components/molecules/tooltip/anchoredTooltipManager';
import EgPopover from '@eds/desktop-components/molecules/popovers/Popover.vue';
import type {
  PopoverHeightMode,
  PopoverWidthMode,
} from '@eds/desktop-components/molecules/popovers/Popover.vue';

/** 准备开层超过该时长仍未完成时，才展示 Loading（网络/系统慢响应）。 */
const PREP_LOADING_DELAY_MS = 500;

const props = withDefaults(
  defineProps<{
    placement?: TooltipPlacement;
    align?: TooltipAlign;
    disabled?: boolean;
    loading?: boolean;
    teleportTo?: string | HTMLElement;
    boundarySelector?: string;
    onBeforeOpen?: () => void | Promise<void>;
    crossAxisOffset?: number;
    closeOnScroll?: boolean;
    widthMode?: PopoverWidthMode;
    heightMode?: PopoverHeightMode;
    width?: number;
    maxWidth?: number;
    height?: number;
    maxHeight?: number;
    topTool?: boolean;
    topToolTitle?: string;
    topToolClosable?: boolean;
  }>(),
  {
    placement: 'top',
    align: 'center',
    disabled: false,
    loading: false,
    teleportTo: '.app-preview',
    boundarySelector: '.eds-data-list',
    crossAxisOffset: 0,
    closeOnScroll: true,
  },
);

const emit = defineEmits<{
  open: [];
  close: [];
  dismiss: [];
}>();

const anchorRef = ref<{ toggle: () => void; close: () => void; openPanel: () => void } | null>(
  null,
);
const expanded = ref(false);
const prepBusy = ref(false);
const prepDeferredLoading = ref(false);

const showLoading = computed(() => props.loading || prepDeferredLoading.value);

function closePopover() {
  anchorRef.value?.close();
}

async function onTriggerClick() {
  if (props.disabled || showLoading.value || prepBusy.value) return;

  if (expanded.value) {
    closePopover();
    return;
  }

  closeAllAnchoredTooltips();

  if (!props.onBeforeOpen) {
    anchorRef.value?.openPanel();
    return;
  }

  prepBusy.value = true;
  let prepLoadingTimer: ReturnType<typeof setTimeout> | undefined;

  try {
    prepLoadingTimer = setTimeout(() => {
      prepDeferredLoading.value = true;
    }, PREP_LOADING_DELAY_MS);

    await props.onBeforeOpen();
  } catch {
    return;
  } finally {
    if (prepLoadingTimer !== undefined) {
      clearTimeout(prepLoadingTimer);
    }
    prepDeferredLoading.value = false;
    prepBusy.value = false;
  }

  await nextTick();
  await nextTick();
  requestAnimationFrame(() => {
    anchorRef.value?.openPanel();
  });
}

function onAnchoredClose() {
  expanded.value = false;
  emit('dismiss');
  emit('close');
}

defineExpose({
  close: closePopover,
  open: onTriggerClick,
});
</script>

<template>
  <EgTooltip
    ref="anchorRef"
    :placement="placement"
    :align="align"
    :cross-axis-offset="crossAxisOffset"
    trigger="click"
    :click-toggle="false"
    :wrap-tooltip="false"
    :disabled="disabled || showLoading"
    :teleport-to="teleportTo"
    :boundary-selector="boundarySelector"
    :close-on-scroll="closeOnScroll"
    @open="expanded = true; emit('open')"
    @close="onAnchoredClose"
  >
    <slot
      name="trigger"
      :active="expanded"
      :loading="showLoading"
      :on-click="onTriggerClick"
    />
    <template #content>
      <EgPopover
        :placement="placement"
        :align="align"
        :width-mode="widthMode"
        :height-mode="heightMode"
        :width="width"
        :max-width="maxWidth"
        :height="height"
        :max-height="maxHeight"
        :top-tool="topTool"
        :top-tool-title="topToolTitle"
        :top-tool-closable="topToolClosable"
        @top-tool-close="closePopover"
      >
        <slot :close="closePopover" :active="expanded" />
      </EgPopover>
    </template>
  </EgTooltip>
</template>
