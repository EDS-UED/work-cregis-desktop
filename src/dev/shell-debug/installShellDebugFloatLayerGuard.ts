import {
  isShellDebugUiInteractionPending,
  markShellDebugUiInteraction,
} from './shellDebugFloatInteraction';
import { developerInspectActive } from './inspect/developerInspectSession';
import {
  installDevInspectDocumentPointerCapture,
  installDevInspectPointerCapture,
} from './inspect/devInspectPointerCapture';
import { isInspectFloatLayerElement } from './inspect/inspectFloatLayerScope';
import { isHoverAnchoredTooltipInteractionTarget } from '@/utils/anchoredTooltipLayerScope';
import { isShellDebugUiElement } from './shellDebugUiScope';

let installed = false;

/** Guard 包装前保留原生 API — Dev Inspect picker 须绕过 wrapper，否则浮层点选永不触发 pin。 */
export const nativeDocumentAddEventListener = document.addEventListener.bind(document);
export const nativeDocumentRemoveEventListener = document.removeEventListener.bind(document);
export const nativeWindowAddEventListener = window.addEventListener.bind(window);
export const nativeWindowRemoveEventListener = window.removeEventListener.bind(window);

const SHELL_DEBUG_POINTER_SHIELD_MS = 800;
const INSPECT_FLOAT_POINTER_SHIELD_MS = 600;

function isCapture(options?: boolean | AddEventListenerOptions): boolean {
  if (options === true) return true;
  if (options && typeof options === 'object') return Boolean(options.capture);
  return false;
}

function nodeInShellDebugUi(node: EventTarget | null): boolean {
  return node instanceof Element && isShellDebugUiElement(node);
}

export function isShellDebugFloatInteraction(event: Event): boolean {
  if (nodeInShellDebugUi(event.target)) return true;

  if ('composedPath' in event) {
    for (const node of event.composedPath()) {
      if (nodeInShellDebugUi(node)) return true;
    }
  }

  return false;
}

const APP_PREVIEW_SELECTOR = '.app-preview';

function resolveAppPreview(): Element | null {
  return document.querySelector(APP_PREVIEW_SELECTOR);
}

function shouldShieldDocumentPointerFromAnchoredDismiss(event: Event): boolean {
  if (isShellDebugFloatInteraction(event)) {
    return true;
  }
  /*
   * Dev 点选：任意 document pointer 不得走 AnchoredTooltip outside-dismiss。
   * 否则点击批处理 / 地址 Menu / 其它 teleport 浮层会把 Dev 参数面板（click EgTooltip）关掉。
   */
  if (developerInspectActive.value) {
    return true;
  }
  return false;
}

/**
 * Dev picker 的 native pointerdown 与 early shield 同处 document capture；
 * 须让点选事件继续传播，否则浮层内 pin 永不触发。
 */
function shouldDeferStopImmediateForDevPicker(event: Event): boolean {
  if (!developerInspectActive.value || !(event instanceof PointerEvent)) {
    return false;
  }
  if (isShellDebugFloatInteraction(event)) {
    return true;
  }
  const target = event.target;
  if (!(target instanceof Element)) {
    return false;
  }
  if (isInspectFloatLayerElement(target)) {
    return true;
  }
  const preview = resolveAppPreview();
  return Boolean(preview?.contains(target));
}

function onEarlyDocumentPointerCapture(event: Event) {
  if (!(event instanceof PointerEvent)) return;
  if (!shouldShieldDocumentPointerFromAnchoredDismiss(event)) return;

  if (isShellDebugFloatInteraction(event)) {
    markShellDebugUiInteraction(SHELL_DEBUG_POINTER_SHIELD_MS);
  } else {
    markShellDebugUiInteraction(INSPECT_FLOAT_POINTER_SHIELD_MS);
  }

  if (shouldDeferStopImmediateForDevPicker(event)) {
    return;
  }

  /*
   * Dev 点选期间 wrapped outside-dismiss 已由 shouldSkipAnchoredOutsideDismiss 短路；
   * 此处不得 stopImmediate，否则 Dev picker 若注册在 early shield 之后会永远 Pin 不上。
   */
  if (developerInspectActive.value) {
    return;
  }

  /*
   * AnchoredTooltip 在 document capture 上挂 outside-dismiss；须在 Dev picker 之后、
   * 其它 capture listener 之前 stopImmediatePropagation。
   */
  event.stopImmediatePropagation();
}

function shouldSkipAnchoredOutsideDismiss(event: Event): boolean {
  if (developerInspectActive.value) {
    return true;
  }
  if (shouldShieldDocumentPointerFromAnchoredDismiss(event)) {
    return true;
  }
  if (isShellDebugUiInteractionPending()) {
    return true;
  }
  if (event.target instanceof Node && isHoverAnchoredTooltipInteractionTarget(event.target)) {
    return true;
  }
  return false;
}

type EventTargetLike = {
  addEventListener: typeof document.addEventListener;
  removeEventListener: typeof document.removeEventListener;
};

function patchCaptureListenerTarget(target: EventTargetLike): void {
  const rawAdd = target.addEventListener.bind(target);
  const rawRemove = target.removeEventListener.bind(target);
  const wrappedListeners = new WeakMap<EventListener, EventListener>();

  target.addEventListener = function shellDebugGuardedAddEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ) {
    if (!isCapture(options) || typeof listener !== 'function') {
      return rawAdd(type, listener, options);
    }

    if (type === 'pointerdown' || type === 'mousedown' || type === 'click') {
      const wrapped: EventListener = (event) => {
        if (shouldSkipAnchoredOutsideDismiss(event)) {
          return;
        }
        listener.call(target, event);
      };

      wrappedListeners.set(listener, wrapped);
      return rawAdd(type, wrapped, options);
    }

    if (type === 'scroll') {
      const wrapped: EventListener = (event) => {
        if (shouldSkipAnchoredOutsideDismiss(event)) return;
        listener.call(target, event);
      };

      wrappedListeners.set(listener, wrapped);
      return rawAdd(type, wrapped, options);
    }

    return rawAdd(type, listener, options);
  };

  target.removeEventListener = function shellDebugGuardedRemoveEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ) {
    if (
      (type === 'pointerdown' || type === 'mousedown' || type === 'click' || type === 'scroll')
      && typeof listener === 'function'
    ) {
      const wrapped = wrappedListeners.get(listener);
      if (wrapped) {
        wrappedListeners.delete(listener);
        return rawRemove(type, wrapped, options);
      }
    }

    return rawRemove(type, listener, options);
  };
}

/**
 * Dev 壳层与业务 click Popover 并存：点击 Dev / QA / Model 启动器或壳层 Popover 时，
 * 不应触发 AnchoredTooltip 的 document/window capture pointerdown / scroll 外部关闭。
 *
 * main.ts 最前同步安装（VITE_SHELL_DEBUG !== 'false'，含 Pages preview）；包装 document/window capture pointerdown 与 scroll。
 */
export function installShellDebugFloatLayerGuard(): void {
  if (installed || typeof document === 'undefined') return;
  installed = true;

  installDevInspectPointerCapture();
  nativeDocumentAddEventListener('pointerdown', onEarlyDocumentPointerCapture, true);
  installDevInspectDocumentPointerCapture();

  patchCaptureListenerTarget(document);
  patchCaptureListenerTarget(window);
}

export { markShellDebugUiInteraction };
