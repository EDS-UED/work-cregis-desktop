import type { LogsRecordLogEventCategoryKey } from './logsRecordFilterCatalog';

/** logActionKey → 事件筛选类目 i18n key。 */
export function resolveLogsRecordEventCategoryKey(
  logActionKey: string | undefined,
): LogsRecordLogEventCategoryKey {
  const key = String(logActionKey ?? '').trim();

  if (key.startsWith('created')) return 'Log Filter Event Create';
  if (key.startsWith('edited') || key.startsWith('updated') || key.startsWith('upgraded')) {
    return 'Log Filter Event Edit';
  }
  if (key.startsWith('enabled') || key.startsWith('disabled') || key === 'closed rule') {
    return 'Log Filter Event Enable Disable';
  }
  if (key.startsWith('deleted')) return 'Log Filter Event Delete';
  if (key.includes('triggered')) return 'Log Filter Event Trigger';

  return 'Log Filter Event Create';
}
