import type { InspectCodeSection } from './buildIconInspect';
import type { InspectPropertyItem } from './buildElementInspectInfo';
import {
  isCatalogComponentRoot,
  type EdsComponentInspect,
} from './resolveEdsComponentInspect';
import {
  formatCssDeclaration,
  formatTokenVar,
  INSPECT_TOKEN_FILTERS,
} from './resolveDesignToken';

type TypographyRole = {
  label: string;
  sizeToken: string;
  weightToken: string;
  lineHeightToken: string;
};

const TYPOGRAPHY_ROLES: TypographyRole[] = [
  {
    label: 'Display',
    sizeToken: '--eds-display-size',
    weightToken: '--eds-display-weight',
    lineHeightToken: '--eds-display-line-height',
  },
  {
    label: 'Headline',
    sizeToken: '--eds-headline-size',
    weightToken: '--eds-headline-weight',
    lineHeightToken: '--eds-headline-line-height',
  },
  {
    label: 'Title',
    sizeToken: '--eds-title-size',
    weightToken: '--eds-title-weight',
    lineHeightToken: '--eds-title-line-height',
  },
  {
    label: 'Body Large',
    sizeToken: '--eds-body-large-size',
    weightToken: '--eds-body-large-weight',
    lineHeightToken: '--eds-body-large-line-height',
  },
  {
    label: 'Body Large Strong',
    sizeToken: '--eds-body-large-strong-size',
    weightToken: '--eds-body-large-strong-weight',
    lineHeightToken: '--eds-body-large-strong-line-height',
  },
  {
    label: 'Body Medium',
    sizeToken: '--eds-body-medium-size',
    weightToken: '--eds-body-medium-weight',
    lineHeightToken: '--eds-body-medium-line-height',
  },
  {
    label: 'Body Medium Strong',
    sizeToken: '--eds-body-medium-strong-size',
    weightToken: '--eds-body-medium-strong-weight',
    lineHeightToken: '--eds-body-medium-strong-line-height',
  },
  {
    label: 'Body Small',
    sizeToken: '--eds-body-small-size',
    weightToken: '--eds-body-small-weight',
    lineHeightToken: '--eds-body-small-line-height',
  },
  {
    label: 'Body Small Strong',
    sizeToken: '--eds-body-small-strong-size',
    weightToken: '--eds-body-small-strong-weight',
    lineHeightToken: '--eds-body-small-strong-line-height',
  },
  {
    label: 'Footnote',
    sizeToken: '--eds-footnote-size',
    weightToken: '--eds-footnote-weight',
    lineHeightToken: '--eds-footnote-line-height',
  },
  {
    label: 'Footnote Strong',
    sizeToken: '--eds-footnote-strong-size',
    weightToken: '--eds-footnote-strong-weight',
    lineHeightToken: '--eds-footnote-strong-line-height',
  },
  {
    label: 'Bar',
    sizeToken: '--eds-bar-size',
    weightToken: '--eds-bar-weight',
    lineHeightToken: '--eds-bar-line-height',
  },
];

const TEXT_TAGS = new Set(['SPAN', 'P', 'LABEL', 'EM', 'STRONG', 'SMALL', 'TIME', 'A']);
const NON_TEXT_TAGS = new Set(['SVG', 'IMG', 'INPUT', 'TEXTAREA', 'SELECT', 'VIDEO', 'CANVAS']);
const HOST_CLASSES = [
  'eds-button',
  'eds-link',
  'eds-tag',
  'eds-module-menu-item',
  'eds-tab',
  'eds-icon-button',
  'eds-icon-button-pro',
];
const PREFERRED_TEXT_HOST_CLASS_PARTS = [
  'itemMain',
  'itemTitleText',
  'labelWrap',
  'itemValueText',
];
const SIZE_MATCH_EPSILON = 0.61;

function tokenComputedPx(preview: Element, token: string, cssProperty: 'fontSize' | 'lineHeight'): number {
  const probe = document.createElement('div');
  probe.style.position = 'absolute';
  probe.style.visibility = 'hidden';
  probe.style[cssProperty] = `var(${token})`;
  preview.appendChild(probe);
  const value = Number.parseFloat(getComputedStyle(probe)[cssProperty]);
  preview.removeChild(probe);
  return value;
}

function tokenComputedWeight(preview: Element, token: string): string {
  const probe = document.createElement('div');
  probe.style.position = 'absolute';
  probe.style.visibility = 'hidden';
  probe.style.fontWeight = `var(${token})`;
  preview.appendChild(probe);
  const value = getComputedStyle(probe).fontWeight;
  preview.removeChild(probe);
  return value;
}

function readScaledTypeMetrics(style: CSSStyleDeclaration) {
  const fontSizePx = Number.parseFloat(style.fontSize);
  const lineHeightPx = Number.parseFloat(style.lineHeight);
  return {
    fontSizePx,
    lineHeightPx,
    fontWeight: style.fontWeight,
  };
}

function matchesTypographyRole(
  preview: Element,
  role: TypographyRole,
  metrics: { fontSizePx: number; lineHeightPx: number; fontWeight: string },
): boolean {
  const size = tokenComputedPx(preview, role.sizeToken, 'fontSize');
  const lineHeight = tokenComputedPx(preview, role.lineHeightToken, 'lineHeight');
  const weight = tokenComputedWeight(preview, role.weightToken);
  return (
    Number.isFinite(size)
    && Number.isFinite(lineHeight)
    && Math.abs(metrics.fontSizePx - size) < SIZE_MATCH_EPSILON
    && Math.abs(metrics.lineHeightPx - lineHeight) < SIZE_MATCH_EPSILON
    && weight === metrics.fontWeight
  );
}

export function resolveTypographyRole(
  preview: Element,
  element: Element,
  style: CSSStyleDeclaration,
): TypographyRole | null {
  const metrics = readScaledTypeMetrics(style);
  const matches = TYPOGRAPHY_ROLES.filter((role) => matchesTypographyRole(preview, role, metrics));
  if (matches.length === 0) return null;
  if (matches.length === 1) return matches[0] ?? null;
  const strong = matches.filter((role) => role.label.endsWith(' Strong'));
  return strong[0] ?? matches[0] ?? null;
}

function lineHeightPercentComment(metrics: { fontSizePx: number; lineHeightPx: number }): string | null {
  if (!Number.isFinite(metrics.fontSizePx) || !Number.isFinite(metrics.lineHeightPx) || metrics.fontSizePx <= 0) {
    return null;
  }
  return `${Math.round((metrics.lineHeightPx / metrics.fontSizePx) * 1000) / 10}%`;
}

function readDirectText(element: Element): string {
  const parts: string[] = [];
  for (const node of element.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.replace(/\s+/g, ' ').trim();
      if (text) parts.push(text);
    }
  }
  return parts.join(' ').trim();
}

function isPreferredTextHost(element: Element): boolean {
  return [...element.classList].some((name) =>
    PREFERRED_TEXT_HOST_CLASS_PARTS.some((part) => name.includes(part)),
  );
}

export function isTextLeaf(element: Element): boolean {
  if (element.closest('.eds-avatar')) return false;
  if (NON_TEXT_TAGS.has(element.tagName)) return false;
  if (HOST_CLASSES.some((name) => element.classList.contains(name))) return false;
  if (element.querySelector('svg, img, input, textarea, select, video, canvas, button')) return false;

  const text = readDirectText(element) || element.textContent?.replace(/\s+/g, ' ').trim() || '';
  if (!text) return false;

  if (isPreferredTextHost(element)) return true;

  const elementChildren = [...element.children].filter((child) => child.tagName !== 'BR');
  if (TEXT_TAGS.has(element.tagName) && elementChildren.length === 0) return true;

  return [...element.classList].some((name) => name.includes('itemLabel'));
}

export function resolvePreferredInspectElement(element: Element): Element {
  if (isCatalogComponentRoot(element)) return element;
  if (isPreferredTextHost(element)) return element;

  let ancestor: Element | null = element.parentElement;
  while (ancestor) {
    const current = ancestor;
    if (HOST_CLASSES.some((name) => current.classList.contains(name))) break;
    if (isPreferredTextHost(current)) return current;
    ancestor = current.parentElement;
  }

  const descendantHost = [...element.querySelectorAll('span, p, label, em, strong, small, time, a')].find(
    (node) => isPreferredTextHost(node),
  );
  if (descendantHost) return descendantHost;

  if (isTextLeaf(element)) return element;

  const candidates = [...element.querySelectorAll('span, p, label, em, strong, small, time, a')];
  const leaf = candidates.find((node) => isTextLeaf(node));
  return leaf ?? element;
}

function buildTypographyLines(
  preview: Element,
  element: Element,
  style: CSSStyleDeclaration,
): string[] {
  const role = resolveTypographyRole(preview, element, style);
  const metrics = readScaledTypeMetrics(style);
  const lines: string[] = [];

  const color = formatCssDeclaration(preview, 'color', style.color, {
    filter: INSPECT_TOKEN_FILTERS.textColor,
    cssProperty: 'color',
  });
  if (color) lines.push(color);

  const family = formatCssDeclaration(preview, 'font-family', style.fontFamily, {
    filter: INSPECT_TOKEN_FILTERS.fontFamily,
    cssProperty: 'fontFamily',
  });
  if (family) lines.push(family);

  if (role) {
    lines.push(`font-size: ${formatTokenVar(role.sizeToken)};`);
    lines.push(`font-weight: ${formatTokenVar(role.weightToken)};`);
    const percent = lineHeightPercentComment(metrics);
    lines.push(
      percent
        ? `line-height: ${formatTokenVar(role.lineHeightToken)}; /* ${percent} */`
        : `line-height: ${formatTokenVar(role.lineHeightToken)};`,
    );
    return lines;
  }

  const fontSize = formatCssDeclaration(preview, 'font-size', style.fontSize, {
    filter: INSPECT_TOKEN_FILTERS.typographySize,
    cssProperty: 'fontSize',
  });
  if (fontSize) lines.push(fontSize);

  if (style.fontStyle.trim() && style.fontStyle !== 'normal') {
    lines.push(`font-style: ${style.fontStyle};`);
  }

  const fontWeight = formatCssDeclaration(preview, 'font-weight', style.fontWeight, {
    filter: INSPECT_TOKEN_FILTERS.typographyWeight,
    cssProperty: 'fontWeight',
  });
  if (fontWeight) lines.push(fontWeight);

  const lineHeight = formatCssDeclaration(preview, 'line-height', style.lineHeight, {
    filter: INSPECT_TOKEN_FILTERS.typographyLineHeight,
    cssProperty: 'lineHeight',
  });
  if (lineHeight) lines.push(lineHeight);

  return lines;
}

function buildLayoutLines(preview: Element, style: CSSStyleDeclaration): string[] {
  const lines: string[] = [];
  const display = style.display.trim();
  if (display && display !== 'inline' && display !== 'contents') {
    lines.push(`display: ${display};`);
  }

  const width = formatCssDeclaration(
    preview,
    'width',
    style.width,
    {
      filter: (name) => INSPECT_TOKEN_FILTERS.spacing(name) || INSPECT_TOKEN_FILTERS.scale(name),
    },
  );
  if (width && !width.includes('auto') && !width.includes('%')) {
    lines.push(width);
  }

  return lines;
}

export function resolveTextInspect(
  element: Element,
  preview: Element,
): EdsComponentInspect | null {
  if (!isTextLeaf(element)) return null;

  const style = getComputedStyle(element);
  const text = readDirectText(element) || element.textContent?.replace(/\s+/g, ' ').trim() || '—';
  const role = resolveTypographyRole(preview, element, style);
  const props: InspectPropertyItem[] = [
    {
      label: '样式',
      value: role?.label ?? '—',
      token: null,
      copyLine: role?.label ?? '',
    },
    {
      label: '文本',
      value: text,
      token: null,
      copyLine: text === '—' ? '' : text,
    },
  ].filter((item) => item.value !== '—');

  const layout = buildLayoutLines(preview, style);
  const typography = buildTypographyLines(preview, element, style);
  const codeSections: InspectCodeSection[] = [];
  if (layout.length > 0) codeSections.push({ title: '布局', content: layout.join('\n') });
  if (typography.length > 0) codeSections.push({ title: '字体排版', content: typography.join('\n') });

  return {
    vueName: 'Text',
    displayName: 'Text',
    rootElement: element,
    props,
    usageSnippet: '',
    codeSections,
  };
}

export function resolveInspectAncestor(element: Element, preview: Element): string | null {
  type VueInternal = {
    type?: { name?: string; __name?: string };
    parent?: VueInternal;
    subTree?: { el?: Element | null };
    vnode?: { el?: Element | null };
  };

  const formatName = (name: string) => (name.startsWith('Eg') ? name.slice(2) : name);
  let current = (element as Element & { __vueParentComponent?: VueInternal }).__vueParentComponent;
  while (current) {
    const root = current.subTree?.el ?? current.vnode?.el;
    if (root === element) {
      current = current.parent;
      continue;
    }
    const name = current.type?.name || current.type?.__name;
    if (name && name !== 'Text' && !name.startsWith('Base')) {
      return formatName(name);
    }
    current = current.parent;
  }

  let node = element.parentElement;
  while (node && preview.contains(node)) {
    const probe = node as Element & { __vueParentComponent?: VueInternal };
    let instance = probe.__vueParentComponent;
    while (instance) {
      const name = instance.type?.name || instance.type?.__name;
      if (name && name !== 'Text' && !name.startsWith('Base')) {
        return formatName(name);
      }
      instance = instance.parent;
    }
    node = node.parentElement;
  }

  return null;
}

export function resolveMotionLabel(element: Element): string {
  if (
    (element instanceof HTMLButtonElement && element.disabled)
    || element.getAttribute('aria-disabled') === 'true'
  ) {
    return '无';
  }
  if (element.classList.contains('motion-none')) return '.motion-none';
  if (element.classList.contains('motion-ease') && element.classList.contains('is-enter-only')) {
    return '.motion-ease.is-enter-only';
  }
  if (element.classList.contains('motion-ease') && element.classList.contains('is-hover')) {
    return '.motion-ease.is-hover';
  }
  if (element.classList.contains('motion-ease') && element.classList.contains('is-paint')) {
    return '.motion-ease.is-paint';
  }
  if (element.classList.contains('motion-ease') && element.classList.contains('is-asym')) {
    return '.motion-ease.is-asym';
  }
  if (element.classList.contains('motion-ease')) return '.motion-ease';
  if (element.classList.contains('motion-flotation') && element.classList.contains('is-active')) {
    return '.motion-flotation.is-active';
  }
  if (element.classList.contains('motion-layout') && element.classList.contains('is-active')) {
    return '.motion-layout.is-active';
  }
  if (element.classList.contains('motion-deform')) return '.motion-deform';
  if (element.classList.contains('motion-page')) return '.motion-page';
  if (element.classList.contains('motion-layout-deform')) return '.motion-layout-deform';
  if (element.classList.contains('motion-flotation')) return '.motion-flotation';
  if (element.classList.contains('motion-layout')) return '.motion-layout';
  return '无';
}

export function roundInspectPx(value: number): string {
  return `${Math.round(value * 10) / 10}px`;
}
