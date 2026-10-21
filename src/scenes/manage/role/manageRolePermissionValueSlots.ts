import { MANAGE_ROLE_PERMISSION_ITEM_KEYS } from './manageRolePermissionCatalog';
import { resolveManageRolePermissionEnabled } from './buildManageRoleDetailSections';

export type ManageRolePermissionValueSlot = {
  key: string;
  labelKey: string;
  enabled: boolean;
};

export function buildManageRolePermissionValueSlots(roleId: string): ManageRolePermissionValueSlot[] {
  const slots: ManageRolePermissionValueSlot[] = [];

  MANAGE_ROLE_PERMISSION_ITEM_KEYS.forEach((permissionKeys, tabIndex) => {
    permissionKeys.forEach((permissionKey, itemIndex) => {
      slots.push({
        key: `role-perm-${tabIndex}-${itemIndex}`,
        labelKey: permissionKey,
        enabled: resolveManageRolePermissionEnabled(roleId, tabIndex, itemIndex),
      });
    });
  });

  return slots;
}
