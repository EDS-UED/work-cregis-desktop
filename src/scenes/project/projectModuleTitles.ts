import type { CregisModuleMenuBusinessTitle } from '@/presets/module-menu/businessModuleTitles';

export function isWaasModuleTitle(title: CregisModuleMenuBusinessTitle | string): boolean {
  return title === 'WaaS';
}

export function isPaymentEngineModuleTitle(title: CregisModuleMenuBusinessTitle | string): boolean {
  return title === 'Payment Engine';
}

export function isReportModuleTitle(title: CregisModuleMenuBusinessTitle | string): boolean {
  return title === 'Report';
}
