import type {
  PaymentEngineRecordPageConfig,
} from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import {
  DATA_LIST_COLUMN_HEIGHT_MD,
  DATA_LIST_COLUMN_HEIGHT_XL,
} from '@/scenes/payment-engine/usePaymentEngineDataListPage';
import {
  resolveRiskControlRecordMenuItem,
  type RiskControlDataListMenuItem,
} from './riskControlMenuData';

const POLICY_NAME_ID_COLUMN_MIN_WIDTH = '248px';
const POLICY_WEIGHT_COLUMN_MIN_WIDTH = '88px';
const POLICY_TYPE_COLUMN_MIN_WIDTH = '128px';
const POLICY_STATUS_COLUMN_MIN_WIDTH = '112px';
const POLICY_ACTIONS_COLUMN_MIN_WIDTH = '168px';

const AUTOMATION_NAME_ID_COLUMN_MIN_WIDTH = '280px';
const AUTOMATION_TYPE_COLUMN_MIN_WIDTH = '128px';
const AUTOMATION_STATUS_COLUMN_MIN_WIDTH = '128px';
const AUTOMATION_ACTIONS_COLUMN_MIN_WIDTH = '160px';

const AUTO_RULE_NAME_ID_COLUMN_MIN_WIDTH = '248px';
const AUTO_RULE_WAAS_PROJECT_COLUMN_MIN_WIDTH = '200px';
const AUTO_RULE_SERVICE_PROVIDER_COLUMN_MIN_WIDTH = '128px';
const AUTO_RULE_STATUS_COLUMN_MIN_WIDTH = '112px';
const AUTO_RULE_ACTIONS_COLUMN_MIN_WIDTH = '168px';

const ADDRESS_BOOK_CRYPTO_COLUMN_MIN_WIDTH = '168px';
const ADDRESS_BOOK_ADDRESS_COLUMN_MIN_WIDTH = '320px';
const ADDRESS_BOOK_ACTIONS_COLUMN_MIN_WIDTH = '160px';

const AML_ADDRESS_REQUESTER_COLUMN_MIN_WIDTH = '360px';
const AML_SERVICE_PROVIDER_COLUMN_MIN_WIDTH = '128px';
const AML_QUERY_TIME_COLUMN_MIN_WIDTH = '180px';
const AML_RISK_SCORE_COLUMN_MIN_WIDTH = '160px';

const LOGS_TYPE_COLUMN_MIN_WIDTH = '128px';
const LOGS_EVENT_COLUMN_MIN_WIDTH = '320px';
const LOGS_TIME_COLUMN_MIN_WIDTH = '180px';
const LOGS_ACTIONS_COLUMN_MIN_WIDTH = '80px';

const POLICY_SETTINGS_COLUMNS: PaymentEngineRecordPageConfig['columns'] = [
  {
    key: 'ruleNameId',
    labelKey: 'Strategy Name',
    secondaryLabelKey: 'Number',
    minWidth: POLICY_NAME_ID_COLUMN_MIN_WIDTH,
    headerKind: 'combo',
    displayOrder: 1,
  },
  {
    key: 'policyWeight',
    labelKey: 'Weight',
    minWidth: POLICY_WEIGHT_COLUMN_MIN_WIDTH,
    displayOrder: 2,
  },
  {
    key: 'policyType',
    labelKey: 'Strategy Type',
    minWidth: POLICY_TYPE_COLUMN_MIN_WIDTH,
    displayOrder: 3,
  },
  {
    key: 'ruleEnabled',
    labelKey: 'Strategy Status',
    minWidth: POLICY_STATUS_COLUMN_MIN_WIDTH,
    align: 'center',
    displayOrder: 4,
  },
  {
    key: 'policyActions',
    labelKey: 'Actions',
    minWidth: POLICY_ACTIONS_COLUMN_MIN_WIDTH,
    align: 'end',
    displayOrder: 5,
  },
];

const AUTOMATION_COLUMNS: PaymentEngineRecordPageConfig['columns'] = [
  {
    key: 'ruleNameId',
    labelKey: 'Automation Name',
    secondaryLabelKey: 'Number',
    minWidth: AUTOMATION_NAME_ID_COLUMN_MIN_WIDTH,
    headerKind: 'combo',
    displayOrder: 1,
  },
  {
    key: 'automationType',
    labelKey: 'Automation Type',
    minWidth: AUTOMATION_TYPE_COLUMN_MIN_WIDTH,
    displayOrder: 2,
  },
  {
    key: 'ruleEnabled',
    labelKey: 'Automation Status',
    minWidth: AUTOMATION_STATUS_COLUMN_MIN_WIDTH,
    align: 'center',
    displayOrder: 3,
  },
  {
    key: 'automationActions',
    labelKey: 'Actions',
    minWidth: AUTOMATION_ACTIONS_COLUMN_MIN_WIDTH,
    align: 'end',
    displayOrder: 4,
  },
];

const WHITELIST_COLUMNS: PaymentEngineRecordPageConfig['columns'] = [
  {
    key: 'crypto',
    labelKey: 'Currency',
    minWidth: ADDRESS_BOOK_CRYPTO_COLUMN_MIN_WIDTH,
    displayOrder: 1,
  },
  {
    key: 'addressBookAddress',
    labelKey: 'Address',
    minWidth: ADDRESS_BOOK_ADDRESS_COLUMN_MIN_WIDTH,
    displayOrder: 2,
  },
  {
    key: 'addressBookActions',
    labelKey: 'Actions',
    minWidth: ADDRESS_BOOK_ACTIONS_COLUMN_MIN_WIDTH,
    align: 'end',
    displayOrder: 3,
  },
];

const AUTO_RULES_COLUMNS: PaymentEngineRecordPageConfig['columns'] = [
  {
    key: 'ruleNameId',
    labelKey: 'Name',
    secondaryLabelKey: 'Number',
    minWidth: AUTO_RULE_NAME_ID_COLUMN_MIN_WIDTH,
    headerKind: 'combo',
    displayOrder: 1,
  },
  {
    key: 'autoRuleWaasProject',
    labelKey: 'WaaS Project',
    minWidth: AUTO_RULE_WAAS_PROJECT_COLUMN_MIN_WIDTH,
    flexGrow: true,
    displayOrder: 2,
  },
  {
    key: 'autoRuleServiceProvider',
    labelKey: 'Service Provider',
    minWidth: AUTO_RULE_SERVICE_PROVIDER_COLUMN_MIN_WIDTH,
    width: AUTO_RULE_SERVICE_PROVIDER_COLUMN_MIN_WIDTH,
    flexGrow: false,
    displayOrder: 3,
  },
  {
    key: 'ruleEnabled',
    labelKey: 'Status',
    minWidth: AUTO_RULE_STATUS_COLUMN_MIN_WIDTH,
    align: 'center',
    displayOrder: 4,
  },
  {
    key: 'autoRuleActions',
    labelKey: 'Actions',
    minWidth: AUTO_RULE_ACTIONS_COLUMN_MIN_WIDTH,
    align: 'end',
    displayOrder: 5,
  },
];

const AML_COLUMNS: PaymentEngineRecordPageConfig['columns'] = [
  {
    key: 'amlAddressRequester',
    labelKey: 'Address/Transaction Hash',
    secondaryLabelKey: 'Requester',
    minWidth: AML_ADDRESS_REQUESTER_COLUMN_MIN_WIDTH,
    headerKind: 'combo',
    flexGrow: true,
    displayOrder: 1,
  },
  {
    key: 'amlServiceProvider',
    labelKey: 'Service Provider',
    minWidth: AML_SERVICE_PROVIDER_COLUMN_MIN_WIDTH,
    width: AML_SERVICE_PROVIDER_COLUMN_MIN_WIDTH,
    flexGrow: false,
    displayOrder: 2,
  },
  {
    key: 'amlQueryTime',
    labelKey: 'Query Time',
    minWidth: AML_QUERY_TIME_COLUMN_MIN_WIDTH,
    width: AML_QUERY_TIME_COLUMN_MIN_WIDTH,
    sortable: true,
    flexGrow: false,
    displayOrder: 3,
  },
  {
    key: 'amlRiskScore',
    labelKey: 'Risk Rating',
    secondaryLabelKey: 'Score',
    minWidth: AML_RISK_SCORE_COLUMN_MIN_WIDTH,
    width: AML_RISK_SCORE_COLUMN_MIN_WIDTH,
    headerKind: 'combo',
    align: 'end',
    comboAlignEnd: true,
    flexGrow: false,
    displayOrder: 4,
  },
];

const LOGS_COLUMNS: PaymentEngineRecordPageConfig['columns'] = [
  {
    key: 'logEvent',
    labelKey: 'Event',
    minWidth: LOGS_EVENT_COLUMN_MIN_WIDTH,
    flexGrow: true,
    displayOrder: 1,
  },
  {
    key: 'logType',
    labelKey: 'Type',
    minWidth: LOGS_TYPE_COLUMN_MIN_WIDTH,
    width: LOGS_TYPE_COLUMN_MIN_WIDTH,
    flexGrow: false,
    displayOrder: 2,
  },
  {
    key: 'createdAt',
    labelKey: 'Time UTC+08:00',
    minWidth: LOGS_TIME_COLUMN_MIN_WIDTH,
    width: LOGS_TIME_COLUMN_MIN_WIDTH,
    sortable: true,
    flexGrow: false,
    displayOrder: 3,
  },
  {
    key: 'logActions',
    labelKey: 'Action',
    minWidth: LOGS_ACTIONS_COLUMN_MIN_WIDTH,
    align: 'end',
    flexGrow: false,
    displayOrder: 4,
  },
];

const BLACKLIST_COLUMNS: PaymentEngineRecordPageConfig['columns'] = [
  {
    key: 'addressBookAddress',
    labelKey: 'Address',
    minWidth: ADDRESS_BOOK_ADDRESS_COLUMN_MIN_WIDTH,
    displayOrder: 1,
  },
  {
    key: 'addressBookActions',
    labelKey: 'Actions',
    minWidth: ADDRESS_BOOK_ACTIONS_COLUMN_MIN_WIDTH,
    align: 'end',
    displayOrder: 2,
  },
];

export const RISK_CONTROL_RECORD_PAGE_CONFIG: Record<
  RiskControlDataListMenuItem,
  PaymentEngineRecordPageConfig
> = {
  'Policy Settings': {
    showExport: false,
    toolbarPreset: 'filter-add',
    columns: POLICY_SETTINGS_COLUMNS,
  },
  Automation: {
    showExport: false,
    toolbarPreset: 'filter-add',
    columns: AUTOMATION_COLUMNS,
  },
  'Auto Rules': {
    showExport: false,
    toolbarPreset: 'filter-add',
    columns: AUTO_RULES_COLUMNS,
  },
  AML: {
    showExport: false,
    toolbarPreset: 'filter-refresh',
    columnHeight: DATA_LIST_COLUMN_HEIGHT_XL,
    columns: AML_COLUMNS,
  },
  Logs: {
    showExport: false,
    toolbarPreset: 'filter-refresh',
    columnHeight: DATA_LIST_COLUMN_HEIGHT_MD,
    columns: LOGS_COLUMNS,
  },
  Whitelist: {
    showExport: false,
    toolbarPreset: 'filter-add',
    columnHeight: DATA_LIST_COLUMN_HEIGHT_MD,
    columns: WHITELIST_COLUMNS,
  },
  Blacklist: {
    showExport: false,
    toolbarPreset: 'filter-add',
    columnHeight: DATA_LIST_COLUMN_HEIGHT_MD,
    columns: BLACKLIST_COLUMNS,
  },
};

export function resolveRiskControlRecordConfig(
  menuItem: string,
): PaymentEngineRecordPageConfig {
  const resolvedMenuItem = resolveRiskControlRecordMenuItem(menuItem);
  return (
    RISK_CONTROL_RECORD_PAGE_CONFIG[resolvedMenuItem]
    ?? RISK_CONTROL_RECORD_PAGE_CONFIG['Policy Settings']
  );
}
