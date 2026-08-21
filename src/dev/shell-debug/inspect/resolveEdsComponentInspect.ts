import type { InspectPropertyItem } from './buildElementInspectInfo';
import {
  buildAvatarCodeSections,
  buildAvatarPropertyItems,
  buildAvatarUsageSnippet,
  isAvatarGraphicAssetName,
  resolveAvatarHostElement,
} from './buildAvatarInspect';
import {
  buildDividerCodeSections,
  buildDividerPropertyItems,
  buildDividerUsageSnippet,
  resolveDividerHostElement,
} from './buildDividerInspect';
import {
  buildCryptoCodeSections,
  buildCryptoPropertyItems,
  resolveCryptoHostElement,
  resolveCryptoName,
} from './buildCryptoInspect';
import {
  buildIconCodeSections,
  buildIconPropertyItems,
  resolveIconHostElement,
  resolveIconName,
  type InspectCodeSection,
} from './buildIconInspect';
import { canInspectAsText, formatDomTagInspectLabel, resolveTextInspect } from './buildTextInspect';
import {
  buildDetailApplyItemInspect,
  isDetailApplyItemRowLayerHit,
  shouldPromoteDetailApplyItemRow,
} from './buildDetailApplyItemInspect';
import {
  formatIconName,
  lookupEdsCatalogByDomClass,
  lookupEdsCatalogByVueName,
  type EdsInspectCatalogEntry,
  type EdsPropExtractContext,
  type EdsPropSpec,
} from './edsInspectCatalog';
import { resolveInspectPropLabel } from './inspectPropLabels';
import {
  findDirectDomCatalogEntry,
  findNearestVueCatalogOwner,
  measureInspectOwnerDepth,
} from './inspectIdentity';
import { resolveInspectScopeRoot } from './inspectFloatLayerScope';
import { isInspectLayoutStylePropKey } from './inspectLayoutStyleProps';

type VueComponentInternal = {
  type?: { name?: string; __name?: string };
  parent?: VueComponentInternal;
  props?: Record<string, unknown>;
  subTree?: { el?: Element | null };
  vnode?: { el?: Element | null };
};

export type EdsComponentInspect = {
  vueName: string;
  displayName: string;
  rootElement: Element | null;
  props: InspectPropertyItem[];
  usageSnippet: string;
  codeSections?: InspectCodeSection[];
};

type ResolvedCandidate = {
  entry: EdsInspectCatalogEntry;
  vueName: string;
  instance: VueComponentInternal;
  rootElement: Element | null;
  chainDepth: number;
  genericInspect?: EdsComponentInspect;
};

export type InspectTargetResolution = {
  /** UI 只展示这一层名字。 */
  primaryLabel: string;
  /** 自内向外的组件链路（内部识别，不拼进标题）。 */
  componentChain: string[];
  edsComponent: EdsComponentInspect | null;
};

function resolveVueComponentName(instance: VueComponentInternal): string | null {
  return instance.type?.name || instance.type?.__name || null;
}

function readVueProps(instance: VueComponentInternal): Record<string, unknown> {
  type Extended = VueComponentInternal & {
    props?: Record<string, unknown>;
    vnode?: { props?: Record<string, unknown> };
    setupState?: Record<string, unknown>;
  };
  const probe = instance as Extended;

  if (probe.props && typeof probe.props === 'object') {
    const keys = Object.keys(probe.props).filter((key) => !key.startsWith('_') && !key.startsWith('$'));
    if (keys.length > 0) {
      return Object.fromEntries(keys.map((key) => [key, probe.props![key]]));
    }
  }

  const vnodeProps = probe.vnode?.props;
  if (vnodeProps && typeof vnodeProps === 'object') {
    const raw: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(vnodeProps)) {
      if (key.startsWith('on') || key === 'key' || key === 'ref') continue;
      raw[key] = value;
    }
    if (Object.keys(raw).length > 0) return raw;
  }

  return {};
}

function resolveCatalogForVueName(vueName: string | null | undefined): EdsInspectCatalogEntry | null {
  if (!vueName) return null;
  return lookupEdsCatalogByVueName(vueName) ?? lookupEdsCatalogByVueName(`Eg${vueName}`) ?? null;
}

function resolveCandidateInstance(
  element: Element,
  entry: EdsInspectCatalogEntry,
  candidate: VueComponentInternal,
  scopeRoot?: Element | null,
): VueComponentInternal {
  if (candidate && Object.keys(readVueProps(candidate)).length > 0) return candidate;

  for (const instance of walkVueChain(element)) {
    const vueName = resolveVueComponentName(instance);
    if (resolveCatalogForVueName(vueName) !== entry) continue;

    const root = resolveComponentRootElement(instance);
    if (scopeRoot instanceof Element) {
      if (root !== scopeRoot && !(root instanceof Element && scopeRoot.contains(root))) continue;
      if (!(root instanceof Element && (root === element || root.contains(element)))) continue;
    } else if (root instanceof Element) {
      if (root !== element && !root.contains(element)) continue;
    }
    return instance;
  }

  return candidate;
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

const GRAPHIC_INSPECT_TAGS = new Set(['SVG', 'PATH', 'G', 'USE', 'IMG', 'PICTURE']);

function isGraphicInspectNode(element: Element): boolean {
  return GRAPHIC_INSPECT_TAGS.has(element.tagName.toUpperCase());
}

/** 仅当前节点自身的 catalog domClass，不向上冒泡。 */
function findDirectDomCatalogMatch(element: Element) {
  return findDirectDomCatalogEntry(element);
}

function resolveAvatarSubtreeCandidate(element: Element): ResolvedCandidate | null {
  const host = element.closest('.eds-avatar');
  if (!host) return null;

  const entry = lookupEdsCatalogByDomClass('eds-avatar');
  if (!entry) return null;

  return buildDomCatalogCandidate(entry, host, element);
}

function buildDomCatalogCandidate(
  entry: EdsInspectCatalogEntry,
  root: Element,
  element: Element,
  scopeRoot?: Element | null,
): ResolvedCandidate {
  return {
    entry,
    vueName: entry.vueNames[0] ?? entry.displayName,
    instance: resolveCandidateInstance(element, entry, {}, scopeRoot ?? root),
    rootElement: resolveInspectRootElement(entry, element, root),
    chainDepth: 0,
  };
}

/** 未入 catalog 的 Eg*：沿 Vue 链取最内层 owner（与 catalog 组件同规则，非仅 DOM 根）。 */
function findGenericEgInspectNearestOwner(element: Element): ResolvedCandidate | null {
  let best: ResolvedCandidate | null = null;

  for (const instance of walkVueChain(element)) {
    const vueName = resolveVueComponentName(instance);
    if (!vueName?.startsWith('Eg')) continue;
    if (resolveCatalogForVueName(vueName)) continue;

    const root = resolveComponentRootElement(instance);
    if (!(root instanceof Element)) continue;
    if (root !== element && !root.contains(element)) continue;

    const generic = buildGenericEdsInspect(vueName, instance);
    if (!generic) continue;

    const depth = measureInspectOwnerDepth(element, root);
    const candidate: ResolvedCandidate = {
      entry: {
        displayName: generic.displayName,
        priority: 2,
        vueNames: [vueName],
        props: [],
      },
      vueName,
      instance,
      rootElement: root,
      chainDepth: depth,
      genericInspect: generic,
    };

    if (!best || depth < best.chainDepth) {
      best = candidate;
    }
  }

  return best;
}

/** 全局逐层判定：dom 根 → 最内层 Vue catalog owner → 通用 Eg* → 图形。 */
function resolveInspectableCandidate(element: Element): ResolvedCandidate | null {
  const domMatch = findDirectDomCatalogMatch(element);
  if (domMatch) {
    return {
      entry: domMatch.entry,
      vueName: domMatch.entry.vueNames[0] ?? domMatch.entry.displayName,
      instance: resolveCandidateInstance(element, domMatch.entry, {}, domMatch.root),
      rootElement: resolveInspectRootElement(domMatch.entry, element, domMatch.root),
      chainDepth: 0,
    };
  }

  const owner = findNearestVueCatalogOwner(element);
  if (owner) {
    const vueName = resolveVueComponentName(owner.instance)
      ?? owner.entry.vueNames[0]
      ?? owner.entry.displayName;
    return {
      entry: owner.entry,
      vueName,
      instance: owner.instance,
      rootElement: resolveInspectRootElement(owner.entry, element, owner.root),
      chainDepth: owner.depth,
    };
  }

  const genericMatch = findGenericEgInspectNearestOwner(element);
  if (genericMatch) return genericMatch;

  return resolveGraphicInspectCandidate(element);
}

function buildGraphicCatalogCandidate(element: Element, entry: EdsInspectCatalogEntry): ResolvedCandidate {
  return {
    entry,
    vueName: entry.vueNames[0] ?? entry.displayName,
    instance: {},
    rootElement: resolveInspectRootElement(entry, element, element),
    chainDepth: 0,
  };
}

function resolveGraphicInspectCandidate(element: Element): ResolvedCandidate | null {
  if (!isGraphicInspectNode(element)) return null;

  if (element.closest('.eds-icon')) {
    const entry = lookupEdsCatalogByDomClass('eds-icon');
    if (entry) return buildGraphicCatalogCandidate(element, entry);
  }

  if (element.closest('.eds-crypto')) {
    const entry = lookupEdsCatalogByDomClass('eds-crypto');
    if (entry) return buildGraphicCatalogCandidate(element, entry);
  }

  if (element.closest('.eds-avatar')) {
    const entry = lookupEdsCatalogByDomClass('eds-avatar');
    if (entry) return buildGraphicCatalogCandidate(element, entry);
  }

  return null;
}

function resolveEdsComponentForElement(element: Element, _preview?: Element): EdsComponentInspect | null {
  const candidate = resolveInspectableCandidate(element);
  if (!candidate) return null;
  return buildFromCandidate(candidate, element);
}

function resolveInspectRootElement(
  entry: EdsInspectCatalogEntry,
  element: Element,
  domRoot: Element,
): Element | null {
  if (entry.displayName === 'Icon') {
    return resolveIconHostElement(element) ?? domRoot.parentElement ?? domRoot;
  }
  if (entry.displayName === 'Crypto') {
    return resolveCryptoHostElement(element) ?? domRoot.parentElement ?? domRoot;
  }
  if (entry.displayName === 'Avatar') {
    return resolveAvatarHostElement(element) ?? domRoot;
  }
  if (entry.displayName === 'Divider') {
    return resolveDividerHostElement(element) ?? domRoot;
  }
  return domRoot;
}

function formatPropValue(spec: EdsPropSpec, raw: unknown, props: Record<string, unknown>): string {
  if (spec.format) return spec.format(raw, props);
  if (raw === true) return '是';
  if (raw === false) return '否';
  if (raw == null || raw === '') return '—';
  return String(raw);
}

function isDefaultPropValue(spec: EdsPropSpec, raw: unknown): boolean {
  if (spec.defaultValue === undefined) return false;
  return raw === spec.defaultValue;
}

function readRawPropValue(
  spec: EdsPropSpec,
  vueProps: Record<string, unknown>,
  ctx: EdsPropExtractContext,
): unknown {
  const raw = spec.derive ? spec.derive(ctx) : vueProps[spec.key];
  if (raw !== undefined && raw !== null && raw !== '') return raw;
  if (spec.defaultValue !== undefined) return spec.defaultValue;
  return raw;
}

function extractPropItems(
  entry: EdsInspectCatalogEntry,
  vueProps: Record<string, unknown>,
  element: Element,
  rootElement: Element | null,
): InspectPropertyItem[] {
  const ctx: EdsPropExtractContext = { props: vueProps, element, rootElement };
  const items: InspectPropertyItem[] = [];

  for (const spec of entry.props) {
    if (isInspectLayoutStylePropKey(spec.key)) continue;
    if (DERIVED_PROPERTY_KEYS.has(spec.key)) continue;
    if (spec.when && !spec.when(vueProps)) continue;

    const raw = readRawPropValue(spec, vueProps, ctx);
    const value = formatPropValue(spec, raw, vueProps);
    if (value === '—' && spec.defaultValue === undefined && !spec.derive) continue;

    items.push({
      label: spec.label,
      value,
      token: null,
      copyLine:
        spec.key === 'name' && entry.displayName === 'Icon'
          ? `name="${formatIconName(raw)}"`
          : `${spec.key}="${value === '是' ? 'true' : value === '否' ? 'false' : value}"`,
    });
  }

  return items;
}

const DERIVED_USAGE_LABELS = new Set(['文本', '显示图标']);
const DERIVED_PROPERTY_KEYS = new Set(['text', 'displayText', 'tooltipText', 'content']);

function buildUsageSnippet(
  entry: EdsInspectCatalogEntry,
  vueName: string,
  vueProps: Record<string, unknown>,
  element: Element,
  rootElement: Element | null,
): string {
  const componentTag = vueName.startsWith('Eg') ? vueName : `Eg${entry.displayName}`;
  const ctx: EdsPropExtractContext = { props: vueProps, element, rootElement };
  const attrs: string[] = [];

  for (const spec of entry.props) {
    if (spec.when && !spec.when(vueProps)) continue;
    if (DERIVED_USAGE_LABELS.has(spec.label)) continue;

    const raw = readRawPropValue(spec, vueProps, ctx);
    if (isDefaultPropValue(spec, raw)) continue;
    if (raw === false || raw == null || raw === '') continue;

    if (raw === true) {
      attrs.push(spec.key);
      continue;
    }

    const formatted = formatPropValue(spec, raw, vueProps);
    if (formatted === '—') continue;
    attrs.push(`${spec.key}="${formatted}"`);
  }

  const attrText = attrs.length > 0 ? ` ${attrs.join(' ')}` : '';
  return `<${componentTag}${attrText} />`;
}

function formatGenericPropValue(value: unknown): string {
  if (value === true) return '是';
  if (value === false) return '否';
  if (value == null || value === '') return '—';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function buildGenericEdsInspect(
  vueName: string,
  instance: VueComponentInternal,
): EdsComponentInspect | null {
  const vueProps = readVueProps(instance);
  const keys = Object.keys(vueProps).filter((key) => !key.startsWith('_') && !key.startsWith('$'));
  if (keys.length === 0) return null;

  const catalogEntry = resolveCatalogForVueName(vueName);
  const displayName = catalogEntry?.displayName
    ?? (vueName.startsWith('Eg') ? vueName.slice(2) : vueName);
  const propItems: InspectPropertyItem[] = keys
    .filter((key) => !isInspectLayoutStylePropKey(key) && !DERIVED_PROPERTY_KEYS.has(key))
    .sort()
    .map((key) => {
    const value = formatGenericPropValue(vueProps[key]);
    return {
      label: resolveInspectPropLabel(key),
      value,
      token: null,
      copyLine:
        value === '是'
          ? `${key}`
          : value === '否'
            ? ''
            : `${key}="${value}"`,
    };
  }).filter((item) => item.copyLine);

  if (propItems.length === 0) return null;

  const attrs = propItems
    .map((item) => item.copyLine)
    .filter(Boolean)
    .join(' ');

  return {
    vueName,
    displayName,
    rootElement: resolveComponentRootElement(instance),
    props: propItems,
    usageSnippet: attrs ? `<${vueName} ${attrs} />` : `<${vueName} />`,
  };
}

function buildFromCandidate(candidate: ResolvedCandidate, element: Element): EdsComponentInspect {
  if (candidate.genericInspect) {
    return candidate.genericInspect;
  }

  const scopeRoot = candidate.rootElement;
  const instance = resolveCandidateInstance(
    element,
    candidate.entry,
    candidate.instance,
    scopeRoot,
  );
  const vueProps = readVueProps(instance);
  const rootElement =
    candidate.entry.displayName === 'Icon'
      ? resolveIconHostElement(element) ?? candidate.rootElement
      : candidate.entry.displayName === 'Crypto'
        ? resolveCryptoHostElement(element) ?? candidate.rootElement
        : candidate.entry.displayName === 'Avatar'
          ? resolveAvatarHostElement(element) ?? candidate.rootElement
          : candidate.entry.displayName === 'Divider'
            ? resolveDividerHostElement(element) ?? candidate.rootElement
            : candidate.rootElement;

  if (candidate.entry.displayName === 'Icon') {
    const iconName = resolveIconName(element, vueProps);
    if (isAvatarGraphicAssetName(iconName)) {
      const iconRoot = resolveIconHostElement(element) ?? rootElement;
      return {
        vueName: candidate.vueName,
        displayName: 'Avatar',
        rootElement: iconRoot,
        props: buildAvatarPropertyItems(element, vueProps, iconRoot),
        codeSections: buildAvatarCodeSections(element),
        usageSnippet: buildAvatarUsageSnippet(element, vueProps),
      };
    }

    const nameRaw = buildIconPropertyItems(element, vueProps, rootElement);
    const usageName = nameRaw.find((item) => item.label === '名称')?.value;
    const usageSize = vueProps.size ?? 'md';
    const usageAttrs = [
      usageName && usageName !== '—' ? `name="${usageName}"` : '',
      usageSize !== 'md' ? `size="${String(usageSize)}"` : '',
      vueProps.fit === true ? 'fit' : '',
    ].filter(Boolean);

    return {
      vueName: candidate.vueName,
      displayName: candidate.entry.displayName,
      rootElement,
      props: nameRaw,
      codeSections: buildIconCodeSections(element),
      usageSnippet:
        usageAttrs.length > 0
          ? `<EgIcon ${usageAttrs.join(' ')} />`
          : '<EgIcon />',
    };
  }

  if (candidate.entry.displayName === 'Crypto') {
    const propItems = buildCryptoPropertyItems(element, vueProps, rootElement);
    const usageName = propItems.find((item) => item.label === '名称')?.value;
    const usageSize = vueProps.size ?? 'md';
    const usageAttrs = [
      usageName && usageName !== '—' ? `name="${usageName}"` : '',
      usageSize !== 'md' ? `size="${String(usageSize)}"` : '',
      vueProps.fit === true ? 'fit' : '',
    ].filter(Boolean);

    return {
      vueName: candidate.vueName,
      displayName: candidate.entry.displayName,
      rootElement,
      props: propItems,
      codeSections: buildCryptoCodeSections(element),
      usageSnippet:
        usageAttrs.length > 0
          ? `<EgCrypto ${usageAttrs.join(' ')} />`
          : '<EgCrypto />',
    };
  }

  if (candidate.entry.displayName === 'Avatar') {
    const propItems = buildAvatarPropertyItems(element, vueProps, rootElement);

    return {
      vueName: candidate.vueName,
      displayName: candidate.entry.displayName,
      rootElement,
      props: propItems,
      codeSections: buildAvatarCodeSections(element),
      usageSnippet: buildAvatarUsageSnippet(element, vueProps),
    };
  }

  if (candidate.entry.displayName === 'Divider') {
    const propItems = buildDividerPropertyItems(element, vueProps, rootElement);

    return {
      vueName: candidate.vueName,
      displayName: candidate.entry.displayName,
      rootElement,
      props: propItems,
      codeSections: buildDividerCodeSections(element),
      usageSnippet: buildDividerUsageSnippet(element, vueProps),
    };
  }

  const propItems = extractPropItems(
    candidate.entry,
    vueProps,
    element,
    rootElement,
  );

  return {
    vueName: candidate.vueName,
    displayName: candidate.entry.displayName,
    rootElement,
    props: propItems,
    usageSnippet: buildUsageSnippet(
      candidate.entry,
      candidate.vueName,
      vueProps,
      element,
      rootElement,
    ),
  };
}

function resolveCatalogStackLabel(
  entry: EdsInspectCatalogEntry,
  element: Element,
  vueProps: Record<string, unknown>,
): string {
  if (entry.displayName === 'Icon') {
    const iconName = resolveIconName(element, vueProps);
    if (isAvatarGraphicAssetName(iconName)) return 'Avatar';
  }
  return entry.displayName;
}

function resolveInspectLayerLabel(element: Element, _preview: Element): string {
  if (element.closest('.eds-avatar')) return 'Avatar';

  if (canInspectAsText(element)) return 'Text';

  if (isDetailApplyItemRowLayerHit(element)) return 'Apply_Item';

  const candidate = resolveInspectableCandidate(element);
  if (candidate) {
    const instance = resolveCandidateInstance(
      element,
      candidate.entry,
      candidate.instance,
      candidate.rootElement,
    );
    return resolveCatalogStackLabel(candidate.entry, element, readVueProps(instance));
  }

  return formatDomTagInspectLabel(element.tagName);
}

function buildInspectComponentChain(element: Element, preview: Element): string[] {
  const scope = resolveInspectScopeRoot(element, preview);
  const chain: string[] = [];
  const seen = new Set<string>();
  let node: Element | null = element;

  while (node && scope.contains(node)) {
    const label = resolveInspectLayerLabel(node, preview);
    if (!seen.has(label)) {
      seen.add(label);
      chain.push(label);
    }
    node = node.parentElement;
  }

  return chain;
}

/** @deprecated 使用 resolveInspectTarget().componentChain */
export function resolveInspectComponentStack(element: Element, preview: Element): string[] {
  return buildInspectComponentChain(element, preview);
}

/** 点谁是谁：DOM 节点决策树 + 单名展示；componentChain 沿 DOM 祖先逐层套用同一规则。 */
export function resolveInspectTarget(element: Element, preview: Element): InspectTargetResolution {
  const componentChain = buildInspectComponentChain(element, preview);

  const avatarMatch = resolveAvatarSubtreeCandidate(element);
  if (avatarMatch) {
    const edsComponent = buildFromCandidate(avatarMatch, element);
    return {
      primaryLabel: edsComponent.displayName,
      componentChain,
      edsComponent,
    };
  }

  if (canInspectAsText(element)) {
    return {
      primaryLabel: 'Text',
      componentChain,
      edsComponent: resolveTextInspect(element, preview),
    };
  }

  let edsComponent = resolveEdsComponentForElement(element, preview);
  if (shouldPromoteDetailApplyItemRow(element, edsComponent)) {
    const applyItem = buildDetailApplyItemInspect(element);
    if (applyItem) edsComponent = applyItem;
  }

  if (edsComponent) {
    return {
      primaryLabel: edsComponent.displayName,
      componentChain,
      edsComponent,
    };
  }

  return {
    primaryLabel: formatDomTagInspectLabel(element.tagName),
    componentChain,
    edsComponent: null,
  };
}

export function resolveEdsComponentInspect(element: Element): EdsComponentInspect | null {
  if (canInspectAsText(element)) return null;
  return resolveEdsComponentForElement(element);
}
