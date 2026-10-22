import { shallowRef } from 'vue';
import type { useRiskControlAmlRecordDetailFlow } from './useRiskControlAmlRecordDetailFlow';

export type RiskControlAmlRecordDetailOverlaySurface = ReturnType<
  typeof useRiskControlAmlRecordDetailFlow
>['overlaySurface'];

export const riskControlAmlRecordDetailOverlayRegistry =
  shallowRef<RiskControlAmlRecordDetailOverlaySurface | null>(null);

export function registerRiskControlAmlRecordDetailOverlay(
  surface: RiskControlAmlRecordDetailOverlaySurface | null,
) {
  riskControlAmlRecordDetailOverlayRegistry.value = surface;
}
