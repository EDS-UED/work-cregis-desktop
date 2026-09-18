import type { TagStatus } from '@eds/desktop-components';
import { formatGroupedAmountText } from '@/utils/formatGroupedDisplay';
import { resolveCryptoNameFromSymbol } from '@/scenes/tasks/list-field/listFieldCryptoResolve';
import type { PaymentEngineRecordRow } from './paymentEngineRecordConfigs';
import { resolvePaymentBulkTransferDetailRecord } from './paymentEngineBulkTransferDetailData';

export type PaymentEngineBulkTransferDetailView = {
  headline: {
    eyebrowKey: 'Bulk Transfer Amount';
    amountText: string;
    status: {
      label: string;
      kind: TagStatus;
    };
  };
  creationTime: {
    labelKey: 'Bulk Transfer Order Creation Time';
    value: string;
  };
  summary: {
    titleKey: 'Bulk Transfer Detail';
    transferId: string;
    currency: {
      symbol: string;
      cryptoName: string;
      networkTag: string;
    };
    recipientAddress: string;
  };
  transferRecords: {
    tabLabelKey: 'Transfer Records';
    lines: ReturnType<typeof resolvePaymentBulkTransferDetailRecord>['transferLines'];
  };
};

export function buildPaymentEngineBulkTransferDetailView(
  row: PaymentEngineRecordRow,
  menuItem: string,
  translate: (key: string) => string,
  resolveStatusLabel: (
    row: PaymentEngineRecordRow,
    menuItem: string,
    translate: (key: string) => string,
  ) => string,
  resolveStatusKind: (row: PaymentEngineRecordRow, menuItem: string) => TagStatus,
): PaymentEngineBulkTransferDetailView {
  const detail = resolvePaymentBulkTransferDetailRecord(row);
  const currencySymbol = row.currencySymbol ?? row.orderSymbol;
  const cryptoName =
    resolveCryptoNameFromSymbol(currencySymbol) ?? 'eds-usdt-tether';

  return {
    headline: {
      eyebrowKey: 'Bulk Transfer Amount',
      amountText: formatGroupedAmountText(`${row.orderAmount} ${currencySymbol}`.trim()),
      status: {
        label: resolveStatusLabel(row, menuItem, translate),
        kind: resolveStatusKind(row, menuItem),
      },
    },
    creationTime: {
      labelKey: 'Bulk Transfer Order Creation Time',
      value: row.createdAt,
    },
    summary: {
      titleKey: 'Bulk Transfer Detail',
      transferId: row.bulkTransferId ?? row.id,
      currency: {
        symbol: currencySymbol,
        cryptoName,
        networkTag: (row.currencyNetwork ?? row.networkLabel ?? '').trim(),
      },
      recipientAddress: detail.recipientAddress,
    },
    transferRecords: {
      tabLabelKey: 'Transfer Records',
      lines: detail.transferLines,
    },
  };
}
