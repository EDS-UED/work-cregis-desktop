import { isShellDebugUiElement, SHELL_DEBUG_UI_ROOT_SELECTOR } from '../shellDebugUiScope';

export type LayoutMapPinningLayer = {
  element: Element;
  rect: DOMRect;
  zIndex: number;
};

type PinningLayerScope = {
  preview: Element;
  root: Element;
};

const MIN_PINNING_LAYER_W = 16;
const MIN_PINNING_LAYER_H = 8;

function intersectDomRects(
  a: DOMRect,
  b: DOMRect,
  minWidth: number,
  minHeight: number,
): DOMRect | null {
  const left = Math.max(a.left, b.left);
  const top = Math.max(a.top, b.top);
  const right = Math.min(a.right, b.right);
  const bottom = Math.min(a.bottom, b.bottom);
  const width = right - left;
  const height = bottom - top;
  if (width < minWidth || height < minHeight) return null;
  return new DOMRect(left, top, width, height);
}

function parseCssPx(value: string): number {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function isExcludedPinningElement(element: Element, scope: PinningLayerScope): boolean {
  if (!scope.root.contains(element) && element !== scope.root) return true;
  if (element.closest(SHELL_DEBUG_UI_ROOT_SELECTOR)) return true;
  return false;
}

function isLayoutMapVisibleBox(element: Element): boolean {
  if (!(element instanceof HTMLElement)) return false;
  if (element.hidden) return false;
  if (element.getAttribute('aria-hidden') === 'true') return false;

  const style = getComputedStyle(element);
  if (style.display === 'none' || style.display === 'contents') return false;
  if (style.visibility === 'hidden' || style.visibility === 'collapse') return false;
  if (Number.parseFloat(style.opacity) === 0) return false;

  return true;
}

function resolveStackZIndex(element: Element): number {
  let maxZ = 0;
  let node: Element | null = element;
  while (node) {
    const style = getComputedStyle(node);
    const z = Number.parseInt(style.zIndex, 10);
    if (!Number.isNaN(z)) maxZ = Math.max(maxZ, z);
    node = node.parentElement;
  }
  return maxZ;
}

/** EgLayout toolbarOverlay / paginerOverlay：absolute 贴顶或贴底的全宽 chrome。 */
function isLayoutChromeOverlayHost(element: HTMLElement): boolean {
  const layoutRoot = element.closest('.eds-layout');
  if (!(layoutRoot instanceof HTMLElement)) return false;
  if (!layoutRoot.classList.contains('eds-layout-chrome-overlay')) return false;

  const style = getComputedStyle(element);
  if (style.position !== 'absolute') return false;

  const zIndex = Number.parseInt(style.zIndex, 10);
  if (Number.isNaN(zIndex) || zIndex < 1) return false;

  const top = parseCssPx(style.top);
  const bottom = parseCssPx(style.bottom);
  const left = parseCssPx(style.left);
  const right = parseCssPx(style.right);

  if (top <= 1 && left <= 1 && right <= 1) return true;
  if (bottom <= 1 && left <= 1 && right <= 1) return true;
  return false;
}

function clipPinningLayerRect(rect: DOMRect, scope: PinningLayerScope): DOMRect | null {
  return intersectDomRects(
    rect,
    scope.preview.getBoundingClientRect(),
    MIN_PINNING_LAYER_W,
    MIN_PINNING_LAYER_H,
  );
}

/** 业务全局浮标：仅交互区遮罩，勿用 inset:0 的 host 整页遮罩。 */
function isClientFloatPinningHost(element: HTMLElement): boolean {
  return element.hasAttribute('data-float-interactive');
}

/** DataList BatchBar 悬浮条（absolute + 高 z-index）。 */
function isDataListOperationBarHost(element: HTMLElement): boolean {
  if (!element.closest('.eds-data-list')) return false;
  if (!element.querySelector('.eds-batch-bar')) return false;
  const style = getComputedStyle(element);
  if (style.position !== 'absolute') return false;
  const zIndex = Number.parseInt(style.zIndex, 10);
  return !Number.isNaN(zIndex) && zIndex >= 20;
}

function isLayoutMapPinningHost(element: HTMLElement): boolean {
  if (element.hasAttribute('data-app-client-float-host')) return false;
  if (isClientFloatPinningHost(element)) return true;
  if (isDataListOperationBarHost(element)) return true;

  const style = getComputedStyle(element);
  if (style.position === 'fixed' || style.position === 'sticky') return true;
  return isLayoutChromeOverlayHost(element);
}

function resolvePinningLayerRect(
  element: HTMLElement,
  scope: PinningLayerScope,
): DOMRect | null {
  return clipPinningLayerRect(element.getBoundingClientRect(), scope);
}

/** Popup / 浮层内容壳遮罩 sibling 列表页结构图（overlay 判定失败时的兜底）。 */
export function collectLayoutMapPopupOcclusionLayers(
  preview: Element,
  occlusionRoot: Element | null,
): LayoutMapPinningLayer[] {
  if (!(occlusionRoot instanceof HTMLElement)) return [];
  if (!isLayoutMapVisibleBox(occlusionRoot)) return [];

  const clipped = clipPinningLayerRect(
    occlusionRoot.getBoundingClientRect(),
    { preview, root: preview },
  );
  if (!clipped) return [];

  return [{
    element: occlusionRoot,
    rect: clipped,
    zIndex: resolveStackZIndex(occlusionRoot),
  }];
}

/** 采集 fixed / sticky / Layout chrome 等钉住层，用于遮罩其下方的结构图。 */
export function collectLayoutMapPinningLayers(scope: PinningLayerScope): LayoutMapPinningLayer[] {
  const layers: LayoutMapPinningLayer[] = [];

  const walk = (element: Element): void => {
    if (isExcludedPinningElement(element, scope)) return;

    if (element instanceof HTMLElement && isLayoutMapVisibleBox(element) && isLayoutMapPinningHost(element)) {
      const clipped = resolvePinningLayerRect(element, scope);
      if (clipped) {
        layers.push({
          element,
          rect: clipped,
          zIndex: resolveStackZIndex(element),
        });
      }
    }

    for (const child of element.children) {
      walk(child);
    }
  };

  walk(scope.root);
  return layers.sort((left, right) => left.zIndex - right.zIndex);
}

function layoutMapItemIntersectsPinningLayer(
  item: { x: number; y: number; width: number; height: number },
  layerRect: DOMRect,
): boolean {
  return intersectDomRects(
    new DOMRect(item.x, item.y, item.width, item.height),
    layerRect,
    1,
    1,
  ) !== null;
}

/** 结构图条带/线框与钉住层相交、且不属于该层子树 → 不绘制（避免下层布局穿透 fixed 顶栏 / 分页 / 浮标）。 */
export function isLayoutMapItemOccludedByPinningLayer(
  source: Element,
  item: { x: number; y: number; width: number; height: number },
  layers: LayoutMapPinningLayer[],
): boolean {
  if (layers.length === 0) return false;

  for (const layer of layers) {
    if (layer.element.contains(source)) continue;
    if (layoutMapItemIntersectsPinningLayer(item, layer.rect)) return true;
  }

  return false;
}
