import type {
  PaymentEngineRecordRow,
  RiskControlAutoRuleDetailRecord,
} from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import {
  mergeRiskControlCurrencyConditions,
  RISK_CONTROL_CURRENCY_CONDITION_HIDDEN,
  RISK_CONTROL_CURRENCY_CONDITION_SHOWCASE,
} from './riskControlCurrencyConditionDemoData';

function buildAutoRuleDetailRecord(row: PaymentEngineRecordRow): RiskControlAutoRuleDetailRecord {
  const direction = row.autoRuleDirection ?? 'inflow';
  const isOutflow = direction === 'outflow';
  const ruleName = row.ruleName?.trim() || 'Test_FAT';

  return {
    creatorName: 'Alex Mah.',
    creatorAvatarName: 'Alex Mah.',
    creatorEmailMasked: 't******z@gmail.com',
    createdAt: row.createdAt,
    recordNumber: row.ruleNumber?.trim() || 'AML2026102100001',
    waasProject: row.autoRuleWaasProject?.trim() || 'Doris Stodio',
    serviceProvider: row.autoRuleServiceProvider?.trim() || 'Elliptic',
    currencyConditions: RISK_CONTROL_CURRENCY_CONDITION_SHOWCASE.map((entry) => ({ ...entry })),
    hiddenCurrencyConditionCount: RISK_CONTROL_CURRENCY_CONDITION_HIDDEN.length,
    riskRatingCriteria: isOutflow
      ? `当收款地址风险评分大于等于 7.0 时，Cregis AML将执行风险控制措施（${ruleName}）`
      : '大于等于“0.1”为危险交易，并禁用API收款地址',
    alertRecipientName: isOutflow ? 'Withdrawal initiator' : 'Ed Stark.',
    alertRecipientAvatarName: isOutflow ? undefined : 'Ed Stark.',
    alertRecipientEmailMasked: isOutflow ? undefined : 'e******k@gmail.com',
    direction,
    withdrawalTypeKey: row.autoRuleScopeKey ?? 'Manual Transfer',
    scopeLabel: row.autoRuleScopeKey,
    skipWhitelistEnabled: true,
    skipInternalTeamEnabled: true,
    screeningNodeKey: isOutflow
      ? 'Before signature, after approval (if required)'
      : 'Before approval process',
    riskControlActionKey: 'Alarm the reviewer(s)/signer(s)',
    exceptionHandlingKey: 'Bypass the query, proceed and notify the operator',
    exceptionHandlerName: isOutflow ? 'Morgan Lee' : undefined,
    exceptionHandlerAvatarName: isOutflow ? 'Morgan Lee' : undefined,
  };
}

export function resolveRiskControlAutoRuleAllCurrencyConditions(
  detail: RiskControlAutoRuleDetailRecord,
): RiskControlAutoRuleDetailRecord['currencyConditions'] {
  return mergeRiskControlCurrencyConditions(detail.currencyConditions);
}

export function resolveRiskControlAutoRuleRecordDetail(
  row: PaymentEngineRecordRow,
): RiskControlAutoRuleDetailRecord {
  return buildAutoRuleDetailRecord(row);
}

export function enrichRiskControlAutoRuleRecordForDetail(
  row: PaymentEngineRecordRow,
): PaymentEngineRecordRow {
  return {
    ...row,
    createdAt: row.createdAt || '2027-12-23 10:23:00',
    ruleName: row.ruleName?.trim() || row.id,
  };
}
