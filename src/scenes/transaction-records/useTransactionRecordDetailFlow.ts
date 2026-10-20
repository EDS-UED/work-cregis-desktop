import { computed, ref, shallowRef } from 'vue';
import {
  buildTransactionRecordRow,
  TRANSACTION_RECORD_PARALLEL_OUT_DEMO_ROW_INDEX,
} from './transactionRecordData';
import type { TransactionRecordDetailPage } from './transactionRecordDetailPage';
import type { TransactionRecordRow } from './transactionRecordTypes';
import { parseRowIndexFromTransactionRecordId } from './transactionRecordDetail';

export function useTransactionRecordDetailFlow() {
  const detailOpen = ref(false);
  const detailRow = shallowRef<TransactionRecordRow | null>(null);
  const detailPage = ref<TransactionRecordDetailPage>('summary');

  const detailPopupMounted = computed(
    () => detailOpen.value || detailRow.value != null,
  );

  function loadDetail(id: string) {
    const rowIndex = parseRowIndexFromTransactionRecordId(id);
    detailRow.value = buildTransactionRecordRow(rowIndex);
  }

  function openDetailForRow(
    row: TransactionRecordRow,
    page: TransactionRecordDetailPage = 'summary',
  ) {
    loadDetail(row.id);
    detailPage.value = page;
    detailOpen.value = true;
  }

  function openParallelOutBtcDetailDemo(
    page: TransactionRecordDetailPage = 'summary',
  ) {
    openDetailForRow(
      buildTransactionRecordRow(TRANSACTION_RECORD_PARALLEL_OUT_DEMO_ROW_INDEX),
      page,
    );
  }

  function resetDetailNavigation() {
    detailPage.value = 'summary';
  }

  function onDetailPopupClosed() {
    detailRow.value = null;
    detailPage.value = 'summary';
  }

  return {
    detailOpen,
    detailRow,
    detailPage,
    detailPopupMounted,
    openDetailForRow,
    openParallelOutBtcDetailDemo,
    resetDetailNavigation,
    onDetailPopupClosed,
  };
}
