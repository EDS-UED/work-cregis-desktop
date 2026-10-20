import type {
  EgFilterFieldDropdownOption,
  EgFilterFieldStatusOption,
} from '@eds/desktop-components';
import { buildDataListCurrencyFilterOptionsFromRows } from '../../shared/buildDataListCurrencyFilterOptionsFromRows';
import { uniqueDataListFilterOptions } from '../../shared/dataListFilterOptionUtils';
import { resolveCallbackEventLabelKey } from '../../payment-engine/paymentEngineListFieldCustomize';
import { buildPaymentEngineRecordRows } from '../../payment-engine/paymentEngineOrderRecordData';
import { resolvePaymentRefundRecordDetail } from '../../payment-engine/paymentEngineRefundRecordDetailData';
import { buildWaasOrderModeStatusFilterOptions } from './buildWaasOrderModeStatusFilterOptions';

export type WaasOrderModeFilterRowOptions = {
  currencyOptions: ReturnType<typeof buildDataListCurrencyFilterOptionsFromRows>;
  orderCurrencyOptions: ReturnType<typeof buildDataListCurrencyFilterOptionsFromRows>;
  receivingCurrencyOptions: ReturnType<typeof buildDataListCurrencyFilterOptionsFromRows>;
  transferCurrencyOptions: ReturnType<typeof buildDataListCurrencyFilterOptionsFromRows>;
  orderStatusOptions: EgFilterFieldStatusOption[];
  bulkTransferStatusOptions: EgFilterFieldStatusOption[];
  refundStatusOptions: EgFilterFieldStatusOption[];
  transferStatusOptions: EgFilterFieldStatusOption[];
  transactionStatusOptions: EgFilterFieldStatusOption[];
  pushStatusOptions: EgFilterFieldStatusOption[];
  refundReasonOptions: EgFilterFieldDropdownOption[];
  refundTypeOptions: EgFilterFieldDropdownOption[];
  businessTypeOptions: EgFilterFieldDropdownOption[];
};

export function buildWaasOrderModeFilterOptionsFromRows(
  rowCount: number,
  menuItem: string,
): WaasOrderModeFilterRowOptions {
  const safeRowCount = Math.max(0, rowCount);
  const rows = buildPaymentEngineRecordRows(menuItem, safeRowCount);

  const refundReasonLabels: string[] = [];
  const refundTypeLabels: string[] = [];
  const businessTypeLabels: string[] = [];

  for (const row of rows) {
    if (menuItem === 'Refund Record') {
      const detail = resolvePaymentRefundRecordDetail(row);
      if (detail.refundReasonKey) refundReasonLabels.push(detail.refundReasonKey);
      if (detail.refundTypeKey) refundTypeLabels.push(detail.refundTypeKey);
    }

    if (row.callbackEventType) {
      businessTypeLabels.push(resolveCallbackEventLabelKey(row.callbackEventType));
    }
  }

  return {
    currencyOptions: buildDataListCurrencyFilterOptionsFromRows(
      rows,
      (row) => row.currencySymbol ?? row.orderSymbol,
    ),
    orderCurrencyOptions: buildDataListCurrencyFilterOptionsFromRows(
      rows,
      (row) => row.orderSymbol,
    ),
    receivingCurrencyOptions: buildDataListCurrencyFilterOptionsFromRows(
      rows,
      (row) => row.receivedSymbol ?? row.orderSymbol,
    ),
    transferCurrencyOptions: buildDataListCurrencyFilterOptionsFromRows(
      rows,
      (row) => row.currencySymbol ?? row.orderSymbol,
    ),
    orderStatusOptions: buildWaasOrderModeStatusFilterOptions(safeRowCount, menuItem, 'orderStatus'),
    bulkTransferStatusOptions: buildWaasOrderModeStatusFilterOptions(
      safeRowCount,
      menuItem,
      'bulkTransferStatus',
    ),
    refundStatusOptions: buildWaasOrderModeStatusFilterOptions(safeRowCount, menuItem, 'refundStatus'),
    transferStatusOptions: buildWaasOrderModeStatusFilterOptions(safeRowCount, menuItem, 'transferStatus'),
    transactionStatusOptions: buildWaasOrderModeStatusFilterOptions(
      safeRowCount,
      menuItem,
      'transactionStatus',
    ),
    pushStatusOptions: buildWaasOrderModeStatusFilterOptions(safeRowCount, menuItem, 'pushStatus'),
    refundReasonOptions: uniqueDataListFilterOptions('waas-refund-reason', refundReasonLabels),
    refundTypeOptions: uniqueDataListFilterOptions('waas-refund-type', refundTypeLabels),
    businessTypeOptions: uniqueDataListFilterOptions('waas-business-type', businessTypeLabels),
  };
}
