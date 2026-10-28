import { markShellDebugUiInteraction } from '../shellDebugFloatInteraction';
import { isShellDebugUiElement } from '../shellDebugUiScope';
import { developerInspectActive } from './developerInspectSession';
import {
  isDevInspectPinGestureCommitted,
  resetDevInspectPinGestureFlag,
  tryCommitDevInspectPin,
} from './devInspectPinHandler';

function isShellDebugUiPointerEvent(event: PointerEvent | MouseEvent): boolean {
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
const nativeWindowAddEventListener = window.addEventListener.bind(window);
const nativeWindowRemoveEventListener = window.removeEventListener.bind(window);

let pointerCaptureInstalled = false;
let documentPointerCaptureInstalled = false;
let clickCaptureInstalled = false;

const handledPinPointerEvents = new WeakSet<Event>();

export function onDevInspectPointerDownCapture(event: PointerEvent) {
  if (handledPinPointerEvents.has(event)) return;
  if (!developerInspectActive.value) return;

  if (isShellDebugUiPointerEvent(event)) {
    markShellDebugUiInteraction();
    return;
  }

  resetDevInspectPinGestureFlag();

  if (!tryCommitDevInspectPin(event)) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
  handledPinPointerEvents.add(event);
}

function onDevInspectClickCapture(event: MouseEvent) {
  if (!developerInspectActive.value) return;

  if (isShellDebugUiPointerEvent(event)) {
    markShellDebugUiInteraction();
    return;
  }

  if (isDevInspectPinGestureCommitted()) return;

  if (!tryCommitDevInspectPin(event)) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
}

/**
 * window capture + 在 installShellDebugFloatLayerGuard 内最先注册：
 * 须早于 document 上 early shield / AnchoredTooltip outside-dismiss，避免 stopImmediate 吃掉 Pin。
 */
export function installDevInspectPointerCapture(): void {
  if (pointerCaptureInstalled || typeof window === 'undefined') return;
  pointerCaptureInstalled = true;
  nativeWindowAddEventListener('pointerdown', onDevInspectPointerDownCapture, true);
}

/** document capture：须在 early shield 之后注册，作 window 被 stopPropagation 时的回退。 */
export function installDevInspectDocumentPointerCapture(): void {
  if (documentPointerCaptureInstalled || typeof document === 'undefined') return;
  documentPointerCaptureInstalled = true;
  const nativeDocumentAddEventListener = document.addEventListener.bind(document);
  nativeDocumentAddEventListener('pointerdown', onDevInspectPointerDownCapture, true);

  if (!clickCaptureInstalled) {
    clickCaptureInstalled = true;
    nativeDocumentAddEventListener('click', onDevInspectClickCapture, true);
  }
}

export function uninstallDevInspectPointerCapture(): void {
  if (!pointerCaptureInstalled) return;
  pointerCaptureInstalled = false;
  nativeWindowRemoveEventListener('pointerdown', onDevInspectPointerDownCapture, true);
}
