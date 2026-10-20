import { isClientPopupActive } from '@/scenes/tasks/shared/clientPopupActive';
import { isShellDebugUiElement, SHELL_DEBUG_UI_ROOT_SELECTOR } from '../shellDebugUiScope';
import { isLayoutMapBorderOnlyComponentRoot } from './layoutMapBorderOnlyComponents';
import {
  collectLayoutMapPinningLayers,
  collectLayoutMapPopupOcclusionLayers,
  isLayoutMapItemOccludedByPinningLayer,
  type LayoutMapPinningLayer,
} from './layoutMapPinningLayers';

/** Dev 布局结构图：layout 宿主 + 子格 + padding / margin / gap 分色。 */
export type InspectLayoutMapItem = {
  x: number;
  y: number;
  width: number;
  height: number;
  role: 'frame' | 'cell' | 'padding' | 'margin' | 'gap';
};

type LayoutMapScope = {
  preview: Element;
  /** 采集子树根：无叠层时为 preview，有叠层时为最上层 popover / tooltip / popup。 */
  root: Element;
  /** fixed / sticky / Layout chrome 钉住层；其下方（非子树）结构图不绘制。 */
  pinningLayers: LayoutMapPinningLayer[];
};

const MIN_FRAME_CLIP_W = 20;
const MIN_FRAME_CLIP_H = 14;
const MIN_CELL_CLIP_W = 8;
const MIN_CELL_CLIP_H = 8;
/** spacing 条带可薄至 1px（--spacing-05 等）；勿用 4px 门槛误裁。 */
const MIN_SPACING_CLIP_W = 1;
const MIN_SPACING_CLIP_H = 1;
const MIN_HOST_W = 28;
const MIN_HOST_H = 20;
const MAX_LAYOUT_MAP_LINE_ITEMS = 700;
const MIN_OVERLAY_LAYER_W = 16;
const MIN_OVERLAY_LAYER_H = 16;
const MIN_POPUP_PANEL_W = 160;
const MIN_POPUP_PANEL_H = 120;
/** Popover / Flotation / Menu 相对 Popup / 未展开 tooltip 宿主的全局置顶门槛。 */
const HIGH_RANK_OVERLAY_LAYER_RANK = 30;

const OVERFLOW_CLIP_VALUES = new Set(['hidden', 'auto', 'scroll', 'clip']);

const OVERLAY_LAYER_SELECTORS = [
  '.eds-popup',
  '[id^="eds-tooltip-"]',
  '.effect-flotation-box',
  '.eds-flotation-menu',
  '.eds-popover',
] as const;

/** 叠层类型优先级：Popover > Flotation Box > Menu > Tooltip 宿主 > Popup。 */
function resolveOverlayLayerTypeRank(element: Element): number {
  if (element.classList.contains('eds-popover')) return 40;
  if (element.classList.contains('effect-flotation-box')) return 35;
  if (element.classList.contains('eds-flotation-menu')) return 30;
  if (element.id.startsWith('eds-tooltip-')) return 20;
  if (element.classList.contains('eds-popup')) return 10;
  return 0;
}

function elementOverlapsPreview(preview: Element, element: Element): boolean {
  return intersectDomRects(
    element.getBoundingClientRect(),
    preview.getBoundingClientRect(),
    1,
    1,
  ) !== null;
}

function resolveLayoutMapOverlayCollectionRoot(element: Element): Element {
  if (
    element.classList.contains('eds-popover')
    || element.classList.contains('eds-flotation-menu')
    || element.classList.contains('effect-flotation-box')
  ) {
    return element;
  }

  if (element.id.startsWith('eds-tooltip-')) {
    for (const selector of [
      ':scope > div .eds-popover',
      ':scope .eds-popover',
      ':scope .eds-flotation-menu',
      ':scope .effect-flotation-box',
    ]) {
      const nested = element.querySelector(selector);
      if (nested instanceof HTMLElement) {
        if (nested.classList.contains('eds-popover') && isPresentingPopoverOverlayLayer(nested)) {
          return nested;
        }
        if (isVisibleOverlayLayerCandidate(nested)) {
          return nested;
        }
      }
    }
  }

  return element;
}

const SKIP_LAYOUT_HOST_TAGS = new Set(['SCRIPT', 'STYLE', 'LINK', 'META', 'NOSCRIPT', 'SVG']);

function isExcludedLayoutMapElement(element: Element, scope: LayoutMapScope): boolean {
  if (element === scope.preview && scope.root === scope.preview) return true;
  if (!scope.root.contains(element) && element !== scope.root) return true;
  if (element.closest(SHELL_DEBUG_UI_ROOT_SELECTOR)) return true;
  return false;
}

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

function hasEdsRootClass(element: Element): boolean {
  for (const className of element.classList) {
    if (className.startsWith('eds-')) return true;
  }
  return false;
}

function layoutMapSpacingThickness(value: string): number {
  return parseCssPx(value);
}

function layoutMapHasNonZeroPadding(style: CSSStyleDeclaration): boolean {
  return (
    layoutMapSpacingThickness(style.paddingTop) > 0.5
    || layoutMapSpacingThickness(style.paddingRight) > 0.5
    || layoutMapSpacingThickness(style.paddingBottom) > 0.5
    || layoutMapSpacingThickness(style.paddingLeft) > 0.5
  );
}

function layoutMapHasNonZeroMargin(style: CSSStyleDeclaration): boolean {
  return (
    layoutMapSpacingThickness(style.marginTop) > 0.5
    || layoutMapSpacingThickness(style.marginRight) > 0.5
    || layoutMapSpacingThickness(style.marginBottom) > 0.5
    || layoutMapSpacingThickness(style.marginLeft) > 0.5
  );
}

function layoutMapMaxPadding(style: CSSStyleDeclaration): number {
  return Math.max(
    layoutMapSpacingThickness(style.paddingTop),
    layoutMapSpacingThickness(style.paddingRight),
    layoutMapSpacingThickness(style.paddingBottom),
    layoutMapSpacingThickness(style.paddingLeft),
  );
}

/** Popover contentSlot 等 block 壳：有实质 padding、且不与 layout 宿主重复采集。 */
function isLayoutMapPaddingContentShell(element: HTMLElement): boolean {
  const style = getComputedStyle(element);
  if (!layoutMapHasNonZeroPadding(style)) return false;
  if (layoutMapMaxPadding(style) < 4) return false;

  const parent = element.parentElement;
  if (parent instanceof HTMLElement && isLayoutHost(parent)) {
    const parentStyle = getComputedStyle(parent);
    if (layoutMapHasNonZeroPadding(parentStyle)) return false;
  }

  return true;
}

/** 仅 layout 宿主、EDS 根、或独立 content 壳采集 spacing，避免每层 wrapper 叠绿条。 */
function shouldCollectLayoutMapPaddingAndMargin(element: HTMLElement): boolean {
  if (isLayoutHost(element)) return true;

  const style = getComputedStyle(element);
  const hasPadding = layoutMapHasNonZeroPadding(style);
  const hasMargin = layoutMapHasNonZeroMargin(style);
  if (!hasPadding && !hasMargin) return false;

  if (hasEdsRootClass(element)) return true;
  if (hasPadding && isLayoutMapPaddingContentShell(element)) return true;

  return false;
}

function isLayoutMapVisibleBox(element: Element): boolean {
  if (element instanceof HTMLElement) {
    if (element.hidden) return false;
    if (element.getAttribute('aria-hidden') === 'true') return false;
  }

  if (!(element instanceof HTMLElement || element instanceof SVGElement)) {
    return false;
  }

  if (element instanceof HTMLElement && SKIP_LAYOUT_HOST_TAGS.has(element.tagName)) {
    return false;
  }

  const style = getComputedStyle(element);
  if (style.display === 'none' || style.display === 'contents') return false;
  if (style.visibility === 'hidden' || style.visibility === 'collapse') return false;
  if (Number.parseFloat(style.opacity) === 0) return false;

  return true;
}

function isLayoutContainerDisplay(display: string): boolean {
  return display === 'flex'
    || display === 'inline-flex'
    || display === 'grid'
    || display === 'inline-grid'
    || display === 'table'
    || display === 'table-row-group'
    || display === 'table-row';
}

function isLayoutHost(element: Element): boolean {
  if (!(element instanceof HTMLElement)) return false;
  if (hasEdsRootClass(element)) return true;

  const style = getComputedStyle(element);
  if (!isLayoutContainerDisplay(style.display)) return false;

  const rect = element.getBoundingClientRect();
  return rect.width >= MIN_HOST_W && rect.height >= MIN_HOST_H;
}

/** 采集 gap 时放宽尺寸门槛，避免小 flex 行（如 progress stepTrack）漏 gap。 */
function isLayoutGapHost(element: HTMLElement): boolean {
  if (hasEdsRootClass(element)) return true;

  const style = getComputedStyle(element);
  if (!isLayoutContainerDisplay(style.display)) return false;

  const rect = element.getBoundingClientRect();
  return rect.width >= MIN_CELL_CLIP_W && rect.height >= MIN_CELL_CLIP_H;
}

function isDirectChildOfLayoutHost(element: Element): boolean {
  const parent = element.parentElement;
  return parent != null && isLayoutHost(parent);
}

function layoutHostHasVisibleBackground(style: CSSStyleDeclaration): boolean {
  const bg = style.backgroundColor;
  if (!bg || bg === 'transparent') return false;
  const match = /rgba?\(([^)]+)\)/.exec(bg);
  if (!match) return true;
  const parts = match[1].split(',').map((part) => part.trim());
  if (parts.length === 4 && Number.parseFloat(parts[3]) === 0) return false;
  return true;
}

/** 有圆角 / 背景 / 边框等「组外壳」的 layout 宿主：实线外框（类似 Figma ModuleMenuItem / networkRow）。 */
function isLayoutMapGroupEnvelope(host: HTMLElement): boolean {
  const style = getComputedStyle(host);
  if (parseCssPx(style.borderRadius) > 0.5) return true;
  if (layoutHostHasVisibleBackground(style)) return true;
  return (
    parseCssPx(style.borderTopWidth) > 0.5 && style.borderTopStyle !== 'none'
  );
}

/** 实线外框：组外壳，或不在另一 layout 宿主内部的顶层宿主。 */
function shouldDrawLayoutMapSolidFrame(element: Element): boolean {
  if (!(element instanceof HTMLElement)) return true;
  if (isLayoutMapGroupEnvelope(element)) return true;
  return !isDirectChildOfLayoutHost(element);
}

function shouldDrawLayoutMapCellForChild(child: Element): boolean {
  if (!isLayoutMapVisibleBox(child)) return false;
  if (isLayoutMapBorderOnlyComponentRoot(child)) return false;
  if (
    child instanceof HTMLElement
    && isLayoutHost(child)
    && shouldDrawLayoutMapSolidFrame(child)
  ) {
    return false;
  }
  return true;
}

function ancestorClipsOverflow(element: Element): boolean {
  const style = getComputedStyle(element);
  return OVERFLOW_CLIP_VALUES.has(style.overflow)
    || OVERFLOW_CLIP_VALUES.has(style.overflowX)
    || OVERFLOW_CLIP_VALUES.has(style.overflowY);
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

function compareOverlayStackOrder(left: Element, right: Element): number {
  const typeDiff = resolveOverlayLayerTypeRank(left) - resolveOverlayLayerTypeRank(right);
  if (typeDiff !== 0) return typeDiff;

  if (left.contains(right)) return -1;
  if (right.contains(left)) return 1;

  const zDiff = resolveStackZIndex(right) - resolveStackZIndex(left);
  if (zDiff !== 0) return zDiff;

  const position = left.compareDocumentPosition(right);
  if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
  if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1;
  return 0;
}

function isVisibleOverlayLayerCandidate(element: Element): boolean {
  if (isShellDebugUiElement(element)) return false;
  if (!isLayoutMapVisibleBox(element)) return false;
  const rect = element.getBoundingClientRect();
  return rect.width >= MIN_OVERLAY_LAYER_W && rect.height >= MIN_OVERLAY_LAYER_H;
}

function isPresentingPopupOverlayLayer(element: Element, preview: Element): boolean {
  if (!element.classList.contains('eds-popup')) return false;
  if (isShellDebugUiElement(element)) return false;
  if (!isLayoutMapVisibleBox(element)) return false;

  const popupRect = element.getBoundingClientRect();
  if (
    isClientPopupActive()
    && popupRect.width >= MIN_OVERLAY_LAYER_W
    && popupRect.height >= MIN_OVERLAY_LAYER_H
  ) {
    return true;
  }

  const panel = element.querySelector('.effect-popup-box');
  if (panel instanceof HTMLElement && isLayoutMapVisibleBox(panel)) {
    const panelRect = panel.getBoundingClientRect();
    if (panelRect.width >= MIN_POPUP_PANEL_W && panelRect.height >= MIN_POPUP_PANEL_H) {
      return true;
    }
  }

  const rect = element.getBoundingClientRect();
  const previewRect = preview.getBoundingClientRect();
  if (
    rect.width >= previewRect.width * 0.5
    && rect.height >= previewRect.height * 0.5
  ) {
    return true;
  }

  return rect.width >= MIN_OVERLAY_LAYER_W && rect.height >= MIN_OVERLAY_LAYER_H;
}

function resolvePresentingPopupOverlayRoot(preview: Element): Element | null {
  const popups = [...preview.querySelectorAll('.eds-popup')].filter(
    (popup) => isPresentingPopupOverlayLayer(popup, preview),
  );
  if (popups.length === 0) return null;
  return popups.sort(compareOverlayStackOrder).at(-1) ?? null;
}

function isPresentingPopoverOverlayLayer(element: Element): boolean {
  if (!element.classList.contains('eds-popover')) return false;
  if (isShellDebugUiElement(element)) return false;
  if (!isLayoutMapVisibleBox(element)) return false;

  const rect = element.getBoundingClientRect();
  if (rect.width < MIN_OVERLAY_LAYER_W || rect.height < MIN_OVERLAY_LAYER_H) return false;

  if (element.querySelector('.effect-popover-box') instanceof HTMLElement) return true;
  return element.querySelector('.eds-popover-content') instanceof HTMLElement;
}

function isAnchoredTooltipHostOverlayOpen(host: Element): boolean {
  if (!host.id.startsWith('eds-tooltip-')) return false;

  for (const selector of [
    ':scope > div .eds-popover',
    ':scope .eds-popover',
    ':scope .eds-flotation-menu',
    ':scope .effect-flotation-box',
  ]) {
    const nested = host.querySelector(selector);
    if (nested instanceof HTMLElement) {
      if (nested.classList.contains('eds-popover') && isPresentingPopoverOverlayLayer(nested)) {
        return true;
      }
      if (isVisibleOverlayLayerCandidate(nested)) return true;
    }
  }

  if (host.querySelector('.glassMicroFloatHostActive')) return true;
  if (host.querySelector('[data-eds-tooltip-open], [aria-expanded="true"]')) return true;

  return false;
}

function collectOverlayLayerCandidates(preview: Element): Element[] {
  const seen = new Set<Element>();
  const candidates: Element[] = [];

  const addCandidate = (element: Element) => {
    if (seen.has(element)) return;
    if (isShellDebugUiElement(element)) return;
    if (element.classList.contains('eds-popover') && !isPresentingPopoverOverlayLayer(element)) {
      return;
    }
    if (!isVisibleOverlayLayerCandidate(element)) return;
    if (
      element.id.startsWith('eds-tooltip-')
      && !isAnchoredTooltipHostOverlayOpen(element)
    ) {
      return;
    }
    if (!preview.contains(element) && !elementOverlapsPreview(preview, element)) return;
    seen.add(element);
    candidates.push(element);
  };

  const promoteTooltipHostContents = (host: Element) => {
    if (isVisibleOverlayLayerCandidate(host)) return;
    host.querySelectorAll('.eds-popover, .eds-flotation-menu, .effect-flotation-box')
      .forEach(addCandidate);
  };

  preview.querySelectorAll('.eds-popup').forEach((element) => {
    if (!isPresentingPopupOverlayLayer(element, preview)) return;
    addCandidate(element);
  });

  for (const selector of OVERLAY_LAYER_SELECTORS) {
    if (selector === '.eds-popup') continue;
    document.querySelectorAll(selector).forEach((element) => {
      addCandidate(element);
      if (element.id.startsWith('eds-tooltip-')) {
        promoteTooltipHostContents(element);
      }
    });
  }

  return candidates;
}

/** 叠层时取类型 / z-index 最上层的可见壳；Tooltip 宿主下沉到 popover / flotation 内容。 */
export function resolveTopmostLayoutMapOverlayRoot(preview: Element): Element | null {
  const presentingPopup = resolvePresentingPopupOverlayRoot(preview);
  const candidates = collectOverlayLayerCandidates(preview);

  if (presentingPopup && !candidates.includes(presentingPopup)) {
    candidates.push(presentingPopup);
  }

  if (candidates.length === 0) {
    return presentingPopup;
  }

  const ranked = [...candidates]
    .map((candidate) => ({
      candidate,
      collectionRoot: resolveLayoutMapOverlayCollectionRoot(candidate),
    }))
    .sort((left, right) =>
      compareOverlayStackOrder(left.collectionRoot, right.collectionRoot),
    );

  const top = ranked.at(-1);
  if (!top) return presentingPopup;

  const { collectionRoot } = top;
  const topRank = resolveOverlayLayerTypeRank(collectionRoot);

  // Popover / Flotation / Menu 全局置顶（含 teleport 到 .app-preview 的备注 Popover，不在 popup DOM 子树内）。
  if (topRank >= HIGH_RANK_OVERLAY_LAYER_RANK) {
    return collectionRoot;
  }

  // EgPopup 打开时切 overlay 模式；无 Popover / Flotation / Menu 时优先 popup，避免 walk 整页列表。
  if (
    presentingPopup
    && (
      isClientPopupActive()
      || topRank <= resolveOverlayLayerTypeRank(presentingPopup)
    )
  ) {
    return presentingPopup;
  }

  return collectionRoot;
}

/**
 * 叠层 walk / clip 真边界：Popup 下沉到 .effect-popup-box，其余用 collection root。
 * 禁止用整屏 .eds-popup 当 scope（会把 sibling 列表页几何裁进同一框）。
 */
export function resolveLayoutMapWalkRoot(overlayRoot: Element): Element {
  const collectionRoot = resolveLayoutMapOverlayCollectionRoot(overlayRoot);

  if (collectionRoot.classList.contains('eds-popup')) {
    const panel = collectionRoot.querySelector('.effect-popup-box');
    if (panel instanceof HTMLElement && isLayoutMapVisibleBox(panel)) {
      const panelRect = panel.getBoundingClientRect();
      if (panelRect.width >= MIN_POPUP_PANEL_W && panelRect.height >= MIN_POPUP_PANEL_H) {
        return panel;
      }
    }
  }

  return collectionRoot;
}

function filterLayoutMapItemsToScopeRoot(
  items: InspectLayoutMapItem[],
  scope: LayoutMapScope,
): InspectLayoutMapItem[] {
  if (scope.root === scope.preview) return items;

  const rootRect = scope.root.getBoundingClientRect();
  return items.filter((item) => {
    const itemRect = new DOMRect(item.x, item.y, item.width, item.height);
    return intersectDomRects(itemRect, rootRect, 1, 1) !== null;
  });
}

function resolveLayoutMapScope(
  preview: Element,
  walkRoot: Element | null,
  presentingPopup: Element | null = resolvePresentingPopupOverlayRoot(preview),
): LayoutMapScope {
  const scope: LayoutMapScope = {
    preview,
    root: walkRoot ?? preview,
    pinningLayers: [],
  };
  scope.pinningLayers = collectLayoutMapPinningLayers(scope);
  if (presentingPopup && walkRoot == null) {
    scope.pinningLayers.push(
      ...collectLayoutMapPopupOcclusionLayers(
        preview,
        resolveLayoutMapWalkRoot(presentingPopup),
      ),
    );
  }
  return scope;
}

function parseCssPx(value: string): number {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function readComputedGapPart(value: string, fallback: number): number {
  if (value === 'normal' || value === '') return fallback;
  const parsed = parseCssPx(value);
  return parsed > 0 ? parsed : fallback;
}

function resolveLayoutHostGaps(host: HTMLElement): { rowGap: number; columnGap: number } {
  const style = getComputedStyle(host);
  const parsedGap = style.gap === 'normal' || style.gap === '' ? 0 : parseCssPx(style.gap);
  const rowGap = readComputedGapPart(style.rowGap, parsedGap);
  const columnGap = readComputedGapPart(style.columnGap, parsedGap);
  return { rowGap, columnGap };
}

function resolveLayoutHostMainAxis(host: HTMLElement): 'horizontal' | 'vertical' {
  const style = getComputedStyle(host);
  if (style.display.includes('grid')) {
    return style.gridAutoFlow.includes('column') ? 'vertical' : 'horizontal';
  }
  return style.flexDirection === 'column' || style.flexDirection === 'column-reverse'
    ? 'vertical'
    : 'horizontal';
}

function resolveLayoutMapClipMin(role: InspectLayoutMapItem['role']): { w: number; h: number } {
  if (role === 'frame') return { w: MIN_FRAME_CLIP_W, h: MIN_FRAME_CLIP_H };
  if (role === 'cell') return { w: MIN_CELL_CLIP_W, h: MIN_CELL_CLIP_H };
  return { w: MIN_SPACING_CLIP_W, h: MIN_SPACING_CLIP_H };
}

function shouldClipLayoutMapSpacingToOverflowAncestors(
  role: InspectLayoutMapItem['role'],
): boolean {
  // padding / margin / gap 只裁 preview + 叠层根；勿沿 overflow:hidden 祖先再裁，
  // 否则 Popover contentSlot、签名进度 .progress 等条带会被 scroll 壳误裁没。
  return role === 'frame' || role === 'cell';
}

function clipLayoutMapBoxForHost(
  box: DOMRect,
  host: Element,
  scope: LayoutMapScope,
  role: InspectLayoutMapItem['role'],
): DOMRect | null {
  const { w: minW, h: minH } = resolveLayoutMapClipMin(role);
  const previewRect = scope.preview.getBoundingClientRect();
  let clipped = intersectDomRects(box, previewRect, minW, minH);
  if (!clipped) return null;

  if (scope.root !== scope.preview) {
    clipped = intersectDomRects(clipped, scope.root.getBoundingClientRect(), minW, minH);
    if (!clipped) return null;
  }

  if (!shouldClipLayoutMapSpacingToOverflowAncestors(role)) {
    return clipped;
  }

  let node = host.parentElement;
  while (node && node !== scope.root) {
    if (node instanceof HTMLElement && ancestorClipsOverflow(node)) {
      clipped = intersectDomRects(clipped, node.getBoundingClientRect(), minW, minH);
      if (!clipped) return null;
    }
    node = node.parentElement;
  }

  return clipped;
}

function pushLayoutMapSpacingBox(
  items: InspectLayoutMapItem[],
  box: DOMRect,
  host: Element,
  scope: LayoutMapScope,
  role: 'padding' | 'margin' | 'gap',
): void {
  const clipped = clipLayoutMapBoxForHost(box, host, scope, role);
  if (!clipped) return;

  const item = {
    x: clipped.left,
    y: clipped.top,
    width: clipped.width,
    height: clipped.height,
    role,
  };
  if (isLayoutMapItemOccludedByPinningLayer(host, item, scope.pinningLayers)) return;

  items.push(item);
}

function pushLayoutHostMargin(
  items: InspectLayoutMapItem[],
  host: HTMLElement,
  scope: LayoutMapScope,
): void {
  const hostRect = host.getBoundingClientRect();
  const style = getComputedStyle(host);

  const sides = ['top', 'right', 'bottom', 'left'] as const;
  for (const side of sides) {
    const marginRaw =
      side === 'top'
        ? style.marginTop
        : side === 'right'
          ? style.marginRight
          : side === 'bottom'
            ? style.marginBottom
            : style.marginLeft;
    const marginThickness = parseCssPx(marginRaw);
    if (marginThickness <= 0.5) continue;

    let marginBox: DOMRect;
    switch (side) {
      case 'top':
        marginBox = new DOMRect(hostRect.left, hostRect.top - marginThickness, hostRect.width, marginThickness);
        break;
      case 'bottom':
        marginBox = new DOMRect(hostRect.left, hostRect.bottom, hostRect.width, marginThickness);
        break;
      case 'left':
        marginBox = new DOMRect(hostRect.left - marginThickness, hostRect.top, marginThickness, hostRect.height);
        break;
      case 'right':
        marginBox = new DOMRect(hostRect.right, hostRect.top, marginThickness, hostRect.height);
        break;
    }
    pushLayoutMapSpacingBox(items, marginBox, host, scope, 'margin');
  }
}

function pushLayoutHostPaddingAndMargin(
  items: InspectLayoutMapItem[],
  host: HTMLElement,
  scope: LayoutMapScope,
): void {
  pushLayoutHostMargin(items, host, scope);

  const hostRect = host.getBoundingClientRect();
  const style = getComputedStyle(host);

  const sides = ['top', 'right', 'bottom', 'left'] as const;
  for (const side of sides) {
    const paddingRaw =
      side === 'top'
        ? style.paddingTop
        : side === 'right'
          ? style.paddingRight
          : side === 'bottom'
            ? style.paddingBottom
            : style.paddingLeft;
    const paddingThickness = parseCssPx(paddingRaw);
    if (paddingThickness <= 0.5) continue;

    let paddingBox: DOMRect;
    switch (side) {
      case 'top':
        paddingBox = new DOMRect(hostRect.left, hostRect.top, hostRect.width, paddingThickness);
        break;
      case 'bottom':
        paddingBox = new DOMRect(hostRect.left, hostRect.bottom - paddingThickness, hostRect.width, paddingThickness);
        break;
      case 'left':
        paddingBox = new DOMRect(hostRect.left, hostRect.top, paddingThickness, hostRect.height);
        break;
      case 'right':
        paddingBox = new DOMRect(hostRect.right - paddingThickness, hostRect.top, paddingThickness, hostRect.height);
        break;
    }
    pushLayoutMapSpacingBox(items, paddingBox, host, scope, 'padding');
  }
}

const LAYOUT_MAP_GAP_DISTANCE_TOLERANCE_PX = 2;

function layoutMapGapDistanceMatches(expectedGap: number, measuredDistance: number): boolean {
  if (expectedGap <= 0.5) return false;
  if (measuredDistance <= 0.5) return false;
  if (measuredDistance > expectedGap * 2 + LAYOUT_MAP_GAP_DISTANCE_TOLERANCE_PX) return false;
  return Math.abs(measuredDistance - expectedGap) <= LAYOUT_MAP_GAP_DISTANCE_TOLERANCE_PX;
}

function resolveLayoutHostContentCrossAxis(
  host: HTMLElement,
): { crossStart: number; crossSize: number } {
  const hostRect = host.getBoundingClientRect();
  const style = getComputedStyle(host);
  const paddingTop = parseCssPx(style.paddingTop);
  const paddingBottom = parseCssPx(style.paddingBottom);
  const paddingLeft = parseCssPx(style.paddingLeft);
  const paddingRight = parseCssPx(style.paddingRight);
  const mainAxis = resolveLayoutHostMainAxis(host);

  if (mainAxis === 'horizontal') {
    return {
      crossStart: hostRect.top + paddingTop,
      crossSize: Math.max(hostRect.height - paddingTop - paddingBottom, 1),
    };
  }

  return {
    crossStart: hostRect.left + paddingLeft,
    crossSize: Math.max(hostRect.width - paddingLeft - paddingRight, 1),
  };
}

function pushLayoutMapFlexGapBox(
  items: InspectLayoutMapItem[],
  host: HTMLElement,
  scope: LayoutMapScope,
  currentRect: DOMRect,
  nextRect: DOMRect,
  axis: 'horizontal' | 'vertical',
  gapSize: number,
): void {
  const crossAxis = resolveLayoutHostContentCrossAxis(host);

  if (axis === 'horizontal') {
    const distance = nextRect.left - currentRect.right;
    if (!layoutMapGapDistanceMatches(gapSize, distance)) return;
    pushLayoutMapSpacingBox(
      items,
      new DOMRect(
        currentRect.right,
        crossAxis.crossStart,
        gapSize,
        crossAxis.crossSize,
      ),
      host,
      scope,
      'gap',
    );
    return;
  }

  const distance = nextRect.top - currentRect.bottom;
  if (!layoutMapGapDistanceMatches(gapSize, distance)) return;
  pushLayoutMapSpacingBox(
    items,
    new DOMRect(
      crossAxis.crossStart,
      currentRect.bottom,
      crossAxis.crossSize,
      gapSize,
    ),
    host,
    scope,
    'gap',
  );
}

function pushLayoutHostChildGapsAlongAxis(
  items: InspectLayoutMapItem[],
  host: HTMLElement,
  scope: LayoutMapScope,
  axis: 'horizontal' | 'vertical',
  gapSize: number,
): void {
  if (gapSize <= 0.5) return;

  const children = [...host.children].filter(
    (child): child is HTMLElement => child instanceof HTMLElement && isLayoutMapVisibleBox(child),
  );

  for (let index = 0; index < children.length - 1; index += 1) {
    const currentRect = children[index].getBoundingClientRect();
    const nextRect = children[index + 1].getBoundingClientRect();
    if (currentRect.width <= 0.5 || currentRect.height <= 0.5) continue;
    if (nextRect.width <= 0.5 || nextRect.height <= 0.5) continue;
    pushLayoutMapFlexGapBox(items, host, scope, currentRect, nextRect, axis, gapSize);
  }
}

function pushLayoutHostChildGaps(
  items: InspectLayoutMapItem[],
  host: HTMLElement,
  scope: LayoutMapScope,
): void {
  if (!isLayoutGapHost(host)) return;

  const { rowGap, columnGap } = resolveLayoutHostGaps(host);
  if (rowGap <= 0.5 && columnGap <= 0.5) return;

  const style = getComputedStyle(host);
  if (style.display.includes('grid')) {
    pushLayoutHostChildGapsAlongAxis(items, host, scope, 'vertical', rowGap);
    pushLayoutHostChildGapsAlongAxis(items, host, scope, 'horizontal', columnGap);
    return;
  }

  const mainAxis = resolveLayoutHostMainAxis(host);
  const gapSize = mainAxis === 'horizontal' ? columnGap : rowGap;
  pushLayoutHostChildGapsAlongAxis(items, host, scope, mainAxis, gapSize);
}

function resolveLayoutMapClipRect(
  element: Element,
  scope: LayoutMapScope,
  role: InspectLayoutMapItem['role'],
): DOMRect | null {
  const previewRect = scope.preview.getBoundingClientRect();
  const scopeRect = scope.root.getBoundingClientRect();
  const { w: minW, h: minH } = resolveLayoutMapClipMin(role);

  let clipped = intersectDomRects(element.getBoundingClientRect(), previewRect, minW, minH);
  if (!clipped) return null;

  if (scope.root !== scope.preview) {
    clipped = intersectDomRects(clipped, scopeRect, minW, minH);
    if (!clipped) return null;
  }

  let node = element.parentElement;
  while (node && node !== scope.root) {
    if (node instanceof HTMLElement && ancestorClipsOverflow(node)) {
      clipped = intersectDomRects(clipped, node.getBoundingClientRect(), minW, minH);
      if (!clipped) return null;
    }
    node = node.parentElement;
  }

  return clipped;
}

function pushLayoutMapItem(
  items: InspectLayoutMapItem[],
  element: Element,
  scope: LayoutMapScope,
  role: InspectLayoutMapItem['role'],
): void {
  const rect = resolveLayoutMapClipRect(element, scope, role);
  if (!rect) return;

  const item = {
    x: rect.left,
    y: rect.top,
    width: rect.width,
    height: rect.height,
    role,
  };
  if (isLayoutMapItemOccludedByPinningLayer(element, item, scope.pinningLayers)) return;

  items.push(item);
}

function resolveLayoutHostMainAxisIsHorizontal(host: HTMLElement): boolean {
  const style = getComputedStyle(host);
  if (style.display.includes('grid')) {
    return style.gridAutoFlow.includes('column');
  }
  return style.flexDirection === 'row' || style.flexDirection === 'row-reverse';
}

function pushLayoutHostCells(
  items: InspectLayoutMapItem[],
  host: Element,
  scope: LayoutMapScope,
): void {
  if (!(host instanceof HTMLElement)) return;

  const mainAxisHorizontal = resolveLayoutHostMainAxisIsHorizontal(host);
  const cells = [...host.children]
    .filter((child) => shouldDrawLayoutMapCellForChild(child))
    .map((child) => ({
      child,
      rect: resolveLayoutMapClipRect(child, scope, 'cell'),
    }))
    .filter((entry): entry is { child: Element; rect: DOMRect } => entry.rect !== null)
    .sort((left, right) => (
      mainAxisHorizontal
        ? left.rect.left - right.rect.left
        : left.rect.top - right.rect.top
    ));

  cells.forEach(({ child }) => {
    pushLayoutMapItem(items, child, scope, 'cell');
  });
}

function walkLayoutMapTree(
  element: Element,
  scope: LayoutMapScope,
  items: InspectLayoutMapItem[],
): void {
  if (isExcludedLayoutMapElement(element, scope)) return;
  if (!isLayoutMapVisibleBox(element)) return;

  if (isLayoutMapBorderOnlyComponentRoot(element)) {
    // 白名单原子 / 控件：仅 1 条实线外框，不递归、不铺 spacing。
    pushLayoutMapItem(items, element, scope, 'frame');
    return;
  }

  // spacing 只挂在 layout 宿主 / EDS 根 / Popover contentSlot 等独立 content 壳。
  if (element instanceof HTMLElement && shouldCollectLayoutMapPaddingAndMargin(element)) {
    pushLayoutHostPaddingAndMargin(items, element, scope);
  }

  if (element instanceof HTMLElement) {
    pushLayoutHostChildGaps(items, element, scope);
  }

  if (element instanceof HTMLElement && isLayoutHost(element)) {
    if (shouldDrawLayoutMapSolidFrame(element)) {
      pushLayoutMapItem(items, element, scope, 'frame');
    }
    pushLayoutHostCells(items, element, scope);
  }

  for (const child of element.children) {
    walkLayoutMapTree(child, scope, items);
  }
}

function compareLayoutMapItemArea(
  left: InspectLayoutMapItem,
  right: InspectLayoutMapItem,
): number {
  return (left.width * left.height) - (right.width * right.height);
}

function capLayoutMapItemsByArea(
  items: InspectLayoutMapItem[],
  budget: number,
): InspectLayoutMapItem[] {
  if (items.length <= budget) return items;
  return [...items]
    .sort(compareLayoutMapItemArea)
    .slice(0, budget);
}

/** 超量时只裁 cell；padding / margin / gap 全量保留，避免开发误判布局。 */
function capLayoutMapItems(items: InspectLayoutMapItem[]): InspectLayoutMapItem[] {
  const frames = items.filter((item) => item.role === 'frame');
  const cells = items.filter((item) => item.role === 'cell');
  const spacing = items.filter((item) =>
    item.role === 'padding' || item.role === 'margin' || item.role === 'gap',
  );

  const keptFrames = frames;
  const cellBudget = Math.max(0, MAX_LAYOUT_MAP_LINE_ITEMS - keptFrames.length);
  const keptCells = capLayoutMapItemsByArea(cells, cellBudget);

  return [...keptFrames, ...keptCells, ...spacing];
}

/** 采集 layout 宿主 + 直接子格；有叠层时仅 walk 内容壳，且几何裁到 scope.root。 */
export function collectLayoutMapItems(preview: Element): InspectLayoutMapItem[] {
  const presentingPopup = resolvePresentingPopupOverlayRoot(preview);
  let overlayCandidate = resolveTopmostLayoutMapOverlayRoot(preview);
  if (!overlayCandidate && presentingPopup) {
    overlayCandidate = presentingPopup;
  }
  if (!overlayCandidate && isClientPopupActive()) {
    overlayCandidate = presentingPopup;
  }

  const overlayActive = overlayCandidate != null;
  const walkRoot = overlayCandidate ? resolveLayoutMapWalkRoot(overlayCandidate) : null;
  const scope = resolveLayoutMapScope(preview, walkRoot, presentingPopup);
  const items: InspectLayoutMapItem[] = [];

  if (walkRoot) {
    walkLayoutMapTree(walkRoot, scope, items);
  } else if (!overlayActive) {
    for (const child of scope.preview.children) {
      if (child instanceof Element && child.closest(SHELL_DEBUG_UI_ROOT_SELECTOR)) continue;
      walkLayoutMapTree(child, scope, items);
    }
  }

  return filterLayoutMapItemsToScopeRoot(capLayoutMapItems(items), scope)
    .sort(compareLayoutMapItemArea);
}
