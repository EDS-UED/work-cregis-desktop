import type { ModuleMenuPresetGroup, ModuleMenuPresetItem } from '@eds/desktop-components';
import {
  MANAGE_FEE_RECORDS_MENU_ITEM,
  MANAGE_GAS_PROXY_PAYMENT_RECORDS_MENU_ITEM,
  MANAGE_OVERVIEW_MENU_ITEM,
} from './manageMenuData';

export const MANAGE_TEAM_ACCOUNT_BALANCE_MENU_ITEM = 'Team Account Balance';

const TEAM_ACCOUNT_BRANCH_SUBITEMS: ModuleMenuPresetItem[] = [
  { label: MANAGE_OVERVIEW_MENU_ITEM, icon: 'eds-dashboard' },
  { label: MANAGE_FEE_RECORDS_MENU_ITEM, icon: 'eds-text-amount' },
  { label: MANAGE_GAS_PROXY_PAYMENT_RECORDS_MENU_ITEM, icon: 'eds-text-logs-policy' },
];

/**
 * Manage · 团队账户：业务真源为 tier-2（总览 / 费用记录 / Gas 代付记录）。
 * Pages CI 若 checkout 旧 eds preset（无 subitems），在此补齐，避免「团队账户」落占位页。
 */
export function patchManageTeamAccountBalanceBranch(
  groups: readonly ModuleMenuPresetGroup[],
): ModuleMenuPresetGroup[] {
  return groups.map((group) => ({
    ...group,
    items: group.items.map((item) => {
      if (item.label !== MANAGE_TEAM_ACCOUNT_BALANCE_MENU_ITEM) {
        return item;
      }
      return {
        ...item,
        tier: 2,
        subitems: TEAM_ACCOUNT_BRANCH_SUBITEMS,
      };
    }),
  }));
}
