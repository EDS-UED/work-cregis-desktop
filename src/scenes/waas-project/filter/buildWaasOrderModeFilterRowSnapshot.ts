import type { EgFilterRowSnapshot } from '../../shared/applyEgFilterConditions';
import { resolveCallbackEventLabelKey } from '../../payment-engine/paymentEngineListFieldCustomize';
import type { PaymentEngineRecordRow } from '../../payment-engine/paymentEngineRecordConfigs';
import { enrichPaymentOrderRecordForDetail } from '../../payment-engine/paymentEngineOrderRecordDetailData';
import { resolvePaymentOrderRecordRowIndex } from '../../payment-engine/paymentEngineOrderRecordData';
import { resolvePaymentExceptionRecordDetail } from '../../payment-engine/paymentEnginePaymentExceptionDetailData';
import { resolvePaymentRefundRecordDetail } from '../../payment-engine/paymentEngineRefundRecordDetailData';
import { resolveWaasOrderModeFilterStatusOptionId } from './buildWaasOrderModeStatusFilterOptions';
import { buildWaasDataListFilterRowSnapshot } from './buildWaasDataListFilterRowSnapshot';
import {
  joinWaasFilterSearchParts,
  resolveWaasFilterDropdownOptionId,
} from './waasDataListFilterShared';

function buildCurrencySnapshot(row: PaymentEngineRecordRow): Pick<
  EgFilterRowSnapshot,
  'currency' | 'currencySymbol' | 'currencyNetwork'
> {
  return {
    currency: row.currencySymbol ?? row.orderSymbol,
    currencySymbol: row.currencySymbol ?? row.orderSymbol,
    currencyNetwork: String(row.currencyNetwork ?? row.networkLabel ?? '').trim(),
  };
}

function buildAddressPairSnapshot(
  senderAddress?: string,
  senderAlias?: string,
  receiverAddress?: string,
  receiverAlias?: string,
): Pick<EgFilterRowSnapshot, 'sender' | 'receiver'> {
  return {
    sender: joinWaasFilterSearchParts([senderAddress, senderAlias]),
    receiver: joinWaasFilterSearchParts([receiverAddress, receiverAlias]),
  };
}

function buildOrderRecordSnapshot(
  rowIndex: number,
  row: PaymentEngineRecordRow,
): EgFilterRowSnapshot {
  const enriched = enrichPaymentOrderRecordForDetail(row);
  const resolvedIndex = resolvePaymentOrderRecordRowIndex(row);
  const firstPayment = enriched.orderPayments?.[0];

  return {
    ...buildCurrencySnapshot(row),
    merchantOrderId: row.merchantOrderId ?? '',
    orderId: row.id,
    createdAt: row.createdAt,
    paymentTxHash: firstPayment?.txHash ?? '',
    orderStatus: resolveWaasOrderModeFilterStatusOptionId(row, 'Order Record', 'orderStatus', resolvedIndex),
    orderCurrency: row.orderSymbol,
    orderAmount: row.orderAmount,
    receivingCurrency: row.receivedSymbol ?? row.orderSymbol,
  };
}

function buildBulkTransferRecordSnapshot(
  rowIndex: number,
  row: PaymentEngineRecordRow,
  menuItem: string,
): EgFilterRowSnapshot {
  return {
    bulkTransferId: row.bulkTransferId ?? row.id,
    bulkTransferStatus: resolveWaasOrderModeFilterStatusOptionId(
      row,
      menuItem,
      'bulkTransferStatus',
      rowIndex,
    ),
    createdAt: row.createdAt,
    bulkTransferAmount: row.orderAmount,
    transferCurrency: row.currencySymbol ?? row.orderSymbol,
  };
}

function buildRefundRecordSnapshot(
  rowIndex: number,
  row: PaymentEngineRecordRow,
  menuItem: string,
): EgFilterRowSnapshot {
  const detail = resolvePaymentRefundRecordDetail(row);

  return {
    ...buildCurrencySnapshot(row),
    orderId: row.id,
    createdAt: row.createdAt,
    refundReason: detail.refundReasonKey
      ? resolveWaasFilterDropdownOptionId('waas-refund-reason', detail.refundReasonKey)
      : undefined,
    refundStatus: resolveWaasOrderModeFilterStatusOptionId(row, menuItem, 'refundStatus', rowIndex),
    refundType: detail.refundTypeKey
      ? resolveWaasFilterDropdownOptionId('waas-refund-type', detail.refundTypeKey)
      : undefined,
  };
}

function buildPaymentExceptionRecordSnapshot(
  rowIndex: number,
  row: PaymentEngineRecordRow,
  menuItem: string,
): EgFilterRowSnapshot {
  const detail = resolvePaymentExceptionRecordDetail(row);

  return {
    ...buildCurrencySnapshot(row),
    createdAt: row.createdAt,
    txHash: detail.txHash ?? '',
    abnormalReason: detail.filteredReasonKey,
    transferStatus: resolveWaasOrderModeFilterStatusOptionId(row, menuItem, 'transferStatus', rowIndex),
    ...buildAddressPairSnapshot(
      detail.senderAddress,
      undefined,
      detail.receiverAddress,
      detail.receiverAlias,
    ),
  };
}

function buildCallbackEventSnapshot(
  rowIndex: number,
  row: PaymentEngineRecordRow,
  menuItem: string,
): EgFilterRowSnapshot {
  const businessTypeLabel = row.callbackEventType
    ? resolveCallbackEventLabelKey(row.callbackEventType)
    : '';

  return {
    cregisId: joinWaasFilterSearchParts([row.callbackEventId, row.id]),
    businessType: businessTypeLabel
      ? resolveWaasFilterDropdownOptionId('waas-business-type', businessTypeLabel)
      : undefined,
    callbackAddress: row.callbackUrl ?? '',
    callbackTime: row.createdAt,
    ...(menuItem === 'History Callback'
      ? {
          pushStatus: resolveWaasOrderModeFilterStatusOptionId(
            row,
            menuItem,
            'pushStatus',
            rowIndex,
          ),
        }
      : {}),
  };
}

export function buildWaasOrderModeFilterRowSnapshot(
  rowIndex: number,
  row: PaymentEngineRecordRow,
  menuItem: string,
): EgFilterRowSnapshot {
  switch (menuItem) {
    case 'Order Record':
      return buildOrderRecordSnapshot(rowIndex, row);
    case 'Bulk Transfer Record':
      return buildBulkTransferRecordSnapshot(rowIndex, row, menuItem);
    case 'Refund Record':
      return buildRefundRecordSnapshot(rowIndex, row, menuItem);
    case 'Payment Exception Record':
      return buildPaymentExceptionRecordSnapshot(rowIndex, row, menuItem);
    case 'Wallet Payout':
      return buildWaasDataListFilterRowSnapshot(rowIndex, row, menuItem);
    case 'Callback Error':
    case 'History Callback':
      return buildCallbackEventSnapshot(rowIndex, row, menuItem);
    default:
      return buildWaasDataListFilterRowSnapshot(rowIndex, row, menuItem);
  }
}
