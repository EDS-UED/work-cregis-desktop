import { lookupEdsCatalogByVueName } from './edsInspectCatalog';
import {
  findDirectDomCatalogEntry,
  findEdsComponentRootInstance,
  type VueComponentInternal,
} from './inspectIdentity';

/** 结构图只画外框 + margin、不展开内部的简单原子 / 控件（catalog displayName）。 */
export const LAYOUT_MAP_BORDER_ONLY_DISPLAY_NAMES = new Set([
  'Icon',
  'Crypto',
  'Avatar',
  'Divider',
  'Input',
  'Textarea',
  'Button',
  'Tabs',
  'Segmented',
  'Checkbox',
  'Radio',
  'Switch',
  'Decide',
  'Tag',
  'Streamer',
  'Toast',
  'Message',
  'Reddot',
  'EndFeedbackCard',
  'Progress',
  /** 胶囊 / chrome：NavBar、Paginer（EgNavBar / EgPaginer）、BatchBar 只画外框。 */
  'NavBar',
  'Paginer',
  'BatchBar',
]);

const LAYOUT_MAP_CAPSULE_TOOLTIP_PANEL_VUE_NAMES = new Set(['TooltipPanel', 'EgTooltipPanel']);

const R1_ATOMIC_DOM_CLASS_TO_DISPLAY_NAME: Record<string, string> = {
  'eds-icon': 'Icon',
  'eds-crypto': 'Crypto',
  'eds-avatar': 'Avatar',
  'eds-nav-bar': 'NavBar',
  /** EgNavBar 外壳（含 nav + 竖向 Divider）；须在 walk 入口截断，避免 shell 被父级画成虚线 cell。 */
  'eds-nav-bar-shell': 'NavBar',
  'eds-paginer': 'Paginer',
};

type VueInstanceProbe = VueComponentInternal & {
  props?: Record<string, unknown>;
  vnode?: { props?: Record<string, unknown> };
};

function readLayoutMapVueComponentProps(instance: VueComponentInternal): Record<string, unknown> {
  const probe = instance as VueInstanceProbe;

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

/** Popup Box + radius-full 胶囊（如多签邀请浮标）：只画外框，不展开 Icon / 文案。 */
function isLayoutMapCapsuleTooltipPanelRoot(element: Element): boolean {
  const eds = findEdsComponentRootInstance(element);
  if (!eds || !LAYOUT_MAP_CAPSULE_TOOLTIP_PANEL_VUE_NAMES.has(eds.vueName)) return false;

  const props = readLayoutMapVueComponentProps(eds.instance);
  const panelKind = String(props.panelKind ?? 'flotation').trim();
  const panelRadius = String(props.panelRadius ?? '').trim();

  return panelKind === 'popup' && panelRadius === 'radius-full';
}

/** 解析节点对应的 Inspect catalog displayName；非组件根返回 null。 */
export function resolveLayoutMapComponentDisplayName(element: Element): string | null {
  for (const className of element.classList) {
    const displayName = R1_ATOMIC_DOM_CLASS_TO_DISPLAY_NAME[className];
    if (displayName) return displayName;
  }

  const catalog = findDirectDomCatalogEntry(element);
  if (catalog) return catalog.entry.displayName;

  const eds = findEdsComponentRootInstance(element);
  if (!eds) return null;

  const entry =
    lookupEdsCatalogByVueName(eds.vueName)
    ?? lookupEdsCatalogByVueName(`Eg${eds.vueName}`);
  if (entry) return entry.displayName;

  return eds.vueName;
}

export function isLayoutMapBorderOnlyComponentRoot(element: Element): boolean {
  if (isLayoutMapCapsuleTooltipPanelRoot(element)) return true;

  const displayName = resolveLayoutMapComponentDisplayName(element);
  return displayName != null && LAYOUT_MAP_BORDER_ONLY_DISPLAY_NAMES.has(displayName);
}
