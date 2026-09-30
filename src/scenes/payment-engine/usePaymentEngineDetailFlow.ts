import { computed, ref, shallowRef } from 'vue';
import {
  isCallbackRecordDetailMenuItem,
  isPaymentBulkTransferRecordMenuItem,
  isPaymentExceptionRecordMenuItem,
  isPaymentOrderRecordMenuItem,
  isPaymentRefundRecordMenuItem,
  isWalletPayoutRecordMenuItem,
  isTransactionRecordDetailMenuItem,
  isApiCollectionRecordMenuItem,
  isPaymentCollectionDetailMenuItem,
  isCollectionRecordDetailMenuItem,
  isRuleConfigurationRecordMenuItem,
} from './paymentEngineOrderRecordData';
import { enrichPaymentApiCollectionRecordForDetail } from './paymentEngineApiCollectionDetailData';
import { enrichPaymentCollectionRecordForDetail } from './paymentEngineCollectionRecordDetailData';
import { enrichPaymentCollectionDetailRecordForDetail } from './paymentEngineCollectionDetailData';
import { enrichPaymentRuleConfigurationRecordForDetail } from './paymentEngineRuleConfigurationDetailData';
import { enrichPaymentTransactionRecordForDetail } from './paymentEngineTransactionRecordDetailData';
import { enrichPaymentWalletPayoutRecordForDetail } from './paymentEngineWalletPayoutDetailData';
import { enrichPaymentCallbackErrorRecordForDetail } from './paymentEngineCallbackErrorDetailData';
import { enrichPaymentBulkTransferRecordForDetail } from './paymentEngineBulkTransferDetailData';
import { enrichPaymentExceptionRecordForDetail } from './paymentEnginePaymentExceptionDetailData';
import { enrichPaymentRefundRecordForDetail } from './paymentEngineRefundRecordDetailData';
import {
  enrichPaymentOrderRecordForDetail,
  isPaymentOrderRecordDetailEnriched,
} from './paymentEngineOrderRecordDetailData';
import { enrichRiskControlAutoRuleRecordForDetail } from '@/scenes/risk-control/riskControlAutoRuleDetailData';
import { enrichRiskControlLogRecordForDetail } from '@/scenes/risk-control/riskControlLogDetailData';
import {
  isRiskControlAutoRulesMenuItem,
  isRiskControlLogsMenuItem,
} from '@/scenes/risk-control/riskControlMenuData';
import type { PaymentEngineRecordRow } from './paymentEngineRecordConfigs';

export function usePaymentEngineDetailFlow() {
  const detailOpen = ref(false);
  const detailRow = shallowRef<PaymentEngineRecordRow | null>(null);
  const detailMenuItem = ref('Payment Record');
  const detailActiveTab = ref(0);
  const bulkTransferDetailOpen = ref(false);
  const bulkTransferDetailRow = shallowRef<PaymentEngineRecordRow | null>(null);
  const collectionDetailOpen = ref(false);
  const collectionDetailRow = shallowRef<PaymentEngineRecordRow | null>(null);

  const detailPopupMounted = computed(
    () => detailOpen.value || detailRow.value != null,
  );

  function closeBulkTransferDetail() {
    bulkTransferDetailOpen.value = false;
  }

  function clearBulkTransferDetailRow() {
    bulkTransferDetailRow.value = null;
  }

  function closeCollectionDetail() {
    collectionDetailOpen.value = false;
  }

  function clearCollectionDetailRow() {
    collectionDetailRow.value = null;
  }

  function openCollectionDetailForRow(
    row: PaymentEngineRecordRow,
    menuItem: string,
  ) {
    detailMenuItem.value = menuItem;
    detailOpen.value = false;
    detailRow.value = null;
    bulkTransferDetailOpen.value = false;
    bulkTransferDetailRow.value = null;
    collectionDetailRow.value = enrichPaymentCollectionDetailRecordForDetail(row);
    collectionDetailOpen.value = true;
  }

  function openBulkTransferDetailForRow(
    row: PaymentEngineRecordRow,
    menuItem: string,
  ) {
    detailMenuItem.value = menuItem;
    detailOpen.value = false;
    detailRow.value = null;
    collectionDetailOpen.value = false;
    collectionDetailRow.value = null;
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

    if (isPaymentCollectionDetailMenuItem(menuItem)) {
      openCollectionDetailForRow(row, menuItem);
      return;
    }

    closeBulkTransferDetail();
    closeCollectionDetail();
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
    } else if (isWalletPayoutRecordMenuItem(menuItem)) {
      detailRow.value = enrichPaymentWalletPayoutRecordForDetail(row);
    } else if (isTransactionRecordDetailMenuItem(menuItem)) {
      detailRow.value = enrichPaymentTransactionRecordForDetail(row, menuItem);
    } else if (isApiCollectionRecordMenuItem(menuItem)) {
      detailRow.value = enrichPaymentApiCollectionRecordForDetail(row);
    } else if (isCollectionRecordDetailMenuItem(menuItem)) {
      detailRow.value = enrichPaymentCollectionRecordForDetail(row, menuItem);
    } else if (isRuleConfigurationRecordMenuItem(menuItem)) {
      detailRow.value = enrichPaymentRuleConfigurationRecordForDetail(row);
    } else if (isRiskControlAutoRulesMenuItem(menuItem)) {
      detailRow.value = enrichRiskControlAutoRuleRecordForDetail(row);
    } else if (isRiskControlLogsMenuItem(menuItem)) {
      detailRow.value = enrichRiskControlLogRecordForDetail(row);
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
    collectionDetailOpen,
    collectionDetailRow,
    openDetailForRow,
    closeBulkTransferDetail,
    clearBulkTransferDetailRow,
    closeCollectionDetail,
    clearCollectionDetailRow,
    onDetailPopupClosed,
  };
}
