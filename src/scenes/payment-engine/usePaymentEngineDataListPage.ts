import { computed, ref, watch, type Ref } from 'vue';
import {
  DATA_LIST_FIGMA_PAGE_SIZE_OPTIONS,
  DATA_LIST_FIGMA_PAGINER,
  iconButtonProItemDefaults,
  paginerPaginationDefaults,
  readIconButtonProItem,
  readPaginerPaginationItem,
  type PaginerPaginationSlotKey,
} from '@/scenes/tasks/tasksDataListPageData';
import {
  buildManyPageItems,
  computeManyNextKeepWindow,
  computeManyPageClickKeepWindow,
  computeManyPrevKeepWindow,
  defaultManyWindowStart,
  isManyPageItemSelected,
  type PaginerManyPageItem,
} from '@/scenes/tasks/paginerManyPagination';

export const PAYMENT_ENGINE_COLUMN_HEIGHT = 66;
export const PAYMENT_ENGINE_HEADER_HEIGHT = 32;

type ToolbarActionKey = 'filter' | 'refresh' | 'export';

export function usePaymentEngineDataListPage<T>(options: {
  rows: Ref<readonly T[]>;
  showExport: Ref<boolean>;
  filterBadge: Ref<number>;
}) {
  const customize = ref<Record<string, unknown>>({
    ...iconButtonProItemDefaults('filter', { label: 'Filter', icon: 'eds-filter' }),
    ...iconButtonProItemDefaults('refresh', { label: 'Refresh', icon: 'eds-arrow-refresh' }),
    ...iconButtonProItemDefaults('export', { label: 'Export', icon: 'eds-arrow-download' }),
    ...paginerPaginationDefaults(),
    loading: false,
  });

  const settingsLevelIndex = ref(0);
  const settingsJumpValue = ref('');
  const currentPage = ref(1);

  watch(
    options.filterBadge,
    (badge) => {
      customize.value.filterShowBadge = badge > 0;
      customize.value.filterBadge = String(badge);
    },
    { immediate: true },
  );

  function trackSingleIconButton(prefix: string) {
    void customize.value[`${prefix}Label`];
    void customize.value[`${prefix}Icon`];
    void customize.value[`${prefix}ShowBadge`];
    void customize.value[`${prefix}Badge`];
    void customize.value[`${prefix}ShowReddot`];
    void customize.value[`${prefix}Disabled`];
  }

  const filterButton = computed(() => {
    trackSingleIconButton('filter');
    return readIconButtonProItem(customize.value, 'filter');
  });

  const refreshButton = computed(() => {
    trackSingleIconButton('refresh');
    return readIconButtonProItem(customize.value, 'refresh');
  });

  const exportButton = computed(() => {
    trackSingleIconButton('export');
    return readIconButtonProItem(customize.value, 'export');
  });

  const toolbarActionButtons = computed(() => {
    trackSingleIconButton('filter');
    trackSingleIconButton('refresh');
    const buttons: Array<{ key: ToolbarActionKey; item: ReturnType<typeof readIconButtonProItem> }> = [
      { key: 'filter', item: filterButton.value },
      { key: 'refresh', item: refreshButton.value },
    ];
    if (options.showExport.value) {
      trackSingleIconButton('export');
      buttons.push({ key: 'export', item: exportButton.value });
    }
    return buttons;
  });

  const pageSize = computed(() => {
    const label =
      DATA_LIST_FIGMA_PAGE_SIZE_OPTIONS[settingsLevelIndex.value] ??
      DATA_LIST_FIGMA_PAGE_SIZE_OPTIONS[0];
    const parsed = Number.parseInt(label, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 20;
  });

  const totalRowCount = computed(() => options.rows.value.length);

  const totalPages = computed(() => {
    if (totalRowCount.value === 0) return 1;
    return Math.ceil(totalRowCount.value / pageSize.value);
  });

  const paginatedRows = computed(() => {
    if (totalRowCount.value === 0) return [];
    const start = (currentPage.value - 1) * pageSize.value;
    return options.rows.value.slice(start, start + pageSize.value);
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

  watch(options.rows, () => {
    navigateManyPage(1);
  });

  let refreshTimer: ReturnType<typeof setTimeout> | undefined;

  function onRefreshClick() {
    if (refreshTimer !== undefined) {
      clearTimeout(refreshTimer);
      refreshTimer = undefined;
    }
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
    currentPage,
    customize,
    exportButton,
    filterButton,
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
    refreshButton,
    settingsJumpValue,
    settingsLevelIndex,
    toolbarActionButtons,
    totalRowCount,
  };
}
