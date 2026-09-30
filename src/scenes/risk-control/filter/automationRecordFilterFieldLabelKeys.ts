export const AUTOMATION_RECORD_FILTER_FIELD_LABEL_KEYS = {
  automationType: 'Automation Type',
  automationStatus: 'Automation Status',
  automationName: 'Automation Name',
  automationNumber: 'Automation Number',
} as const;

export type AutomationRecordFilterFieldId =
  keyof typeof AUTOMATION_RECORD_FILTER_FIELD_LABEL_KEYS;
