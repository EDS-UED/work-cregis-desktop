import { onBeforeUnmount, onMounted, watch } from 'vue';
import { buildElementInspectHoverPreview, buildElementInspectInfo } from './buildElementInspectInfo';
import {
  clearInspectSelection,
  developerInspectActive,
  inspectHoverInfo,
  inspectHoverRect,
  inspectMeasureElement,
  inspectMeasureRect,
  inspectPinnedInfo,
  inspectPinnedRect,
} from './developerInspectSession';

import {
  markShellDebugUiInteraction,
  nativeWindowAddEventListener,
  nativeWindowRemoveEventListener,
} from '../installShellDebugFloatLayerGuard';
import { isShellDebugUiElement } from '../shellDebugUiScope';
import { isInspectFloatLayerElement } from './inspectFloatLayerScope';

const PREVIEW_SELECTOR = '.app-preview';
const BLOCK_EVENT_TYPES = ['click', 'mousedown', 'mouseup', 'dblclick'] as const;

let lastHoverTarget: Element | null = null;
let pointerRafId: number | null = null;
let pendingPointer: { x: number; y: number; eventTarget: EventTarget | null } | null = null;

function resolvePreview(): Element | null {
  return document.querySelector(PREVIEW_SELECTOR);
}

function isInspectOverlayTarget(target: Element): boolean {
  return (
    isShellDebugUiElement(target)
    || Boolean(target.closest('[data-app-client-float-host], [data-float-interactive]'))
  );
}


/** Dev 点选须拦截业务交互：preview 内 + teleport 浮层（eds-tooltip-v-* / Flotation / Popover）。 */
function shouldBlockDevInspectBusinessInteraction(target: Element, preview: Element): boolean {
  if (isInspectOverlayTarget(target)) return false;
  if (preview.contains(target)) return true;
  return isInspectFloatLayerElement(target);
}

function elementFromPreviewPoint(x: number, y: number, preview: Element): Element | null {
  const stack = document.elementsFromPoint(x, y);
  for (const node of stack) {
    if (!(node instanceof Element)) continue;
    if (isShellDebugUiElement(node) || node.closest('[data-app-client-float-host]')) {
      continue;
    }
    if (preview.contains(node) || isInspectFloatLayerElement(node)) return node;
  }
  return null;
}

function blockPreviewInteraction(event: Event) {
  if (!developerInspectActive.value) return;

  const preview = resolvePreview();
  if (!preview) return;

  const target = event.target;
  if (!(target instanceof Element)) return;
  if (!shouldBlockDevInspectBusinessInteraction(target, preview)) return;

  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
}

function blockPreviewKeyboard(event: KeyboardEvent) {
  if (!developerInspectActive.value) return;

  const preview = resolvePreview();
  if (!preview) return;

  const target = event.target;
  if (!(target instanceof Element)) return;
  if (!shouldBlockDevInspectBusinessInteraction(target, preview)) return;

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }
}

function syncPinnedRect() {
  const pinned = inspectPinnedInfo.value;
  if (!pinned) {
    inspectPinnedRect.value = null;
    return;
  }
  if (!pinned.element.isConnected) {
    // Teleport 浮层可能在业务关闭动画中短暂 unmount；保留 pin 快照供粉框与 Dev 面板。
    return;
  }
  inspectPinnedRect.value = pinned.element.getBoundingClientRect();
}

function syncHoverRect() {
  const hover = inspectHoverInfo.value;
  if (!hover) {
    inspectHoverRect.value = null;
    return;
  }
  if (!hover.element.isConnected) {
    inspectHoverInfo.value = null;
    inspectHoverRect.value = null;
    lastHoverTarget = null;
    return;
  }
  inspectHoverRect.value = hover.element.getBoundingClientRect();
}

function syncMeasureRect() {
  const measure = inspectMeasureElement.value;
  if (!measure) {
    inspectMeasureRect.value = null;
    return;
  }
  if (!measure.isConnected) {
    inspectMeasureElement.value = null;
    inspectMeasureRect.value = null;
    return;
  }
  inspectMeasureRect.value = measure.getBoundingClientRect();
}

function clearHoverSelection() {
  lastHoverTarget = null;
  inspectHoverInfo.value = null;
  inspectHoverRect.value = null;
  inspectMeasureElement.value = null;
  inspectMeasureRect.value = null;
}

function updateHoverTarget(target: Element | null, preview: Element) {
  if (!target) {
    clearHoverSelection();
    return;
  }

  const pinned = inspectPinnedInfo.value;
  if (pinned?.element === target) {
    clearHoverSelection();
    return;
  }

  if (target === lastHoverTarget && inspectHoverInfo.value) {
    inspectHoverRect.value = target.getBoundingClientRect();
    if (pinned) {
      inspectMeasureElement.value = target;
      inspectMeasureRect.value = target.getBoundingClientRect();
    }
    return;
  }

  lastHoverTarget = target;
  const info = buildElementInspectHoverPreview(target, preview);
  if (!info) {
    clearHoverSelection();
    return;
  }

  inspectHoverInfo.value = info;
  inspectHoverRect.value = target.getBoundingClientRect();

  if (pinned) {
    inspectMeasureElement.value = target;
    inspectMeasureRect.value = target.getBoundingClientRect();
    return;
  }

  inspectMeasureElement.value = null;
  inspectMeasureRect.value = null;
}

function processPointerMove(x: number, y: number, eventTarget: EventTarget | null) {
  if (eventTarget instanceof Element && isShellDebugUiElement(eventTarget)) {
    clearHoverSelection();
    return;
  }

  const preview = resolvePreview();
  if (!preview) return;

  const target = elementFromPreviewPoint(x, y, preview);
  updateHoverTarget(target, preview);
}

function onPointerMove(event: PointerEvent) {
  if (!developerInspectActive.value) return;

  pendingPointer = {
    x: event.clientX,
    y: event.clientY,
    eventTarget: event.target,
  };
  if (pointerRafId !== null) return;

  pointerRafId = requestAnimationFrame(() => {
    pointerRafId = null;
    const pending = pendingPointer;
    pendingPointer = null;
    if (!pending || !developerInspectActive.value) return;
    processPointerMove(pending.x, pending.y, pending.eventTarget);
  });
}

function cancelPointerRaf() {
  if (pointerRafId === null) return;
  cancelAnimationFrame(pointerRafId);
  pointerRafId = null;
  pendingPointer = null;
}

function isShellDebugUiPointerEvent(event: PointerEvent): boolean {
  if (event.target instanceof Element && isShellDebugUiElement(event.target)) {
    return true;
  }
  if ('composedPath' in event) {
    for (const node of event.composedPath()) {
      if (node instanceof Element && isShellDebugUiElement(node)) {
        return true;
      }
    }
  }
  return false;
}

function onPointerDown(event: PointerEvent) {
  if (!developerInspectActive.value) return;

  const preview = resolvePreview();
  if (!preview) return;

  const target = elementFromPreviewPoint(event.clientX, event.clientY, preview);

  if (isShellDebugUiPointerEvent(event)) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    markShellDebugUiInteraction();
    return;
  }

  if (!target) {
    if (inspectPinnedInfo.value) {
      clearInspectSelection();
    }
    return;
  }

  if (isShellDebugUiElement(target)) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();

  if (isInspectFloatLayerElement(target)) {
    markShellDebugUiInteraction(400);
  } else {
    markShellDebugUiInteraction(120);
  }

  const info = buildElementInspectInfo(target, preview, { includeAdaptive: true });
  if (!info) {
    clearInspectSelection();
    return;
  }

  inspectPinnedInfo.value = info;
  inspectPinnedRect.value = target.getBoundingClientRect();
  clearHoverSelection();
}

function onScrollOrResize() {
  if (!developerInspectActive.value) return;
  syncPinnedRect();
  syncHoverRect();
  syncMeasureRect();
}

export function useDeveloperInspectPicker() {
  onMounted(() => {
    for (const type of BLOCK_EVENT_TYPES) {
      window.addEventListener(type, blockPreviewInteraction, true);
    }
    window.addEventListener('keydown', blockPreviewKeyboard, true);
    // 须用原生 addEventListener：installShellDebugFloatLayerGuard 会跳过浮层上的 wrapped capture pointerdown。
    nativeWindowAddEventListener('pointerdown', onPointerDown, true);
    window.addEventListener('pointermove', onPointerMove, true);
    nativeWindowAddEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize, true);
  });

  onBeforeUnmount(() => {
    cancelPointerRaf();
    for (const type of BLOCK_EVENT_TYPES) {
      window.removeEventListener(type, blockPreviewInteraction, true);
    }
    window.removeEventListener('keydown', blockPreviewKeyboard, true);
    nativeWindowRemoveEventListener('pointerdown', onPointerDown, true);
    window.removeEventListener('pointermove', onPointerMove, true);
    nativeWindowRemoveEventListener('scroll', onScrollOrResize, true);
    window.removeEventListener('resize', onScrollOrResize, true);
  });

  watch(developerInspectActive, (active) => {
    if (active) return;
    cancelPointerRaf();
    lastHoverTarget = null;
    clearInspectSelection();
  });
}

/** @deprecated Use buildElementInspectInfo + developerInspectSession. */
export type PickedElementInfo = never;

/** @deprecated Use useDeveloperInspectPicker. */
export function useElementPicker() {
  throw new Error('useElementPicker is deprecated. Use useDeveloperInspectPicker.');
}
