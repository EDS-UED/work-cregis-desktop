import { MANAGE_ROLE_PERMISSION_ITEM_KEYS } from './manageRolePermissionCatalog';
import { resolveManageRolePermissionEnabled } from './buildManageRoleDetailSections';

export type ManageRolePermissionValueSlot = {
  key: string;
  label: string;
  enabled: boolean;
};

export function buildManageRolePermissionValueSlots(
  roleId: string,
  translate: (key: string) => string,
): ManageRolePermissionValueSlot[] {
  const slots: ManageRolePermissionValueSlot[] = [];

  MANAGE_ROLE_PERMISSION_ITEM_KEYS.forEach((permissionKeys, tabIndex) => {
    permissionKeys.forEach((permissionKey, itemIndex) => {
      if (permissionKey === 'Role App Permission Hint') return;

      slots.push({
        key: `role-perm-${tabIndex}-${itemIndex}`,
        label: translate(permissionKey),
        enabled: resolveManageRolePermissionEnabled(roleId, tabIndex, itemIndex),
      });
    });
  });

  return slots;
}
