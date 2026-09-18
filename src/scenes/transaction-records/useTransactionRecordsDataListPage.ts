import { computed, ref, watch } from 'vue';
import {
  DATA_LIST_FIGMA_PAGE_SIZE_OPTIONS,
  DATA_LIST_FIGMA_PAGINER,
  iconButtonProItemDefaults,
  paginerPaginationDefaults,
  readIconButtonProItem,
  readPaginerPaginationItem,
  type PaginerPaginationSlotKey,
} from '@/scenes/tasks/tasksDataListPageData';
import type { TasksDataListSortOrder } from '@/scenes/tasks/tasksDataListSort';
import {
  buildManyPageItems,
  computeManyNextKeepWindow,
  computeManyPageClickKeepWindow,
  computeManyPrevKeepWindow,
  defaultManyWindowStart,
  isManyPageItemSelected,
  type PaginerManyPageItem,
} from '@/scenes/tasks/paginerManyPagination';
import {
  TRANSACTION_RECORDS_DEMO_TOTAL,
  buildTransactionRecordPageRows,
} from './transactionRecordData';
import { sortTransactionRecordIndices } from './sortTransactionRecordIndices';

export const TRANSACTION_RECORDS_COLUMN_HEIGHT = 66;
export const TRANSACTION_RECORDS_HEADER_HEIGHT = 32;

type ToolbarActionKey = 'filter' | 'refresh' | 'export' | 'legacy';

function buildDefaultIndices(): number[] {
  return Array.from({ length: TRANSACTION_RECORDS_DEMO_TOTAL }, (_, index) => index);
}

export function useTransactionRecordsDataListPage() {
  const customize = ref<Record<string, unknown>>({
    ...iconButtonProItemDefaults('filter', { label: 'Filter', icon: 'eds-filter' }),
    ...iconButtonProItemDefaults('refresh', { label: 'Refresh', icon: 'eds-arrow-refresh' }),
    ...iconButtonProItemDefaults('export', { label: 'Export', icon: 'eds-arrow-download' }),
    ...iconButtonProItemDefaults('legacy', {
      label: 'Switch to Legacy Version',
      icon: 'eds-arrow-toggle-horizontal',
    }),
    ...paginerPaginationDefaults(),
    loading: false,
  });

  const settingsLevelIndex = ref(2);
  const settingsJumpValue = ref('');
  const currentPage = ref(1);
  const timeSortOrder = ref<TasksDataListSortOrder | ''>('');
  const amountSortOrder = ref<TasksDataListSortOrder | ''>('');
  const sortedIndices = ref<number[]>(buildDefaultIndices());

  function trackSingleIconButton(prefix: string) {
    void customize.value[`${prefix}Label`];
    void customize.value[`${prefix}Icon`];
    void customize.value[`${prefix}ShowBadge`];
    void customize.value[`${prefix}Badge`];
    void customize.value[`${prefix}ShowReddot`];
    void customize.value[`${prefix}Disabled`];
  }

  const toolbarActionButtons = computed(() => {
    const keys: ToolbarActionKey[] = ['filter', 'refresh', 'export', 'legacy'];
    return keys.map((key) => {
      trackSingleIconButton(key);
      return { key, item: readIconButtonProItem(customize.value, key) };
    });
  });

  const pageSize = computed(() => {
    const label =
      DATA_LIST_FIGMA_PAGE_SIZE_OPTIONS[settingsLevelIndex.value] ??
      DATA_LIST_FIGMA_PAGE_SIZE_OPTIONS[0];
    const parsed = Number.parseInt(label, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 100;
  });

  const totalRowCount = computed(() => TRANSACTION_RECORDS_DEMO_TOTAL);

  const totalPages = computed(() => {
    if (totalRowCount.value === 0) return 1;
    return Math.ceil(totalRowCount.value / pageSize.value);
  });

  const paginatedRows = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const pageIndices = sortedIndices.value.slice(start, start + pageSize.value);
    return buildTransactionRecordPageRows(pageIndices);
  });

  const isManyPagination = computed(() => totalPages.value > 1);
  const manyWindowStart = ref(defaultManyWindowStart(currentPage.value, totalPages.value));
  const previousManyPage = ref(currentPage.value);
  let navigatingManyPage = false;

  const manyPageItems = computed(() =>
    buildManyPageItems(currentPage.value, manyWindowStart.value, totalPages.value),
  );

  const isFirstPage = computed(() => currentPage.value <= 1);
  const isLastPage = computed(() => currentPage.value >= totalPages.value);
  const prevNavDisabled = computed(() => totalRowCount.value === 0 || isFirstPage.value);
  const nextNavDisabled = computed(() => totalRowCount.value === 0 || isLastPage.value);

  function clampPage(page: number) {
    return Math.min(totalPages.value, Math.max(1, page));
  }

  function syncManyWindowStart(page: number, keepWindow: boolean) {
    if (keepWindow) return;
    manyWindowStart.value = defaultManyWindowStart(page, totalPages.value);
  }

  function navigateManyPage(page: number, keepWindow = false) {
    navigatingManyPage = true;
    currentPage.value = clampPage(page);
    syncManyWindowStart(currentPage.value, keepWindow);
    previousManyPage.value = currentPage.value;
    navigatingManyPage = false;
  }

  function applySortState() {
    if (timeSortOrder.value) {
      sortedIndices.value = sortTransactionRecordIndices(
        buildDefaultIndices(),
        'time',
        timeSortOrder.value,
      );
      return;
    }
    if (amountSortOrder.value) {
      sortedIndices.value = sortTransactionRecordIndices(
        buildDefaultIndices(),
        'amount',
        amountSortOrder.value,
      );
      return;
    }
    sortedIndices.value = buildDefaultIndices();
  }

  function setTimeSort(order: TasksDataListSortOrder | null) {
    timeSortOrder.value = order ?? '';
    if (order) {
      amountSortOrder.value = '';
    }
    applySortState();
    navigateManyPage(1);
  }

  function setAmountSort(order: TasksDataListSortOrder | null) {
    amountSortOrder.value = order ?? '';
    if (order) {
      timeSortOrder.value = '';
    }
    applySortState();
    navigateManyPage(1);
  }

  function goFirstPage() {
    if (prevNavDisabled.value) return;
    navigateManyPage(1);
  }

  function goPrevPage() {
    if (prevNavDisabled.value) return;
    const page = currentPage.value;
    if (page <= 3) {
      navigateManyPage(page - 1);
      return;
    }
    navigateManyPage(page - 1, computeManyPrevKeepWindow(page, manyWindowStart.value));
  }

  function goNextPage() {
    if (nextNavDisabled.value) return;
    const page = currentPage.value;
    if (page <= 3) {
      navigateManyPage(page + 1);
      return;
    }
    navigateManyPage(page + 1, computeManyNextKeepWindow(page, manyWindowStart.value));
  }

  function goLastPage() {
    if (nextNavDisabled.value) return;
    navigateManyPage(totalPages.value);
  }

  function onManyPageItemClick(item: PaginerManyPageItem) {
    if (item.kind !== 'page') return;
    const page = currentPage.value;
    if (item.page === page) return;
    navigateManyPage(
      item.page,
      computeManyPageClickKeepWindow(page, item.page, manyWindowStart.value),
    );
  }

  function isManyPageSelected(item: PaginerManyPageItem, index: number): boolean {
    return isManyPageItemSelected(
      item,
      index,
      currentPage.value,
      totalPages.value,
      manyPageItems.value,
    );
  }

  function onSettingsJump(value: string) {
    const page = Number.parseInt(value.trim(), 10);
    if (!Number.isFinite(page)) return;
    navigateManyPage(page);
  }

  function trackDataListPagination(prefix: PaginerPaginationSlotKey) {
    void customize.value[`${prefix}Kind`];
    void customize.value[`${prefix}Tone`];
    void customize.value[`${prefix}Label`];
    void customize.value[`${prefix}Disabled`];
  }

  function dataListPagination(prefix: PaginerPaginationSlotKey) {
    trackDataListPagination(prefix);
    return readPaginerPaginationItem(customize.value, prefix);
  }

  const firstPagination = computed(() => dataListPagination('first'));
  const prevPagination = computed(() => dataListPagination('prev'));
  const pagePagination = computed(() => dataListPagination('page'));
  const nextPagination = computed(() => dataListPagination('next'));
  const lastPagination = computed(() => dataListPagination('last'));

  watch(pageSize, () => {
    navigateManyPage(1);
  });

  watch(totalPages, (pages) => {
    if (currentPage.value > pages) {
      navigateManyPage(Math.max(1, pages));
    } else {
      manyWindowStart.value = defaultManyWindowStart(currentPage.value, pages);
      previousManyPage.value = currentPage.value;
    }
  });

  watch(currentPage, (page) => {
    if (navigatingManyPage) return;
    if (page === previousManyPage.value) return;
    manyWindowStart.value = defaultManyWindowStart(page, totalPages.value);
    previousManyPage.value = page;
  });

  let refreshTimer: ReturnType<typeof setTimeout> | undefined;

  function onRefreshClick() {
    if (refreshTimer !== undefined) {
      clearTimeout(refreshTimer);
      refreshTimer = undefined;
    }
    timeSortOrder.value = '';
    amountSortOrder.value = '';
    applySortState();
    navigateManyPage(1);
    customize.value.loading = true;
    refreshTimer = window.setTimeout(() => {
      customize.value.loading = false;
      refreshTimer = undefined;
    }, 1200);
  }

  function onToolbarActionClick(key: ToolbarActionKey) {
    if (key === 'refresh') {
      onRefreshClick();
    }
  }

  return {
    DATA_LIST_FIGMA_PAGINER,
    DATA_LIST_FIGMA_PAGE_SIZE_OPTIONS,
    amountSortOrder,
    currentPage,
    customize,
    firstPagination,
    goFirstPage,
    goLastPage,
    goNextPage,
    goPrevPage,
    isManyPageSelected,
    isManyPagination,
    lastPagination,
    manyPageItems,
    nextNavDisabled,
    nextPagination,
    onManyPageItemClick,
    onSettingsJump,
    onToolbarActionClick,
    pagePagination,
    paginatedRows,
    prevNavDisabled,
    prevPagination,
    setAmountSort,
    setTimeSort,
    settingsJumpValue,
    settingsLevelIndex,
    timeSortOrder,
    toolbarActionButtons,
    totalRowCount,
  };
}
