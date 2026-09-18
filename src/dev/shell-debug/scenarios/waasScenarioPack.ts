import { WAAS_ORDER_MODE_MENU_ITEMS } from '@/scenes/waas-project/waasMenuData';
import type { ShellPageKey } from '../pageKeyFromShell';
import { replaceShellDebugScenariosForPage } from '../registry';
import type { ShellDebugScenario } from '../registry';
import { applyWaasOrderModeScenario } from './waasScenarioActions';

export function createWaasOrderModeBusinessScenario(
  pageKey: ShellPageKey,
): ShellDebugScenario {
  return {
    id: 'waas-order-mode',
    pageKey,
    label: '订单模式',
    description:
      '切至 WaaS 模块并选中订单模式演示项目 Cascade Disburse；左侧模块菜单切换为订单模式。',
    apply: applyWaasOrderModeScenario,
  };
}

export function registerWaasScenarioPack() {
  for (const menuItem of WAAS_ORDER_MODE_MENU_ITEMS) {
    if (
      menuItem === 'Settings'
      || menuItem === 'Order Record'
      || menuItem === 'Bulk Transfer Record'
      || menuItem === 'Wallet Payout'
      || menuItem === 'Callback Error'
      || menuItem === 'History Callback'
    ) {
      continue;
    }

    replaceShellDebugScenariosForPage(`WaaS:${menuItem}`, [
      createWaasOrderModeBusinessScenario(`WaaS:${menuItem}`),
    ]);
  }

  replaceShellDebugScenariosForPage('WaaS:Sub-Address', [
    createWaasOrderModeBusinessScenario('WaaS:Sub-Address'),
  ]);
}

registerWaasScenarioPack();
