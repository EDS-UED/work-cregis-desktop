/** 风控日志 · 类型筛选项 i18n key（与 logTypeKey 一致）。 */
export const LOGS_RECORD_LOG_TYPE_KEYS = [
  'Policy',
  'Automation',
  'AML',
  'Team API',
] as const;

/** 风控日志 · 事件筛选项 i18n key。 */
export const LOGS_RECORD_LOG_EVENT_CATEGORY_KEYS = [
  'Log Filter Event Create',
  'Log Filter Event Edit',
  'Log Filter Event Enable Disable',
  'Log Filter Event Delete',
  'Log Filter Event Trigger',
] as const;

export type LogsRecordLogEventCategoryKey =
  (typeof LOGS_RECORD_LOG_EVENT_CATEGORY_KEYS)[number];
