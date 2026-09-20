<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import {
  EgDataList,
  EgDataListCellOverflow,
  EgDataListColumn,
  EgDivider,
  EgIcon,
  EgIconProButton,
  EgLayout,
  EgListFieldHashLikeLine,
  EgListFieldOverflowText,
  EgPaginer,
  EgPaginationGroupButton,
  EgToolBar,
  type DataListItem,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import { useDeferredContentMount } from '@/composables/useDeferredContentMount';
import DataListHeaderSortTrigger from '@/scenes/tasks/DataListHeaderSortTrigger.vue';
import TasksListFieldAmount from '@/scenes/tasks/list-field/TasksListFieldAmount.vue';
import TasksListFieldCurrency from '@/scenes/tasks/list-field/TasksListFieldCurrency.vue';
import TasksListFieldGeneralStructure from '@/scenes/tasks/list-field/TasksListFieldGeneralStructure.vue';
import TasksListFieldTime from '@/scenes/tasks/list-field/TasksListFieldTime.vue';
import pageStyles from '@/scenes/tasks/TasksDataListPage.module.css';
import TransactionRecordsWalletColumnHeader from './list-field/TransactionRecordsWalletColumnHeader.vue';
import {
  buildReportAmountCustomize,
  buildReportCurrencyCustomize,
  buildReportTimeCustomize,
  buildReportWalletCustomize,
} from './reportListFieldCustomize';
import type { TransactionRecordRow } from './transactionRecordTypes';
import {
  TRANSACTION_RECORD_AMOUNT_COLUMN_MIN_WIDTH,
  TRANSACTION_RECORD_CURRENCY_ADDRESS_COLUMN_MIN_WIDTH,
  TRANSACTION_RECORD_DIRECTION_COLUMN_MIN_WIDTH,
  TRANSACTION_RECORD_HASH_COLUMN_MIN_WIDTH,
  TRANSACTION_RECORD_TIME_COLUMN_MIN_WIDTH,
  TRANSACTION_RECORD_TIME_COLUMN_WIDTH,
  TRANSACTION_RECORD_TYPE_COLUMN_MIN_WIDTH,
  TRANSACTION_RECORD_WALLET_COLUMN_MIN_WIDTH,
} from './transactionRecordColumnLayout';
import {
  TRANSACTION_RECORDS_COLUMN_HEIGHT,
  TRANSACTION_RECORDS_HEADER_HEIGHT,
  useTransactionRecordsDataListPage,
} from './useTransactionRecordsDataListPage';
import { registerTransactionRecordDetailFlow } from './transactionRecordDetailFlowContext';
import { registerTransactionRecordsDataListShellApi } from './transactionRecordsDataListShellApi';
import { useTransactionRecordDetailFlow } from './useTransactionRecordDetailFlow';
import styles from './TransactionRecordsDataListPage.module.css';

const { ui } = useAppI18n();

const {
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
} = useTransactionRecordsDataListPage();

const { contentReady, setContentReady } = useDeferredContentMount();
const listForcedEmpty = ref(false);
const qaInitingHeld = ref(false);

const displayRows = computed(() => {
  if (listForcedEmpty.value) {
    return [];
  }
  return contentReady.value ? paginatedRows.value : [];
});

const listIniting = computed(() => qaInitingHeld.value || !contentReady.value);

const isHeaderSortDisabled = computed(
  () => Boolean(customize.value.loading) || displayRows.value.length === 0,
);

const detailFlow = useTransactionRecordDetailFlow();

onMounted(() => {
  registerTransactionRecordDetailFlow(detailFlow);
  registerTransactionRecordsDataListShellApi({
    setListEmpty: (empty) => {
      listForcedEmpty.value = empty;
      if (empty) {
        customize.value.loading = false;
        qaInitingHeld.value = false;
        setContentReady(true);
      }
    },
    setListIniting: (initing) => {
      qaInitingHeld.value = initing;
      if (initing) {
        listForcedEmpty.value = false;
        customize.value.loading = false;
        setContentReady(false);
        return;
      }
      setContentReady(true);
    },
    setListLoading: (loading) => {
      customize.value.loading = loading;
      if (loading) {
        listForcedEmpty.value = false;
        qaInitingHeld.value = false;
        setContentReady(true);
      }
    },
    showDangerToast: (message) => {
      console.warn(`[transaction-records QA] ${message}`);
    },
  });
});

onBeforeUnmount(() => {
  registerTransactionRecordDetailFlow(null);
  registerTransactionRecordsDataListShellApi(null);
});

function recordRow(data: DataListItem): TransactionRecordRow {
  return data as TransactionRecordRow;
}

function onRowClick(data: DataListItem) {
  detailFlow.openDetailForRow(recordRow(data));
}
</script>

<template>
  <div :class="styles.dataListNest">
    <EgLayout type="empty" show-toolbar show-paginer>
      <template #toolbar>
        <EgToolBar
          :title="ui('Report')"
          :show-operation="true"
          :show-divider="true"
        >
          <template #functional>
            <EgIconProButton
              v-for="button in toolbarActionButtons"
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
          :header-height="TRANSACTION_RECORDS_HEADER_HEIGHT"
          :column-height="TRANSACTION_RECORDS_COLUMN_HEIGHT"
          :loading="Boolean(customize.loading)"
          :initing="listIniting"
          :initing-text="ui('Loading')"
          @row-click="onRowClick"
        >
          <EgDataListColumn
            prop="transactionTime"
            :label="ui('Transaction Time UTC+08:00')"
            :min-width="TRANSACTION_RECORD_TIME_COLUMN_MIN_WIDTH"
            :width="TRANSACTION_RECORD_TIME_COLUMN_WIDTH"
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
                      {{ ui('Transaction Time UTC+08:00') }}
                    </EgDataListCellOverflow>
                  </div>
                  <DataListHeaderSortTrigger
                    label="Transaction Time UTC+08:00"
                    :active-order="timeSortOrder"
                    :disabled="isHeaderSortDisabled"
                    @sort-change="setTimeSort"
                  />
                </div>
              </div>
            </template>
            <template #default="{ data }">
              <TasksListFieldTime :customize="buildReportTimeCustomize(recordRow(data))" />
            </template>
          </EgDataListColumn>

          <EgDataListColumn
            prop="currencyAddress"
            :label="ui('Currency')"
            :min-width="TRANSACTION_RECORD_CURRENCY_ADDRESS_COLUMN_MIN_WIDTH"
            align="left"
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
                      {{ ui('Currency') }}
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
                      {{ ui('Address') }}
                    </EgDataListCellOverflow>
                  </div>
                </div>
              </div>
            </template>
            <template #default="{ data }">
              <div :class="styles.currencyAddressCell">
                <TasksListFieldCurrency :customize="buildReportCurrencyCustomize(recordRow(data))" />
              </div>
            </template>
          </EgDataListColumn>

          <EgDataListColumn
            prop="txHash"
            :label="ui('Transaction hash')"
            :min-width="TRANSACTION_RECORD_HASH_COLUMN_MIN_WIDTH"
            align="left"
            :display-order="3"
            :sortable="false"
          >
            <template #default="{ data }">
              <EgListFieldHashLikeLine
                :text="recordRow(data).txHash"
                variant="primary"
                tooltip-trigger="hover"
              />
            </template>
          </EgDataListColumn>

          <EgDataListColumn
            prop="walletName"
            :label="ui('Affiliated Wallet')"
            :min-width="TRANSACTION_RECORD_WALLET_COLUMN_MIN_WIDTH"
            :display-order="6"
            :sortable="false"
          >
            <template #header>
              <TransactionRecordsWalletColumnHeader />
            </template>
            <template #default="{ data }">
              <TasksListFieldGeneralStructure :customize="buildReportWalletCustomize(recordRow(data))" />
            </template>
          </EgDataListColumn>

          <EgDataListColumn
            prop="transactionType"
            :label="ui('Transaction Type')"
            :min-width="TRANSACTION_RECORD_TYPE_COLUMN_MIN_WIDTH"
            :display-order="5"
            align="left"
            :sortable="false"
          >
            <template #default="{ data }">
              <EgListFieldOverflowText
                :text="recordRow(data).transactionType"
                variant="primary"
                tooltip-trigger="hover"
              />
            </template>
          </EgDataListColumn>

          <EgDataListColumn
            prop="directionLabel"
            :label="ui('Income/Expense Type')"
            :min-width="TRANSACTION_RECORD_DIRECTION_COLUMN_MIN_WIDTH"
            :display-order="4"
            align="left"
            :sortable="false"
          >
            <template #default="{ data }">
              <EgListFieldOverflowText
                :text="recordRow(data).directionLabel"
                variant="primary"
                tooltip-trigger="hover"
              />
            </template>
          </EgDataListColumn>

          <EgDataListColumn
            prop="amount"
            :label="ui('Amount')"
            :min-width="TRANSACTION_RECORD_AMOUNT_COLUMN_MIN_WIDTH"
            align="right"
            :flex-grow="true"
            :display-order="7"
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
              </div>
            </template>
            <template #default="{ data }">
              <TasksListFieldAmount :customize="buildReportAmountCustomize(recordRow(data))" />
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
