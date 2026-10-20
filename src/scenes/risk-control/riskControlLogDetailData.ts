import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import type { DetailProgressMemberDeviceInfo } from '@/scenes/tasks/shared/detailProgressMemberDeviceInfo.types';
import {
  RISK_CONTROL_CURRENCY_CONDITION_HIDDEN,
  RISK_CONTROL_CURRENCY_CONDITION_SHOWCASE,
} from './riskControlCurrencyConditionDemoData';
import {
  resolveRiskControlLogMemberDemo,
  resolveRiskControlLogStrategyNameForDetail,
} from './riskControlLogMemberDemo';

export type RiskControlLogCurrencyCondition = {
  symbol: string;
  cryptoName: string;
  networkLabel?: string;
  thresholdAmount: string;
  thresholdSymbol: string;
};

export type RiskControlLogDetailKind =
  | 'trigger-strategy'
  | 'strategy-snapshot'
  | 'team-api-create'
  | 'team-api-update';

export type RiskControlLogDetailRecord = {
  kind: RiskControlLogDetailKind;
  headlineKey: string;
  triggerTypeKey: string;
  executedActionKey: string;
  operatorName: string;
  operatorAvatarName: string;
  operatorEmailMasked: string;
  deviceLabel: string;
  deviceInfo: DetailProgressMemberDeviceInfo;
  operationTime: string;
  ipLocationLabel: string;
  strategyName: string;
  scheduleLabelKey: string;
  currencyConditions: RiskControlLogCurrencyCondition[];
  hiddenCurrencyConditionCount: number;
  creatorName: string;
  creatorAvatarName: string;
  creatorEmailMasked: string;
  creatorDeviceInfo: DetailProgressMemberDeviceInfo;
  gatewayServer: string;
  permissionsLabel: string;
  ipWhitelist: string;
  apiSnapshotBefore: {
    apiName: string;
    permissionsLabel: string;
    ipWhitelist: string;
  };
  apiSnapshotAfter: {
    apiName: string;
    permissionsLabel: string;
    ipWhitelist: string;
  };
};

const LOG_API_SNAPSHOT = {
  apiName: 'https://api.cregis.com',
  permissionsLabel: 'Wallet',
  ipWhitelist: '192.168.1.230、192.168.1.2304',
} as const;

function resolveLogDetailKind(row: PaymentEngineRecordRow): RiskControlLogDetailKind {
  const logTypeKey = row.logTypeKey ?? 'Policy';
  const logActionKey = row.logActionKey ?? '';

  if (logActionKey.includes('triggered')) {
    return 'trigger-strategy';
  }

  if (logTypeKey === 'Team API') {
    if (logActionKey.startsWith('upgraded') || logActionKey.startsWith('edited')) {
      return 'team-api-update';
    }
    return 'team-api-create';
  }

  return 'strategy-snapshot';
}

function resolveLogDetailHeadlineKey(
  kind: RiskControlLogDetailKind,
  logActionKey: string,
): string {
  if (kind === 'trigger-strategy') return 'Trigger Strategy';
  if (kind === 'team-api-create') return 'Created API';
  if (kind === 'team-api-update') return 'Updated API';
  return logActionKey || 'Log Detail';
}

function resolveTriggerTypeKey(logActionKey: string): string {
  if (logActionKey.includes('withdraw')) return 'Withdraw';
  return 'Send Transaction';
}

export function resolveRiskControlLogDetailKind(
  row: PaymentEngineRecordRow,
): RiskControlLogDetailKind {
  return resolveLogDetailKind(row);
}

export function resolveRiskControlLogRecordDetail(
  row: PaymentEngineRecordRow,
): RiskControlLogDetailRecord {
  const logActionKey = row.logActionKey ?? 'created Policy';
  const kind = resolveLogDetailKind(row);
  const member = resolveRiskControlLogMemberDemo(row);
  const strategyName = resolveRiskControlLogStrategyNameForDetail(row);
  const operationTime = row.createdAt || '2027-12-23 10:23:00';

  return {
    kind,
    headlineKey: resolveLogDetailHeadlineKey(kind, logActionKey),
    triggerTypeKey: resolveTriggerTypeKey(logActionKey),
    executedActionKey: 'Approval action',
    operatorName: member.name,
    operatorAvatarName: member.avatarName,
    operatorEmailMasked: member.emailMasked,
    deviceLabel: member.deviceLabel,
    deviceInfo: member.deviceInfo,
    operationTime,
    ipLocationLabel: member.ipLocationLabel,
    strategyName,
    scheduleLabelKey: 'All Day',
    currencyConditions: RISK_CONTROL_CURRENCY_CONDITION_SHOWCASE.map((entry) => ({ ...entry })),
    hiddenCurrencyConditionCount: RISK_CONTROL_CURRENCY_CONDITION_HIDDEN.length,
    creatorName: member.name,
    creatorAvatarName: member.avatarName,
    creatorEmailMasked: member.emailMasked,
    creatorDeviceInfo: member.deviceInfo,
    gatewayServer: LOG_API_SNAPSHOT.apiName,
    permissionsLabel: LOG_API_SNAPSHOT.permissionsLabel,
    ipWhitelist: LOG_API_SNAPSHOT.ipWhitelist,
    apiSnapshotBefore: { ...LOG_API_SNAPSHOT },
    apiSnapshotAfter: { ...LOG_API_SNAPSHOT },
  };
}

export function enrichRiskControlLogRecordForDetail(
  row: PaymentEngineRecordRow,
): PaymentEngineRecordRow {
  return {
    ...row,
    createdAt: row.createdAt || '2027-12-23 10:23:00',
  };
}
