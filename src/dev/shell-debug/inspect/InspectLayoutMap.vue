<script setup lang="ts">
import { computed, onBeforeUnmount, shallowRef, watch } from 'vue';
import { isClientPopupActive } from '@/scenes/tasks/shared/clientPopupActive';
import {
  developerInspectActive,
  inspectHoverInfo,
  inspectPinnedInfo,
} from './developerInspectSession';
import { collectLayoutMapItems, type InspectLayoutMapItem } from './buildLayoutMap';
import {
  DEV_INSPECT_GAP_ACCENT,
  DEV_INSPECT_LAYOUT_MAP_STROKE,
  DEV_INSPECT_MARGIN_ACCENT,
  DEV_INSPECT_PADDING_ACCENT,
} from './devInspectTheme';

const PREVIEW_SELECTOR = '.app-preview';

const layoutItems = shallowRef<InspectLayoutMapItem[]>([]);

/** 无 hover / pin / EgPopup 时才铺结构图；有前景交互时让出视觉层。 */
const showLayoutMap = computed(
  () =>
    developerInspectActive.value
    && !inspectPinnedInfo.value
    && !inspectHoverInfo.value
    && !isClientPopupActive(),
);

const layoutMapThemeStyle = computed(
  () =>
    ({
      '--dev-inspect-layout-map-stroke': DEV_INSPECT_LAYOUT_MAP_STROKE,
      '--dev-inspect-layout-map-padding': DEV_INSPECT_PADDING_ACCENT,
      '--dev-inspect-layout-map-margin': DEV_INSPECT_MARGIN_ACCENT,
      '--dev-inspect-layout-map-gap': DEV_INSPECT_GAP_ACCENT,
    }) as const,
);

const layoutMarginItems = computed(() =>
  layoutItems.value.filter((item) => item.role === 'margin'),
);

const layoutPaddingItems = computed(() =>
  layoutItems.value.filter((item) => item.role === 'padding'),
);

const layoutGapItems = computed(() =>
  layoutItems.value.filter((item) => item.role === 'gap'),
);

const layoutLineItems = computed(() =>
  layoutItems.value.filter((item) => item.role === 'frame' || item.role === 'cell'),
);

let rebuildRafId: number | null = null;
let mutationObserver: MutationObserver | undefined;
let bodyMutationObserver: MutationObserver | undefined;
let resizeObserver: ResizeObserver | undefined;

const OVERLAY_LAYER_MUTATION_SELECTORS = [
  '[id^="eds-tooltip-"]',
  '.effect-flotation-box',
  '.eds-flotation-menu',
  '.eds-popover',
  '.eds-popup',
] as const;

function nodeTouchesOverlayLayer(node: Node): boolean {
  if (!(node instanceof Element)) return false;
  return OVERLAY_LAYER_MUTATION_SELECTORS.some(
    (selector) => node.matches(selector) || Boolean(node.querySelector(selector)),
  );
}

function mutationTouchesOverlayLayer(mutation: MutationRecord): boolean {
  if (mutation.type === 'childList') {
    for (const node of mutation.addedNodes) {
      if (nodeTouchesOverlayLayer(node)) return true;
    }
    for (const node of mutation.removedNodes) {
      if (nodeTouchesOverlayLayer(node)) return true;
    }
    return false;
  }

  if (mutation.type === 'attributes' && mutation.target instanceof Element) {
    const target = mutation.target;
    return OVERLAY_LAYER_MUTATION_SELECTORS.some(
      (selector) => target.matches(selector) || Boolean(target.closest(selector)),
    );
  }

  return false;
}

function rebuildLayoutMap() {
  const preview = document.querySelector(PREVIEW_SELECTOR);
  if (!(preview instanceof Element)) {
    layoutItems.value = [];
    return;
  }
  layoutItems.value = collectLayoutMapItems(preview);
}

function scheduleLayoutMapRebuild() {
  if (!developerInspectActive.value) return;
  if (rebuildRafId !== null) return;
  rebuildRafId = requestAnimationFrame(() => {
    rebuildRafId = null;
    rebuildLayoutMap();
  });
}

function bindLayoutMapObservers() {
  unbindLayoutMapObservers();
  rebuildLayoutMap();

  window.addEventListener('scroll', scheduleLayoutMapRebuild, true);
  window.addEventListener('resize', scheduleLayoutMapRebuild, { passive: true });

  const preview = document.querySelector(PREVIEW_SELECTOR);
  if (!(preview instanceof Element)) return;

  resizeObserver = new ResizeObserver(scheduleLayoutMapRebuild);
  resizeObserver.observe(preview);

  mutationObserver = new MutationObserver(scheduleLayoutMapRebuild);
  mutationObserver.observe(preview, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style', 'hidden', 'aria-hidden'],
  });

  // EgFlotation / AnchoredTooltip 默认 teleport 到 body；preview 内 observer 捕不到开合。
  bodyMutationObserver = new MutationObserver((mutations) => {
    if (mutations.some(mutationTouchesOverlayLayer)) {
      scheduleLayoutMapRebuild();
    }
  });
  bodyMutationObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style', 'hidden', 'aria-hidden', 'id'],
  });
}

function unbindLayoutMapObservers() {
  if (rebuildRafId !== null) {
    cancelAnimationFrame(rebuildRafId);
    rebuildRafId = null;
  }
  window.removeEventListener('scroll', scheduleLayoutMapRebuild, true);
  window.removeEventListener('resize', scheduleLayoutMapRebuild);
  mutationObserver?.disconnect();
  mutationObserver = undefined;
  bodyMutationObserver?.disconnect();
  bodyMutationObserver = undefined;
  resizeObserver?.disconnect();
  resizeObserver = undefined;
  layoutItems.value = [];
}

watch(
  developerInspectActive,
  (active) => {
    if (active) {
      bindLayoutMapObservers();
      return;
    }
    unbindLayoutMapObservers();
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  unbindLayoutMapObservers();
});
</script>

<template>
  <svg
    v-if="showLayoutMap && layoutItems.length > 0"
    data-dev-inspect-layout-map
    :class="$style.root"
    :style="layoutMapThemeStyle"
    aria-hidden="true"
  >
    <g :class="$style.lineLayer">
      <rect
        v-for="(item, index) in layoutLineItems"
        :key="`layout-line-${index}`"
        :class="item.role === 'frame' ? $style.frameLine : $style.cellLine"
        :x="item.x"
        :y="item.y"
        :width="item.width"
        :height="item.height"
        rx="1"
        ry="1"
      />
    </g>
    <!-- spacing 均在 line 之上，避免描边盖住条带 -->
    <g :class="$style.marginLayer">
      <rect
        v-for="(item, index) in layoutMarginItems"
        :key="`layout-margin-${index}`"
        :class="$style.margin"
        :x="item.x"
        :y="item.y"
        :width="item.width"
        :height="item.height"
      />
    </g>
    <g :class="$style.gapLayer">
      <rect
        v-for="(item, index) in layoutGapItems"
        :key="`layout-gap-${index}`"
        :class="$style.gap"
        :x="item.x"
        :y="item.y"
        :width="item.width"
        :height="item.height"
      />
    </g>
    <g :class="$style.paddingLayer">
      <rect
        v-for="(item, index) in layoutPaddingItems"
        :key="`layout-padding-${index}`"
        :class="$style.padding"
        :x="item.x"
        :y="item.y"
        :width="item.width"
        :height="item.height"
      />
    </g>
  </svg>
</template>

<style module>
.root {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
  z-index: 9990;
}

.marginLayer,
.paddingLayer,
.gapLayer,
.lineLayer {
  pointer-events: none;
}

.margin {
  fill: color-mix(in srgb, var(--dev-inspect-layout-map-margin, #f97316) 38%, transparent);
  stroke: none;
  shape-rendering: geometricPrecision;
}

.padding {
  fill: color-mix(in srgb, var(--dev-inspect-layout-map-padding, #22c55e) 24%, transparent);
  stroke: none;
  shape-rendering: geometricPrecision;
}

.gap {
  fill: color-mix(in srgb, var(--dev-inspect-layout-map-gap, #ec008c) 40%, transparent);
  stroke: none;
  shape-rendering: geometricPrecision;
}

.frameLine {
  fill: none;
  stroke: var(--dev-inspect-layout-map-stroke, #6f4dff);
  stroke-width: 1.2;
  vector-effect: non-scaling-stroke;
  shape-rendering: geometricPrecision;
}

.cellLine {
  fill: none;
  stroke: color-mix(in srgb, var(--dev-inspect-layout-map-stroke, #6f4dff) 35%, transparent);
  stroke-width: 1;
  stroke-dasharray: 4 3;
  vector-effect: non-scaling-stroke;
  shape-rendering: geometricPrecision;
}
</style>
