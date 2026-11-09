<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  EgDataList,
  EgDataListCellOverflow,
  EgDataListColumn,
  EgDivider,
  EgIcon,
  EgIconProButton,
  EgLayout,
  EgPaginer,
  EgPaginationGroupButton,
  EgToolBar,
  type DataListItem,
  type EgFilterCondition,
  type EgFilterField,
  type EgFilterLogicMode,
} from '@eds/desktop-components';
import {
  applyEgFilterConditions,
  hasActiveEgFilterConditions,
  isActiveEgFilterCondition,
} from '@/scenes/shared/applyEgFilterConditions';
import { resolveDataListFilterSourceRowCount } from '@/scenes/shared/buildListDerivedFilterOptions';
import TasksToolbarFilter from '@/scenes/tasks/filter/TasksToolbarFilter.vue';
import { useAppI18n } from '@/composables/useAppI18n';
import { useDeferredContentMount } from '@/composables/useDeferredContentMount';
import DataListHeaderSortTrigger from '@/scenes/tasks/DataListHeaderSortTrigger.vue';
import TasksListFieldAmount from '@/scenes/tasks/list-field/TasksListFieldAmount.vue';
import TasksListFieldTime from '@/scenes/tasks/list-field/TasksListFieldTime.vue';
import pageStyles from '@/scenes/tasks/TasksDataListPage.module.css';
import { dataListTimeColumnLabelKey } from '@/scenes/shared/dataListTimeLabelKeys';
import {
  buildGasProxyDeductedAmountAccountCustomize,
  buildGasProxyTimeCustomize,
} from './gasProxyPaymentRecordListFieldCustomize';
import type { GasProxyPaymentRecordRow } from './gasProxyPaymentRecordTypes';
import {
  GAS_PROXY_DEDUCTED_AMOUNT_ACCOUNT_COLUMN_MIN_WIDTH,
  GAS_PROXY_TIME_COLUMN_MIN_WIDTH,
  GAS_PROXY_TYPE_HASH_COLUMN_MIN_WIDTH,
} from './gasProxyPaymentRecordColumnLayout';
import ManageGasProxyTypeHash from './list-field/ManageGasProxyTypeHash.vue';
import {
  GAS_PROXY_PAYMENT_RECORDS_COLUMN_HEIGHT,
  GAS_PROXY_PAYMENT_RECORDS_HEADER_HEIGHT,
  useManageGasProxyPaymentRecordsDataListPage,
} from './useManageGasProxyPaymentRecordsDataListPage';
import { buildGasProxyFilterPaginerStatistics } from './buildGasProxyFilterPaginerStatistics';
import { buildGasProxyPaymentRecordFilterRowSnapshot } from './filter/buildGasProxyPaymentRecordFilterRowSnapshot';
import {
  GAS_PROXY_PAYMENT_RECORD_FILTER_OPERATORS,
  buildGasProxyPaymentRecordFilterFields,
} from './filter/gasProxyPaymentRecordFilterFields';
import {
  GAS_PROXY_PAYMENT_RECORDS_DEMO_TOTAL,
  buildGasProxyPaymentRecordRow,
} from './gasProxyPaymentRecordData';
import styles from './ManageGasProxyPaymentRecordsDataListPage.module.css';

const emit = defineEmits<{
  'row-click': [row: GasProxyPaymentRecordRow];
}>();

const { ui } = useAppI18n();

const filterConditions = ref<EgFilterCondition[]>([]);
const filterLogicMode = ref<EgFilterLogicMode>('all');

const filterSourceRowCount = resolveDataListFilterSourceRowCount(
  false,
  GAS_PROXY_PAYMENT_RECORDS_DEMO_TOTAL,
);

const filterFields = computed((): EgFilterField[] =>
  buildGasProxyPaymentRecordFilterFields((key) => ui(key), filterSourceRowCount),
);

const filteredIndices = computed(() => {
  const allIndices = Array.from(
    { length: GAS_PROXY_PAYMENT_RECORDS_DEMO_TOTAL },
    (_, index) => index,
  );
  if (!hasActiveEgFilterConditions(filterConditions.value)) {
    return allIndices;
  }

  const conditions = filterConditions.value;
  const fields = filterFields.value;
  const logicMode = filterLogicMode.value;

  return allIndices.filter((rowIndex) => {
    try {
      return applyEgFilterConditions({
        snapshot: buildGasProxyPaymentRecordFilterRowSnapshot(
          buildGasProxyPaymentRecordRow(rowIndex),
        ),
        conditions,
        fields,
        logicMode,
      });
    } catch {
      return true;
    }
  });
});

const filterBadge = computed(
  () => filterConditions.value.filter(isActiveEgFilterCondition).length,
);

const timeColumnLabelKey = dataListTimeColumnLabelKey('Time');

const {
  DATA_LIST_FIGMA_PAGINER,
  DATA_LIST_FIGMA_PAGE_SIZE_OPTIONS,
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
  amountSortOrder,
  setAmountSort,
  setTimeSort,
  settingsJumpValue,
  settingsLevelIndex,
  timeSortOrder,
  sourceIndices,
  toolbarActionButtons,
  totalRowCount,
} = useManageGasProxyPaymentRecordsDataListPage({
  sourceIndices: filteredIndices,
  filterBadge,
});

watch(filterConditions, () => {
  if (hasActiveEgFilterConditions(filterConditions.value)) {
    goFirstPage();
  }
}, { deep: true });

const paginerStatisticsItems = computed(() =>
  buildGasProxyFilterPaginerStatistics(
    sourceIndices.value,
    ui,
    filterConditions.value,
  ),
);

const showPaginerStatistics = computed(() => paginerStatisticsItems.value.length > 0);

const displayToolbarActionButtons = computed(() =>
  toolbarActionButtons.value.filter((button) => button.key !== 'filter'),
);

const { contentReady } = useDeferredContentMount();

const listIniting = computed(() => !contentReady.value);
const displayRows = computed(() => (contentReady.value ? paginatedRows.value : []));

const isHeaderSortDisabled = computed(() => Boolean(customize.value.loading));

function recordRow(data: DataListItem): GasProxyPaymentRecordRow {
  return data as GasProxyPaymentRecordRow;
}

function onRowClick(data: DataListItem) {
  emit('row-click', recordRow(data));
}
</script>

<template>
  <div :class="styles.dataListNest">
    <EgLayout type="empty" show-toolbar show-paginer>
      <template #toolbar>
        <EgToolBar
          :title="ui('Gas Proxy Payment Records')"
          :show-operation="true"
          :show-divider="true"
          frosted
        >
          <template #functional>
            <TasksToolbarFilter
              v-model="filterConditions"
              v-model:logic-mode="filterLogicMode"
              :fields="filterFields"
              :operators="GAS_PROXY_PAYMENT_RECORD_FILTER_OPERATORS"
            />
            <EgIconProButton
              v-for="button in displayToolbarActionButtons"
              :key="button.key"
              :label="ui(button.item.label)"
              :badge="button.item.badge"
              :show-badge="button.item.showBadge"
              :show-reddot="button.item.showReddot"
              :disabled="button.item.disabled"
              @click="onToolbarActionClick(button.key)"
            >
              <EgIcon :name="button.item.icon" size="sm" />
            </EgIconProButton>
          </template>
        </EgToolBar>
      </template>

      <div :class="styles.listRegion">
        <EgDataList
          :data-list="displayRows"
          :header-height="GAS_PROXY_PAYMENT_RECORDS_HEADER_HEIGHT"
          :column-height="GAS_PROXY_PAYMENT_RECORDS_COLUMN_HEIGHT"
          :loading="Boolean(customize.loading)"
          :initing="listIniting"
          :initing-text="ui('Loading')"
          @row-click="onRowClick"
        >
          <EgDataListColumn
            prop="transactionTypeKey"
            :label="ui('Gas Proxy Transaction Type')"
            :min-width="GAS_PROXY_TYPE_HASH_COLUMN_MIN_WIDTH"
            align="left"
            :display-order="1"
            :sortable="false"
          >
            <template #header>
              <div :class="pageStyles.comboHeader">
                <div :class="pageStyles.comboHeaderSegment">
                  <div :class="pageStyles.comboHeaderSegmentTextWrap">
                    <EgDataListCellOverflow
                      :content-class="pageStyles.comboHeaderSegmentText"
                      context="header"
                    >
                      {{ ui('Gas Proxy Transaction Type') }}
                    </EgDataListCellOverflow>
                  </div>
                </div>
                <EgDivider type="navigator" direction="vertical" />
                <div :class="pageStyles.comboHeaderSegment">
                  <div :class="pageStyles.comboHeaderSegmentTextWrap">
                    <EgDataListCellOverflow
                      :content-class="pageStyles.comboHeaderSegmentText"
                      context="header"
                    >
                      {{ ui('Transaction hash') }}
                    </EgDataListCellOverflow>
                  </div>
                </div>
              </div>
            </template>
            <template #default="{ data }">
              <ManageGasProxyTypeHash :row="recordRow(data)" />
            </template>
          </EgDataListColumn>

          <EgDataListColumn
            prop="transactionTime"
            :label="ui(timeColumnLabelKey)"
            :min-width="GAS_PROXY_TIME_COLUMN_MIN_WIDTH"
            :flex-grow="true"
            :display-order="2"
            :sortable="false"
          >
            <template #header>
              <div :class="pageStyles.comboHeader">
                <div :class="pageStyles.comboHeaderSegment">
                  <div :class="pageStyles.comboHeaderSegmentTextWrap">
                    <EgDataListCellOverflow
                      :content-class="pageStyles.comboHeaderSegmentText"
                      context="header"
                    >
                      {{ ui(timeColumnLabelKey) }}
                    </EgDataListCellOverflow>
                  </div>
                  <DataListHeaderSortTrigger
                    :label="timeColumnLabelKey"
                    :active-order="timeSortOrder"
                    :disabled="isHeaderSortDisabled"
                    @sort-change="setTimeSort"
                  />
                </div>
              </div>
            </template>
            <template #default="{ data }">
              <TasksListFieldTime :customize="buildGasProxyTimeCustomize(recordRow(data))" />
            </template>
          </EgDataListColumn>

          <EgDataListColumn
            prop="deductedAmountAccount"
            :label="ui('Deducted Amount')"
            :min-width="GAS_PROXY_DEDUCTED_AMOUNT_ACCOUNT_COLUMN_MIN_WIDTH"
            align="right"
            :flex-grow="true"
            :display-order="3"
            :sortable="false"
          >
            <template #header>
              <div :class="[pageStyles.comboHeader, pageStyles.comboHeaderAlignEnd]">
                <div :class="pageStyles.comboHeaderSegment">
                  <div :class="pageStyles.comboHeaderSegmentTextWrap">
                    <EgDataListCellOverflow
                      :content-class="pageStyles.comboHeaderSegmentText"
                      context="header"
                    >
                      {{ ui('Deducted Amount') }}
                    </EgDataListCellOverflow>
                  </div>
                  <DataListHeaderSortTrigger
                    label="Deducted Amount"
                    align="end"
                    :active-order="amountSortOrder"
                    :disabled="isHeaderSortDisabled"
                    @sort-change="setAmountSort"
                  />
                </div>
                <EgDivider type="navigator" direction="vertical" />
                <div :class="pageStyles.comboHeaderSegment">
                  <div :class="pageStyles.comboHeaderSegmentTextWrap">
                    <EgDataListCellOverflow
                      :content-class="pageStyles.comboHeaderSegmentText"
                      context="header"
                    >
                      {{ ui('Account') }}
                    </EgDataListCellOverflow>
                  </div>
                </div>
              </div>
            </template>
            <template #default="{ data }">
              <TasksListFieldAmount
                :customize="buildGasProxyDeductedAmountAccountCustomize(recordRow(data))"
              />
            </template>
          </EgDataListColumn>
        </EgDataList>
      </div>

      <template #paginer>
        <EgPaginer
          v-model:settings-level-index="settingsLevelIndex"
          v-model:settings-jump-value="settingsJumpValue"
          :show-statistics="showPaginerStatistics"
          :statistics-items="paginerStatisticsItems"
          :data-volume-total="ui(DATA_LIST_FIGMA_PAGINER.dataVolumeTotal)"
          :data-volume-count="String(totalRowCount)"
          :data-volume-results="ui(DATA_LIST_FIGMA_PAGINER.dataVolumeResults)"
          :settings-level-labels="[...DATA_LIST_FIGMA_PAGE_SIZE_OPTIONS]"
          :settings-level-label="ui('Items Per Page')"
          :settings-jump-label="ui('Go to Page')"
          :settings-jump-placeholder="ui('Please Enter')"
          @settings-jump="onSettingsJump"
        >
          <EgPaginationGroupButton
            :kind="firstPagination.kind"
            :tone="firstPagination.tone"
            :disabled="prevNavDisabled || firstPagination.disabled"
            @click="goFirstPage"
          >
            <EgIcon name="eds-arrow-go-first" fit />
          </EgPaginationGroupButton>
          <EgPaginationGroupButton
            :kind="prevPagination.kind"
            :tone="prevPagination.tone"
            :disabled="prevNavDisabled || prevPagination.disabled"
            @click="goPrevPage"
          >
            <EgIcon name="eds-arrow-left-mini-ios" fit />
          </EgPaginationGroupButton>
          <template v-if="!isManyPagination">
            <EgPaginationGroupButton
              :kind="pagePagination.kind"
              :tone="pagePagination.tone"
              selected
              :disabled="pagePagination.disabled"
              :label="String(currentPage)"
            />
          </template>
          <template v-else>
            <EgPaginationGroupButton
              v-for="(item, index) in manyPageItems"
              :key="`${item.kind}-${item.label}-${index}`"
              :kind="pagePagination.kind"
              :tone="pagePagination.tone"
              :selected="isManyPageSelected(item, index)"
              :disabled="pagePagination.disabled"
              :label="item.label"
              @click="onManyPageItemClick(item)"
            />
          </template>
          <EgPaginationGroupButton
            :kind="nextPagination.kind"
            :tone="nextPagination.tone"
            :disabled="nextNavDisabled || nextPagination.disabled"
            @click="goNextPage"
          >
            <EgIcon name="eds-arrow-right-mini-ios" fit />
          </EgPaginationGroupButton>
          <EgPaginationGroupButton
            :kind="lastPagination.kind"
            :tone="lastPagination.tone"
            :disabled="nextNavDisabled || lastPagination.disabled"
            @click="goLastPage"
          >
            <EgIcon name="eds-arrow-go-last" fit />
          </EgPaginationGroupButton>
        </EgPaginer>
      </template>
    </EgLayout>
  </div>
</template>
