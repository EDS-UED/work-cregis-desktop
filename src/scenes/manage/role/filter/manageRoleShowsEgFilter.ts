import { isManageRoleMenuItem } from '@/scenes/manage/manageMenuData';

export function manageRoleDataListShowsEgFilter(menuItem: string | undefined): boolean {
  return isManageRoleMenuItem(menuItem ?? '');
}

export function shouldUseManageRoleRecordEgFilterSchema(menuItem: string): boolean {
  return isManageRoleMenuItem(menuItem);
}
