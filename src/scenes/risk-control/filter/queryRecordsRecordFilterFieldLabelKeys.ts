export const QUERY_RECORDS_FILTER_FIELD_LABEL_KEYS = {
  amlCurrency: 'Currency',
  amlWaasProject: 'WaaS Project',
  amlQueryResult: 'Query Result',
  amlServiceProvider: 'Service Provider',
  amlQueryObject: 'Query Object',
  amlQueryType: 'Type',
  amlQueryTime: 'Query Time',
} as const;

export type QueryRecordsFilterFieldId =
  keyof typeof QUERY_RECORDS_FILTER_FIELD_LABEL_KEYS;
