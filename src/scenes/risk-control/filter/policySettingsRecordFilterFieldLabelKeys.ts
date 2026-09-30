export const POLICY_SETTINGS_RECORD_FILTER_FIELD_LABEL_KEYS = {
  policyType: 'Strategy Type',
  policyStatus: 'Strategy Status',
  policyName: 'Strategy Name',
  policyNumber: 'Strategy Number',
} as const;

export type PolicySettingsRecordFilterFieldId =
  keyof typeof POLICY_SETTINGS_RECORD_FILTER_FIELD_LABEL_KEYS;
