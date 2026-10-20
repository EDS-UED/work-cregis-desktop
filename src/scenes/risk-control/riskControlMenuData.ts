import { riskControlLogRowHasActionButton } from './riskControlLogRowHasActionButton';

export const RISK_CONTROL_DATA_LIST_MENU_ITEMS = [
  'Policy Settings',
  'Automation',
  'Auto Rules',
  'AML',
  'Logs',
  'Whitelist',
  'Blacklist',
] as const;

export type RiskControlDataListMenuItem = (typeof RISK_CONTROL_DATA_LIST_MENU_ITEMS)[number];

/** tier-2 分组父级：仅展开子菜单，无独立列表页。 */
export const RISK_CONTROL_MENU_BRANCH_ONLY_ITEMS = new Set(['AML']);

export const RISK_CONTROL_AML_QUERY_MENU_ITEM = 'AML Query' as const;

/** EDS 模块菜单别名 → 业务 DataList canonical menuItem。 */
export const RISK_CONTROL_MENU_ALIASES = {
  'Query Records': 'AML',
} as const satisfies Record<string, RiskControlDataListMenuItem>;

export type RiskControlMenuAlias = keyof typeof RISK_CONTROL_MENU_ALIASES;

export const RISK_CONTROL_SELECTABLE_MENU_ITEMS = [
  ...RISK_CONTROL_DATA_LIST_MENU_ITEMS,
  RISK_CONTROL_AML_QUERY_MENU_ITEM,
  ...Object.keys(RISK_CONTROL_MENU_ALIASES),
] as const;

export const DEFAULT_RISK_CONTROL_MENU_ITEM: RiskControlDataListMenuItem = 'Policy Settings';

export function resolveRiskControlRecordMenuItem(
  menuItem: string,
): RiskControlDataListMenuItem {
  const alias = RISK_CONTROL_MENU_ALIASES[menuItem as RiskControlMenuAlias];
  if (alias) return alias;

  if ((RISK_CONTROL_DATA_LIST_MENU_ITEMS as readonly string[]).includes(menuItem)) {
    return menuItem as RiskControlDataListMenuItem;
  }

  return DEFAULT_RISK_CONTROL_MENU_ITEM;
}

export function isRiskControlMenuBranchOnlyItem(label: string): boolean {
  return RISK_CONTROL_MENU_BRANCH_ONLY_ITEMS.has(label);
}

export function isRiskControlAmlQueryMenuItem(menuItem: string): boolean {
  return menuItem === RISK_CONTROL_AML_QUERY_MENU_ITEM;
}

export function isRiskControlAutoRulesMenuItem(menuItem: string): boolean {
  return resolveRiskControlRecordMenuItem(menuItem) === 'Auto Rules';
}

export function isRiskControlAmlMenuItem(menuItem: string): boolean {
  if (isRiskControlAmlQueryMenuItem(menuItem)) return false;
  return resolveRiskControlRecordMenuItem(menuItem) === 'AML';
}

export function isRiskControlLogsMenuItem(menuItem: string): boolean {
  return resolveRiskControlRecordMenuItem(menuItem) === 'Logs';
}

export function isRiskControlAddressBookMenuItem(menuItem: string): boolean {
  const resolvedMenuItem = resolveRiskControlRecordMenuItem(menuItem);
  return resolvedMenuItem === 'Whitelist' || resolvedMenuItem === 'Blacklist';
}

/** 风控列表 · 整行点击是否打开详情（与 Action 列按钮可见性对齐）。 */
export function shouldOpenRiskControlDetailOnRowClick(
  menuItem: string,
  row: { logTypeKey?: string; logActionKey?: string },
): boolean {
  if (isRiskControlAmlMenuItem(menuItem) || isRiskControlAutoRulesMenuItem(menuItem)) {
    return true;
  }
  if (isRiskControlLogsMenuItem(menuItem)) {
    return riskControlLogRowHasActionButton(row);
  }
  return false;
}

export function isRiskControlDataListMenuItem(
  label: string,
): label is RiskControlDataListMenuItem | RiskControlMenuAlias {
  if (isRiskControlAmlQueryMenuItem(label)) return false;
  return (RISK_CONTROL_SELECTABLE_MENU_ITEMS as readonly string[]).includes(label);
}

/** 风控模块菜单可切换项（含 AML 查询页，不含 AML 分组父级）。 */
export function isRiskControlModuleMenuItem(label: string): boolean {
  if (isRiskControlAmlQueryMenuItem(label)) return true;
  if (isRiskControlMenuBranchOnlyItem(label)) return false;
  return isRiskControlDataListMenuItem(label);
}
