import { closeAllAnchoredTooltipsForShellDebugScenarioReset } from '../shellDebugScenarioAnchoredLayers';
import { WAAS_ORDER_MODE_DEMO_PROJECT_ID } from '@/scenes/project/waasProjectStore';
import { waasProjectShellApiRegistry } from '@/scenes/project/waasProjectShellApi';
import { clearQaLoadingTimeout } from './commonScenarioActions';

export function resetWaasScenarioBaseline() {
  clearQaLoadingTimeout();
  closeAllAnchoredTooltipsForShellDebugScenarioReset();
}

/** 切至 WaaS 并选中订单模式演示项目 Cascade Disburse。 */
export function applyWaasOrderModeScenario() {
  resetWaasScenarioBaseline();
  const api = waasProjectShellApiRegistry.value;
  if (!api) return;
  api.setProjectsEmpty(false);
  api.activateWaasModule();
  api.selectProjectById(WAAS_ORDER_MODE_DEMO_PROJECT_ID);
}
