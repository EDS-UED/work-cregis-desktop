import type { EgFilterRowSnapshot } from '../../shared/applyEgFilterConditions';
import { resolveDataListFilterOptionId } from '../../shared/dataListFilterOptionUtils';
import type { PaymentEngineRecordRow } from '../paymentEngineRecordConfigs';
import { resolvePaymentSettlementRecordDetail } from '../paymentEngineSettlementDetailData';
import { buildPaymentEngineRecordStatusCustomize } from '../paymentEngineRecordStatusCustomize';
import { resolvePaymentRecordPaymentCurrencyLabel } from './resolvePaymentRecordPaymentCurrencyLabel';
import {
  SETTLEMENT_RECORD_CURRENCY_NAMESPACE,
  SETTLEMENT_RECORD_STATUS_NAMESPACE,
} from './settlementRecordFilterNamespaces';

function resolveSettlementRecordStatusOptionId(
  row: PaymentEngineRecordRow,
): string | undefined {
  const customize = buildPaymentEngineRecordStatusCustomize(row, 'Settlement Record');
  const label = String(customize.label ?? '').trim();
  if (!label) return undefined;
  return resolveDataListFilterOptionId(SETTLEMENT_RECORD_STATUS_NAMESPACE, label);
}

export function buildSettlementRecordFilterRowSnapshot(
  _rowIndex: number,
  row: PaymentEngineRecordRow,
): EgFilterRowSnapshot {
  const detail = resolvePaymentSettlementRecordDetail(row);

  return {
    settlementId: row.id,
    settlementStatus: resolveSettlementRecordStatusOptionId(row),
    settlementCurrency: resolveDataListFilterOptionId(
      SETTLEMENT_RECORD_CURRENCY_NAMESPACE,
      resolvePaymentRecordPaymentCurrencyLabel(row),
    ),
    settlementTime: row.createdAt,
    settlementAmount: row.orderAmount,
    settlementWalletAddress: detail.settlementAddress,
  };
}
