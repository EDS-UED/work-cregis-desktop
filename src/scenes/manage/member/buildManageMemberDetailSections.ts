import type { DetailSectionData } from '@eds/desktop-components';
import { buildManageRoleDetailSections } from '../role/buildManageRoleDetailSections';
import {
  buildManageRolePermissionValueSlots,
  type ManageRolePermissionValueSlot,
} from '../role/manageRolePermissionValueSlots';

function enabledPermissionKeys(roleId: string): Set<string> {
  return new Set(
    buildManageRolePermissionValueSlots(roleId)
      .filter((slot) => slot.enabled)
      .map((slot) => slot.key),
  );
}

/** 成员详情：仅展示已授权权限项；未授权整行不出现。 */
export function buildManageMemberDetailSections(
  roleId: string,
  translate: (key: string) => string,
): DetailSectionData[] {
  const keys = enabledPermissionKeys(roleId);
  return buildManageRoleDetailSections(roleId, translate)
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => item.key != null && keys.has(item.key)),
    }))
    .filter((section) => section.items.length > 0);
}

export function buildManageMemberPermissionValueSlots(
  roleId: string,
): ManageRolePermissionValueSlot[] {
  return buildManageRolePermissionValueSlots(roleId).filter((slot) => slot.enabled);
}
