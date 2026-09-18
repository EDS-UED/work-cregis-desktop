<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { EgLayout, EgToolBar, type DataListItem } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import { useDeferredContentMount } from '@/composables/useDeferredContentMount';
import LayoutChromePageStack from '@/scenes/project/LayoutChromePageStack.vue';
import {
  buildPaymentEngineRecordRows,
  isPaymentBulkTransferRecordMenuItem,
  resolvePaymentEngineRecordRowCount,
} from './paymentEngineOrderRecordData';
import {
  resolvePaymentEngineRecordConfig,
  type PaymentEngineRecordRow,
} from './paymentEngineRecordConfigs';
import { usePaymentEngineDataListPage } from './usePaymentEngineDataListPage';
import { registerPaymentEngineDetailFlow } from './paymentEngineDetailFlowContext';
import { usePaymentEngineDetailFlow } from './usePaymentEngineDetailFlow';
import PaymentEngineBulkTransferDetailPage from './PaymentEngineBulkTransferDetailPage.vue';
import PaymentEngineRecordListPaginer from './PaymentEngineRecordListPaginer.vue';
import PaymentEngineRecordListTable from './PaymentEngineRecordListTable.vue';
import PaymentEngineRecordListToolbar from './PaymentEngineRecordListToolbar.vue';
import styles from './PaymentEngineDataListPage.module.css';

const props = defineProps<{
  menuItem: string;
  resolveConfig?: (menuItem: string) => ReturnType<typeof resolvePaymentEngineRecordConfig>;
  buildRows?: (menuItem: string, count: number) => ReturnType<typeof buildPaymentEngineRecordRows>;
}>();

const { ui } = useAppI18n();

const pageConfig = computed(() =>
  (props.resolveConfig ?? resolvePaymentEngineRecordConfig)(props.menuItem),
);
const allRows = computed(() =>
  (props.buildRows ?? buildPaymentEngineRecordRows)(
    props.menuItem,
    resolvePaymentEngineRecordRowCount(props.menuItem),
  ),
);
const displayToolbarTitle = computed(() => ui(props.menuItem));

const {
  DATA_LIST_FIGMA_PAGINER,
  DATA_LIST_FIGMA_PAGE_SIZE_OPTIONS,
  currentPage,
  customize,
  dataListBatchActions,
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
  onBatchAction,
  onManyPageItemClick,
  onSettingsJump,
  onToolbarActionClick,
  pagePagination,
  paginatedRows,
  prevNavDisabled,
  prevPagination,
  settingsJumpValue,
  settingsLevelIndex,
  toolbarActionButtons,
  toolbarBatchButton,
  toolbarSectionButtons,
  totalRowCount,
} = usePaymentEngineDataListPage({
  rows: allRows,
  showExport: computed(() => pageConfig.value.showExport),
  showBatchSelect: computed(() => Boolean(pageConfig.value.showBatchSelect)),
  filterBadge: computed(() => pageConfig.value.filterBadge ?? 0),
});

const showBatchButton = computed(() => Boolean(pageConfig.value.showBatchSelect));

const selectMode = computed({
  get: () => Boolean(customize.value.selectMode),
  set: (value: boolean) => {
    customize.value.selectMode = value;
  },
});

const displayBatchActions = computed(() =>
  dataListBatchActions.value.map((action) => ({
    ...action,
    label: ui(action.label),
  })),
);

const { contentReady } = useDeferredContentMount();
const detailFlow = usePaymentEngineDetailFlow();

const usesBulkTransferPageStack = computed(() =>
  isPaymentBulkTransferRecordMenuItem(props.menuItem),
);

const bulkTransferPageMotionRef = ref<InstanceType<typeof LayoutChromePageStack> | null>(null);

const bulkTransferDetailOpen = computed(() => detailFlow.bulkTransferDetailOpen.value);
const bulkTransferDetailRow = computed(() => detailFlow.bulkTransferDetailRow.value);

const bulkTransferPageKey = computed(() =>
  bulkTransferDetailOpen.value ? 'detail' : 'list',
);

const displayRows = computed(() => (contentReady.value ? paginatedRows.value : []));

onMounted(() => {
  registerPaymentEngineDetailFlow(detailFlow);
});

onBeforeUnmount(() => {
  registerPaymentEngineDetailFlow(null);
});

function onRowClick(data: DataListItem) {
  if (isPaymentBulkTransferRecordMenuItem(props.menuItem)) {
    bulkTransferPageMotionRef.value?.setDirection('forward');
  }
  detailFlow.openDetailForRow(recordRow(data), props.menuItem);
}

function onBulkTransferDetailBack() {
  bulkTransferPageMotionRef.value?.setDirection('backward');
  detailFlow.closeBulkTransferDetail();
}

function onBulkTransferPageSettled() {
  if (!detailFlow.bulkTransferDetailOpen.value) {
    detailFlow.clearBulkTransferDetailRow();
  }
}

function dismissBulkTransferDetail(instant = false) {
  if (instant) {
    bulkTransferPageMotionRef.value?.setDirection('none');
  }
  detailFlow.closeBulkTransferDetail();
  detailFlow.clearBulkTransferDetailRow();
}

watch(
  () => props.menuItem,
  () => {
    if (!detailFlow.bulkTransferDetailOpen.value) {
      return;
    }
    dismissBulkTransferDetail(true);
  },
);

const isFilterActive = computed(() => (pageConfig.value.filterBadge ?? 0) > 0);

const paginerStatistics = computed(() => {
  if (!isFilterActive.value) return [];
  return (pageConfig.value.statistics ?? []).map((item) => ({
    text: ui(item.labelKey),
    number: item.value,
  }));
});

function recordRow(data: DataListItem): PaymentEngineRecordRow {
  return data as PaymentEngineRecordRow;
}
</script>

<template>
  <div :class="styles.dataListNest">
    <EgLayout
      type="empty"
      :show-toolbar="!usesBulkTransferPageStack"
      :show-paginer="!usesBulkTransferPageStack"
    >
      <template #toolbar>
        <PaymentEngineRecordListToolbar
          :title="displayToolbarTitle"
          :show-batch-button="showBatchButton"
          :toolbar-batch-button="toolbarBatchButton"
          :toolbar-section-buttons="toolbarSectionButtons"
          :toolbar-action-buttons="toolbarActionButtons"
          :translate="ui"
          @toolbar-action="(key) => onToolbarActionClick(key as 'batch' | 'filter' | 'refresh' | 'export')"
        />
      </template>

      <LayoutChromePageStack
        v-if="usesBulkTransferPageStack"
        ref="bulkTransferPageMotionRef"
        :enabled="true"
        :page-key="bulkTransferPageKey"
        @page-settled="onBulkTransferPageSettled"
      >
        <template #list-toolbar>
          <PaymentEngineRecordListToolbar
            :title="displayToolbarTitle"
            :show-batch-button="showBatchButton"
            :toolbar-batch-button="toolbarBatchButton"
            :toolbar-section-buttons="toolbarSectionButtons"
            :toolbar-action-buttons="toolbarActionButtons"
            :translate="ui"
            @toolbar-action="(key) => onToolbarActionClick(key as 'batch' | 'filter' | 'refresh' | 'export')"
          />
        </template>

        <template #detail-toolbar>
          <EgToolBar
            :title="ui('Bulk Transfer Detail')"
            :show-back="true"
            :show-operation="false"
            @back="onBulkTransferDetailBack"
          />
        </template>

        <template #detail>
          <PaymentEngineBulkTransferDetailPage
            v-if="bulkTransferDetailRow"
            embedded-in-page-stack
            :detail="bulkTransferDetailRow"
            :menu-item="props.menuItem"
          />
        </template>

        <template #list-paginer>
          <PaymentEngineRecordListPaginer
            v-model:settings-level-index="settingsLevelIndex"
            v-model:settings-jump-value="settingsJumpValue"
            :show-statistics="paginerStatistics.length > 0"
            :statistics-items="paginerStatistics"
            :data-volume-total="ui(DATA_LIST_FIGMA_PAGINER.dataVolumeTotal)"
            :data-volume-count="String(totalRowCount)"
            :data-volume-results="ui(DATA_LIST_FIGMA_PAGINER.dataVolumeResults)"
            :settings-level-labels="[...DATA_LIST_FIGMA_PAGE_SIZE_OPTIONS]"
            :settings-level-label="ui('Items Per Page')"
            :settings-jump-label="ui('Go to Page')"
            :settings-jump-placeholder="ui('Please Enter')"
            :first-pagination="firstPagination"
            :prev-pagination="prevPagination"
            :page-pagination="pagePagination"
            :next-pagination="nextPagination"
            :last-pagination="lastPagination"
            :prev-nav-disabled="prevNavDisabled"
            :next-nav-disabled="nextNavDisabled"
            :is-many-pagination="isManyPagination"
            :many-page-items="manyPageItems"
            :current-page="currentPage"
            :is-many-page-selected="isManyPageSelected"
            @settings-jump="onSettingsJump"
            @go-first="goFirstPage"
            @go-prev="goPrevPage"
            @go-next="goNextPage"
            @go-last="goLastPage"
            @many-page-item-click="onManyPageItemClick"
          />
        </template>

        <template #list>
          <PaymentEngineRecordListTable
            v-model:select-mode="selectMode"
            :menu-item="props.menuItem"
            :columns="pageConfig.columns"
            :rows="displayRows"
            :loading="Boolean(customize.loading)"
            :initing="!contentReady"
            :batch-actions="displayBatchActions"
            :on-batch-action="onBatchAction"
            @row-click="onRowClick"
          />
        </template>
      </LayoutChromePageStack>

      <LayoutChromePageStack
        v-else
        :enabled="false"
        page-key="list"
      >
        <PaymentEngineRecordListTable
          v-model:select-mode="selectMode"
          :menu-item="props.menuItem"
          :columns="pageConfig.columns"
          :rows="displayRows"
          :loading="Boolean(customize.loading)"
          :initing="!contentReady"
          :batch-actions="displayBatchActions"
          :on-batch-action="onBatchAction"
          @row-click="onRowClick"
        />
      </LayoutChromePageStack>

      <template #paginer>
        <PaymentEngineRecordListPaginer
          v-model:settings-level-index="settingsLevelIndex"
          v-model:settings-jump-value="settingsJumpValue"
          :show-statistics="paginerStatistics.length > 0"
          :statistics-items="paginerStatistics"
          :data-volume-total="ui(DATA_LIST_FIGMA_PAGINER.dataVolumeTotal)"
          :data-volume-count="String(totalRowCount)"
          :data-volume-results="ui(DATA_LIST_FIGMA_PAGINER.dataVolumeResults)"
          :settings-level-labels="[...DATA_LIST_FIGMA_PAGE_SIZE_OPTIONS]"
          :settings-level-label="ui('Items Per Page')"
          :settings-jump-label="ui('Go to Page')"
          :settings-jump-placeholder="ui('Please Enter')"
          :first-pagination="firstPagination"
          :prev-pagination="prevPagination"
          :page-pagination="pagePagination"
          :next-pagination="nextPagination"
          :last-pagination="lastPagination"
          :prev-nav-disabled="prevNavDisabled"
          :next-nav-disabled="nextNavDisabled"
          :is-many-pagination="isManyPagination"
          :many-page-items="manyPageItems"
          :current-page="currentPage"
          :is-many-page-selected="isManyPageSelected"
          @settings-jump="onSettingsJump"
          @go-first="goFirstPage"
          @go-prev="goPrevPage"
          @go-next="goNextPage"
          @go-last="goLastPage"
          @many-page-item-click="onManyPageItemClick"
        />
      </template>
    </EgLayout>
  </div>
</template>

