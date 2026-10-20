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
  return {
    creatorName: 'Alex Mah.',
    creatorAvatarName: 'Alex Mah.',
    creatorEmailMasked: 't******z@gmail.com',
    createdAt: row.createdAt,
    recordNumber: '062544f2496c44c6a282d7fbc1aa0450',
    waasProject: row.autoRuleWaasProject?.trim() || 'Doris Stodio',
    serviceProvider: row.autoRuleServiceProvider?.trim() || 'Regtank',
    currencyConditions: RISK_CONTROL_CURRENCY_CONDITION_SHOWCASE.map((entry) => ({ ...entry })),
    hiddenCurrencyConditionCount: RISK_CONTROL_CURRENCY_CONDITION_HIDDEN.length,
    riskRatingCriteria:
      '大于等于“0.1”为危险交易，并禁用API收款地址',
    alertRecipientName: 'Ed Stark.',
    alertRecipientAvatarName: 'Ed Stark.',
    alertRecipientEmailMasked: 'e******k@gmail.com',
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
