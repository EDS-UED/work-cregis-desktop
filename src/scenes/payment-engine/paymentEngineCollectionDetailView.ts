import type { TagStatus } from '@eds/desktop-components';
import { formatGroupedAmountText } from '@/utils/formatGroupedDisplay';
import type { PaymentEngineRecordRow } from './paymentEngineRecordConfigs';
import { resolvePaymentCollectionDetailRecord } from './paymentEngineCollectionDetailData';

export type PaymentEngineCollectionDetailView = {
  headline: {
    eyebrowKey: 'Collected Amount';
    amountText: string;
    status: {
      labelKey: 'Collecting';
      kind: TagStatus;
    };
  };
  meta: {
    minerFee: string;
    initiatorName: string;
  };
  conditions: ReturnType<typeof resolvePaymentCollectionDetailRecord>;
  progress: {
    percent: number;
    runningStartedAt: number;
    pendingCount: string;
    failedCount: string;
    successCount: string;
  };
  recordTabs: {
    labels: readonly ['Collection Record', 'EIP-7702 Upgrading', 'Gas Fee Top-up'];
  };
  records: ReturnType<typeof resolvePaymentCollectionDetailRecord>['recordLines'];
};

export function buildPaymentEngineCollectionDetailView(
  row: PaymentEngineRecordRow,
): PaymentEngineCollectionDetailView {
  const detail = resolvePaymentCollectionDetailRecord(row);

  return {
    headline: {
      eyebrowKey: 'Collected Amount',
      amountText: formatGroupedAmountText(
        `${detail.collectedAmount} ${detail.collectedSymbol}`.trim(),
      ),
      status: {
        labelKey: 'Collecting',
        kind: 'success',
      },
    },
    meta: {
      minerFee: detail.minerFee,
      initiatorName: detail.initiatorName,
    },
    conditions: detail,
    progress: {
      percent: detail.progressPercent,
      runningStartedAt: detail.runningStartedAt,
      pendingCount: detail.pendingCount,
      failedCount: detail.failedCount,
      successCount: detail.successCount,
    },
    recordTabs: {
      labels: ['Collection Record', 'EIP-7702 Upgrading', 'Gas Fee Top-up'],
    },
    records: detail.recordLines,
  };
}
