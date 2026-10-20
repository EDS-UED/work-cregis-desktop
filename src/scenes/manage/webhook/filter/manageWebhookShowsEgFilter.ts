import {
  isManageWebhookConfigMenuItem,
  isManageWebhookPushRecordsMenuItem,
} from '@/scenes/manage/manageMenuData';

/** Manage · Webhook DataList 启用 EgFilter。 */
export function manageWebhookDataListShowsEgFilter(menuItem: string | undefined): boolean {
  const item = menuItem ?? '';
  return isManageWebhookConfigMenuItem(item) || isManageWebhookPushRecordsMenuItem(item);
}

export function shouldUseWebhookConfigRecordEgFilterSchema(menuItem: string): boolean {
  return isManageWebhookConfigMenuItem(menuItem);
}

export function shouldUseWebhookPushRecordEgFilterSchema(menuItem: string): boolean {
  return isManageWebhookPushRecordsMenuItem(menuItem);
}
