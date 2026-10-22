import { shallowRef } from 'vue';
import type { useRiskControlAmlManualQueryFlow } from './useRiskControlAmlManualQueryFlow';

export type RiskControlAmlManualQueryOverlaySurface = ReturnType<
  typeof useRiskControlAmlManualQueryFlow
>['overlaySurface'];

export const riskControlAmlManualQueryOverlayRegistry =
  shallowRef<RiskControlAmlManualQueryOverlaySurface | null>(null);

export function registerRiskControlAmlManualQueryOverlay(
  surface: RiskControlAmlManualQueryOverlaySurface | null,
) {
  riskControlAmlManualQueryOverlayRegistry.value = surface;
}
