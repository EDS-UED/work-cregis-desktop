import type { EgFilterRowSnapshot } from '../../shared/applyEgFilterConditions';
import { resolveDataListFilterOptionId } from '../../shared/dataListFilterOptionUtils';
import { enrichPaymentOrderRecordForDetail } from '../paymentEngineOrderRecordDetailData';
import {
  resolvePaymentOrderRecordRowIndex,
  resolvePaymentOrderRecordSeedByIndex,
} from '../paymentEngineOrderRecordData';
import type { PaymentEngineOrderStatus, PaymentEngineRecordRow } from '../paymentEngineRecordConfigs';
import { resolvePaymentEngineOrderStatusLabelKey } from '../paymentEngineOrderStatusLabels';
import {
  PAYMENT_RECORD_ORDER_STATUS_SEQUENCE,
  PAYMENT_RECORD_SETTLEMENT_STATUS_LABEL_KEYS,
} from './paymentRecordFilterCatalog';
import {
  PAYMENT_RECORD_ORDER_STATUS_NAMESPACE,
  PAYMENT_RECORD_SETTLEMENT_STATUS_NAMESPACE,
} from './paymentRecordFilterNamespaces';

export function resolvePaymentRecordOrderStatusOptionId(
  status: PaymentEngineOrderStatus,
): string | undefined {
  if (!(PAYMENT_RECORD_ORDER_STATUS_SEQUENCE as readonly PaymentEngineOrderStatus[]).includes(status)) {
    return undefined;
  }
  const label = resolvePaymentEngineOrderStatusLabelKey(status);
  return resolveDataListFilterOptionId(PAYMENT_RECORD_ORDER_STATUS_NAMESPACE, label);
}

function resolvePaymentRecordSettlementStatusLabel(
  row: PaymentEngineRecordRow,
): (typeof PAYMENT_RECORD_SETTLEMENT_STATUS_LABEL_KEYS)[number] | undefined {
  if (row.status === 'transferred') return 'Settled';
  if (row.status === 'paid') return 'Settling';
  return undefined;
}

export function resolvePaymentRecordSettlementStatusOptionId(
  row: PaymentEngineRecordRow,
): string | undefined {
  const label = resolvePaymentRecordSettlementStatusLabel(row);
  if (!label) return undefined;
  return resolveDataListFilterOptionId(PAYMENT_RECORD_SETTLEMENT_STATUS_NAMESPACE, label);
}

function resolvePaymentRecordOrderCurrencySymbol(row: PaymentEngineRecordRow): string {
  const rowIndex = resolvePaymentOrderRecordRowIndex(row);
  const seed = resolvePaymentOrderRecordSeedByIndex(rowIndex);
  const fiatSymbol = seed.orderFiatSymbol.trim();
  if (fiatSymbol) return fiatSymbol;
  return row.orderSymbol.trim();
}

function joinFilterSearchParts(parts: Array<string | undefined>): string {
  return parts
    .map((part) => String(part ?? '').trim())
    .filter(Boolean)
    .join(' ');
}

export function buildPaymentRecordFilterRowSnapshot(
  rowIndex: number,
  row: PaymentEngineRecordRow,
): EgFilterRowSnapshot {
  const enriched = enrichPaymentOrderRecordForDetail(row);
  const firstPayment = enriched.orderPayments?.[0];
  const orderCurrency = resolvePaymentRecordOrderCurrencySymbol(row);
  const paymentSymbol = String(row.receivedSymbol ?? row.orderSymbol ?? '').trim();
  const paymentNetwork = String(row.currencyNetwork ?? row.networkLabel ?? '').trim();

  return {
    orderId: row.id,
    merchantOrderId: row.merchantOrderId ?? '',
    orderStatus: resolvePaymentRecordOrderStatusOptionId(row.status),
    settlementStatus: resolvePaymentRecordSettlementStatusOptionId(row),
    createdAt: row.createdAt,
    paymentTxHash: firstPayment?.txHash ?? '',
    paymentSender: joinFilterSearchParts([
      firstPayment?.senderAddress,
      firstPayment?.paymentWallet,
    ]),
    paymentReceiver: joinFilterSearchParts([firstPayment?.receiverAddress]),
    orderCurrency,
    orderAmount: row.orderAmount,
    paymentCurrency: paymentSymbol,
    currencySymbol: paymentSymbol,
    currencyNetwork: paymentNetwork,
    receivedAmount: row.receivedAmount,
  };
}
