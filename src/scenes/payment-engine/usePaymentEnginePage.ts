import { computed, reactive, ref, watch } from 'vue';
import type {
  DataListItem,
  DetailSectionData,
  TagStatus,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import {
  parseAmountSortValue,
  type TasksDataListSortOrder,
} from '@/scenes/tasks/tasksDataListSort';
import { useDataListPaginer } from '@/scenes/tasks/useDataListPaginer';
import { formatGroupedNumber } from '@/utils/formatGroupedDisplay';
import {
  CALLBACK_RECORDS,
  EXCEPTION_RECORDS,
  ORDER_RECORDS,
  PAYMENT_ENGINE_PAGINER_STATS,
  SETTLEMENT_RECORDS,
  type OrderRecordRow,
  type PaymentEngineListKind,
  type SettlementRecordRow,
} from './paymentEngineData';
import {
  defaultPaymentEngineFilterRows,
  recordMatchesFilter,
} from './paymentEngineFilter';
import {
  orderDetailSections,
  orderHeadline,
  orderHeadlineStatus,
  orderTabLabels,
  settlementDetailSections,
  settlementHeadline,
} from './paymentEngineDetail';

export type PaymentEngineDetailKind = 'order' | 'settlement';

export const paymentEngineState = reactive({
  detailOpen: false,
  detailKind: 'order' as PaymentEngineDetailKind,
  activeOrderId: '',
  activeSettlementId: '',
  listRemountKey: 0,
  exportOpen: false,
});

const appliedFilterByKind = reactive<Record<PaymentEngineListKind, ReturnType<typeof defaultPaymentEngineFilterRows>>>({
  'Order Record': defaultPaymentEngineFilterRows('Order Record'),
  'Settlement Record': defaultPaymentEngineFilterRows('Settlement Record'),
  'Payment Exception Record': defaultPaymentEngineFilterRows('Payment Exception Record'),
  'Callback Record': defaultPaymentEngineFilterRows('Callback Record'),
});

const timeSortOrder = ref<TasksDataListSortOrder | ''>('');
const settlementNumberSortOrder = ref<TasksDataListSortOrder | ''>('');
const amountSortOrder = ref<TasksDataListSortOrder | ''>('');
const activeTab = ref(0);

function parseTime(value: string): number {
  const parsed = Date.parse(value.trim().replace('  ', ' ').replace(' ', 'T'));
  return Number.isFinite(parsed) ? parsed : 0;
}

function applyTimeSort<T>(items: T[], readTime: (item: T) => string): T[] {
  if (!timeSortOrder.value) return items;
  const copy = [...items];
  copy.sort((a, b) => {
    const delta = parseTime(readTime(a)) - parseTime(readTime(b));
    return timeSortOrder.value === 'asc' ? delta : -delta;
  });
  return copy;
}

function applyAmountSort<T>(items: T[], readAmount: (item: T) => string): T[] {
  if (!amountSortOrder.value) return items;
  const copy = [...items];
  copy.sort((a, b) => {
    const delta = parseAmountSortValue(readAmount(a)) - parseAmountSortValue(readAmount(b));
    return amountSortOrder.value === 'asc' ? delta : -delta;
  });
  return copy;
}

function clearOtherSorts(keep: 'time' | 'amount' | 'settlement-number') {
  if (keep !== 'time') timeSortOrder.value = '';
  if (keep !== 'amount') amountSortOrder.value = '';
  if (keep !== 'settlement-number') settlementNumberSortOrder.value = '';
}

export function usePaymentEnginePage(kind: () => PaymentEngineListKind) {
  const { ui } = useAppI18n();

  const appliedFilter = computed({
    get: () => appliedFilterByKind[kind()],
    set: (value) => {
      appliedFilterByKind[kind()] = value;
    },
  });

  const filteredOrders = computed(() => {
    let rows = ORDER_RECORDS.filter((row) =>
      recordMatchesFilter(
        `${row.orderId} ${row.merchantOrderId} ${row.status} ${ui(row.status)}`,
        appliedFilterByKind['Order Record'],
      ),
    );
    rows = applyAmountSort(rows, (row) => row.receivedAmount);
    return applyTimeSort(rows, (row) => row.createdAt);
  });

  const filteredSettlements = computed(() => {
    let rows = SETTLEMENT_RECORDS.filter((row) =>
      recordMatchesFilter(
        `${row.token} ${row.address} ${row.status} ${ui(row.status)} ${row.settlementNumber}`,
        appliedFilterByKind['Settlement Record'],
      ),
    );
    if (settlementNumberSortOrder.value) {
      rows = [...rows].sort((a, b) => {
        const delta = a.settlementNumber.localeCompare(b.settlementNumber);
        return settlementNumberSortOrder.value === 'asc' ? delta : -delta;
      });
    }
    rows = applyAmountSort(rows, (row) => row.receivedAmount);
    return applyTimeSort(rows, (row) => row.createdAt);
  });

  const filteredExceptions = computed(() => {
    let rows = EXCEPTION_RECORDS.filter((row) =>
      recordMatchesFilter(
        `${row.token} ${row.status} ${ui(row.status)} ${row.amount} ${row.fromAddress} ${row.toAddress}`,
        appliedFilterByKind['Payment Exception Record'],
      ),
    );
    rows = applyAmountSort(rows, (row) => row.amount);
    return applyTimeSort(rows, (row) => row.receivedAt);
  });

  const filteredCallbacks = computed(() => {
    const rows = CALLBACK_RECORDS.filter((row) =>
      recordMatchesFilter(
        `${row.orderId} ${row.merchantOrderId} ${row.status} ${ui(row.status)} ${row.event}`,
        appliedFilterByKind['Callback Record'],
      ),
    );
    return applyTimeSort(rows, (row) => row.callbackAt);
  });

  const totalCount = computed(() => {
    const current = kind();
    if (current === 'Order Record') return filteredOrders.value.length;
    if (current === 'Settlement Record') return filteredSettlements.value.length;
    if (current === 'Payment Exception Record') return filteredExceptions.value.length;
    return filteredCallbacks.value.length;
  });

  const paginer = useDataListPaginer(totalCount);

  watch(
    kind,
    () => {
      timeSortOrder.value = '';
      settlementNumberSortOrder.value = '';
      amountSortOrder.value = '';
      paginer.goFirstPage();
    },
    { immediate: true },
  );

  const pagedOrders = computed(() => paginer.paginateItems(filteredOrders.value));
  const pagedSettlements = computed(() => paginer.paginateItems(filteredSettlements.value));
  const pagedExceptions = computed(() => paginer.paginateItems(filteredExceptions.value));
  const pagedCallbacks = computed(() => paginer.paginateItems(filteredCallbacks.value));

  const dataList = computed((): DataListItem[] => {
    const current = kind();
    if (current === 'Order Record') {
      return pagedOrders.value.map((row) => ({ ...row }));
    }
    if (current === 'Settlement Record') {
      return pagedSettlements.value.map((row) => ({ ...row }));
    }
    if (current === 'Payment Exception Record') {
      return pagedExceptions.value.map((row) => ({ ...row }));
    }
    return pagedCallbacks.value.map((row) => ({ ...row }));
  });

  const statisticsItems = computed(() => {
    const current = kind();
    if (current === 'Callback Record') return [];
    return PAYMENT_ENGINE_PAGINER_STATS.map((item) => ({
      text: ui(item.text),
      number: formatGroupedNumber(item.number),
    }));
  });

  const activeOrder = computed(
    () => ORDER_RECORDS.find((row) => row.id === paymentEngineState.activeOrderId) ?? null,
  );
  const activeSettlement = computed(
    () => SETTLEMENT_RECORDS.find((row) => row.id === paymentEngineState.activeSettlementId) ?? null,
  );

  const tabLabels = computed(() => {
    if (paymentEngineState.detailKind !== 'order' || !activeOrder.value) return [];
    return orderTabLabels(activeOrder.value, ui);
  });

  const detailSections = computed((): DetailSectionData[] => {
    if (paymentEngineState.detailKind === 'settlement' && activeSettlement.value) {
      return settlementDetailSections(activeSettlement.value, ui);
    }
    if (activeOrder.value) {
      return orderDetailSections(activeOrder.value, activeTab.value, ui);
    }
    return [];
  });

  const detailEyebrow = computed(() => {
    if (paymentEngineState.detailKind === 'settlement') return ui('Settlement Detail');
    return ui('Order Amount');
  });
  const detailHeadline = computed(() => {
    if (paymentEngineState.detailKind === 'settlement' && activeSettlement.value) {
      return settlementHeadline(activeSettlement.value);
    }
    if (activeOrder.value) return orderHeadline(activeOrder.value);
    return '';
  });
  const detailStatus = computed(() => {
    if (paymentEngineState.detailKind === 'settlement' && activeSettlement.value) {
      return ui(activeSettlement.value.status);
    }
    if (activeOrder.value) {
      return activeOrder.value.status === 'Completed'
        ? ui('Order Completed')
        : ui(activeOrder.value.status);
    }
    return '';
  });
  const detailStatusKind = computed((): TagStatus => {
    if (paymentEngineState.detailKind === 'settlement' && activeSettlement.value) {
      return activeSettlement.value.status === 'Settling' ? 'warning' : 'success';
    }
    if (activeOrder.value) return orderHeadlineStatus(activeOrder.value.status);
    return 'success';
  });
  const showDetailTabs = computed(
    () => paymentEngineState.detailKind === 'order' && Boolean(activeOrder.value),
  );

  function openOrder(row: OrderRecordRow) {
    paymentEngineState.detailKind = 'order';
    paymentEngineState.activeOrderId = row.id;
    paymentEngineState.activeSettlementId = '';
    activeTab.value = 0;
    paymentEngineState.detailOpen = true;
  }

  function openSettlement(row: SettlementRecordRow) {
    paymentEngineState.detailKind = 'settlement';
    paymentEngineState.activeSettlementId = row.id;
    paymentEngineState.activeOrderId = '';
    activeTab.value = 0;
    paymentEngineState.detailOpen = true;
  }

  function onRowClick(row: DataListItem) {
    const current = kind();
    const id = String(row.id);
    if (current === 'Order Record') {
      const found = pagedOrders.value.find((item) => item.id === id);
      if (found) openOrder(found);
      return;
    }
    if (current === 'Settlement Record') {
      const found = pagedSettlements.value.find((item) => item.id === id);
      if (found) openSettlement(found);
    }
  }

  function refreshList() {
    paymentEngineState.listRemountKey += 1;
  }

  function onTimeSort(order: TasksDataListSortOrder | null) {
    timeSortOrder.value = order ?? '';
    if (order) clearOtherSorts('time');
    paginer.goFirstPage();
  }

  function onSettlementNumberSort(order: TasksDataListSortOrder | null) {
    settlementNumberSortOrder.value = order ?? '';
    if (order) clearOtherSorts('settlement-number');
    paginer.goFirstPage();
  }

  function onAmountSort(order: TasksDataListSortOrder | null) {
    amountSortOrder.value = order ?? '';
    if (order) clearOtherSorts('amount');
    paginer.goFirstPage();
  }

  return {
    ui,
    appliedFilter,
    dataList,
    statisticsItems,
    paginer,
    timeSortOrder,
    settlementNumberSortOrder,
    amountSortOrder,
    activeTab,
    tabLabels,
    detailSections,
    detailEyebrow,
    detailHeadline,
    detailStatus,
    detailStatusKind,
    showDetailTabs,
    activeOrder,
    activeSettlement,
    onRowClick,
    refreshList,
    onTimeSort,
    onSettlementNumberSort,
    onAmountSort,
  };
}
