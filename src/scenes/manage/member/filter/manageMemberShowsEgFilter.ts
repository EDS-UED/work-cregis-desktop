import { isManageMemberMenuItem } from '@/scenes/manage/manageMenuData';

export function manageMemberDataListShowsEgFilter(menuItem: string | undefined): boolean {
  return isManageMemberMenuItem(menuItem ?? '');
}

export function shouldUseManageMemberRecordEgFilterSchema(menuItem: string): boolean {
  return isManageMemberMenuItem(menuItem);
}
