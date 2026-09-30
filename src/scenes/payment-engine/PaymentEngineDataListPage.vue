<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, unref, watch } from 'vue';
import {
  EgLayout,
  EgToolBar,
  type DataListItem,
  type EgFilterCondition,
  type EgFilterField,
  type EgFilterLogicMode,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import {
  applyEgFilterConditions,
  hasActiveEgFilterConditions,
  isActiveEgFilterCondition,
} from '@/scenes/shared/applyEgFilterConditions';
import { resolveDataListFilterSourceRowCount } from '@/scenes/shared/buildListDerivedFilterOptions';
import { buildWaasDataListFilterRowSnapshot } from '@/scenes/waas-project/filter/buildWaasDataListFilterRowSnapshot';
import { buildWaasOrderModeFilterRowSnapshot } from '@/scenes/waas-project/filter/buildWaasOrderModeFilterRowSnapshot';
import WaasToolbarFilter from '@/scenes/waas-project/filter/WaasToolbarFilter.vue';
import {
  WAAS_DATA_LIST_FILTER_OPERATORS,
  buildWaasDataListFilterFields,
} from '@/scenes/waas-project/filter/waasDataListFilterFields';
import {
  WAAS_ORDER_MODE_FILTER_OPERATORS,
  buildWaasOrderModeFilterFields,
} from '@/scenes/waas-project/filter/waasOrderModeFilterFields';
import { buildPaymentRecordFilterRowSnapshot } from '@/scenes/payment-engine/filter/buildPaymentRecordFilterRowSnapshot';
import { buildSettlementRecordFilterRowSnapshot } from '@/scenes/payment-engine/filter/buildSettlementRecordFilterRowSnapshot';
import {
  PAYMENT_RECORD_FILTER_OPERATORS,
  buildPaymentRecordFilterFields,
} from '@/scenes/payment-engine/filter/paymentRecordFilterFields';
import {
  SETTLEMENT_RECORD_FILTER_OPERATORS,
  buildSettlementRecordFilterFields,
} from '@/scenes/payment-engine/filter/settlementRecordFilterFields';
import {
  paymentEngineDataListShowsEgFilter,
  shouldUsePaymentRecordEgFilterSchema,
  shouldUseSettlementRecordEgFilterSchema,
} from '@/scenes/payment-engine/filter/paymentEngineShowsEgFilter';
import { shouldUseWaasOrderModeEgFilterSchema } from '@/scenes/waas-project/filter/shouldUseWaasOrderModeEgFilterSchema';
import { waasDataListShowsEgFilter } from '@/scenes/waas-project/filter/waasDataListShowsEgFilter';
import { buildLogsRecordFilterRowSnapshot } from '@/scenes/risk-control/filter/buildLogsRecordFilterRowSnapshot';
import {
  LOGS_RECORD_FILTER_OPERATORS,
  buildLogsRecordFilterFields,
} from '@/scenes/risk-control/filter/logsRecordFilterFields';
import { buildAutoRulesRecordFilterRowSnapshot } from '@/scenes/risk-control/filter/buildAutoRulesRecordFilterRowSnapshot';
import {
  AUTO_RULES_RECORD_FILTER_OPERATORS,
  buildAutoRulesRecordFilterFields,
} from '@/scenes/risk-control/filter/autoRulesRecordFilterFields';
import { buildPolicySettingsRecordFilterRowSnapshot } from '@/scenes/risk-control/filter/buildPolicySettingsRecordFilterRowSnapshot';
import {
  POLICY_SETTINGS_RECORD_FILTER_OPERATORS,
  buildPolicySettingsRecordFilterFields,
} from '@/scenes/risk-control/filter/policySettingsRecordFilterFields';
import { buildAutomationRecordFilterRowSnapshot } from '@/scenes/risk-control/filter/buildAutomationRecordFilterRowSnapshot';
import {
  AUTOMATION_RECORD_FILTER_OPERATORS,
  buildAutomationRecordFilterFields,
} from '@/scenes/risk-control/filter/automationRecordFilterFields';
import { buildQueryRecordsRecordFilterRowSnapshot } from '@/scenes/risk-control/filter/buildQueryRecordsRecordFilterRowSnapshot';
import {
  QUERY_RECORDS_FILTER_OPERATORS,
  buildQueryRecordsRecordFilterFields,
} from '@/scenes/risk-control/filter/queryRecordsRecordFilterFields';
import { buildAddressBookRecordFilterRowSnapshot } from '@/scenes/risk-control/filter/buildAddressBookRecordFilterRowSnapshot';
import {
  ADDRESS_BOOK_RECORD_FILTER_OPERATORS,
  buildAddressBookRecordFilterFields,
} from '@/scenes/risk-control/filter/addressBookRecordFilterFields';
import {
  riskControlDataListShowsEgFilter,
  shouldUseAddressBookRecordEgFilterSchema,
  shouldUseAutoRulesRecordEgFilterSchema,
  shouldUseLogsRecordEgFilterSchema,
  shouldUsePolicySettingsRecordEgFilterSchema,
  shouldUseAutomationRecordEgFilterSchema,
  shouldUseQueryRecordsRecordEgFilterSchema,
} from '@/scenes/risk-control/filter/riskControlShowsEgFilter';
import { resolveWaasStandardRecordRowCount } from '@/scenes/waas-project/waasStandardRecordData';
import { useDeferredContentMount } from '@/composables/useDeferredContentMount';
import LayoutChromePageStack from '@/scenes/project/LayoutChromePageStack.vue';
import { buildPaymentOrderRecordPaginerStatistics } from './buildPaymentOrderRecordPaginerStatistics';
import {
  buildPaymentEngineRecordRows,
  isPaymentBulkTransferRecordMenuItem,
  isPaymentCollectionDetailMenuItem,
  resolvePaymentEngineRecordRowCount,
} from './paymentEngineOrderRecordData';
import {
  resolvePaymentEngineRecordConfig,
  type PaymentEngineRecordRow,
} from './paymentEngineRecordConfigs';
import { usePaymentEngineDataListPage, PAYMENT_ENGINE_COLUMN_HEIGHT } from './usePaymentEngineDataListPage';
import { registerPaymentEngineDetailFlow } from './paymentEngineDetailFlowContext';
import { usePaymentEngineDetailFlow } from './usePaymentEngineDetailFlow';
import PaymentEngineBulkTransferDetailPage from './PaymentEngineBulkTransferDetailPage.vue';
import PaymentEngineCollectionDetailPage from './PaymentEngineCollectionDetailPage.vue';
import PaymentEngineRecordListPaginer from './PaymentEngineRecordListPaginer.vue';
import PaymentEngineRecordListTable from './PaymentEngineRecordListTable.vue';
import PaymentEngineRecordListToolbar from './PaymentEngineRecordListToolbar.vue';
import WaasSubAddressCurrencyPicker from '@/scenes/waas-project/WaasSubAddressCurrencyPicker.vue';
import { useWaasSubAddressCurrencySelection } from '@/scenes/waas-project/useWaasSubAddressCurrencySelection';
import { buildWaasStandardRecordRows } from '@/scenes/waas-project/waasStandardRecordData';
import type { PaymentEngineRecordSortTarget } from './paymentEngineRecordSort';
import styles from './PaymentEngineDataListPage.module.css';

const props = withDefaults(
  defineProps<{
    menuItem: string;
    resolveConfig?: (menuItem: string) => ReturnType<typeof resolvePaymentEngineRecordConfig>;
    buildRows?: (menuItem: string, count: number) => ReturnType<typeof buildPaymentEngineRecordRows>;
    openDetailOnRowClick?: boolean;
    canOpenDetailOnRowClick?: (
      row: PaymentEngineRecordRow,
      menuItem: string,
    ) => boolean;
  }>(),
  {
    openDetailOnRowClick: true,
  },
);

const { ui } = useAppI18n();

const pageConfig = computed(() =>
  (props.resolveConfig ?? resolvePaymentEngineRecordConfig)(props.menuItem),
);

const listColumnHeight = computed(
  () => pageConfig.value.columnHeight ?? PAYMENT_ENGINE_COLUMN_HEIGHT,
);

function resolveRowCount(menuItem: string): number {
  return pageConfig.value.rowCount ?? resolvePaymentEngineRecordRowCount(menuItem);
}

const usesSubAddressCurrencyToolbar = computed(() => props.menuItem === 'Sub-Address');
const { selection: subAddressCurrencySelection } = useWaasSubAddressCurrencySelection();

const allRows = computed(() => {
  const count = resolveRowCount(props.menuItem);
  if (usesSubAddressCurrencyToolbar.value) {
    return buildWaasStandardRecordRows(
      props.menuItem,
      count,
      subAddressCurrencySelection.value,
    );
  }
  return (props.buildRows ?? buildPaymentEngineRecordRows)(props.menuItem, count);
});

const usesPaymentEngineEgFilter = computed(() =>
  paymentEngineDataListShowsEgFilter(props.menuItem),
);
const usesWaasEgFilter = computed(() => waasDataListShowsEgFilter(props.menuItem));
const usesRiskControlEgFilter = computed(() => riskControlDataListShowsEgFilter(props.menuItem));
const usesEgFilter = computed(
  () =>
    usesPaymentEngineEgFilter.value
    || usesWaasEgFilter.value
    || usesRiskControlEgFilter.value,
);
const usesLogsRecordEgFilter = computed(() => shouldUseLogsRecordEgFilterSchema(props.menuItem));
const usesAutoRulesRecordEgFilter = computed(() =>
  shouldUseAutoRulesRecordEgFilterSchema(props.menuItem),
);
const usesPolicySettingsRecordEgFilter = computed(() =>
  shouldUsePolicySettingsRecordEgFilterSchema(props.menuItem),
);
const usesAutomationRecordEgFilter = computed(() =>
  shouldUseAutomationRecordEgFilterSchema(props.menuItem),
);
const usesQueryRecordsRecordEgFilter = computed(() =>
  shouldUseQueryRecordsRecordEgFilterSchema(props.menuItem),
);
const usesAddressBookRecordEgFilter = computed(() =>
  shouldUseAddressBookRecordEgFilterSchema(props.menuItem),
);
const usesPaymentRecordEgFilter = computed(() =>
  shouldUsePaymentRecordEgFilterSchema(props.menuItem),
);
const usesSettlementRecordEgFilter = computed(() =>
  shouldUseSettlementRecordEgFilterSchema(props.menuItem),
);
const usesWaasOrderModeEgFilter = computed(() =>
  shouldUseWaasOrderModeEgFilterSchema(props.menuItem),
);

const waasFilterConditions = ref<EgFilterCondition[]>([]);
const waasFilterLogicMode = ref<EgFilterLogicMode>('all');

function resolveWaasFilterSourceRowCount(): number {
  const usesPaymentEngineRowSource =
    usesPaymentRecordEgFilter.value
    || usesSettlementRecordEgFilter.value
    || usesWaasOrderModeEgFilter.value
    || usesLogsRecordEgFilter.value
    || usesAutoRulesRecordEgFilter.value
    || usesPolicySettingsRecordEgFilter.value
    || usesAutomationRecordEgFilter.value
    || usesQueryRecordsRecordEgFilter.value
    || usesAddressBookRecordEgFilter.value;
  const baseCount = usesPaymentEngineRowSource
    ? resolvePaymentEngineRecordRowCount(props.menuItem)
    : resolveWaasStandardRecordRowCount(props.menuItem);
  return resolveDataListFilterSourceRowCount(false, baseCount);
}

function buildFilterRowSnapshot(rowIndex: number, row: PaymentEngineRecordRow) {
  if (usesPaymentRecordEgFilter.value) {
    return buildPaymentRecordFilterRowSnapshot(rowIndex, row);
  }
  if (usesSettlementRecordEgFilter.value) {
    return buildSettlementRecordFilterRowSnapshot(rowIndex, row);
  }
  if (usesWaasOrderModeEgFilter.value) {
    return buildWaasOrderModeFilterRowSnapshot(rowIndex, row, props.menuItem);
  }
  if (usesLogsRecordEgFilter.value) {
    return buildLogsRecordFilterRowSnapshot(rowIndex, row);
  }
  if (usesAutoRulesRecordEgFilter.value) {
    return buildAutoRulesRecordFilterRowSnapshot(rowIndex, row);
  }
  if (usesPolicySettingsRecordEgFilter.value) {
    return buildPolicySettingsRecordFilterRowSnapshot(rowIndex, row);
  }
  if (usesAutomationRecordEgFilter.value) {
    return buildAutomationRecordFilterRowSnapshot(rowIndex, row);
  }
  if (usesQueryRecordsRecordEgFilter.value) {
    return buildQueryRecordsRecordFilterRowSnapshot(rowIndex, row);
  }
  if (usesAddressBookRecordEgFilter.value) {
    return buildAddressBookRecordFilterRowSnapshot(rowIndex, row);
  }
  return buildWaasDataListFilterRowSnapshot(rowIndex, row, props.menuItem);
}

const waasFilterFields = computed((): EgFilterField[] => {
  if (!usesEgFilter.value) return [];
  const sourceRowCount = resolveWaasFilterSourceRowCount();
  if (usesPaymentRecordEgFilter.value) {
    return buildPaymentRecordFilterFields((key) => ui(key), sourceRowCount);
  }
  if (usesSettlementRecordEgFilter.value) {
    return buildSettlementRecordFilterFields((key) => ui(key), sourceRowCount);
  }
  if (usesWaasOrderModeEgFilter.value) {
    return buildWaasOrderModeFilterFields(props.menuItem, (key) => ui(key), sourceRowCount);
  }
  if (usesLogsRecordEgFilter.value) {
    return buildLogsRecordFilterFields((key) => ui(key), sourceRowCount);
  }
  if (usesAutoRulesRecordEgFilter.value) {
    return buildAutoRulesRecordFilterFields((key) => ui(key), sourceRowCount);
  }
  if (usesPolicySettingsRecordEgFilter.value) {
    return buildPolicySettingsRecordFilterFields((key) => ui(key), sourceRowCount);
  }
  if (usesAutomationRecordEgFilter.value) {
    return buildAutomationRecordFilterFields((key) => ui(key), sourceRowCount);
  }
  if (usesQueryRecordsRecordEgFilter.value) {
    return buildQueryRecordsRecordFilterFields((key) => ui(key), sourceRowCount);
  }
  if (usesAddressBookRecordEgFilter.value) {
    return buildAddressBookRecordFilterFields(
      props.menuItem,
      (key) => ui(key),
      sourceRowCount,
    );
  }
  return buildWaasDataListFilterFields(
    props.menuItem,
    (key) => ui(key),
    sourceRowCount,
    usesSubAddressCurrencyToolbar.value ? subAddressCurrencySelection.value : undefined,
  );
});

const waasFilterOperators = computed(() => {
  if (usesPaymentRecordEgFilter.value) return PAYMENT_RECORD_FILTER_OPERATORS;
  if (usesSettlementRecordEgFilter.value) return SETTLEMENT_RECORD_FILTER_OPERATORS;
  if (usesWaasOrderModeEgFilter.value) return WAAS_ORDER_MODE_FILTER_OPERATORS;
  if (usesLogsRecordEgFilter.value) return LOGS_RECORD_FILTER_OPERATORS;
  if (usesAutoRulesRecordEgFilter.value) return AUTO_RULES_RECORD_FILTER_OPERATORS;
  if (usesPolicySettingsRecordEgFilter.value) return POLICY_SETTINGS_RECORD_FILTER_OPERATORS;
  if (usesAutomationRecordEgFilter.value) return AUTOMATION_RECORD_FILTER_OPERATORS;
  if (usesQueryRecordsRecordEgFilter.value) return QUERY_RECORDS_FILTER_OPERATORS;
  if (usesAddressBookRecordEgFilter.value) return ADDRESS_BOOK_RECORD_FILTER_OPERATORS;
  return WAAS_DATA_LIST_FILTER_OPERATORS;
});

const filteredRows = computed(() => {
  if (
    !usesEgFilter.value
    || !hasActiveEgFilterConditions(waasFilterConditions.value)
  ) {
    return allRows.value;
  }

  const conditions = waasFilterConditions.value;
  const fields = waasFilterFields.value;
  const logicMode = waasFilterLogicMode.value;

  return allRows.value.filter((row, rowIndex) => {
    try {
      return applyEgFilterConditions({
        snapshot: buildFilterRowSnapshot(rowIndex, row),
        conditions,
        fields,
        logicMode,
      });
    } catch {
      return true;
    }
  });
});

const waasFilterBadge = computed(() => {
  if (!usesEgFilter.value) return 0;
  return waasFilterConditions.value.filter(isActiveEgFilterCondition).length;
});

const displayToolbarTitle = computed(() =>
  usesSubAddressCurrencyToolbar.value ? '' : ui(props.menuItem),
);

const {
  DATA_LIST_FIGMA_PAGINER,
  DATA_LIST_FIGMA_PAGE_SIZE_OPTIONS,
  activeSort,
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
  setColumnSort,
  pagePagination,
  paginatedRows,
  prevNavDisabled,
  prevPagination,
  settingsJumpValue,
  settingsLevelIndex,
  toolbarActionButtons,
  toolbarFunctionalButtons,
  toolbarSectionButtons,
  showToolbarSection,
  totalRowCount,
} = usePaymentEngineDataListPage({
  rows: filteredRows,
  showExport: computed(() => pageConfig.value.showExport),
  showBatchSelect: computed(() => Boolean(pageConfig.value.showBatchSelect)),
  filterBadge: computed(() =>
    usesEgFilter.value ? waasFilterBadge.value : (pageConfig.value.filterBadge ?? 0),
  ),
  toolbarPreset: computed(() => pageConfig.value.toolbarPreset),
});

function resolveToolbarButtonsWithoutFilter<T extends { key: string }>(buttons: readonly T[]): T[] {
  if (!usesEgFilter.value) return [...buttons];
  return buttons.filter((button) => button.key !== 'filter');
}

const displayToolbarActionButtons = computed(() =>
  resolveToolbarButtonsWithoutFilter(unref(toolbarActionButtons) ?? []),
);

const displayToolbarSectionButtons = computed(() =>
  resolveToolbarButtonsWithoutFilter(unref(toolbarSectionButtons) ?? []),
);

watch(waasFilterConditions, () => {
  if (hasActiveEgFilterConditions(waasFilterConditions.value)) {
    goFirstPage();
  }
}, { deep: true });

watch(
  () => props.menuItem,
  () => {
    waasFilterConditions.value = [];
    waasFilterLogicMode.value = 'all';
  },
);

watch(usesEgFilter, (enabled) => {
  if (!enabled) {
    waasFilterConditions.value = [];
    waasFilterLogicMode.value = 'all';
  }
});

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

const usesLayoutDetailPageStack = computed(() =>
  isPaymentBulkTransferRecordMenuItem(props.menuItem)
  || isPaymentCollectionDetailMenuItem(props.menuItem),
);

const layoutDetailPageMotionRef = ref<InstanceType<typeof LayoutChromePageStack> | null>(null);

const layoutDetailOpen = computed(() => {
  if (isPaymentBulkTransferRecordMenuItem(props.menuItem)) {
    return detailFlow.bulkTransferDetailOpen.value;
  }
  if (isPaymentCollectionDetailMenuItem(props.menuItem)) {
    return detailFlow.collectionDetailOpen.value;
  }
  return false;
});

const bulkTransferDetailRow = computed(() => detailFlow.bulkTransferDetailRow.value);
const collectionDetailRow = computed(() => detailFlow.collectionDetailRow.value);

const layoutDetailPageKey = computed(() =>
  layoutDetailOpen.value ? 'detail' : 'list',
);

const layoutDetailToolbarTitleKey = computed(() => {
  if (isPaymentCollectionDetailMenuItem(props.menuItem)) {
    return 'Collection Details';
  }
  return 'Bulk Transfer Detail';
});

const displayRows = computed(() => (contentReady.value ? paginatedRows.value : []));

onMounted(() => {
  registerPaymentEngineDetailFlow(detailFlow);
});

onBeforeUnmount(() => {
  registerPaymentEngineDetailFlow(null);
});

function onRowClick(data: DataListItem) {
  const row = recordRow(data);
  const canOpen = props.canOpenDetailOnRowClick
    ? props.canOpenDetailOnRowClick(row, props.menuItem)
    : props.openDetailOnRowClick;
  if (!canOpen) return;
  if (usesLayoutDetailPageStack.value) {
    layoutDetailPageMotionRef.value?.setDirection('forward');
  }
  detailFlow.openDetailForRow(row, props.menuItem);
}

function onLayoutDetailBack() {
  layoutDetailPageMotionRef.value?.setDirection('backward');
  if (isPaymentBulkTransferRecordMenuItem(props.menuItem)) {
    detailFlow.closeBulkTransferDetail();
    return;
  }
  detailFlow.closeCollectionDetail();
}

function onLayoutDetailPageSettled() {
  if (isPaymentBulkTransferRecordMenuItem(props.menuItem)) {
    if (!detailFlow.bulkTransferDetailOpen.value) {
      detailFlow.clearBulkTransferDetailRow();
    }
    return;
  }
  if (isPaymentCollectionDetailMenuItem(props.menuItem)) {
    if (!detailFlow.collectionDetailOpen.value) {
      detailFlow.clearCollectionDetailRow();
    }
  }
}

function dismissLayoutDetail(instant = false) {
  if (instant) {
    layoutDetailPageMotionRef.value?.setDirection('none');
  }
  detailFlow.closeBulkTransferDetail();
  detailFlow.clearBulkTransferDetailRow();
  detailFlow.closeCollectionDetail();
  detailFlow.clearCollectionDetailRow();
}

watch(
  () => props.menuItem,
  () => {
    if (
      !detailFlow.bulkTransferDetailOpen.value
      && !detailFlow.collectionDetailOpen.value
    ) {
      return;
    }
    dismissLayoutDetail(true);
  },
);

const isFilterActive = computed(() =>
  usesEgFilter.value
    ? waasFilterBadge.value > 0
    : (pageConfig.value.filterBadge ?? 0) > 0,
);

const usesOrderRecordPaginerStatistics = computed(
  () => pageConfig.value.paginerStatisticsKind === 'order-record',
);

const paginerStatistics = computed(() => {
  if (usesOrderRecordPaginerStatistics.value) {
    return buildPaymentOrderRecordPaginerStatistics(filteredRows.value, ui);
  }

  const stats = pageConfig.value.statistics ?? [];
  if (stats.length === 0) return [];
  if (!pageConfig.value.showPaginerStatistics && !isFilterActive.value) return [];
  return stats.map((item) => ({
    text: ui(item.labelKey),
    number: item.value,
  }));
});

const showPaginerStatisticsPanel = computed(() => {
  if (usesOrderRecordPaginerStatistics.value) {
    return pageConfig.value.showPaginerStatistics !== false;
  }
  if (!pageConfig.value.showPaginerStatistics && !isFilterActive.value) {
    return false;
  }
  return paginerStatistics.value.length > 0;
});

function onColumnSortChange(next: PaymentEngineRecordSortTarget | null) {
  setColumnSort(next);
}

function recordRow(data: DataListItem): PaymentEngineRecordRow {
  return data as PaymentEngineRecordRow;
}
</script>

<template>
  <div :class="styles.dataListNest">
    <EgLayout
      type="empty"
      :show-toolbar="!usesLayoutDetailPageStack"
      :show-paginer="!usesLayoutDetailPageStack"
    >
      <template #toolbar>
        <PaymentEngineRecordListToolbar
          :title="displayToolbarTitle"
          :show-toolbar-section="showToolbarSection"
          :toolbar-functional-buttons="toolbarFunctionalButtons"
          :toolbar-section-buttons="displayToolbarSectionButtons"
          :toolbar-action-buttons="displayToolbarActionButtons"
          :translate="ui"
          @toolbar-action="onToolbarActionClick"
        >
          <template v-if="usesSubAddressCurrencyToolbar" #title>
            <WaasSubAddressCurrencyPicker />
          </template>
          <template v-if="usesEgFilter && showToolbarSection" #section-prefix>
            <WaasToolbarFilter
              v-model="waasFilterConditions"
              v-model:logic-mode="waasFilterLogicMode"
              :fields="waasFilterFields"
              :operators="waasFilterOperators"
            />
          </template>
          <template v-else-if="usesEgFilter" #functional-prefix>
            <WaasToolbarFilter
              v-model="waasFilterConditions"
              v-model:logic-mode="waasFilterLogicMode"
              :fields="waasFilterFields"
              :operators="waasFilterOperators"
            />
          </template>
        </PaymentEngineRecordListToolbar>
      </template>

      <LayoutChromePageStack
        v-if="usesLayoutDetailPageStack"
        ref="layoutDetailPageMotionRef"
        :enabled="true"
        :page-key="layoutDetailPageKey"
        @page-settled="onLayoutDetailPageSettled"
      >
        <template #list-toolbar>
          <PaymentEngineRecordListToolbar
            :title="displayToolbarTitle"
            :show-toolbar-section="showToolbarSection"
            :toolbar-functional-buttons="toolbarFunctionalButtons"
            :toolbar-section-buttons="displayToolbarSectionButtons"
            :toolbar-action-buttons="displayToolbarActionButtons"
            :translate="ui"
            @toolbar-action="onToolbarActionClick"
          >
            <template v-if="usesSubAddressCurrencyToolbar" #title>
              <WaasSubAddressCurrencyPicker />
            </template>
            <template v-if="usesEgFilter && showToolbarSection" #section-prefix>
              <WaasToolbarFilter
                v-model="waasFilterConditions"
                v-model:logic-mode="waasFilterLogicMode"
                :fields="waasFilterFields"
                :operators="waasFilterOperators"
              />
            </template>
            <template v-else-if="usesEgFilter" #functional-prefix>
              <WaasToolbarFilter
                v-model="waasFilterConditions"
                v-model:logic-mode="waasFilterLogicMode"
                :fields="waasFilterFields"
                :operators="waasFilterOperators"
              />
            </template>
          </PaymentEngineRecordListToolbar>
        </template>

        <template #detail-toolbar>
          <EgToolBar
            :title="ui(layoutDetailToolbarTitleKey)"
            :show-back="true"
            :show-operation="false"
            @back="onLayoutDetailBack"
          />
        </template>

        <template #detail>
          <PaymentEngineBulkTransferDetailPage
            v-if="bulkTransferDetailRow && isPaymentBulkTransferRecordMenuItem(props.menuItem)"
            embedded-in-page-stack
            :detail="bulkTransferDetailRow"
            :menu-item="props.menuItem"
          />
          <PaymentEngineCollectionDetailPage
            v-else-if="collectionDetailRow && isPaymentCollectionDetailMenuItem(props.menuItem)"
            embedded-in-page-stack
            :detail="collectionDetailRow"
            :menu-item="props.menuItem"
          />
        </template>

        <template #list-paginer>
          <PaymentEngineRecordListPaginer
            v-model:settings-level-index="settingsLevelIndex"
            v-model:settings-jump-value="settingsJumpValue"
            :show-statistics="showPaginerStatisticsPanel"
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
            :active-sort="activeSort"
            :column-height="listColumnHeight"
            @row-click="onRowClick"
            @sort-change="onColumnSortChange"
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
          :active-sort="activeSort"
          :column-height="listColumnHeight"
          @row-click="onRowClick"
          @sort-change="onColumnSortChange"
        />
      </LayoutChromePageStack>

      <template #paginer>
        <PaymentEngineRecordListPaginer
          v-model:settings-level-index="settingsLevelIndex"
          v-model:settings-jump-value="settingsJumpValue"
          :show-statistics="showPaginerStatisticsPanel"
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

