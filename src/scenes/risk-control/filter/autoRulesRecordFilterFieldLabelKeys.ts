export const AUTO_RULES_RECORD_FILTER_FIELD_LABEL_KEYS = {
  autoRuleWaasProject: 'WaaS Project',
  autoRuleStatus: 'Status',
  autoRuleServiceProvider: 'Service Provider',
} as const;

export type AutoRulesRecordFilterFieldId =
  keyof typeof AUTO_RULES_RECORD_FILTER_FIELD_LABEL_KEYS;
