import { computed, ref, shallowRef } from 'vue';
import {
  isCallbackRecordDetailMenuItem,
  isPaymentBulkTransferRecordMenuItem,
  isPaymentExceptionRecordMenuItem,
  isPaymentOrderRecordMenuItem,
  isPaymentRefundRecordMenuItem,
} from './paymentEngineOrderRecordData';
import { enrichPaymentCallbackErrorRecordForDetail } from './paymentEngineCallbackErrorDetailData';
import { enrichPaymentBulkTransferRecordForDetail } from './paymentEngineBulkTransferDetailData';
import { enrichPaymentExceptionRecordForDetail } from './paymentEnginePaymentExceptionDetailData';
import { enrichPaymentRefundRecordForDetail } from './paymentEngineRefundRecordDetailData';
import {
  enrichPaymentOrderRecordForDetail,
  isPaymentOrderRecordDetailEnriched,
} from './paymentEngineOrderRecordDetailData';
import type { PaymentEngineRecordRow } from './paymentEngineRecordConfigs';

export function usePaymentEngineDetailFlow() {
  const detailOpen = ref(false);
  const detailRow = shallowRef<PaymentEngineRecordRow | null>(null);
  const detailMenuItem = ref('Payment Record');
  const detailActiveTab = ref(0);
  const bulkTransferDetailOpen = ref(false);
  const bulkTransferDetailRow = shallowRef<PaymentEngineRecordRow | null>(null);

  const detailPopupMounted = computed(
    () => detailOpen.value || detailRow.value != null,
  );

  function closeBulkTransferDetail() {
    bulkTransferDetailOpen.value = false;
  }

  function clearBulkTransferDetailRow() {
    bulkTransferDetailRow.value = null;
  }

  function openBulkTransferDetailForRow(
    row: PaymentEngineRecordRow,
    menuItem: string,
  ) {
    detailMenuItem.value = menuItem;
    detailOpen.value = false;
    detailRow.value = null;
    bulkTransferDetailRow.value = enrichPaymentBulkTransferRecordForDetail(row);
    bulkTransferDetailOpen.value = true;
  }

  function openDetailForRow(
    row: PaymentEngineRecordRow,
    menuItem: string,
    activeTab = 0,
  ) {
    if (isPaymentBulkTransferRecordMenuItem(menuItem)) {
      openBulkTransferDetailForRow(row, menuItem);
      return;
    }

    closeBulkTransferDetail();
    detailMenuItem.value = menuItem;
    detailActiveTab.value = activeTab;
    if (isPaymentOrderRecordMenuItem(menuItem)) {
      detailRow.value = isPaymentOrderRecordDetailEnriched(row)
        ? row
        : enrichPaymentOrderRecordForDetail(row);
    } else if (isPaymentRefundRecordMenuItem(menuItem)) {
      detailRow.value = enrichPaymentRefundRecordForDetail(row);
    } else if (isPaymentExceptionRecordMenuItem(menuItem)) {
      detailRow.value = enrichPaymentExceptionRecordForDetail(row);
    } else if (isCallbackRecordDetailMenuItem(menuItem)) {
      detailRow.value = enrichPaymentCallbackErrorRecordForDetail(row);
    } else {
      detailRow.value = row;
    }
    detailOpen.value = true;
  }

  function onDetailPopupClosed() {
    detailRow.value = null;
  }

  return {
    detailOpen,
    detailRow,
    detailMenuItem,
    detailActiveTab,
    detailPopupMounted,
    bulkTransferDetailOpen,
    bulkTransferDetailRow,
    openDetailForRow,
    closeBulkTransferDetail,
    clearBulkTransferDetailRow,
    onDetailPopupClosed,
  };
}
