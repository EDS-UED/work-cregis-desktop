import {
  createDetailApplyItemRow,
  type DetailItemData,
  type TagStatus,
} from '@eds/desktop-components';
import { resolveVerifiedTxHashForRow } from '@/scenes/tasks/list-field/listFieldCryptoSampleAddresses';

export type DetailTransactionOutcomeFields = {
  transactionStatusLabel?: string;
  transactionStatusTag?: TagStatus;
  transactionHash?: string;
};

export function buildDetailTransactionOutcomeFields(
  rowIndex: number,
): DetailTransactionOutcomeFields {
  return {
    transactionStatusLabel: 'Success',
    transactionStatusTag: 'success',
    transactionHash: resolveVerifiedTxHashForRow(rowIndex, 'evm'),
  };
}

export function buildDetailTransactionStatusItem(
  detail: DetailTransactionOutcomeFields,
  translate: (key: string) => string,
): DetailItemData | null {
  if (!detail.transactionStatusLabel) return null;

  return {
    ...createDetailApplyItemRow('status', {
      key: 'transaction-status',
      title: translate('Transaction Status'),
      tag: translate(detail.transactionStatusLabel),
    }),
    tagFamily: 'status',
    tagStatus: detail.transactionStatusTag ?? 'success',
    valueTagOnly: true,
    value: '',
  };
}

export function buildDetailTransactionHashItem(
  detail: DetailTransactionOutcomeFields,
  translate: (key: string) => string,
): DetailItemData | null {
  const hash = detail.transactionHash?.trim();
  if (!hash) return null;

  return createDetailApplyItemRow('txid', {
    key: 'transaction-hash',
    title: translate('Transaction hash'),
    value: hash,
  });
}
