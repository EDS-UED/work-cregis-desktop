import { buildElementInspectInfo } from './buildElementInspectInfo';
import {
  inspectHoverInfo,
  inspectHoverRect,
  inspectMeasureElement,
  inspectMeasureRect,
  inspectPinnedInfo,
  inspectPinnedRect,
} from './developerInspectSession';
import { markShellDebugUiInteraction } from '../shellDebugFloatInteraction';
import { isShellDebugUiElement } from '../shellDebugUiScope';
import { isInspectFloatLayerElement } from './inspectFloatLayerScope';
import { pickInspectableElementFromPoint, pickInspectableElementFromPointer } from './inspectPickTarget';

const PREVIEW_SELECTOR = '.app-preview';

function resolvePreview(): Element | null {
  return document.querySelector(PREVIEW_SELECTOR);
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

/** 同一手势 pointerdown 已 Pin 时，click 不再重复处理。 */
let pinCommittedForLastPointerDown = false;

export function resetDevInspectPinGestureFlag(): void {
  pinCommittedForLastPointerDown = false;
}

export function markDevInspectPinGestureCommitted(): void {
  pinCommittedForLastPointerDown = true;
}

export function isDevInspectPinGestureCommitted(): boolean {
  return pinCommittedForLastPointerDown;
}

export function tryCommitDevInspectPin(event: PointerEvent | MouseEvent): boolean {
  const preview = resolvePreview();
  if (!preview) return false;

  const target =
    event instanceof PointerEvent
      ? pickInspectableElementFromPointer(event, preview)
      : pickInspectableElementFromPoint(event.clientX, event.clientY, preview);

  if (!target) {
    if (isShellDebugUiEvent(event)) {
      markShellDebugUiInteraction();
    }
    return false;
  }

  if (isShellDebugUiElement(target)) {
    markShellDebugUiInteraction();
    return false;
  }

  const info = buildElementInspectInfo(target, preview, { includeAdaptive: true });
  if (!info) {
    return false;
  }

  inspectPinnedInfo.value = info;
  inspectPinnedRect.value = target.getBoundingClientRect();
  inspectHoverInfo.value = null;
  inspectHoverRect.value = null;
  inspectMeasureElement.value = null;
  inspectMeasureRect.value = null;

  if (isInspectFloatLayerElement(target)) {
    markShellDebugUiInteraction(400);
  } else {
    markShellDebugUiInteraction(120);
  }

  markDevInspectPinGestureCommitted();
  return true;
}
