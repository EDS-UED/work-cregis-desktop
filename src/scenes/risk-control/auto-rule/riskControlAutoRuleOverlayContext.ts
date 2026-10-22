import { shallowRef } from 'vue';
import type { useRiskControlAutoRuleFlow } from './useRiskControlAutoRuleFlow';

export type RiskControlAutoRuleOverlaySurface = ReturnType<
  typeof useRiskControlAutoRuleFlow
>['overlaySurface'];

export const riskControlAutoRuleOverlayRegistry =
  shallowRef<RiskControlAutoRuleOverlaySurface | null>(null);

export function registerRiskControlAutoRuleOverlay(
  surface: RiskControlAutoRuleOverlaySurface | null,
) {
  riskControlAutoRuleOverlayRegistry.value = surface;
}
