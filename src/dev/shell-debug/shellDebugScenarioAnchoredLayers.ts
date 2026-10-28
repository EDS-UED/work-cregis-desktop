import { closeAllAnchoredTooltips } from './shim/anchoredTooltipManager';

/** QA 场景切换：清 click + hover 锚定层（日常 closeAll 默认保留 hover，见 §1.4）。 */
export function closeAllAnchoredTooltipsForShellDebugScenarioReset(): void {
  closeAllAnchoredTooltips({ includeHoverLayers: true });
}
