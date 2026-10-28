import { isInspectFloatLayerElement } from './inspectFloatLayerScope';
import { isShellDebugUiElement } from '../shellDebugUiScope';

function shouldSkipPickNode(node: Element): boolean {
  if (isShellDebugUiElement(node)) return true;
  if (node.closest('[data-app-client-float-host]')) return true;
  return false;
}

function isInspectableTarget(node: Element, preview: Element): boolean {
  if (shouldSkipPickNode(node)) return false;
  return preview.contains(node) || isInspectFloatLayerElement(node);
}

/**
 * Dev 点选 hit-test：elementsFromPoint 优先；teleport 浮层栈异常时用 composedPath 回退。
 */
export function pickInspectableElementFromPointer(
  event: PointerEvent,
  preview: Element,
): Element | null {
  const fromPoint = pickInspectableElementFromPoint(event.clientX, event.clientY, preview);
  if (fromPoint) return fromPoint;

  if (!('composedPath' in event)) return null;

  for (const node of event.composedPath()) {
    if (!(node instanceof Element)) continue;
    if (isInspectableTarget(node, preview)) return node;
  }

  return null;
}

export function pickInspectableElementFromPoint(
  clientX: number,
  clientY: number,
  preview: Element,
): Element | null {
  const stack = document.elementsFromPoint(clientX, clientY);
  for (const node of stack) {
    if (!(node instanceof Element)) continue;
    if (!isInspectableTarget(node, preview)) continue;
    return node;
  }
  return null;
}
