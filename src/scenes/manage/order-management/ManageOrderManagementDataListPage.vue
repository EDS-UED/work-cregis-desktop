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
import TasksToolbarFilter from '@/scenes/tasks/filter/TasksToolbarFilter.vue';
import DataListHeaderSortTrigger from '@/scenes/tasks/DataListHeaderSortTrigger.vue';
import pageStyles from '@/scenes/tasks/TasksDataListPage.module.css';
import {
  ORDER_MANAGEMENT_ACTIONS_COLUMN_MIN_WIDTH,
  ORDER_MANAGEMENT_AMOUNT_TIME_COLUMN_MIN_WIDTH,
  ORDER_MANAGEMENT_STATUS_COLUMN_MIN_WIDTH,
  ORDER_MANAGEMENT_TYPE_PLAN_COLUMN_MIN_WIDTH,
} from './orderManagementColumnLayout';
import { ORDER_MANAGEMENT_DEMO_TOTAL, buildOrderManagementRow } from './orderManagementData';
import { buildOrderManagementFilterRowSnapshot } from './filter/buildOrderManagementFilterRowSnapshot';
import {
  ORDER_MANAGEMENT_FILTER_OPERATORS,
  buildOrderManagementFilterFields,
} from './filter/orderManagementFilterFields';
import ManageOrderManagementActions from './list-field/ManageOrderManagementActions.vue';
import ManageOrderManagementAmountTime from './list-field/ManageOrderManagementAmountTime.vue';
import ManageOrderManagementStatus from './list-field/ManageOrderManagementStatus.vue';
import ManageOrderManagementTypePlan from './list-field/ManageOrderManagementTypePlan.vue';
import type { OrderManagementRow } from './orderManagementTypes';
import {
  ORDER_MANAGEMENT_COLUMN_HEIGHT,
  ORDER_MANAGEMENT_HEADER_HEIGHT,
  useManageOrderManagementDataListPage,
} from './useManageOrderManagementDataListPage';
import styles from './ManageOrderManagementDataListPage.module.css';

const emit = defineEmits<{
  'row-click': [row: OrderManagementRow];
}>();

const { ui } = useAppI18n();

const filterConditions = ref<EgFilterCondition[]>([]);
const filterLogicMode = ref<EgFilterLogicMode>('all');

const filterFields = computed((): EgFilterField[] => buildOrderManagementFilterFields((key) => ui(key)));

const filteredIndices = computed(() => {
  const allIndices = Array.from({ length: ORDER_MANAGEMENT_DEMO_TOTAL }, (_, index) => index);
  if (!hasActiveEgFilterConditions(filterConditions.value)) {
    return allIndices;
  }

  const conditions = filterConditions.value;
  const fields = filterFields.value;
  const logicMode = filterLogicMode.value;

  return allIndices.filter((rowIndex) => {
    try {
      return applyEgFilterConditions({
        snapshot: buildOrderManagementFilterRowSnapshot(buildOrderManagementRow(rowIndex)),
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
  settingsJumpValue,
  settingsLevelIndex,
  amountSortOrder,
  orderPlacedTimeSortOrder,
  setAmountSort,
  setOrderPlacedTimeSort,
  toolbarActionButtons,
  totalRowCount,
} = useManageOrderManagementDataListPage({
  sourceIndices: filteredIndices,
  filterBadge,
});

watch(filterConditions, () => {
  if (hasActiveEgFilterConditions(filterConditions.value)) {
    goFirstPage();
  }
}, { deep: true });

const displayToolbarActionButtons = computed(() =>
  toolbarActionButtons.value.filter((button) => button.key !== 'filter'),
);

const { contentReady } = useDeferredContentMount();

const listIniting = computed(() => !contentReady.value);
const displayRows = computed(() => (contentReady.value ? paginatedRows.value : []));

const isHeaderSortDisabled = computed(() => Boolean(customize.value.loading));

function recordRow(data: DataListItem): OrderManagementRow {
  return data as OrderManagementRow;
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
          :title="ui('Order Management')"
          :show-operation="true"
          :show-divider="true"
        >
          <template #functional>
            <TasksToolbarFilter
              v-model="filterConditions"
              v-model:logic-mode="filterLogicMode"
              :fields="filterFields"
              :operators="ORDER_MANAGEMENT_FILTER_OPERATORS"
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
          :header-height="ORDER_MANAGEMENT_HEADER_HEIGHT"
          :column-height="ORDER_MANAGEMENT_COLUMN_HEIGHT"
          :loading="Boolean(customize.loading)"
          :initing="listIniting"
          :initing-text="ui('Loading')"
          @row-click="onRowClick"
        >
          <EgDataListColumn
            prop="operationTypeKey"
            :label="ui('Fee Operation Type')"
            :min-width="ORDER_MANAGEMENT_TYPE_PLAN_COLUMN_MIN_WIDTH"
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
                      {{ ui('Fee Operation Type') }}
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
                      {{ ui('Fee Record Plan') }}
                    </EgDataListCellOverflow>
                  </div>
                </div>
              </div>
            </template>
            <template #default="{ data }">
              <ManageOrderManagementTypePlan :row="recordRow(data)" />
            </template>
          </EgDataListColumn>

          <EgDataListColumn
            prop="amountDisplay"
            :label="ui('Amount')"
            :min-width="ORDER_MANAGEMENT_AMOUNT_TIME_COLUMN_MIN_WIDTH"
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
                      {{ ui('Amount') }}
                    </EgDataListCellOverflow>
                  </div>
                  <DataListHeaderSortTrigger
                    label="Amount"
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
                      {{ ui('Order Placed Time UTC+08:00') }}
                    </EgDataListCellOverflow>
                  </div>
                  <DataListHeaderSortTrigger
                    label="Order Placed Time UTC+08:00"
                    :active-order="orderPlacedTimeSortOrder"
                    :disabled="isHeaderSortDisabled"
                    @sort-change="setOrderPlacedTimeSort"
                  />
                </div>
              </div>
            </template>
            <template #default="{ data }">
              <ManageOrderManagementAmountTime :row="recordRow(data)" />
            </template>
          </EgDataListColumn>

          <EgDataListColumn
            prop="statusKey"
            :label="ui('Status')"
            :min-width="ORDER_MANAGEMENT_STATUS_COLUMN_MIN_WIDTH"
            align="center"
            :display-order="3"
            :sortable="false"
          >
            <template #default="{ data }">
              <ManageOrderManagementStatus :row="recordRow(data)" />
            </template>
          </EgDataListColumn>

          <EgDataListColumn
            prop="actions"
            :label="ui('Actions')"
            :min-width="ORDER_MANAGEMENT_ACTIONS_COLUMN_MIN_WIDTH"
            align="right"
            :display-order="4"
            :sortable="false"
            is-action
          >
            <template #default="{ data }">
              <ManageOrderManagementActions :row="recordRow(data)" />
            </template>
          </EgDataListColumn>
        </EgDataList>
      </div>

      <template #paginer>
        <EgPaginer
          v-model:settings-level-index="settingsLevelIndex"
          v-model:settings-jump-value="settingsJumpValue"
          :show-statistics="false"
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
