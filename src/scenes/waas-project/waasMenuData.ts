import {
  cregisWaasOrderModuleMenuGroups,
  cregisWaasModuleMenuGroups,
} from '@eds/desktop-components';
import { flattenModuleMenuPresetItemLabels } from '@/presets/module-menu/moduleMenuPresetHelpers';
import type { WaasProject } from '@/scenes/project/types';

export const WAAS_SETTINGS_MENU_ITEM = 'Settings';

export const WAAS_STANDARD_MENU_ITEMS = flattenModuleMenuPresetItemLabels(
  cregisWaasModuleMenuGroups,
) as readonly string[];

export const WAAS_ORDER_MODE_MENU_ITEMS = flattenModuleMenuPresetItemLabels(
  cregisWaasOrderModuleMenuGroups,
) as readonly string[];

export type WaasOrderModeMenuItem = (typeof WAAS_ORDER_MODE_MENU_ITEMS)[number];

export const DEFAULT_WAAS_MENU_ITEM = 'Sub-Address';
export const DEFAULT_WAAS_ORDER_MODE_MENU_ITEM: WaasOrderModeMenuItem = 'Order Record';

export function isWaasOrderModeProject(project: WaasProject | null | undefined): boolean {
  return Boolean(project?.depositEnabled && project.depositMode === 'order');
}

export function isWaasOrderModeMenuItem(label: string): label is WaasOrderModeMenuItem {
  return (WAAS_ORDER_MODE_MENU_ITEMS as readonly string[]).includes(label);
}

export function isWaasStandardMenuItem(label: string): boolean {
  return (WAAS_STANDARD_MENU_ITEMS as readonly string[]).includes(label);
}

export function resolveDefaultWaasMenuItem(project: WaasProject | null | undefined): string {
  return isWaasOrderModeProject(project)
    ? DEFAULT_WAAS_ORDER_MODE_MENU_ITEM
    : DEFAULT_WAAS_MENU_ITEM;
}

export function isWaasMenuItemValidForProject(
  label: string | null,
  project: WaasProject | null | undefined,
): boolean {
  if (!label || label === WAAS_SETTINGS_MENU_ITEM) return true;
  if (isWaasOrderModeProject(project)) {
    return isWaasOrderModeMenuItem(label);
  }
  return isWaasStandardMenuItem(label);
}
