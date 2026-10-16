<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  EgButton,
  EgDataList,
  EgDataListCellOverflow,
  EgDataListColumn,
  EgIcon,
  EgIconButtonPro,
  EgLayout,
  EgListFieldOverflowText,
  EgPaginer,
  EgPaginationItem,
  EgToast,
  EgToolBar,
  type DataListItem,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import { hasActiveEgFilterConditions } from '@/scenes/shared/applyEgFilterConditions';
import DataListHeaderSortTrigger from '@/scenes/tasks/DataListHeaderSortTrigger.vue';
import TasksToolbarFilter from '@/scenes/tasks/filter/TasksToolbarFilter.vue';
import {
  DATA_LIST_FIGMA_HEADER_HEIGHT,
  DATA_LIST_FIGMA_PAGE_SIZE_OPTIONS,
} from '@/scenes/tasks/tasksDataListPageData';
import TransactionRecordsExportFlotation from '@/scenes/transaction-records/export/TransactionRecordsExportFlotation.vue';
import { TRANSACTION_RECORDS_EXPORT_HISTORY_OPERATOR_DEMO } from '@/scenes/transaction-records/export/transactionRecordsExportData';
import { formatGroupedNumber } from '@/utils/formatGroupedDisplay';
import TeamAccountDisplayTimezoneControl from './TeamAccountDisplayTimezoneControl.vue';
import TeamAccountMonthlyExportFields from './TeamAccountMonthlyExportFields.vue';
import {
  DEFAULT_MONTHLY_EXPORT_PERIOD_LABEL,
  formatMonthlyExportHistoryTitle,
  TEAM_ACCOUNT_MONTHLY_EXPORT_HISTORY_SEED,
  txDisplayTitleKey,
} from './teamAccountData';
import { TEAM_ACCOUNT_FILTER_OPERATORS } from './teamAccountFilter';
import { useTeamAccountPage } from './useTeamAccountPage';
import styles from './TeamAccountPage.module.css';

const DATA_LIST_COLUMN_HEIGHT = 66;

const { ui, locale } = useAppI18n();
const {
  state,
  filterConditions,
  filterLogicMode,
  filterFields,
  txDataList,
  settingsLevelIndex,
  settingsJumpValue,
  currentPage,
  totalRowCount,
  isManyPagination,
  manyPageItems,
  firstPagination,
  prevPagination,
  pagePagination,
  nextPagination,
  lastPagination,
  prevNavDisabled,
  nextNavDisabled,
  availableBalance,
  openTx,
  goFirstPage,
  goPrevPage,
  goNextPage,
  goLastPage,
  onManyPageItemClick,
  isManyPageSelected,
  onSettingsJump,
  openAlert,
  draftLang,
  draftHeader,
  langItems,
  pagedTx,
  timeSortOrder,
  amountSortOrder,
  onTimeSort,
  onAmountSort,
} = useTeamAccountPage();

const hasActiveTxFilters = computed(() =>
  hasActiveEgFilterConditions(filterConditions.value),
);

const monthlyExportPeriod = ref(DEFAULT_MONTHLY_EXPORT_PERIOD_LABEL);

const monthlyExportHistory = computed(() =>
  TEAM_ACCOUNT_MONTHLY_EXPORT_HISTORY_SEED.map((item) => ({
    id: item.id,
    title: formatMonthlyExportHistoryTitle(item.periodLabel, { locale: locale.value, ui }),
    subtitle: `${item.timezone}  ${item.language}`,
    operator: TRANSACTION_RECORDS_EXPORT_HISTORY_OPERATOR_DEMO,
    exportedAt: item.exportedAt,
    status: 'ready' as const,
  })),
);

function onTxRowClick(row: DataListItem) {
  const tx = pagedTx.value.find((item) => item.id === String(row.id));
  if (tx) openTx(tx);
}

function syncMonthlyExportDrafts() {
  draftLang.value = state.statementLang;
  draftHeader.value = state.statementHeader;
}

function onMonthlyExportTriggerClick(onClick: () => void) {
  syncMonthlyExportDrafts();
  onClick();
}

function onMonthlyExportConfirm() {
  state.statementLang = draftLang.value;
  state.statementHeader = draftHeader.value;
}

function resolveMonthlyHistoryEntry() {
  return {
    title: formatMonthlyExportHistoryTitle(monthlyExportPeriod.value, {
      locale: locale.value,
      ui,
    }),
    subtitle: `${state.statementTz}  ${draftLang.value}`,
  };
}
</script>

<template>
  <section :class="styles.page">
    <header :class="styles.hero">
      <div :class="styles.heroBalance">
        <p :class="styles.heroLabel">{{ ui('Available Balance (USD)') }}</p>
        <div :class="styles.heroAmountRow">
          <p :class="styles.heroAmount">{{ availableBalance }}</p>
          <EgButton
            size="sm"
            @click="state.rechargeOpen = true"
          >
            {{ ui('Recharge') }}
          </EgButton>
        </div>
      </div>
      <div :class="styles.heroActions">
        <EgIconButtonPro :label="ui('Balance Alert')" @click="openAlert">
          <EgIcon name="eds-notice" size="sm" />
        </EgIconButtonPro>
        <TransactionRecordsExportFlotation
          key="monthly-statement-export"
          :panel-title="ui('Generate Monthly Statement')"
          :show-scope="false"
          :show-date-range="false"
          :initial-history="monthlyExportHistory"
          :resolve-history-entry="resolveMonthlyHistoryEntry"
          scope-group-name="team-account-monthly-export-scope"
          @export="onMonthlyExportConfirm"
        >
          <template #trigger="{ expanded, disabled, onClick }">
            <EgIconButtonPro
              :label="ui('Statement')"
              :active="expanded"
              :disabled="disabled"
              :aria-expanded="expanded"
              @click.stop="onMonthlyExportTriggerClick(onClick)"
            >
              <EgIcon name="eds-file" size="sm" />
            </EgIconButtonPro>
          </template>
          <template #extra-fields>
            <TeamAccountMonthlyExportFields
              v-model:period="monthlyExportPeriod"
              v-model:language="draftLang"
              v-model:header="draftHeader"
              :language-items="langItems"
            />
          </template>
        </TransactionRecordsExportFlotation>
      </div>
    </header>

    <div :class="styles.stats">
      <article :class="styles.stat">
        <p :class="styles.statLabel">{{ ui('Expenses This Month') }}</p>
        <p :class="styles.statValue">{{ availableBalance }}</p>
      </article>
      <article :class="styles.stat">
        <p :class="styles.statLabel">{{ ui('Expenses Last Month') }}</p>
        <p :class="styles.statValue">{{ availableBalance }}</p>
      </article>
    </div>

    <div :class="styles.listShell">
      <EgLayout type="empty" show-toolbar show-paginer>
        <template #toolbar>
          <EgToolBar
            :title="ui('Transaction Details')"
            show-divider
          >
              <template #title>
                <span :class="styles.toolbarTitleWithTimezone">
                  <span :class="styles.toolbarTitleText">{{ ui('Transaction Details') }}</span>
                  <TeamAccountDisplayTimezoneControl v-model="state.displayTimezone" />
                </span>
              </template>
              <template #functional>
                <TasksToolbarFilter
                  v-model="filterConditions"
                  v-model:logic-mode="filterLogicMode"
                  :fields="filterFields"
                  :operators="TEAM_ACCOUNT_FILTER_OPERATORS"
                />
                <TransactionRecordsExportFlotation
                  :has-active-filters="hasActiveTxFilters"
                  scope-group-name="team-account-tx-export-scope"
                />
              </template>
            </EgToolBar>
          </template>

          <div :class="styles.listRegion">
            <div :class="[styles.listFill, styles.txListFill]">
              <EgDataList
                :data-list="txDataList"
                :header-height="DATA_LIST_FIGMA_HEADER_HEIGHT"
                :column-height="DATA_LIST_COLUMN_HEIGHT"
                :loading="false"
                :initing="false"
                :empty-text="ui('No matching records')"
                @row-click="onTxRowClick"
              >
                <EgDataListColumn
                  prop="type"
                  :label="ui('Operation Type')"
                  min-width="200px"
                  :sortable="false"
                >
                  <template #header>
                    <div :class="styles.comboHeader">
                      <div :class="styles.comboHeaderSegment">
                        <div :class="styles.comboHeaderSegmentTextWrap">
                          <EgDataListCellOverflow
                            :content-class="styles.comboHeaderSegmentText"
                            context="header"
                          >
                            {{ ui('Operation Type') }}
                          </EgDataListCellOverflow>
                        </div>
                      </div>
                    </div>
                  </template>
                  <template #default="{ data }">
                    <div :class="styles.comboPrimary">
                      <span
                        :class="[styles.dirIcon, data.dir === 'out' ? styles.dirOut : styles.dirIn]"
                        aria-hidden="true"
                      >
                        <span :class="styles.dirIconGlyph">
                          <EgIcon
                            :name="data.dir === 'out' ? 'eds-arrow-outflow' : 'eds-arrow-entry'"
                            fit
                          />
                        </span>
                      </span>
                      <span :class="styles.txType">
                        <EgListFieldOverflowText
                          :text="ui(txDisplayTitleKey(String(data.type)))"
                          size="medium"
                          boundary-selector=".app-preview"
                        />
                      </span>
                    </div>
                  </template>
                </EgDataListColumn>
                <EgDataListColumn
                  prop="time"
                  :label="ui('Time')"
                  min-width="160px"
                  width="160px"
                  :sortable="false"
                >
                  <template #header>
                    <div :class="styles.comboHeader">
                      <div :class="styles.comboHeaderSegment">
                        <div :class="styles.comboHeaderSegmentTextWrap">
                          <EgDataListCellOverflow
                            :content-class="styles.comboHeaderSegmentText"
                            context="header"
                          >
                            {{ ui('Time') }}
                          </EgDataListCellOverflow>
                        </div>
                        <DataListHeaderSortTrigger
                          label="Time"
                          :active-order="timeSortOrder"
                          @sort-change="onTimeSort"
                        />
                      </div>
                    </div>
                  </template>
                  <template #default="{ data }">
                    <EgListFieldOverflowText
                      :text="String(data.time)"
                      size="small"
                      boundary-selector=".app-preview"
                    />
                  </template>
                </EgDataListColumn>
                <EgDataListColumn
                  prop="amount"
                  :label="ui('Amount')"
                  min-width="140px"
                  align="right"
                  :sortable="false"
                >
                  <template #header>
                    <div :class="[styles.comboHeader, styles.comboHeaderAlignEnd]">
                      <div :class="styles.comboHeaderSegment">
                        <div :class="styles.comboHeaderSegmentTextWrap">
                          <EgDataListCellOverflow
                            :content-class="styles.comboHeaderSegmentText"
                            context="header"
                          >
                            {{ ui('Amount') }}
                          </EgDataListCellOverflow>
                        </div>
                        <DataListHeaderSortTrigger
                          label="Amount"
                          :active-order="amountSortOrder"
                          @sort-change="onAmountSort"
                        />
                      </div>
                    </div>
                  </template>
                </EgDataListColumn>
              </EgDataList>
            </div>
          </div>

          <template #paginer>
            <EgPaginer
              v-model:settings-level-index="settingsLevelIndex"
              v-model:settings-jump-value="settingsJumpValue"
              :show-statistics="false"
              :data-volume-total="ui('Total')"
              :data-volume-count="formatGroupedNumber(totalRowCount)"
              :data-volume-results="ui('Results')"
              :settings-level-labels="[...DATA_LIST_FIGMA_PAGE_SIZE_OPTIONS]"
              :settings-level-label="ui('Items Per Page')"
              :settings-jump-label="ui('Go to Page')"
              :settings-jump-placeholder="ui('Please Enter')"
              @settings-jump="onSettingsJump"
            >
              <EgPaginationItem
                :kind="firstPagination.kind"
                :tone="firstPagination.tone"
                :disabled="prevNavDisabled || firstPagination.disabled"
                @click="goFirstPage"
              >
                <EgIcon name="eds-arrow-go-first" fit />
              </EgPaginationItem>
              <EgPaginationItem
                :kind="prevPagination.kind"
                :tone="prevPagination.tone"
                :disabled="prevNavDisabled || prevPagination.disabled"
                @click="goPrevPage"
              >
                <EgIcon name="eds-arrow-left-mini-ios" fit />
              </EgPaginationItem>
              <template v-if="!isManyPagination">
                <EgPaginationItem
                  :kind="pagePagination.kind"
                  :tone="pagePagination.tone"
                  selected
                  :disabled="pagePagination.disabled"
                  :label="String(currentPage)"
                />
              </template>
              <template v-else>
                <EgPaginationItem
                  v-for="(item, index) in manyPageItems"
                  :key="`${item.kind}-${item.label}-${index}`"
                  :kind="pagePagination.kind"
                  :tone="pagePagination.tone"
                  :interactive="item.kind !== 'ellipsis'"
                  :selected="isManyPageSelected(item, index)"
                  :disabled="pagePagination.disabled"
                  :label="item.label"
                  @click="onManyPageItemClick(item)"
                />
              </template>
              <EgPaginationItem
                :kind="nextPagination.kind"
                :tone="nextPagination.tone"
                :disabled="nextNavDisabled || nextPagination.disabled"
                @click="goNextPage"
              >
                <EgIcon name="eds-arrow-right-mini-ios" fit />
              </EgPaginationItem>
              <EgPaginationItem
                :kind="lastPagination.kind"
                :tone="lastPagination.tone"
                :disabled="nextNavDisabled || lastPagination.disabled"
                @click="goLastPage"
              >
                <EgIcon name="eds-arrow-go-last" fit />
              </EgPaginationItem>
            </EgPaginer>
          </template>
        </EgLayout>
    </div>
  </section>

  <Teleport to=".app-preview">
    <div v-if="state.toast" :class="styles.toastHost">
      <EgToast type="result" :text="state.toast" />
    </div>
  </Teleport>
</template>
