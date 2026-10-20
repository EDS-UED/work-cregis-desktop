export type RoleRecordFilterFieldId = 'roleName' | 'roleCreator' | 'roleCreatedTime';

export const ROLE_RECORD_FILTER_FIELD_LABEL_KEYS: Record<
  RoleRecordFilterFieldId,
  string
> = {
  roleName: 'Role Name',
  roleCreator: 'Creator',
  roleCreatedTime: 'Role Created Time',
};
