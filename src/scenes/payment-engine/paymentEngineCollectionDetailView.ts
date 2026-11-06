import type { TagStatus } from '@eds/desktop-components';
import { formatGroupedAmountText } from '@/utils/formatGroupedDisplay';
import type { PaymentEngineRecordRow } from './paymentEngineRecordConfigs';
import { resolvePaymentCollectionDetailRecord } from './paymentEngineCollectionDetailData';

export type PaymentEngineCollectionDetailTabKind = 'collection' | 'eip7702' | 'gas-top-up';

export type PaymentEngineCollectionDetailView = {
  headline: {
    eyebrowKey: 'Collected Amount';
    amountText: string;
    status: {
      labelKey: 'Collecting' | 'Abnormally Stopped';
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
  alert: ReturnType<typeof resolvePaymentCollectionDetailRecord>['alert'];
  stopped: boolean;
  recordTabs: Array<{
    kind: PaymentEngineCollectionDetailTabKind;
    labelKey: 'Collection Record' | 'EIP-7702 Upgrading' | 'Gas Fee Top-up';
  }>;
  recordsByTab: Record<
    PaymentEngineCollectionDetailTabKind,
    ReturnType<typeof resolvePaymentCollectionDetailRecord>['recordLines']
  >;
};

export function buildPaymentEngineCollectionDetailView(
  row: PaymentEngineRecordRow,
): PaymentEngineCollectionDetailView {
  const detail = resolvePaymentCollectionDetailRecord(row);
  const stopped =
    detail.alert === 'miner-fee-insufficient'
    || detail.alert === 'team-account-balance-insufficient';

  return {
    headline: {
      eyebrowKey: 'Collected Amount',
      amountText: formatGroupedAmountText(
        `${detail.collectedAmount} ${detail.collectedSymbol}`.trim(),
      ),
      status: {
        labelKey: stopped ? 'Abnormally Stopped' : 'Collecting',
        kind: stopped ? 'danger' : 'success',
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
    alert: detail.alert,
    stopped,
    recordTabs: [
      { kind: 'collection', labelKey: 'Collection Record' },
      ...(detail.supportsEip7702
        ? [{ kind: 'eip7702' as const, labelKey: 'EIP-7702 Upgrading' as const }]
        : []),
      { kind: 'gas-top-up', labelKey: 'Gas Fee Top-up' },
    ],
    recordsByTab: {
      collection: detail.recordLines,
      eip7702: detail.eip7702Lines,
      'gas-top-up': detail.gasTopUpLines,
    },
  };
}
