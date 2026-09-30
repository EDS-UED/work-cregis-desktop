import {
  isRiskControlAmlMenuItem,
  isRiskControlAutoRulesMenuItem,
} from '@/scenes/risk-control/riskControlMenuData';

/** 风控 DataList 启用 EgFilter 的菜单。 */
export function riskControlDataListShowsEgFilter(menuItem: string | undefined): boolean {
  const item = menuItem ?? '';
  return item === 'Policy Settings'
    || item === 'Automation'
    || item === 'Logs'
    || isRiskControlAutoRulesMenuItem(item)
    || isRiskControlAmlMenuItem(item);
}

export function shouldUsePolicySettingsRecordEgFilterSchema(menuItem: string): boolean {
  return menuItem === 'Policy Settings';
}

export function shouldUseAutomationRecordEgFilterSchema(menuItem: string): boolean {
  return menuItem === 'Automation';
}

export function shouldUseLogsRecordEgFilterSchema(menuItem: string): boolean {
  return menuItem === 'Logs';
}

export function shouldUseAutoRulesRecordEgFilterSchema(menuItem: string): boolean {
  return isRiskControlAutoRulesMenuItem(menuItem);
}

export function shouldUseQueryRecordsRecordEgFilterSchema(menuItem: string): boolean {
  return isRiskControlAmlMenuItem(menuItem);
}
