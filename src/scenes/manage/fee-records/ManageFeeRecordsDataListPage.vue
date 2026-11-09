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
import { useAppI18n } from '@/composables/useAppI18n';
import { useDeferredContentMount } from '@/composables/useDeferredContentMount';
import {
  applyEgFilterConditions,
  hasActiveEgFilterConditions,
  isActiveEgFilterCondition,
} from '@/scenes/shared/applyEgFilterConditions';
import { resolveDataListFilterSourceRowCount } from '@/scenes/shared/buildListDerivedFilterOptions';
import TasksToolbarFilter from '@/scenes/tasks/filter/TasksToolbarFilter.vue';
import DataListHeaderSortTrigger from '@/scenes/tasks/DataListHeaderSortTrigger.vue';
import TasksListFieldAmount from '@/scenes/tasks/list-field/TasksListFieldAmount.vue';
import TasksListFieldTime from '@/scenes/tasks/list-field/TasksListFieldTime.vue';
import pageStyles from '@/scenes/tasks/TasksDataListPage.module.css';
import {
  buildFeeRecordAmountAccountCustomize,
  buildFeeRecordTimeCustomize,
} from './feeRecordListFieldCustomize';
import ManageFeeRecordOperationType from './list-field/ManageFeeRecordOperationType.vue';
import type { FeeRecordRow } from './feeRecordTypes';
import {
  FEE_RECORD_AMOUNT_ACCOUNT_COLUMN_MIN_WIDTH,
  FEE_RECORD_OPERATION_TYPE_COLUMN_MIN_WIDTH,
  FEE_RECORD_TIME_COLUMN_MIN_WIDTH,
} from './feeRecordColumnLayout';
import { buildFeeRecordPaginerStatistics } from './buildFeeRecordPaginerStatistics';
import { buildFeeRecordFilterRowSnapshot } from './filter/buildFeeRecordFilterRowSnapshot';
import {
  FEE_RECORD_FILTER_OPERATORS,
  buildFeeRecordFilterFields,
} from './filter/feeRecordFilterFields';
import { FEE_RECORDS_DEMO_TOTAL, buildFeeRecordRow } from './feeRecordData';
import {
  FEE_RECORDS_COLUMN_HEIGHT,
  FEE_RECORDS_HEADER_HEIGHT,
  useManageFeeRecordsDataListPage,
} from './useManageFeeRecordsDataListPage';
import ManageFeeRecordsToolbarTimezoneHint from './ManageFeeRecordsToolbarTimezoneHint.vue';
import ManageFeeRecordsToolbarTimezonePicker from './ManageFeeRecordsToolbarTimezonePicker.vue';
import styles from './ManageFeeRecordsDataListPage.module.css';

const emit = defineEmits<{
  'row-click': [row: FeeRecordRow];
}>();

const { ui } = useAppI18n();

const timeColumnLabelKey = 'Time';

const filterConditions = ref<EgFilterCondition[]>([]);
const filterLogicMode = ref<EgFilterLogicMode>('all');

const filterSourceRowCount = resolveDataListFilterSourceRowCount(false, FEE_RECORDS_DEMO_TOTAL);

const filterFields = computed((): EgFilterField[] =>
  buildFeeRecordFilterFields((key) => ui(key), filterSourceRowCount),
);

const filteredIndices = computed(() => {
  const allIndices = Array.from({ length: FEE_RECORDS_DEMO_TOTAL }, (_, index) => index);
  if (!hasActiveEgFilterConditions(filterConditions.value)) {
    return allIndices;
  }

  const conditions = filterConditions.value;
  const fields = filterFields.value;
  const logicMode = filterLogicMode.value;

  return allIndices.filter((rowIndex) => {
    try {
      return applyEgFilterConditions({
        snapshot: buildFeeRecordFilterRowSnapshot(buildFeeRecordRow(rowIndex)),
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
} = useManageFeeRecordsDataListPage({
  sourceIndices: filteredIndices,
  filterBadge,
});

watch(filterConditions, () => {
  if (hasActiveEgFilterConditions(filterConditions.value)) {
    goFirstPage();
  }
}, { deep: true });

const paginerStatisticsItems = computed(() =>
  buildFeeRecordPaginerStatistics(sourceIndices.value, ui),
);

const displayToolbarActionButtons = computed(() =>
  toolbarActionButtons.value.filter((button) => button.key !== 'filter'),
);

const { contentReady } = useDeferredContentMount();

const listIniting = computed(() => !contentReady.value);
const displayRows = computed(() => (contentReady.value ? paginatedRows.value : []));

const isHeaderSortDisabled = computed(() => Boolean(customize.value.loading));

function recordRow(data: DataListItem): FeeRecordRow {
  return data as FeeRecordRow;
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
          :show-operation="true"
          :show-divider="true"
          frosted
        >
          <template #title>
            <span :class="styles.toolbarTitleCluster">
              <span :class="styles.toolbarTitleText">{{ ui('Fee Records') }}</span>
              <ManageFeeRecordsToolbarTimezoneHint />
              <ManageFeeRecordsToolbarTimezonePicker />
            </span>
          </template>
          <template #functional>
            <TasksToolbarFilter
              v-model="filterConditions"
              v-model:logic-mode="filterLogicMode"
              :fields="filterFields"
              :operators="FEE_RECORD_FILTER_OPERATORS"
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
          :header-height="FEE_RECORDS_HEADER_HEIGHT"
          :column-height="FEE_RECORDS_COLUMN_HEIGHT"
          :loading="Boolean(customize.loading)"
          :initing="listIniting"
          :initing-text="ui('Loading')"
          @row-click="onRowClick"
        >
          <EgDataListColumn
            prop="operationTypeKey"
            :label="ui('Fee Operation Type')"
            :min-width="FEE_RECORD_OPERATION_TYPE_COLUMN_MIN_WIDTH"
            align="left"
            :display-order="1"
            :sortable="false"
          >
            <template #default="{ data }">
              <ManageFeeRecordOperationType :row="recordRow(data)" />
            </template>
          </EgDataListColumn>

          <EgDataListColumn
            prop="transactionTime"
            :label="ui(timeColumnLabelKey)"
            :min-width="FEE_RECORD_TIME_COLUMN_MIN_WIDTH"
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
              <TasksListFieldTime :customize="buildFeeRecordTimeCustomize(recordRow(data))" />
            </template>
          </EgDataListColumn>

          <EgDataListColumn
            prop="amountAccount"
            :label="ui('Amount')"
            :min-width="FEE_RECORD_AMOUNT_ACCOUNT_COLUMN_MIN_WIDTH"
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
                      {{ ui('Amount') }}
                    </EgDataListCellOverflow>
                  </div>
                  <DataListHeaderSortTrigger
                    label="Amount"
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
                :customize="buildFeeRecordAmountAccountCustomize(recordRow(data))"
              />
            </template>
          </EgDataListColumn>
        </EgDataList>
      </div>

      <template #paginer>
        <EgPaginer
          v-model:settings-level-index="settingsLevelIndex"
          v-model:settings-jump-value="settingsJumpValue"
          :show-statistics="true"
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
