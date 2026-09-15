/**
 * 属性面板「祖先 / 容器」—— 交代点不到的父层归属。
 *
 * ## 为什么需要
 *
 * 命名恒「点谁是谁」（`inspectNamingRules.ts` 五条规则），所以 EDS 组件名只出现在它自己的
 * 根节点上。但有些组件根**点不到**：`ToolBar.module.css` 的 `.root` / `.chrome` 是
 * `width: 100%` 且无内边距，被 `.raw` 完全铺满 —— 点工具栏永远命中 `.raw`（`Div`），
 * `header.eds-tool-bar` 没有任何可点像素。Paginer / Skid / NavBar 的固定栏同理。
 *
 * | 点击节点 | 名字 | 祖先 | 容器 |
 * |---|---|---|---|
 * | `div._raw_`（ToolBar 固定栏） | `Div` | `ToolBar` | — |
 * | `span._iconSlot_` | `Span` | `IconButtonPro` | — |
 * | 批处理 Flotation 行内 `span` | `Text` | `Tooltip` | `flotation` |
 *
 * ## Teleport Tooltip 浮层
 *
 * AnchoredTooltip 触发器在 preview 内、浮层内容 teleport 到 `eds-tooltip-v-*`。
 * DOM 祖先链到不了触发器，故 **祖先固定为 `Tooltip`**；**容器** 为 AnchoredTooltip /
 * EgTooltipPanel 的真实 raw `panelKind`（container / flotation / popup / subtle / molde）。
 * **【禁止】** Popover（`.eds-popover`）展示容器行。
 *
 * ## 【禁止】回流进名字
 *
 * 此值**只作展示**，不得参与 `primaryLabel` / `componentChain` / props 的计算。
 */
import { resolveInspectScopeRoot } from './inspectFloatLayerScope';
import { resolveInspectNamedLayerLabel } from './resolveEdsComponentInspect';
import { resolveInspectTooltipContainerName } from './resolveInspectTooltipContainer';

/** Teleport Tooltip 浮层内祖先恒为 `Tooltip`；容器行仅在此情况下展示。 */
export const INSPECT_TOOLTIP_ANCESTOR_LABEL = 'Tooltip';

const EDS_TOOLTIP_HOST_SELECTOR = '[id^="eds-tooltip-v-"]';

function isInsideEdsTooltipHost(element: Element): boolean {
  return Boolean(element.closest(EDS_TOOLTIP_HOST_SELECTOR));
}

export function resolveInspectAncestorName(element: Element, preview: Element): string | null {
  if (isInsideEdsTooltipHost(element)) {
    return INSPECT_TOOLTIP_ANCESTOR_LABEL;
  }

  const scope = resolveInspectScopeRoot(element, preview);
  let node = element.parentElement;

  while (node && scope.contains(node)) {
    const label = resolveInspectNamedLayerLabel(node, preview);
    if (label) return label;
    node = node.parentElement;
  }

  return null;
}

/**
 * 属性面板「容器」—— 委托 `resolveInspectTooltipContainerName`（raw panelKind 真源）。
 * **【必须】** 仅当祖先为 `Tooltip` 时由 `buildElementInspectInfo` 写入面板。
 */
export function resolveInspectContainerName(element: Element, preview: Element): string | null {
  return resolveInspectTooltipContainerName(element, preview);
}
