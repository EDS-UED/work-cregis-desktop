/** 风控日志 EgFilter 字段 i18n labelKey 真源。 */
export const LOGS_RECORD_FILTER_FIELD_LABEL_KEYS = {
  logType: 'Type',
  logOperator: 'Operator',
  logStrategyName: 'Strategy Name',
  logStrategyNumber: 'Strategy Number',
  logEvent: 'Event',
  createdAt: 'Time',
} as const;

export type LogsRecordFilterFieldId = keyof typeof LOGS_RECORD_FILTER_FIELD_LABEL_KEYS;
