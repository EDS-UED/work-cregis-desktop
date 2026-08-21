import {
  buildMotionPropertyItem,
  deriveInspectMotion,
  type InspectCodeSection,
} from './buildIconInspect';
import { buildDataListAdaptiveInspect } from './buildDataListAdaptiveInspect';
import { buildDeclaredInspectCode } from './buildDeclaredInspectCode';
import { resolveInspectStyleTargetElement } from './resolveInspectStyleTarget';
import { buildInspectCodeSections } from './buildInspectCodeSections';
import { formatDomTagInspectLabel } from './buildTextInspect';
import { isInspectFloatLayerElement, resolveInspectScopeRoot } from './inspectFloatLayerScope';
import { resolveInspectTarget, type InspectTargetResolution } from './resolveEdsComponentInspect';

export type InspectPropertyItem = {
  label: string;
  value: string;
  token: string | null;
  copyLine: string;
};

export type InspectPropertyGroup = {
  id: string;
  label: string;
  items: InspectPropertyItem[];
};

export type ElementInspectInfo = {
  element: Element;
  label: string;
  /** 自内向外的 DS 组件链路（内部识别，UI 不展示完整路径）。 */
  componentChain: string[];
  tagName: string;
  domPath: string;
  classList: string[];
  edsComponentHints: string[];
  vueComponentName: string | null;
  edsComponent: InspectTargetResolution['edsComponent'];
  /** 非 DS 组件时展示的元素本身属性。 */
  elementAttributes: InspectPropertyItem[];
  rect: { width: number; height: number };
  code: {
    layout: InspectPropertyItem[];
    style: InspectPropertyItem[];
  };
  /** Icon 等组件专用：分块代码（布局 / SVG），不走 Tab。 */
  codeSections?: InspectCodeSection[];
  /** DataList 页面级列宽自适应（属性与用法之间）。 */
  adaptiveItems?: InspectPropertyItem[];
  /** @deprecated Legacy grouped dump — prefer edsComponent + code */
  groups: InspectPropertyGroup[];
  copyBundle: string;
};

function roundPx(value: number): string {
  return `${Math.round(value * 10) / 10}px`;
}

function ensureInspectMotionProperty(
  items: InspectPropertyItem[],
  element: Element,
  preview: Element,
): InspectPropertyItem[] {
  const withoutMotion = items.filter((item) => item.label !== '动效');
  const motion = deriveInspectMotion(element, preview);
  return [...withoutMotion, buildMotionPropertyItem(motion)];
}

function buildElementAttributes(
  element: Element,
  _preview: Element,
  _style: CSSStyleDeclaration,
  rect: DOMRect,
): InspectPropertyItem[] {
  const items: InspectPropertyItem[] = [];

  items.push({
    label: '尺寸',
    value: `${roundPx(rect.width)} × ${roundPx(rect.height)}`,
    token: null,
    copyLine: `size: ${roundPx(rect.width)} × ${roundPx(rect.height)}`,
  });

  items.push({
    label: '标签',
    value: element.tagName.toLowerCase(),
    token: null,
    copyLine: `tag: ${element.tagName.toLowerCase()}`,
  });

  if (element.id) {
    items.push({
      label: 'ID',
      value: element.id,
      token: null,
      copyLine: `#${element.id}`,
    });
  }

  const role = element.getAttribute('role');
  if (role) {
    items.push({
      label: 'Role',
      value: role,
      token: null,
      copyLine: `role="${role}"`,
    });
  }

  const edsClasses = [...element.classList].filter((name) => name.startsWith('eds-'));
  if (edsClasses.length > 0) {
    items.push({
      label: 'EDS 类名',
      value: edsClasses.join(' '),
      token: null,
      copyLine: edsClasses.map((name) => `.${name}`).join(' '),
    });
  }

  return items;
}

function buildDomPath(element: Element, root: Element): string {
  const segments: string[] = [];
  let node: Element | null = element;

  while (node && node !== root && node !== document.body) {
    let segment = node.tagName.toLowerCase();
    if (node.id) {
      segment += `#${node.id}`;
    } else if (node.classList.length > 0) {
      const cls = [...node.classList]
        .filter((name) => !name.startsWith('_'))
        .slice(0, 2)
        .join('.');
      if (cls) segment += `.${cls}`;
    }
    segments.unshift(segment);
    node = node.parentElement;
  }

  return segments.join(' > ');
}

function formatVueInspectLabel(vueName: string): string {
  return vueName.startsWith('Eg') ? vueName.slice(2) : vueName;
}

function resolveVueComponentName(element: Element): string | null {
  type VueInternal = {
    type?: { name?: string; __name?: string };
    parent?: VueInternal;
  };
  const probe = element as Element & { __vueParentComponent?: VueInternal };
  let current = probe.__vueParentComponent;
  while (current) {
    const name = current.type?.name || current.type?.__name;
    if (name && !name.startsWith('Base')) {
      return name;
    }
    current = current.parent;
  }
  return null;
}

function readEdsComponentHints(element: Element): string[] {
  const hints = new Set<string>();
  for (const className of element.classList) {
    if (className.startsWith('eds-')) {
      hints.add(className);
    }
  }
  for (const attr of element.attributes) {
    if (attr.name.startsWith('data-eds-')) {
      hints.add(attr.name);
    }
  }
  return [...hints].sort();
}

function buildLabel(info: {
  inspectTarget: InspectTargetResolution;
  vueComponentName: string | null;
  edsComponentHints: string[];
  tagName: string;
}): string {
  if (info.inspectTarget.primaryLabel) {
    return info.inspectTarget.primaryLabel;
  }

  if (info.edsComponentHints[0]) {
    return info.edsComponentHints[0];
  }

  if (info.vueComponentName) {
    return formatVueInspectLabel(info.vueComponentName);
  }

  return formatDomTagInspectLabel(info.tagName);
}

function buildCopyBundle(
  edsComponent: InspectTargetResolution['edsComponent'],
  elementAttributes: InspectPropertyItem[],
  code: { layout: InspectPropertyItem[]; style: InspectPropertyItem[] },
): string {
  const lines: string[] = [];
  const propertyItems = edsComponent?.props ?? elementAttributes;

  if (edsComponent) {
    lines.push(`/* ${edsComponent.displayName} */`);
    lines.push(edsComponent.usageSnippet);
    lines.push('');
  }

  if (propertyItems.length > 0) {
    for (const item of propertyItems) {
      lines.push(`${item.label}: ${item.value}`);
    }
    lines.push('');
  }

  if (code.layout.length > 0) {
    lines.push('/* 布局 */');
    for (const item of code.layout) {
      lines.push(item.copyLine);
    }
  }

  if (code.style.length > 0) {
    if (code.layout.length > 0) lines.push('');
    lines.push('/* 样式 */');
    for (const item of code.style) {
      lines.push(item.copyLine);
    }
  }

  return lines.join('\n').trim();
}

export function buildElementInspectInfo(
  element: Element,
  preview: Element,
): ElementInspectInfo | null {
  if (!preview.contains(element) && !isInspectFloatLayerElement(element)) return null;
  if (element.closest('[data-shell-debug-ui]')) return null;

  const style = getComputedStyle(element);
  const rect = element.getBoundingClientRect();
  const vueComponentName = resolveVueComponentName(element);
  const edsComponentHints = readEdsComponentHints(element);
  const inspectTarget = resolveInspectTarget(element, preview);
  let edsComponent = inspectTarget.edsComponent;
  if (edsComponent) {
    edsComponent = {
      ...edsComponent,
      props: ensureInspectMotionProperty(edsComponent.props, element, preview),
    };
  }

  const elementAttributes = ensureInspectMotionProperty(
    buildElementAttributes(element, preview, style, rect),
    element,
    preview,
  );
  const tagName = element.tagName.toLowerCase();
  const scopeRoot = resolveInspectScopeRoot(element, preview);
  const domPath = buildDomPath(element, scopeRoot);
  const label = inspectTarget.primaryLabel
    || buildLabel({ inspectTarget, vueComponentName, edsComponentHints, tagName });
  const componentChain = inspectTarget.componentChain.length > 0
    ? inspectTarget.componentChain
    : [label];
  const styleTarget = resolveInspectStyleTargetElement(element, edsComponent);
  const declaredCode = buildDeclaredInspectCode(styleTarget, preview);

  const code = {
    layout: declaredCode.layout,
    style: declaredCode.styleItems,
  };
  const codeSections = buildInspectCodeSections(
    element,
    preview,
    edsComponent?.codeSections,
    declaredCode,
  );
  const adaptiveItems = buildDataListAdaptiveInspect(preview, element);

  return {
    element,
    label,
    componentChain,
    tagName,
    domPath,
    classList: [...element.classList],
    edsComponentHints,
    vueComponentName,
    edsComponent,
    elementAttributes,
    rect: {
      width: Math.round(rect.width * 10) / 10,
      height: Math.round(rect.height * 10) / 10,
    },
    code,
    codeSections,
    adaptiveItems: adaptiveItems.length > 0 ? adaptiveItems : undefined,
    groups: [],
    copyBundle: buildCopyBundle(edsComponent, elementAttributes, code),
  };
}
