import { onBeforeUnmount, onMounted, watch } from 'vue';
import { buildElementInspectHoverPreview } from './buildElementInspectInfo';
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
  nativeDocumentAddEventListener,
  nativeDocumentRemoveEventListener,
  nativeWindowAddEventListener,
  nativeWindowRemoveEventListener,
} from '../installShellDebugFloatLayerGuard';
import { isShellDebugUiElement } from '../shellDebugUiScope';
import { isInspectFloatLayerElement } from './inspectFloatLayerScope';
import { pickInspectableElementFromPoint, pickInspectableElementFromPointer } from './inspectPickTarget';

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


/**
 * Dev 点选须吞掉业务 click / 菜单跳转等。
 * 须用 native document capture：float guard 包装的 window listener 在 shellDebug pending 时会跳过拦截。
 */
function shouldDevInspectSwallowBusinessEvent(event: Event): boolean {
  if (!developerInspectActive.value) return false;

  if (isShellDebugUiEvent(event)) {
    return false;
  }

  const preview = resolvePreview();
  if (!preview) return false;

  if (event instanceof PointerEvent) {
    const picked = pickInspectableElementFromPointer(event, preview);
    if (picked) {
      return !isShellDebugUiElement(picked);
    }
  } else if (event instanceof MouseEvent) {
    const picked = pickInspectableElementFromPoint(event.clientX, event.clientY, preview);
    if (picked) {
      return !isShellDebugUiElement(picked);
    }
  }

  const target = event.target;
  if (!(target instanceof Element)) return false;
  return shouldBlockDevInspectBusinessInteraction(target, preview);
}

function swallowDevInspectBusinessEvent(event: Event) {
  if (!shouldDevInspectSwallowBusinessEvent(event)) return;
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
}

function blockPreviewKeyboard(event: KeyboardEvent) {
  if (!developerInspectActive.value) return;
  if (isShellDebugUiEvent(event)) return;

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

  const target = pickInspectableElementFromPoint(x, y, preview);
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

function isShellDebugUiEvent(event: Event): boolean {
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

function onScrollOrResize() {
  if (!developerInspectActive.value) return;
  syncPinnedRect();
  syncHoverRect();
  syncMeasureRect();
}

export function useDeveloperInspectPicker() {
  onMounted(() => {
    for (const type of BLOCK_EVENT_TYPES) {
      nativeDocumentAddEventListener(type, swallowDevInspectBusinessEvent, true);
    }
    nativeDocumentAddEventListener('keydown', blockPreviewKeyboard, true);
    nativeWindowAddEventListener('pointermove', onPointerMove, true);
    nativeWindowAddEventListener('scroll', onScrollOrResize, true);
    nativeWindowAddEventListener('resize', onScrollOrResize, true);
  });

  onBeforeUnmount(() => {
    cancelPointerRaf();
    for (const type of BLOCK_EVENT_TYPES) {
      nativeDocumentRemoveEventListener(type, swallowDevInspectBusinessEvent, true);
    }
    nativeDocumentRemoveEventListener('keydown', blockPreviewKeyboard, true);
    nativeWindowRemoveEventListener('pointermove', onPointerMove, true);
    nativeWindowRemoveEventListener('scroll', onScrollOrResize, true);
    nativeWindowRemoveEventListener('resize', onScrollOrResize, true);
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
