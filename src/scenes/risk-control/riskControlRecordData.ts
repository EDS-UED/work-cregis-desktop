import { PAYMENT_ENGINE_RECORD_ROW_COUNT } from '@/scenes/payment-engine/paymentEngineOrderRecordData';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import {
  resolveCurrencyRowPreset,
  resolveDemoWalletAddress,
  resolveVerifiedTxHashForRow,
} from '@/scenes/shared/egDataListMockData';
import type { DetailAmlSearchResultVariant } from '@/scenes/tasks/shared/detailAmlSearchResult';
import { resolveRiskControlRecordMenuItem } from './riskControlMenuData';
import {
  isRiskControlLogTriggeredAction,
  RISK_CONTROL_LOG_TRIGGER_MEMBER,
  RISK_CONTROL_LOG_TRIGGER_STRATEGY_NAME,
} from './riskControlLogMemberDemo';

const POLICY_NAME_SHOWCASE = [
  'Real World Assets Protocols',
  'Telegram Bot',
  '元宇宙',
  '物联网',
  'Wd_Test_003',
  'Binance Wallet IDO',
  'Oracles',
  'Cat-Themed',
] as const;

const POLICY_NAME_POOL = [
  'Treasury Sweep',
  'Client Deposit',
  'Night Batch',
  'Weekend Guard',
  'EMEA Sweep',
  'Asia Pacific',
  'Retail Flow',
  'Institutional',
] as const;

/** showcase + pool 之后按序取用，保证整表策略名不重复。 */
const POLICY_NAME_TAIL = [
  'Liquidity Router',
  'Cross-Border',
  'Stablecoin Guard',
  'Hot Wallet Bridge',
  'Cold Storage Exit',
  'Payroll Run',
  'Vendor Payout',
  'Merchant Settlement',
  'Gas Top-Up',
  'Compliance Hold',
  'Multi-Sig Release',
  'Sandbox Test',
] as const;

/** 策略类型 · 前 5 行 API 转出，其后全部为人工转出。 */
const POLICY_TYPE_SHOWCASE_ROW_COUNT = 5;
const POLICY_TYPE_SHOWCASE = 'API Transfer-out' as const;
const POLICY_TYPE_COMPLETED = 'Manual Transfer' as const;

const POLICY_WEIGHT_SHOWCASE = ['0', '0', '0', '1', '0', '2', '0', '0'] as const;

const POLICY_ENABLED_SHOWCASE = [true, false, false, true, true, true, true, true] as const;

const AUTOMATION_TYPE_SHOWCASE = [
  'Collection',
  'Collection',
  'Collection',
  'Collection',
  'Collection',
  'Signature',
  'Signature',
  'Signature',
] as const;

const AUTOMATION_ENABLED_SHOWCASE = [true, false, false, true, true, true, true, true] as const;

const AUTO_RULE_WAAS_PROJECT_SHOWCASE = [
  'Coinbase. Deposit_3',
  'Coinbase. User_25',
  'WaaS Project',
  'Test_FAT',
  'Gate. Withdraw',
  'Gate. User',
  'Binance. User_2',
  'Binance. User_8',
] as const;

const AUTO_RULE_PROVIDER_SHOWCASE = [
  'Regtank',
  'Regtank',
  'Elliptic',
  'Elliptic',
  'Regtank',
  'Regtank',
  'Regtank',
  'Regtank',
] as const;

const AUTO_RULE_ENABLED_SHOWCASE = [false, true, false, true, true, true, true, true] as const;

const LOG_OPERATOR_SHOWCASE = [
  'Gavin Wood',
  'Gokal',
  'McCaleb',
  'Kwon',
  'Hoskinson Enterprise',
  'Buterin',
  'Lubin',
  'Zhao',
] as const;

const LOG_OPERATOR_POOL = [
  'Satoshi',
  'Vitalik',
  'Charlie',
  'Daniel',
  'Elena',
  'Frank',
  'Grace',
  'Henry',
] as const;

const LOG_POLICY_ROW_COUNT = 6;
const LOG_AUTOMATION_ROW_COUNT = 6;
const LOG_AML_ROW_COUNT = 5;
const LOG_TEAM_API_SHOWCASE_ROW_COUNT = 4;

const LOG_POLICY_ACTIONS = [
  'created Policy',
  'edited Policy',
  'deleted Policy',
  'enabled Policy',
  'send transaction triggered Policy',
  'withdraw triggered Policy',
] as const;

const LOG_AUTOMATION_ACTIONS = [
  'created Automation',
  'edited Automation',
  'deleted Automation',
  'enabled Automation',
  'send transaction triggered Automation',
  'withdraw triggered Automation',
] as const;

const LOG_AML_ACTIONS = [
  'created rule',
  'edited rule',
  'deleted rule',
  'enabled rule',
  'closed rule',
] as const;

const LOG_TEAM_API_SHOWCASE_ACTIONS = [
  'created API',
  'upgraded API',
  'deleted API',
  'disabled API',
] as const;

const LOG_TEAM_API_COMPLETED_ACTION = 'disabled API' as const;

/** Logs Event 列 · 第 5 行演示策略名溢出截断（操作人见 LOG_OPERATOR_SHOWCASE[4]）。 */
const LOG_OVERFLOW_DEMO_ROW_INDEX = 4;
const LOG_OVERFLOW_STRATEGY_NAME =
  'Wd_Test_003 Cross-Chain Multi-Signature Treasury Sweep Validation Policy Extended Rule Set';

const AML_NETWORK_SHOWCASE = [
  'Bitcoin',
  'Tron',
  'Base',
  'BNB Smart Chain',
] as const;

const AML_REQUESTER_SHOWCASE = [
  'Charlotte Evans',
  'Luna Chen',
  'Gavin Wood',
  'McCaleb',
  'Hoskinson',
  'Buterin',
  'Zhao',
  'Kwon',
] as const;

const AML_REQUESTER_POOL = [
  'Satoshi',
  'Vitalik',
  'Charlie',
  'Daniel',
  'Elena',
  'Frank',
  'Grace',
  'Henry',
] as const;

const AML_PROVIDER_SHOWCASE = ['Regtank', 'Elliptic'] as const;

type AmlRiskDemoPreset = {
  labelKey: DetailAmlSearchResultVariant['labelKey'];
  customStyle: 'aml-danger' | 'aml-suspicious' | 'aml-safe';
  score: string;
};

const AML_RISK_SHOWCASE: readonly AmlRiskDemoPreset[] = [
  { labelKey: 'Danger', customStyle: 'aml-danger', score: '1' },
  { labelKey: 'Suspicious', customStyle: 'aml-suspicious', score: '6.8' },
  { labelKey: 'Safe', customStyle: 'aml-safe', score: '0.0' },
];

const AML_WAAS_PROJECT_SHOWCASE = [
  'Doris Stodio',
  'Coinbase. Deposit_3',
  'Gate. Withdraw',
  'WaaS Project',
] as const;

const AML_QUERY_OBJECT_KEYS = ['Address', 'Transaction Hash'] as const;

const AML_TRIGGER_MODE_KEYS = ['Automatic', 'Manual'] as const;

const AML_RISK_COMPLETED: AmlRiskDemoPreset = AML_RISK_SHOWCASE[2]!;

function seededFraction(rowIndex: number, salt: number): number {
  const x = Math.sin((rowIndex + 1) * 9973 + salt * 7919) * 10000;
  return x - Math.floor(x);
}

function resolveDemoPolicyName(rowIndex: number): string {
  if (rowIndex < POLICY_NAME_SHOWCASE.length) {
    return POLICY_NAME_SHOWCASE[rowIndex]!;
  }

  const poolIndex = rowIndex - POLICY_NAME_SHOWCASE.length;
  if (poolIndex < POLICY_NAME_POOL.length) {
    return POLICY_NAME_POOL[poolIndex]!;
  }

  const tailIndex = poolIndex - POLICY_NAME_POOL.length;
  return POLICY_NAME_TAIL[tailIndex] ?? POLICY_NAME_TAIL[POLICY_NAME_TAIL.length - 1]!;
}

function buildPolicyNumber(rowIndex: number): string {
  return `PO1440143724412${String(928 + rowIndex).padStart(3, '0')}`;
}

function resolveDemoPolicyTypeKey(rowIndex: number): string {
  if (rowIndex < POLICY_TYPE_SHOWCASE_ROW_COUNT) {
    return POLICY_TYPE_SHOWCASE;
  }
  return POLICY_TYPE_COMPLETED;
}

function buildPolicySettingsRow(rowIndex: number): PaymentEngineRecordRow {
  const ruleNumber = buildPolicyNumber(rowIndex);

  return {
    id: ruleNumber,
    merchantOrderId: ruleNumber,
    status: 'success',
    createdAt: '2032-10-23 12:22:54',
    receivedAmount: '0',
    orderAmount: '0',
    orderSymbol: 'USDT',
    receivedSymbol: 'USDT',
    ruleName: resolveDemoPolicyName(rowIndex),
    ruleNumber,
    policyWeight: POLICY_WEIGHT_SHOWCASE[rowIndex % POLICY_WEIGHT_SHOWCASE.length],
    policyTypeKey: resolveDemoPolicyTypeKey(rowIndex),
    ruleEnabled: rowIndex < POLICY_ENABLED_SHOWCASE.length
      ? POLICY_ENABLED_SHOWCASE[rowIndex]
      : rowIndex % 5 !== 1,
  };
}

function buildAutoRulesRow(rowIndex: number): PaymentEngineRecordRow {
  const ruleNumber = buildPolicyNumber(rowIndex);

  return {
    id: ruleNumber,
    merchantOrderId: ruleNumber,
    status: 'success',
    createdAt: '2027-12-23 10:23:00',
    receivedAmount: '0',
    orderAmount: '0',
    orderSymbol: 'USDT',
    receivedSymbol: 'USDT',
    ruleName: resolveDemoPolicyName(rowIndex),
    ruleNumber,
    autoRuleWaasProject: AUTO_RULE_WAAS_PROJECT_SHOWCASE[rowIndex % AUTO_RULE_WAAS_PROJECT_SHOWCASE.length],
    autoRuleServiceProvider: AUTO_RULE_PROVIDER_SHOWCASE[rowIndex % AUTO_RULE_PROVIDER_SHOWCASE.length],
    ruleEnabled: rowIndex < AUTO_RULE_ENABLED_SHOWCASE.length
      ? AUTO_RULE_ENABLED_SHOWCASE[rowIndex]
      : rowIndex % 5 !== 0,
  };
}

function buildAutomationRow(rowIndex: number): PaymentEngineRecordRow {
  const ruleNumber = buildPolicyNumber(rowIndex);

  return {
    id: ruleNumber,
    merchantOrderId: ruleNumber,
    status: 'success',
    createdAt: '2032-10-23 12:22:54',
    receivedAmount: '0',
    orderAmount: '0',
    orderSymbol: 'USDT',
    receivedSymbol: 'USDT',
    ruleName: resolveDemoPolicyName(rowIndex),
    ruleNumber,
    automationTypeKey: AUTOMATION_TYPE_SHOWCASE[rowIndex % AUTOMATION_TYPE_SHOWCASE.length],
    ruleEnabled: rowIndex < AUTOMATION_ENABLED_SHOWCASE.length
      ? AUTOMATION_ENABLED_SHOWCASE[rowIndex]
      : rowIndex % 5 !== 1,
  };
}

function buildAddressBookRecordId(prefix: 'WL' | 'BL', rowIndex: number): string {
  return `${prefix}-${String(rowIndex + 1).padStart(5, '0')}`;
}

function resolveAddressBookAlias(rowIndex: number): string | undefined {
  if (rowIndex <= 2) return 'Mr. Wang';
  if (rowIndex === 4) return '王总';
  if (rowIndex === 8) return '赵总';
  return undefined;
}

function resolveDemoLogOperatorName(rowIndex: number): string {
  const actionKey = resolveDemoLogActionKey(rowIndex);
  if (isRiskControlLogTriggeredAction(actionKey)) {
    return RISK_CONTROL_LOG_TRIGGER_MEMBER.name;
  }
  if (rowIndex < LOG_OPERATOR_SHOWCASE.length) {
    return LOG_OPERATOR_SHOWCASE[rowIndex]!;
  }
  const index = Math.floor(seededFraction(rowIndex, 73) * LOG_OPERATOR_POOL.length);
  return LOG_OPERATOR_POOL[index] ?? LOG_OPERATOR_POOL[0];
}

function resolveDemoLogStrategyName(rowIndex: number): string {
  const actionKey = resolveDemoLogActionKey(rowIndex);
  if (isRiskControlLogTriggeredAction(actionKey)) {
    return RISK_CONTROL_LOG_TRIGGER_STRATEGY_NAME;
  }
  if (rowIndex === LOG_OVERFLOW_DEMO_ROW_INDEX) {
    return LOG_OVERFLOW_STRATEGY_NAME;
  }
  return resolveDemoPolicyName(rowIndex);
}

function resolveDemoLogTypeKey(rowIndex: number): string {
  if (rowIndex < LOG_POLICY_ROW_COUNT) return 'Policy';
  if (rowIndex < LOG_POLICY_ROW_COUNT + LOG_AUTOMATION_ROW_COUNT) return 'Automation';
  if (rowIndex < LOG_POLICY_ROW_COUNT + LOG_AUTOMATION_ROW_COUNT + LOG_AML_ROW_COUNT) {
    return 'AML';
  }
  return 'Team API';
}

function resolveDemoLogActionKey(rowIndex: number): string {
  if (rowIndex < LOG_POLICY_ROW_COUNT) {
    return LOG_POLICY_ACTIONS[rowIndex]!;
  }

  const automationStart = LOG_POLICY_ROW_COUNT;
  if (rowIndex < automationStart + LOG_AUTOMATION_ROW_COUNT) {
    return LOG_AUTOMATION_ACTIONS[rowIndex - automationStart]!;
  }

  const amlStart = automationStart + LOG_AUTOMATION_ROW_COUNT;
  if (rowIndex < amlStart + LOG_AML_ROW_COUNT) {
    return LOG_AML_ACTIONS[rowIndex - amlStart]!;
  }

  const teamApiStart = amlStart + LOG_AML_ROW_COUNT;
  const teamApiIndex = rowIndex - teamApiStart;
  if (teamApiIndex < LOG_TEAM_API_SHOWCASE_ROW_COUNT) {
    return LOG_TEAM_API_SHOWCASE_ACTIONS[teamApiIndex]!;
  }

  return LOG_TEAM_API_COMPLETED_ACTION;
}

function buildLogRecordId(rowIndex: number): string {
  return `LOG-${String(rowIndex + 1).padStart(5, '0')}`;
}

function resolveDemoAmlRequesterName(rowIndex: number): string {
  if (rowIndex < AML_REQUESTER_SHOWCASE.length) {
    return AML_REQUESTER_SHOWCASE[rowIndex]!;
  }
  const index = Math.floor(seededFraction(rowIndex, 83) * AML_REQUESTER_POOL.length);
  return AML_REQUESTER_POOL[index] ?? AML_REQUESTER_POOL[0];
}

function resolveDemoAmlNetworkLabel(rowIndex: number): string {
  return AML_NETWORK_SHOWCASE[rowIndex % AML_NETWORK_SHOWCASE.length]!;
}

function resolveDemoAmlTargetValue(rowIndex: number): string {
  const preset = resolveCurrencyRowPreset(rowIndex);
  if (rowIndex % 2 === 0) {
    return resolveDemoWalletAddress(rowIndex, preset, 'to');
  }
  return resolveVerifiedTxHashForRow(rowIndex);
}

function resolveDemoAmlServiceProvider(rowIndex: number): string {
  return AML_PROVIDER_SHOWCASE[rowIndex % AML_PROVIDER_SHOWCASE.length]!;
}

function resolveDemoAmlRisk(rowIndex: number): AmlRiskDemoPreset {
  if (rowIndex < AML_RISK_SHOWCASE.length) {
    return AML_RISK_SHOWCASE[rowIndex]!;
  }
  return AML_RISK_COMPLETED;
}

function buildAmlRecordId(rowIndex: number): string {
  return `AML-${String(rowIndex + 1).padStart(5, '0')}`;
}

function buildAmlRow(rowIndex: number): PaymentEngineRecordRow {
  const id = buildAmlRecordId(rowIndex);
  const risk = resolveDemoAmlRisk(rowIndex);
  const preset = resolveCurrencyRowPreset(rowIndex);
  const requesterName = resolveDemoAmlRequesterName(rowIndex);

  return {
    id,
    merchantOrderId: id,
    status: 'success',
    createdAt: '2027-12-23 10:23:00',
    receivedAmount: '0',
    orderAmount: '0',
    orderSymbol: 'USDT',
    receivedSymbol: 'USDT',
    amlTargetValue: resolveDemoAmlTargetValue(rowIndex),
    amlNetworkLabel: resolveDemoAmlNetworkLabel(rowIndex),
    amlTriggerModeKey: AML_TRIGGER_MODE_KEYS[rowIndex % AML_TRIGGER_MODE_KEYS.length],
    amlRequesterName: requesterName,
    amlRequesterAvatarName: requesterName,
    amlServiceProvider: resolveDemoAmlServiceProvider(rowIndex),
    amlRiskLabelKey: risk.labelKey,
    amlRiskCustomStyle: risk.customStyle,
    amlRiskScore: risk.score,
    amlWaasProject: AML_WAAS_PROJECT_SHOWCASE[rowIndex % AML_WAAS_PROJECT_SHOWCASE.length],
    amlQueryObjectKey: AML_QUERY_OBJECT_KEYS[rowIndex % AML_QUERY_OBJECT_KEYS.length],
    amlCurrencySymbol: preset.symbol,
    amlCurrencyCryptoName: preset.cryptoName,
    amlCurrencyNetworkLabel: preset.networkLabel,
  };
}

function buildLogsRow(rowIndex: number): PaymentEngineRecordRow {
  const id = buildLogRecordId(rowIndex);

  return {
    id,
    merchantOrderId: id,
    status: 'success',
    createdAt: '2032-10-23 12:22:54',
    receivedAmount: '0',
    orderAmount: '0',
    orderSymbol: 'USDT',
    receivedSymbol: 'USDT',
    logOperatorName: resolveDemoLogOperatorName(rowIndex),
    logActionKey: resolveDemoLogActionKey(rowIndex),
    logTypeKey: resolveDemoLogTypeKey(rowIndex),
    logStrategyName: resolveDemoLogStrategyName(rowIndex),
    logStrategyNumber: buildPolicyNumber(rowIndex),
  };
}

function buildAddressBookRow(
  rowIndex: number,
  prefix: 'WL' | 'BL',
): PaymentEngineRecordRow {
  const id = buildAddressBookRecordId(prefix, rowIndex);
  const preset = resolveCurrencyRowPreset(rowIndex);
  const address = resolveDemoWalletAddress(rowIndex, preset, 'to');

  return {
    id,
    merchantOrderId: id,
    status: 'success',
    createdAt: '2032-10-23 12:22:54',
    receivedAmount: '0',
    orderAmount: '0',
    orderSymbol: preset.symbol,
    receivedSymbol: preset.symbol,
    currencySymbol: preset.symbol,
    currencyCryptoName: preset.cryptoName,
    currencyShowNetwork: preset.showNetwork,
    currencyNetwork: preset.networkLabel,
    walletToAddress: address,
    walletToAlias: resolveAddressBookAlias(rowIndex),
  };
}

export function buildRiskControlRecordRows(
  menuItem: string,
  count = PAYMENT_ENGINE_RECORD_ROW_COUNT,
): PaymentEngineRecordRow[] {
  const resolvedMenuItem = resolveRiskControlRecordMenuItem(menuItem);

  if (resolvedMenuItem === 'Policy Settings') {
    return Array.from({ length: count }, (_, rowIndex) => buildPolicySettingsRow(rowIndex));
  }

  if (resolvedMenuItem === 'Automation') {
    return Array.from({ length: count }, (_, rowIndex) => buildAutomationRow(rowIndex));
  }

  if (resolvedMenuItem === 'Auto Rules') {
    return Array.from({ length: count }, (_, rowIndex) => buildAutoRulesRow(rowIndex));
  }

  if (resolvedMenuItem === 'AML') {
    return Array.from({ length: count }, (_, rowIndex) => buildAmlRow(rowIndex));
  }

  if (resolvedMenuItem === 'Logs') {
    return Array.from({ length: count }, (_, rowIndex) => buildLogsRow(rowIndex));
  }

  if (resolvedMenuItem === 'Whitelist') {
    return Array.from({ length: count }, (_, rowIndex) => buildAddressBookRow(rowIndex, 'WL'));
  }

  if (resolvedMenuItem === 'Blacklist') {
    return Array.from({ length: count }, (_, rowIndex) => buildAddressBookRow(rowIndex, 'BL'));
  }

  return [];
}
