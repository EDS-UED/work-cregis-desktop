export type ManageRolePermissionSectionHintConfig = {
  sectionIndex: number;
  leadCatalogKey: string;
  linkCatalogKey: string;
};

/** 角色详情 · section 标题下副文案（index 对齐 MANAGE_ROLE_PERMISSION_TAB_LABEL_KEYS）。 */
export const MANAGE_ROLE_PERMISSION_SECTION_HINTS: ManageRolePermissionSectionHintConfig[] = [
  {
    sectionIndex: 1,
    leadCatalogKey: 'Role Wallet Permission Hint Lead',
    linkCatalogKey: 'Go to Wallet Management',
  },
  {
    sectionIndex: 15,
    leadCatalogKey: 'Role App Permission Hint Lead',
    linkCatalogKey: 'Go to Application Management',
  },
];
