/**
 * EgTooltipPanel / AnchoredTooltip 的 `panelKind` 真源（eds-desktop `TooltipPanelKind`）。
 *
 * - 属性面板「容器」行：展示 raw panelKind（container / flotation / …）
 * - catalog `resolveDisplayName`：仍映射 Figma 盒子角色名（ContainerBox / …）
 */
export const TOOLTIP_PANEL_KINDS = new Set([
  'container',
  'flotation',
  'popup',
  'subtle',
  'molde',
]);

/** catalog 组件名 hook：仅盒子角色；subtle / molde 仍显示 Tooltip。 */
export const TOOLTIP_PANEL_KIND_CATALOG_DISPLAY_NAMES: Readonly<Record<string, string>> = {
  container: 'ContainerBox',
  flotation: 'FlotationBox',
  popup: 'PopupBox',
};

/** panelKind → effect 语义类（eds-desktop Tooltip.vue） */
export const TOOLTIP_PANEL_KIND_EFFECT_CLASS: Readonly<Record<string, string>> = {
  container: 'effect-container-box',
  flotation: 'effect-flotation-box',
  popup: 'effect-popup-box',
  subtle: 'effect-subtle-card',
  molde: 'effect-molde-level',
};

/** 属性面板「容器」值 —— raw panelKind；缺省对齐 EDS default `flotation`。 */
export function normalizeTooltipPanelKindValue(panelKind: unknown): string | null {
  const key = String(panelKind ?? 'flotation').trim() || 'flotation';
  return TOOLTIP_PANEL_KINDS.has(key) ? key : null;
}

/** catalog `resolveDisplayName`：panelKind → Figma 盒子组件名。 */
export function resolveTooltipCatalogDisplayNameFromPanelKind(panelKind: unknown): string | null {
  const key = String(panelKind ?? '').trim();
  if (!key) return null;
  return TOOLTIP_PANEL_KIND_CATALOG_DISPLAY_NAMES[key] ?? null;
}
