import { ref } from 'vue';
import { paymentEngineDetailFlowRegistry } from '@/scenes/payment-engine/paymentEngineDetailFlowContext';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';

export type AmlExceptionHandlingOutcome = 'retry' | 'pass' | 'reject';

export type AmlManualReviewRiskLevel = 'danger' | 'safe';

/** 指定处理人异常 · 放行 / 驳回后列表与详情风险评级文案 catalog key。 */
export const AML_EXCEPTION_HANDLED_RISK_LABEL_KEY = 'AML Exception Handled';

export const riskControlAmlQueryRecordPatchesRef = ref<
  Record<string, Partial<PaymentEngineRecordRow>>
>({});

export function clearAmlQueryRecordPatches() {
  riskControlAmlQueryRecordPatchesRef.value = {};
}

export function mergeAmlQueryRecordPatch(row: PaymentEngineRecordRow): PaymentEngineRecordRow {
  const patch = riskControlAmlQueryRecordPatchesRef.value[row.id];
  if (!patch) return row;
  return { ...row, ...patch };
}

function riskPatchForOutcome(outcome: AmlExceptionHandlingOutcome): Partial<PaymentEngineRecordRow> {
  if (outcome === 'retry') {
    return {
      amlRiskLabelKey: 'Danger',
      amlRiskCustomStyle: 'aml-danger',
      amlRiskScore: '8.4',
    };
  }
  return {
    amlRiskLabelKey: AML_EXCEPTION_HANDLED_RISK_LABEL_KEY,
    amlRiskCustomStyle: 'aml-handled',
    amlRiskScore: '--',
  };
}

function resolveScoreCustomStyleForManualReview(
  recordId: string,
): PaymentEngineRecordRow['amlRiskScoreCustomStyle'] | undefined {
  const flow = paymentEngineDetailFlowRegistry.value;
  const current = flow?.detailRow.value;
  if (!current || current.id !== recordId) return undefined;
  const style = current.amlRiskScoreCustomStyle ?? current.amlRiskCustomStyle;
  return style;
}

function riskPatchForManualReview(
  level: AmlManualReviewRiskLevel,
  recordId: string,
): Partial<PaymentEngineRecordRow> {
  const scoreCustomStyle = resolveScoreCustomStyleForManualReview(recordId);
  const scorePatch = scoreCustomStyle ? { amlRiskScoreCustomStyle: scoreCustomStyle } : {};

  if (level === 'danger') {
    return {
      amlRiskLabelKey: 'Danger',
      amlRiskCustomStyle: 'aml-danger',
      amlManualReviewCompleted: true,
      ...scorePatch,
    };
  }
  return {
    amlRiskLabelKey: 'Safe',
    amlRiskCustomStyle: 'aml-safe',
    amlManualReviewCompleted: true,
    ...scorePatch,
  };
}

function syncDetailRowPatch(recordId: string) {
  const flow = paymentEngineDetailFlowRegistry.value;
  const current = flow?.detailRow.value;
  if (flow && current?.id === recordId) {
    flow.detailRow.value = mergeAmlQueryRecordPatch(current);
  }
}

export function applyAmlManualReviewOutcome(
  recordId: string,
  level: AmlManualReviewRiskLevel,
) {
  const riskPatch = riskPatchForManualReview(level, recordId);
  riskControlAmlQueryRecordPatchesRef.value = {
    ...riskControlAmlQueryRecordPatchesRef.value,
    [recordId]: {
      ...riskControlAmlQueryRecordPatchesRef.value[recordId],
      ...riskPatch,
    },
  };
  syncDetailRowPatch(recordId);
}

export function applyAmlExceptionHandlingOutcome(
  recordId: string,
  outcome: AmlExceptionHandlingOutcome,
) {
  const riskPatch = riskPatchForOutcome(outcome);
  const patch: Partial<PaymentEngineRecordRow> = {
    amlExceptionHandlingResolved: true,
    amlExceptionHandlingOutcome: outcome,
    ...riskPatch,
  };

  riskControlAmlQueryRecordPatchesRef.value = {
    ...riskControlAmlQueryRecordPatchesRef.value,
    [recordId]: {
      ...riskControlAmlQueryRecordPatchesRef.value[recordId],
      ...patch,
    },
  };

  syncDetailRowPatch(recordId);
}
