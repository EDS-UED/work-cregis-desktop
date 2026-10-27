import { getCregisModuleMenuGroups } from '@eds/desktop-components';
import { flattenModuleMenuPresetItemLabels } from '@/presets/module-menu/moduleMenuPresetHelpers';

/** EDS Manage preset · Webhook 二级分组（无独立列表页；展开默认子项见 work.mdc §4.3）。 */
export const MANAGE_WEBHOOK_BRANCH_ITEM = 'Webhook';

export const MANAGE_WEBHOOK_CONFIG_MENU_ITEM = 'Webhook Config';
export const MANAGE_WEBHOOK_PUSH_RECORDS_MENU_ITEM = 'Push Records';

export const MANAGE_ROLE_MENU_ITEM = 'Role';

export const MANAGE_API_MANAGE_MENU_ITEM = 'API Manage';

export const MANAGE_TEAM_SECURITY_MENU_ITEM = 'Team Security';

export const MANAGE_WEBHOOK_MENU_ITEMS = [
  MANAGE_WEBHOOK_CONFIG_MENU_ITEM,
  MANAGE_WEBHOOK_PUSH_RECORDS_MENU_ITEM,
] as const;

export type ManageWebhookMenuItem = (typeof MANAGE_WEBHOOK_MENU_ITEMS)[number];

export const MANAGE_SELECTABLE_MENU_ITEMS = flattenModuleMenuPresetItemLabels(
  getCregisModuleMenuGroups('Manage'),
) as readonly string[];

export const DEFAULT_MANAGE_MENU_ITEM = 'Team Subscription';

export function isManageWebhookBranchItem(label: string): boolean {
  return label === MANAGE_WEBHOOK_BRANCH_ITEM;
}

export function isManageWebhookConfigMenuItem(menuItem: string): boolean {
  return menuItem === MANAGE_WEBHOOK_CONFIG_MENU_ITEM;
}

export function isManageWebhookPushRecordsMenuItem(menuItem: string): boolean {
  return menuItem === MANAGE_WEBHOOK_PUSH_RECORDS_MENU_ITEM;
}

export function isManageWebhookMenuItem(menuItem: string): menuItem is ManageWebhookMenuItem {
  return (MANAGE_WEBHOOK_MENU_ITEMS as readonly string[]).includes(menuItem);
}

export function isManageRoleMenuItem(menuItem: string): boolean {
  return menuItem === MANAGE_ROLE_MENU_ITEM;
}

export function isManageApiManageMenuItem(menuItem: string): boolean {
  return menuItem === MANAGE_API_MANAGE_MENU_ITEM;
}

export function isManageTeamSecurityMenuItem(menuItem: string): boolean {
  return menuItem === MANAGE_TEAM_SECURITY_MENU_ITEM;
}

export function isManageModuleMenuItem(label: string): boolean {
  if (isManageWebhookBranchItem(label)) return false;
  return (MANAGE_SELECTABLE_MENU_ITEMS as readonly string[]).includes(label);
}
