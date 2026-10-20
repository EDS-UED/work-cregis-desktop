import {
  createDetailApplyItemRow,
  type DetailItemData,
  type DetailSectionData,
} from '@eds/desktop-components';
import { MANAGE_ROLE_PERMISSION_ITEM_KEYS } from './manageRolePermissionCatalog';
import { MANAGE_ROLE_PERMISSION_TAB_LABEL_KEYS } from './manageRolePermissionTabLabelKeys';

export function resolveManageRolePermissionEnabled(
  roleId: string,
  tabIndex: number,
  rowIndex: number,
): boolean {
  const seed = roleId.charCodeAt(roleId.length - 1) + tabIndex * 7 + rowIndex * 13;
  return seed % 3 !== 0;
}

function buildPermissionItem(
  roleId: string,
  tabIndex: number,
  itemIndex: number,
  permissionKey: string,
  translate: (key: string) => string,
): DetailItemData {
  const isHint = permissionKey === 'Role App Permission Hint';
  if (isHint) {
    return {
      ...createDetailApplyItemRow('text', {
        key: `role-perm-${tabIndex}-hint`,
        title: '',
        value: translate(permissionKey),
      }),
      showTitleIcon: false,
    };
  }

  return {
    ...createDetailApplyItemRow('text', {
      key: `role-perm-${tabIndex}-${itemIndex}`,
      title: '',
      value: ' ',
    }),
    showTitleIcon: false,
  };
}

export function buildManageRoleDetailSections(
  roleId: string,
  translate: (key: string) => string,
): DetailSectionData[] {
  return MANAGE_ROLE_PERMISSION_TAB_LABEL_KEYS.map((tabKey, tabIndex) => {
    const permissionKeys = MANAGE_ROLE_PERMISSION_ITEM_KEYS[tabIndex] ?? [];

    return {
      key: `manage-role-perm-${tabIndex}`,
      title: translate(tabKey),
      showDivider: false,
      items: permissionKeys.map((permissionKey, itemIndex) =>
        buildPermissionItem(roleId, tabIndex, itemIndex, permissionKey, translate),
      ),
    };
  });
}
