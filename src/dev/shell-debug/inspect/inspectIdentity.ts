import {
  isDomRootOnlyCatalogEntry,
  isShellSubtreeCatalogEntry,
  lookupEdsCatalogByDomClass,
  lookupEdsCatalogByVueName,
  type EdsInspectCatalogEntry,
} from './edsInspectCatalog';
import {
  elementHasStructuralEdsClass,
  isStructuralEdsDomClass,
} from './edsInspectStructuralDom';

type VueComponentInternal = {
  type?: { name?: string; __name?: string };
  parent?: VueComponentInternal;
  props?: Record<string, unknown>;
  subTree?: { el?: Element | null };
  vnode?: { el?: Element | null };
};

const GRAPHIC_INSPECT_TAGS = new Set(['SVG', 'PATH', 'G', 'USE', 'IMG', 'PICTURE']);

/**
 * 大壳 layout：内部 slot / CSS Module layout **不得**借外壳名。
 * 仅 DOM 根（`element === eds-*` 根）可视为 Vue owner。
 */
const LAYOUT_CONTAINER_DOM_CLASSES = new Set([
  'eds-layout',
  'eds-container',
  'eds-nav-bar',
  'eds-batch-bar',
  'eds-data-list',
  'eds-tabs',
]);

export type VueCatalogOwnerMatch = {
  entry: EdsInspectCatalogEntry;
  instance: VueComponentInternal;
  root: Element;
  depth: number;
};

function resolveVueComponentName(instance: VueComponentInternal): string | null {
  return instance.type?.name || instance.type?.__name || null;
}

function resolveComponentRootElement(instance: VueComponentInternal): Element | null {
  const subTreeEl = instance.subTree?.el;
  if (subTreeEl instanceof Element) return subTreeEl;
  const vnodeEl = instance.vnode?.el;
  if (vnodeEl instanceof Element) return vnodeEl;
  return null;
}

function walkVueChain(element: Element): VueComponentInternal[] {
  const chain: VueComponentInternal[] = [];
  const probe = element as Element & { __vueParentComponent?: VueComponentInternal };
  let current = probe.__vueParentComponent;
  while (current) {
    chain.push(current);
    current = current.parent;
  }
  return chain;
}

function resolveCatalogForVueName(vueName: string | null | undefined): EdsInspectCatalogEntry | null {
  if (!vueName) return null;
  return lookupEdsCatalogByVueName(vueName) ?? lookupEdsCatalogByVueName(`Eg${vueName}`) ?? null;
}

function readVueProps(instance: VueComponentInternal): Record<string, unknown> {
  if (instance.props && typeof instance.props === 'object') {
    const keys = Object.keys(instance.props).filter((key) => !key.startsWith('_') && !key.startsWith('$'));
    if (keys.length > 0) {
      return Object.fromEntries(keys.map((key) => [key, instance.props![key]]));
    }
  }
  return {};
}

function isPreviewShellTooltip(instance: VueComponentInternal): boolean {
  const vueName = resolveVueComponentName(instance);
  if (vueName !== 'Tooltip' && vueName !== 'EgTooltip') return false;
  const props = readVueProps(instance);
  if (props.panelKind !== 'container') return false;
  const root = resolveComponentRootElement(instance);
  return root instanceof HTMLElement && root.classList.contains('app-preview');
}

function isPopupShellTooltip(instance: VueComponentInternal): boolean {
  const vueName = resolveVueComponentName(instance);
  if (vueName !== 'Tooltip' && vueName !== 'EgTooltip') return false;
  const props = readVueProps(instance);
  if (props.panelKind === 'popup') return true;
  const root = resolveComponentRootElement(instance);
  return root instanceof HTMLElement && root.classList.contains('eds-popup-box-content');
}

function shouldSkipVueCatalogInstance(
  element: Element,
  entry: EdsInspectCatalogEntry,
  instance: VueComponentInternal,
): boolean {
  if (entry.displayName !== 'Tooltip') return false;
  if (isPreviewShellTooltip(instance) || isPopupShellTooltip(instance)) return true;
  if (element.closest('.eds-popup, .eds-detail')) return false;
  return Boolean(element.closest('.eds-hover-tooltip-trigger__target, .eds-hover-tooltip-trigger'));
}

function isGraphicInspectNode(element: Element): boolean {
  return GRAPHIC_INSPECT_TAGS.has(element.tagName.toUpperCase());
}

function hasGraphicInspectIdentity(element: Element): boolean {
  if (!isGraphicInspectNode(element)) return false;
  return Boolean(element.closest('.eds-icon, .eds-crypto, .eds-avatar'));
}

export function measureInspectOwnerDepth(from: Element, root: Element): number {
  let depth = 0;
  let node: Element | null = from;
  while (node) {
    if (node === root) return depth;
    node = node.parentElement;
    depth += 1;
  }
  return Number.POSITIVE_INFINITY;
}

function isLayoutContainerEntry(entry: EdsInspectCatalogEntry): boolean {
  return Boolean(entry.domClass && LAYOUT_CONTAINER_DOM_CLASSES.has(entry.domClass));
}

export function findDirectDomCatalogEntry(
  element: Element,
): { entry: EdsInspectCatalogEntry; root: Element } | null {
  let best: { entry: EdsInspectCatalogEntry; root: Element } | null = null;

  for (const className of element.classList) {
    if (!className.startsWith('eds-')) continue;
    if (isStructuralEdsDomClass(className)) continue;
    const entry = lookupEdsCatalogByDomClass(className);
    if (!entry || entry.domClass !== className) continue;
    if (!best || entry.priority > best.entry.priority) {
      best = { entry, root: element };
    }
  }

  return best;
}

/**
 * 全局外壳 chrome 借名：**仅**点击节点自身带 structural `eds-*`（edsInspectStructuralDom 白名单）。
 * 禁止 CSS Module 片段（paginationRaw / section / scroll / stage 等）— 全 app 统一。
 */
export function canBorrowShellSubtreeName(
  element: Element,
  shellRoot: Element,
  entry: EdsInspectCatalogEntry,
): boolean {
  if (element === shellRoot) return false;
  if (!isShellSubtreeCatalogEntry(entry)) return false;
  return elementHasStructuralEdsClass(element);
}

/** 当前 catalog 条目是否「拥有」该点击节点。 */
export function isVueCatalogOwnerHit(
  element: Element,
  entry: EdsInspectCatalogEntry,
  root: Element,
): boolean {
  if (!root.contains(element) && root !== element) return false;

  const direct = findDirectDomCatalogEntry(element);
  if (direct?.entry === entry) return true;
  if (element === root) return true;

  if (isDomRootOnlyCatalogEntry(entry)) return false;

  if (isLayoutContainerEntry(entry)) return false;

  if (isShellSubtreeCatalogEntry(entry)) {
    return canBorrowShellSubtreeName(element, root, entry);
  }

  return root.contains(element);
}

/**
 * 全局：最内层 Vue catalog owner。
 * 普通组件：root.contains(click)；大壳 / 外壳：仅根或 structural chrome。
 */
export function findNearestVueCatalogOwner(element: Element): VueCatalogOwnerMatch | null {
  let best: VueCatalogOwnerMatch | null = null;

  for (const instance of walkVueChain(element)) {
    const vueName = resolveVueComponentName(instance);
    if (!vueName) continue;

    const entry = resolveCatalogForVueName(vueName);
    if (!entry) continue;
    if (shouldSkipVueCatalogInstance(element, entry, instance)) continue;

    const root = resolveComponentRootElement(instance);
    if (!(root instanceof Element)) continue;
    if (!isVueCatalogOwnerHit(element, entry, root)) continue;

    const depth = measureInspectOwnerDepth(element, root);
    if (!best || depth < best.depth) {
      best = { entry, instance, root, depth };
    }
  }

  return best;
}

export function elementHasInspectableIdentity(element: Element): boolean {
  if (findDirectDomCatalogEntry(element)) return true;
  if (hasGraphicInspectIdentity(element)) return true;
  if (findNearestVueCatalogOwner(element)) return true;

  for (const instance of walkVueChain(element)) {
    const root = resolveComponentRootElement(instance);
    if (root !== element) continue;
    const vueName = resolveVueComponentName(instance);
    if (vueName?.startsWith('Eg') && !resolveCatalogForVueName(vueName)) return true;
  }

  return false;
}

export function hasNestedCatalogIdentityBetween(element: Element, shellHost: Element): boolean {
  let node: Element | null = element;
  while (node && node !== shellHost) {
    if (elementHasInspectableIdentity(node)) return true;
    node = node.parentElement;
  }
  return false;
}

export function findNearestShellHost(element: Element): { entry: EdsInspectCatalogEntry; root: Element } | null {
  let host: Element | null = element.parentElement;
  while (host) {
    const domMatch = findDirectDomCatalogEntry(host);
    if (domMatch && isShellSubtreeCatalogEntry(domMatch.entry)) {
      return domMatch;
    }
    host = host.parentElement;
  }
  return null;
}

export { elementHasStructuralEdsClass } from './edsInspectStructuralDom';
