import { closeAllAnchoredTooltipsForShellDebugScenarioReset } from '../../../shellDebugScenarioAnchoredLayers';
import { manageOverviewOverlayRegistry } from '@/scenes/manage/overview/manageOverviewOverlayContext';
import { manageOverviewQaApiRegistry } from '@/scenes/manage/overview/manageOverviewQaApi';
import { clearQaLoadingTimeout } from '../../commonScenarioActions';
import { waitForShellDebugRegistry } from '../waitForShellDebugRegistry';
import { navigateToManageOverview } from '../manageOverviewQaNavigation';

export function resetManageOverviewQaBaseline() {
  clearQaLoadingTimeout();
  closeAllAnchoredTooltipsForShellDebugScenarioReset();

  const overlay = manageOverviewOverlayRegistry.value;
  if (overlay) {
    overlay.confirmDialogOpen.value = false;
    overlay.verifyOpen.value = false;
    overlay.noPermissionDialogOpen.value = false;
    overlay.setTransactionPasswordDialogOpen.value = false;
  }

  manageOverviewQaApiRegistry.value?.resetOverviewQaBaseline();
}

async function withManageOverviewPage(apply: () => void | Promise<void>) {
  resetManageOverviewQaBaseline();
  navigateToManageOverview();
  const api = await waitForShellDebugRegistry(manageOverviewQaApiRegistry);
  if (!api) return;
  api.resetOverviewQaBaseline();
  await apply();
}

export async function applyManageOverviewGasNotEnabledQa() {
  await withManageOverviewPage(() => {
    manageOverviewQaApiRegistry.value?.applySnapshot({ gasProxyEnabled: false });
  });
}

export async function applyManageOverviewGasProxyNoPermissionDialogQa() {
  await withManageOverviewPage(async () => {
    const overlay = await waitForShellDebugRegistry(manageOverviewOverlayRegistry);
    if (!overlay) return;
    overlay.noPermissionDialogOpen.value = true;
  });
}

export async function applyManageOverviewGasProxySetPasswordDialogQa() {
  await withManageOverviewPage(async () => {
    const overlay = await waitForShellDebugRegistry(manageOverviewOverlayRegistry);
    if (!overlay) return;
    overlay.setTransactionPasswordDialogOpen.value = true;
  });
}
