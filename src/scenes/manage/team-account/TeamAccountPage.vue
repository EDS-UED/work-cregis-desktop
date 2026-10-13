<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import {
  EgButton,
  EgDataList,
  EgDataListCellOverflow,
  EgDataListColumn,
  EgDivider,
  EgFlotation,
  EgFlotationMenu,
  EgFlotationMenuItem,
  EgFlotationTrigger,
  EgIcon,
  EgIconButton,
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
import DataListHeaderSortTrigger from '@/scenes/tasks/DataListHeaderSortTrigger.vue';
import TasksToolbarFilter from '@/scenes/tasks/filter/TasksToolbarFilter.vue';
import {
  DATA_LIST_FIGMA_HEADER_HEIGHT,
  DATA_LIST_FIGMA_PAGE_SIZE_OPTIONS,
} from '@/scenes/tasks/tasksDataListPageData';
import { formatGroupedNumber } from '@/utils/formatGroupedDisplay';
import { txDisplayTitleKey, type MonthlyBill } from './teamAccountData';
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
  billYearGroups,
  yearMenuItems,
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
  exportTx,
  openTx,
  setYear,
  goFirstPage,
  goPrevPage,
  goNextPage,
  goLastPage,
  onManyPageItemClick,
  isManyPageSelected,
  onSettingsJump,
  loadEarlier,
  openAlert,
  openBillSetting,
  openStatement,
  openSend,
  pagedTx,
  billListTitle,
  billListTitleCompact,
  timeSortOrder,
  amountSortOrder,
  onTimeSort,
  onAmountSort,
} = useTeamAccountPage();

const billToolbarTzLabel = computed(
  () => `${ui('Financial Time Zone')}: ${state.statementTz}`,
);

function onYearSelect(label: string, close: () => void) {
  setYear(Number(label));
  close();
}

function onTxRowClick(row: DataListItem) {
  const tx = pagedTx.value.find((item) => item.id === String(row.id));
  if (tx) openTx(tx);
}

function onBillOpen(bill: MonthlyBill) {
  openStatement(bill);
}

function onBillSendClick(bill: MonthlyBill) {
  openSend(bill);
}

const billPanelRef = ref<HTMLElement | null>(null);
const billTitleCompact = ref(false);
const billToolbarTitle = computed(() =>
  ui(billTitleCompact.value ? 'Monthly...' : 'Monthly Statement'),
);

let billToolbarResizeObserver: ResizeObserver | undefined;

function queryBillToolbarEls() {
  const panel = billPanelRef.value;
  const toolbar = panel?.querySelector('.eds-tool-bar');
  if (!toolbar) return { titleRow: null, titleEl: null, yearEl: null };
  return {
    titleRow: toolbar.querySelector<HTMLElement>('.eds-tool-bar-title'),
    titleEl: toolbar.querySelector<HTMLElement>('.eds-tool-bar-title p'),
    yearEl: toolbar.querySelector<HTMLElement>('.eds-flotation'),
  };
}

function measureFullBillTitleWidth(sample: HTMLElement) {
  const cs = getComputedStyle(sample);
  const probe = document.createElement('span');
  probe.textContent = ui('Monthly Statement');
  probe.style.cssText = [
    'position:absolute',
    'visibility:hidden',
    'white-space:nowrap',
    `font:${cs.font}`,
    `letter-spacing:${cs.letterSpacing}`,
  ].join(';');
  document.body.appendChild(probe);
  const width = probe.getBoundingClientRect().width;
  probe.remove();
  return width;
}

function updateBillToolbarTitleCompact() {
  const { titleRow, titleEl, yearEl } = queryBillToolbarEls();
  if (!titleRow || !titleEl || !yearEl) return;
  const titleBox = titleRow.getBoundingClientRect();
  const yearBox = yearEl.getBoundingClientRect();
  const gap = 8;
  const available = yearBox.left - titleBox.left - gap;
  if (available <= 0) {
    billTitleCompact.value = true;
    return;
  }
  billTitleCompact.value = measureFullBillTitleWidth(titleEl) >= available;
}

function scheduleBillToolbarTitleCompact() {
  void nextTick(() => {
    requestAnimationFrame(updateBillToolbarTitleCompact);
  });
}

onMounted(() => {
  scheduleBillToolbarTitleCompact();
  const panel = billPanelRef.value;
  if (panel && typeof ResizeObserver !== 'undefined') {
    billToolbarResizeObserver = new ResizeObserver(() => {
      updateBillToolbarTitleCompact();
    });
    billToolbarResizeObserver.observe(panel);
  }
  window.addEventListener('resize', updateBillToolbarTitleCompact);
});

onBeforeUnmount(() => {
  billToolbarResizeObserver?.disconnect();
  billToolbarResizeObserver = undefined;
  window.removeEventListener('resize', updateBillToolbarTitleCompact);
});

watch(locale, scheduleBillToolbarTitleCompact);
watch(billToolbarTitle, scheduleBillToolbarTitleCompact);
</script>

<template>
  <section :class="styles.page">
    <header :class="styles.hero">
      <div>
        <p :class="styles.heroLabel">{{ ui('Available Balance (USD)') }}</p>
        <p :class="styles.heroAmount">{{ availableBalance }}</p>
      </div>
      <div :class="styles.heroActions">
        <EgButton tone="brand" variant="outline" size="md" @click="openAlert">
          <template #icon>
            <EgIcon name="eds-notice" fit />
          </template>
          {{ ui('Balance Alert') }}
        </EgButton>
        <EgButton tone="brand" variant="solid" size="md" @click="state.rechargeOpen = true">
          <template #icon>
            <EgIcon name="eds-recharge-money" fit />
          </template>
          {{ ui('Recharge') }}
        </EgButton>
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

    <div :class="styles.panels">
      <section :class="[styles.panel, styles.txPanel]">
        <EgLayout type="empty" show-toolbar show-paginer :class="styles.panelLayout">
          <template #toolbar>
            <EgToolBar
              :title="ui('Transaction Details')"
              show-divider
            >
              <template #functional>
                <TasksToolbarFilter
                  v-model="filterConditions"
                  v-model:logic-mode="filterLogicMode"
                  :fields="filterFields"
                  :operators="TEAM_ACCOUNT_FILTER_OPERATORS"
                />
                <EgIconButtonPro :label="ui('Export')" @click="exportTx">
                  <EgIcon name="eds-arrow-download" size="sm" />
                </EgIconButtonPro>
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
                  min-width="168px"
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
                      <EgDivider type="navigator" direction="vertical" />
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
                    <div :class="styles.comboCell">
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
                      <span :class="styles.comboSecondary">{{ String(data.time) }}</span>
                    </div>
                  </template>
                </EgDataListColumn>
                <EgDataListColumn
                  prop="amount"
                  :label="ui('Amount')"
                  min-width="180px"
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
      </section>

      <section ref="billPanelRef" :class="styles.panel">
        <EgLayout type="empty" show-toolbar :class="styles.panelLayout">
          <template #toolbar>
            <EgToolBar show-divider :title="billToolbarTitle">
              <template #functional>
                <EgFlotation
                  trigger="click"
                  placement="bottom"
                  align="end"
                  :show-add="false"
                  :show-menu-divider="false"
                  boundary-selector=".app-preview"
                  flip
                  close-on-scroll
                >
                  <template #trigger="{ expanded }">
                    <EgFlotationTrigger
                      trigger-style="outline"
                      size="sm"
                      width-mode="adaptive"
                      :label="String(state.billYear)"
                      :expanded="expanded"
                    />
                  </template>
                  <template #content="{ close }">
                    <EgFlotationMenu
                      height-mode="adaptive"
                      width-mode="adaptive"
                      :scrollable="false"
                      :show-add="false"
                      :show-divider="false"
                    >
                      <EgFlotationMenuItem
                        v-for="item in yearMenuItems"
                        :key="item.label"
                        box-type="text"
                        :label="item.label"
                        :show-tag="false"
                        :focused="item.focused"
                        @click="onYearSelect(item.label, close)"
                      />
                    </EgFlotationMenu>
                  </template>
                </EgFlotation>
                <EgIconButtonPro :label="ui('Settings')" @click="openBillSetting">
                  <EgIcon name="eds-gear" size="sm" />
                </EgIconButtonPro>
              </template>
            </EgToolBar>
          </template>
          <div :class="styles.listRegion">
            <div :class="[styles.listFill, styles.billListFill]">
              <div :class="styles.billChromeSpacer" aria-hidden="true" />
              <section
                v-for="group in billYearGroups"
                :key="group.year"
                :class="styles.yearGroup"
              >
                <div
                  :class="styles.yearBar"
                  :style="{ height: `${DATA_LIST_FIGMA_HEADER_HEIGHT}px` }"
                >
                  <span :class="styles.yearBarYear">{{ group.year }}</span>
                  <span :class="styles.yearBarTz">
                    <EgListFieldOverflowText
                      :text="billToolbarTzLabel"
                      size="small"
                      variant="secondary"
                      boundary-selector=".app-preview"
                    />
                  </span>
                </div>
                <div
                  v-for="bill in group.bills"
                  :key="bill.id"
                  :class="[styles.billRow, 'motion-ease', 'is-hover']"
                  :style="{ minHeight: `${DATA_LIST_COLUMN_HEIGHT}px` }"
                >
                  <button
                    :class="styles.billMain"
                    type="button"
                    @click="onBillOpen(bill)"
                  >
                    <span :class="styles.billTitle">
                      <span :class="styles.billTextFull">
                        <EgListFieldOverflowText
                          :text="billListTitle(bill)"
                          size="small"
                          boundary-selector=".app-preview"
                        />
                      </span>
                      <span :class="styles.billTextCompact">
                        <EgListFieldOverflowText
                          :text="billListTitle(bill)"
                          :display-text="billListTitleCompact(bill)"
                          size="small"
                          boundary-selector=".app-preview"
                        />
                      </span>
                    </span>
                  </button>
                  <div :class="styles.billActions">
                    <EgIconButton
                      size="sm"
                      :label="ui('Download')"
                      @click.stop="onBillOpen(bill)"
                    >
                      <EgIcon name="eds-arrow-download" fit />
                    </EgIconButton>
                    <EgIconButton
                      size="sm"
                      :label="ui('Send Statements')"
                      @click.stop="onBillSendClick(bill)"
                    >
                      <EgIcon name="eds-share" fit />
                    </EgIconButton>
                  </div>
                </div>
              </section>
              <button
                v-if="state.billYear === 2026 && !state.billsExpanded"
                :class="styles.earlier"
                type="button"
                @click="loadEarlier"
              >
                {{ ui('Load More') }}
              </button>
              <p v-else :class="styles.endNote">
                {{ ui('All historical statements have been exported') }}
              </p>
            </div>
          </div>
        </EgLayout>
      </section>
    </div>
  </section>

  <Teleport to=".app-preview">
    <div v-if="state.toast" :class="styles.toastHost">
      <EgToast type="result" :text="state.toast" />
    </div>
  </Teleport>
</template>
