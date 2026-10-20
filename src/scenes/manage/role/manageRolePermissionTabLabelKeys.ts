/** Role detail EgDetail tabs — catalog keys (zh-cn in uiTextZhCN). */
export const MANAGE_ROLE_PERMISSION_TAB_LABEL_KEYS = [
  'Team API',
  'Wallet',
  'Collaboration',
  'WaaS Project',
  'Payment Engine',
  'Transaction Records',
  'Policy',
  'Automation',
  'AML Query',
  'Address Book',
  'Subscription',
  'Member Management',
  'Role Management',
  'Enterprise Verification',
  'App',
] as const;

export type ManageRolePermissionTabLabelKey =
  (typeof MANAGE_ROLE_PERMISSION_TAB_LABEL_KEYS)[number];
