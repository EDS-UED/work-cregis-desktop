/**
 * Tooltip 浮层「容器」行 —— 仅 raw `panelKind`（container | flotation | popup | subtle | molde）。
 *
 * **【禁止】** Popover（`.eds-popover`）走 Tooltip 容器 —— EgAnchoredPopover 无 panelKind 容器语义。
 * **【禁止】** effect 类 / PopoverBox / FlotationBox 等盒子名冒充容器值。
 *
 * 1. 最近 EgTooltipPanel / Tooltip.vue 壳（wrap-tooltip=true）
 * 2. AnchoredTooltip panelKind（wrap-tooltip=false，且不在 `.eds-popover` 内）
 */
import {
  findVueInstancesWithDomRoot,
  walkVueChain,
  type VueComponentInternal,
} from './inspectIdentity';
import { resolveInspectScopeRoot } from './inspectFloatLayerScope';
import { normalizeTooltipPanelKindValue } from './inspectTooltipPanelKind';

const EDS_TOOLTIP_HOST_SELECTOR = '[id^="eds-tooltip-v-"]';

const TOOLTIP_PANEL_VUE_NAMES = new Set(['Tooltip', 'EgTooltipPanel', 'TooltipPanel']);

function resolveVueComponentName(instance: VueComponentInternal): string | null {
  return instance.type?.name || instance.type?.__name || null;
}

type VueInstanceProbe = VueComponentInternal & {
  props?: Record<string, unknown>;
  vnode?: { props?: Record<string, unknown> };
};

function readVueComponentProps(instance: VueComponentInternal): Record<string, unknown> {
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

function isTooltipPanelVueName(name: string | null): boolean {
  return Boolean(name && TOOLTIP_PANEL_VUE_NAMES.has(name));
}

function resolvePanelKindFromTooltipPanelNode(node: Element): string | null {
  const candidates: Element[] = [node];
  if (node.classList.contains('eds-tooltip-panel') && node.parentElement instanceof Element) {
    candidates.push(node.parentElement);
  }

  for (const candidate of candidates) {
    for (const instance of findVueInstancesWithDomRoot(candidate)) {
      const vueName = resolveVueComponentName(instance);
      if (!isTooltipPanelVueName(vueName)) continue;
      return normalizeTooltipPanelKindValue(readVueComponentProps(instance).panelKind);
    }
  }

  return null;
}

function resolveAnchoredTooltipInstance(element: Element): VueComponentInternal | null {
  for (const instance of walkVueChain(element)) {
    const vueName = resolveVueComponentName(instance);
    if (vueName === 'AnchoredTooltip' || vueName === 'EgTooltip') {
      return instance;
    }
  }
  return null;
}

function resolvePanelKindFromAnchoredTooltip(element: Element): string | null {
  const instance = resolveAnchoredTooltipInstance(element);
  if (!instance) return null;

  const props = readVueComponentProps(instance);
  if (props.wrapTooltip === true) return null;

  return normalizeTooltipPanelKindValue(props.panelKind);
}

/** 仅在 `eds-tooltip-v-*` 浮层内调用（外层已 gate 祖先 = Tooltip）。 */
export function resolveInspectTooltipContainerName(element: Element, preview: Element): string | null {
  if (!element.closest(EDS_TOOLTIP_HOST_SELECTOR)) return null;

  // Popover 组件无 Tooltip panelKind 容器语义（EgRemarkPopover / EgConfirmPopover 等）。
  if (element.closest('.eds-popover')) return null;

  const scope = resolveInspectScopeRoot(element, preview);
  let node = element.parentElement;

  while (node && scope.contains(node)) {
    const fromPanel = resolvePanelKindFromTooltipPanelNode(node);
    if (fromPanel) return fromPanel;
    node = node.parentElement;
  }

  return resolvePanelKindFromAnchoredTooltip(element);
}
