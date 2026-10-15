<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type CSSProperties } from 'vue';
import {
  EgDataList,
  EgDataListCellOverflow,
  EgDataListColumn,
  EgDivider,
  EgIcon,
  EgIconProButton,
  EgInput,
  EgLayout,
  EgListFieldHashLikeLine,
  EgListFieldOverflowText,
  EgPaginer,
  EgPaginationGroupButton,
  EgSegmented,
  EgTag,
  EgToast,
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
import TasksListFieldCurrency from '@/scenes/tasks/list-field/TasksListFieldCurrency.vue';
import TasksListFieldGeneralStructure from '@/scenes/tasks/list-field/TasksListFieldGeneralStructure.vue';
import TasksListFieldTime from '@/scenes/tasks/list-field/TasksListFieldTime.vue';
import { truncateAddressMiddle } from '@/scenes/tasks/list-field/listFieldAddressLineModel';
import pageStyles from '@/scenes/tasks/TasksDataListPage.module.css';
import DataListHeaderTimezoneTrigger from './list-field/DataListHeaderTimezoneTrigger.vue';
import TransactionRecordsWalletColumnHeader from './list-field/TransactionRecordsWalletColumnHeader.vue';
import {
  TRANSACTION_RECORDS_DEFAULT_TIMEZONE,
  type TransactionRecordsTimezoneOffset,
} from './list-field/transactionRecordsTimezoneOffsets';
import {
  buildReportAddressColumnModel,
  buildReportAmountCustomize,
  buildReportCurrencyCustomize,
  buildReportTimeCustomize,
  buildReportTokenCustomize,
  buildReportWalletCustomize,
} from './reportListFieldCustomize';
import type { TransactionRecordRow } from './transactionRecordTypes';
import {
  TRANSACTION_RECORD_ADDRESS_COLUMN_MIN_WIDTH,
  TRANSACTION_RECORD_ADDRESS_COLUMN_WIDTH,
  TRANSACTION_RECORD_AMOUNT_COLUMN_MIN_WIDTH,
  TRANSACTION_RECORD_CURRENCY_ADDRESS_COLUMN_MIN_WIDTH,
  TRANSACTION_RECORD_DIRECTION_COLUMN_MIN_WIDTH,
  TRANSACTION_RECORD_HASH_COLUMN_MIN_WIDTH,
  TRANSACTION_RECORD_TIME_COLUMN_ADDRESS_MIN_WIDTH,
  TRANSACTION_RECORD_TIME_COLUMN_ADDRESS_WIDTH,
  TRANSACTION_RECORD_TIME_COLUMN_MIN_WIDTH,
  TRANSACTION_RECORD_TIME_COLUMN_WIDTH,
  TRANSACTION_RECORD_TOKEN_COLUMN_MIN_WIDTH,
  TRANSACTION_RECORD_TYPE_COLUMN_MIN_WIDTH,
  TRANSACTION_RECORD_WALLET_COLUMN_MIN_WIDTH,
} from './transactionRecordColumnLayout';
import {
  TRANSACTION_RECORDS_COLUMN_HEIGHT,
  TRANSACTION_RECORDS_HEADER_HEIGHT,
  useTransactionRecordsDataListPage,
} from './useTransactionRecordsDataListPage';
import { buildTransactionRecordsFilterRowSnapshot } from './filter/buildTransactionRecordsFilterRowSnapshot';
import {
  resolveTransactionRecordsFilterFieldIds,
  type TransactionRecordsFilterViewMode,
} from './filter/transactionRecordsFilterFieldLabelKeys';
import {
  TRANSACTION_RECORDS_FILTER_OPERATORS,
  buildTransactionRecordsFilterFields,
} from './filter/transactionRecordsFilterFields';
import TransactionRecordsExportFlotation from './export/TransactionRecordsExportFlotation.vue';
import type { TransactionRecordsExportScope } from './export/transactionRecordsExportData';
import TransactionRecordsDisplayFlotation from './TransactionRecordsDisplayFlotation.vue';
import { isSmallTransactionRecord } from './isSmallTransactionRecord';
import { registerTransactionRecordDetailFlow } from './transactionRecordDetailFlowContext';
import { registerTransactionRecordsDataListShellApi } from './transactionRecordsDataListShellApi';
import {
  TRANSACTION_RECORDS_DEMO_TOTAL,
  buildTransactionRecordRow,
  resolveDirectionLabelForPerspectiveAddress,
} from './transactionRecordData';
import {
  buildTransactionRecordAddressSuggestions,
  type TransactionRecordAddressSuggestion,
} from './buildTransactionRecordAddressSuggestions';
import { useTransactionRecordDetailFlow } from './useTransactionRecordDetailFlow';
import styles from './TransactionRecordsDataListPage.module.css';

const { ui } = useAppI18n();

const selected = ref(0);
const value = ref('');
/** View by Address: list stays empty until user picks a suggestion. */
const committedAddress = ref('');
const addressInputFocused = ref(false);
const addressInputWrapRef = ref<HTMLElement | null>(null);
const addressInputRef = ref<{ focus?: () => void } | null>(null);
const addressSuggestPanelStyle = ref<CSSProperties>({});
const transactionTimeTimezone = ref<TransactionRecordsTimezoneOffset>(
  TRANSACTION_RECORDS_DEFAULT_TIMEZONE,
);

/** Top-center black toast (same EgToast result pattern as Team Account / Team Security). */
const listToastText = ref('');
let listToastTimer: ReturnType<typeof setTimeout> | undefined;

const isSpecificAddressMode = computed(() => selected.value === 1);
const isWalletView = computed(() => !isSpecificAddressMode.value);

const reportFilterViewMode = computed((): TransactionRecordsFilterViewMode =>
  isSpecificAddressMode.value ? 'address' : 'wallet',
);

/** Wallet: Time → Currency|Address → Hash → Wallet → Type → Direction → Amount
 *  Address: Time → Interaction Address → Token → Hash → Type → Direction → Amount */
const columnDisplayOrder = computed(() =>
  isWalletView.value
    ? {
        time: 1,
        currencyAddress: 2,
        hash: 3,
        wallet: 4,
        type: 5,
        direction: 6,
        amount: 7,
        address: 0,
        token: 0,
      }
    : {
        time: 1,
        address: 2,
        token: 3,
        hash: 4,
        type: 5,
        direction: 6,
        amount: 7,
        wallet: 0,
        currencyAddress: 0,
      },
);

const reportViewSegmentLabels = computed(() => [
  ui('View by Wallet'),
  ui('View by Address'),
]);

const filterConditions = ref<EgFilterCondition[]>([]);
const filterLogicMode = ref<EgFilterLogicMode>('all');
const hideSmallTransactions = ref(false);

const filterSourceRowCount = resolveDataListFilterSourceRowCount(
  false,
  TRANSACTION_RECORDS_DEMO_TOTAL,
);

const filterFields = computed((): EgFilterField[] =>
  buildTransactionRecordsFilterFields(
    (key) => ui(key),
    filterSourceRowCount,
    reportFilterViewMode.value,
  ),
);

const filteredIndices = computed(() => {
  const allIndices = Array.from({ length: TRANSACTION_RECORDS_DEMO_TOTAL }, (_, index) => index);
  const committed = committedAddress.value.trim().toLowerCase();

  // View by Address: empty until a suggestion is selected (not while only typing).
  let addressScopedIndices = allIndices;
  if (isSpecificAddressMode.value) {
    if (!committed) {
      addressScopedIndices = [];
    } else {
      addressScopedIndices = allIndices.filter((rowIndex) => {
        const row = buildTransactionRecordRow(rowIndex);
        return (
          row.fromAddress.toLowerCase() === committed
          || row.toAddress.toLowerCase() === committed
        );
      });
    }
  }

  let nextIndices = addressScopedIndices;

  if (hasActiveEgFilterConditions(filterConditions.value)) {
    const conditions = filterConditions.value;
    const fields = filterFields.value;
    const logicMode = filterLogicMode.value;

    nextIndices = addressScopedIndices.filter((rowIndex) => {
      try {
        const row = buildTransactionRecordRow(rowIndex);
        return applyEgFilterConditions({
          snapshot: buildTransactionRecordsFilterRowSnapshot(row, {
            perspectiveAddress: isSpecificAddressMode.value
              ? committedAddress.value
              : undefined,
          }),
          conditions,
          fields,
          logicMode,
        });
      } catch {
        return true;
      }
    });
  }

  if (hideSmallTransactions.value) {
    nextIndices = nextIndices.filter(
      (rowIndex) => !isSmallTransactionRecord(buildTransactionRecordRow(rowIndex)),
    );
  }

  return nextIndices;
});

const filterBadge = computed(
  () => filterConditions.value.filter(isActiveEgFilterCondition).length,
);

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
} = useTransactionRecordsDataListPage({
  sourceIndices: filteredIndices,
  filterBadge,
});

watch(filterConditions, () => {
  if (hasActiveEgFilterConditions(filterConditions.value)) {
    goFirstPage();
  }
}, { deep: true });

watch(reportFilterViewMode, (viewMode) => {
  const allowedFieldIds = new Set<string>(
    resolveTransactionRecordsFilterFieldIds(viewMode),
  );
  filterConditions.value = filterConditions.value.filter((condition) =>
    allowedFieldIds.has(condition.fieldId),
  );
  goFirstPage();
});

watch(value, () => {
  goFirstPage();
});

watch(hideSmallTransactions, () => {
  goFirstPage();
});

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

function showListToast(messageKey: string) {
  const message = ui(messageKey);
  listToastText.value = message;
  if (listToastTimer !== undefined) clearTimeout(listToastTimer);
  listToastTimer = window.setTimeout(() => {
    if (listToastText.value === message) listToastText.value = '';
    listToastTimer = undefined;
  }, 2200);
}

function focusAddressInput() {
  void nextTick(() => {
    addressInputRef.value?.focus?.();
    const native = addressInputWrapRef.value?.querySelector('input');
    native?.focus();
    addressInputFocused.value = true;
  });
}

const blockExportOpen = computed(
  () => isSpecificAddressMode.value && !value.value.trim(),
);

/** View by Address: block export until the address field has a value; toast + focus input. */
function onExportOpenBlocked() {
  showListToast('Please input address first');
  focusAddressInput();
}

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
      showListToast(message);
    },
  });
  window.addEventListener('resize', updateAddressSuggestPanelPosition);
});

onBeforeUnmount(() => {
  registerTransactionRecordDetailFlow(null);
  registerTransactionRecordsDataListShellApi(null);
  window.removeEventListener('resize', updateAddressSuggestPanelPosition);
  if (listToastTimer !== undefined) clearTimeout(listToastTimer);
});

function recordRow(data: DataListItem): TransactionRecordRow {
  return data as TransactionRecordRow;
}

/** View by Address：收支类型以搜索地址为视角；钱包视图沿用行默认标签。 */
function directionLabelForRow(row: TransactionRecordRow): string {
  return resolveDirectionLabelForPerspectiveAddress(
    row,
    isSpecificAddressMode.value ? committedAddress.value : undefined,
  );
}

function onRowClick(data: DataListItem) {
  detailFlow.openDetailForRow(recordRow(data), 'summary', {
    fromWalletView: isWalletView.value,
  });
}

const displayToolbarActionButtons = computed(() =>
  toolbarActionButtons.value.filter(
    (button) => button.key !== 'filter' && button.key !== 'export',
  ),
);

const hasActiveFilters = computed(() =>
  hasActiveEgFilterConditions(filterConditions.value),
);

function onExportConfirm(payload: {
  scope: TransactionRecordsExportScope;
  dateRange: string;
  presetId: string;
}) {
  void payload;
}

const addressSuggestions = computed(() => {
  if (!isSpecificAddressMode.value) return [];
  return buildTransactionRecordAddressSuggestions(value.value);
});

const showAddressSuggestions = computed(() => {
  if (!isSpecificAddressMode.value || !addressInputFocused.value) return false;
  const query = value.value.trim();
  if (!query) return false;
  const list = addressSuggestions.value;
  if (list.length === 0) return false;
  if (
    list.length === 1
    && list[0]!.address.toLowerCase() === query.toLowerCase()
  ) {
    return false;
  }
  return true;
});

function updateAddressSuggestPanelPosition() {
  const wrap = addressInputWrapRef.value;
  const preview = document.querySelector('.app-preview') as HTMLElement | null;
  if (!wrap || !preview) return;

  const wrapRect = wrap.getBoundingClientRect();
  const previewRect = preview.getBoundingClientRect();
  if (wrapRect.width <= 0 || wrapRect.height <= 0) return;

  const styles = getComputedStyle(wrap);
  const gapPx = Number.parseFloat(styles.getPropertyValue('--spacing-025').trim()) || 2;
  const scale40 = Number.parseFloat(styles.getPropertyValue('--scale-40').trim()) || 160;
  // Wider than the input so full addresses read more comfortably (~1.5× / scale-40×3).
  const panelWidth = Math.round(Math.max(wrapRect.width * 1.5, scale40 * 3));

  addressSuggestPanelStyle.value = {
    position: 'absolute',
    top: `${Math.round(wrapRect.bottom - previewRect.top + gapPx)}px`,
    left: `${Math.round(wrapRect.left - previewRect.left)}px`,
    width: `${panelWidth}px`,
    zIndex: 1100,
  };
}

function onAddressInputFocusIn() {
  addressInputFocused.value = true;
  void nextTick(() => updateAddressSuggestPanelPosition());
}

function onAddressInputFocusOut() {
  // Delay so mousedown on a teleported suggestion can run before focus leaves.
  window.setTimeout(() => {
    addressInputFocused.value = false;
  }, 120);
}

function resolveAddressSuggestionLabel(item: TransactionRecordAddressSuggestion): string {
  return item.alias.trim() || ui('Unnamed Address');
}

/** View by Address：交互地址与 TxID 同用 body-medium（OverflowText primary）。 */
function interactionAddressOverflow(row: TransactionRecordRow): {
  text: string;
  displayText: string;
} {
  const model = buildReportAddressColumnModel(row, {
    hideSelectedAddress: committedAddress.value,
  });
  const sides: Array<{ full: string; display: string }> = [];
  if (model.showFrom) {
    const alias = model.fromAlias?.trim();
    sides.push({
      full: alias ? `${alias} ${model.fromAddress}` : model.fromAddress,
      display: alias || truncateAddressMiddle(model.fromAddress),
    });
  }
  if (model.showTo) {
    const alias = model.toAlias?.trim();
    sides.push({
      full: alias ? `${alias} ${model.toAddress}` : model.toAddress,
      display: alias || truncateAddressMiddle(model.toAddress),
    });
  }
  if (sides.length === 0) {
    return { text: '', displayText: '' };
  }
  return {
    text: sides.map((side) => side.full).join(' → '),
    displayText: sides.map((side) => side.display).join(' → '),
  };
}

function onSelectAddressSuggestion(item: TransactionRecordAddressSuggestion) {
  committedAddress.value = item.address;
  value.value = item.address;
  addressInputFocused.value = false;
}

watch(value, (next) => {
  const wrap = addressInputWrapRef.value;
  if (wrap && wrap.contains(document.activeElement)) {
    addressInputFocused.value = true;
  }
  // Editing away from the committed suggestion clears list results.
  if (next.trim() !== committedAddress.value.trim()) {
    committedAddress.value = '';
  }
});

watch(
  [showAddressSuggestions, addressSuggestions, value],
  async () => {
    if (!showAddressSuggestions.value) return;
    await nextTick();
    updateAddressSuggestPanelPosition();
    requestAnimationFrame(() => updateAddressSuggestPanelPosition());
  },
);

watch(isSpecificAddressMode, (on) => {
  if (!on) {
    addressInputFocused.value = false;
    committedAddress.value = '';
    value.value = '';
  }
});
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
          <template #title>
            <span :class="styles.toolbarTitleWithSegmented">
              {{ ui('Report') }}
              <EgSegmented
                v-model="selected"
                :labels="reportViewSegmentLabels"
              />
              <div
                v-if="isSpecificAddressMode"
                ref="addressInputWrapRef"
                :class="styles.addressInputWrap"
                @focusin="onAddressInputFocusIn"
                @focusout="onAddressInputFocusOut"
              >
                <EgInput
                  ref="addressInputRef"
                  v-model="value"
                  size="sm"
                  width-mode="full"
                  :overflow-feedback="false"
                  :placeholder="ui('Input Address')"
                />
              </div>
              <Teleport to=".app-preview">
                <div
                  v-if="showAddressSuggestions"
                  :class="[styles.addressSuggestPanel, 'desktopTokens']"
                  data-no-corner-smoothing
                  role="listbox"
                  :style="addressSuggestPanelStyle"
                >
                  <button
                    v-for="item in addressSuggestions"
                    :key="item.address"
                    type="button"
                    :class="styles.addressSuggestItem"
                    role="option"
                    @mousedown.prevent="onSelectAddressSuggestion(item)"
                  >
                    <span :class="styles.addressSuggestAlias">
                      <EgTag family="system" system-type="solid-brand" size="sm" truncate>
                        {{ resolveAddressSuggestionLabel(item) }}
                      </EgTag>
                    </span>
                    <span :class="styles.addressSuggestAddress">
                      <EgListFieldOverflowText :text="item.address" />
                    </span>
                  </button>
                </div>
              </Teleport>
            </span>
          </template>
          <template #functional>
            <TasksToolbarFilter
              v-model="filterConditions"
              v-model:logic-mode="filterLogicMode"
              :fields="filterFields"
              :operators="TRANSACTION_RECORDS_FILTER_OPERATORS"
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
            <TransactionRecordsExportFlotation
              :has-active-filters="hasActiveFilters"
              :block-open="blockExportOpen"
              @open-blocked="onExportOpenBlocked"
              @export="onExportConfirm"
            />
            <TransactionRecordsDisplayFlotation
              v-model:hide-small-transactions="hideSmallTransactions"
            />
          </template>
        </EgToolBar>
      </template>

      <div :class="styles.listRegion">
        <EgDataList
          :key="isWalletView ? 'report-wallet' : 'report-address'"
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
            :min-width="
              isWalletView
                ? TRANSACTION_RECORD_TIME_COLUMN_MIN_WIDTH
                : TRANSACTION_RECORD_TIME_COLUMN_ADDRESS_MIN_WIDTH
            "
            :width="
              isWalletView
                ? TRANSACTION_RECORD_TIME_COLUMN_WIDTH
                : TRANSACTION_RECORD_TIME_COLUMN_ADDRESS_WIDTH
            "
            :display-order="columnDisplayOrder.time"
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
                  <DataListHeaderTimezoneTrigger
                    v-model="transactionTimeTimezone"
                    :disabled="Boolean(customize.loading)"
                  />
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
              <TasksListFieldTime
                :customize="buildReportTimeCustomize(recordRow(data), transactionTimeTimezone)"
              />
            </template>
          </EgDataListColumn>

          <!-- Wallet: 币种|地址 合并列（与拆列互斥，用 hidden 避免列槽错绑）。 -->
          <EgDataListColumn
            key="currency-address-combined"
            :hidden="!isWalletView"
            prop="currencyAddress"
            :label="ui('Currency')"
            :min-width="TRANSACTION_RECORD_CURRENCY_ADDRESS_COLUMN_MIN_WIDTH"
            align="left"
            :flex-grow="true"
            :display-order="columnDisplayOrder.currencyAddress"
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
                <TasksListFieldCurrency
                  :customize="buildReportCurrencyCustomize(recordRow(data), {
                    enableMultiTxAddressCount: true,
                  })"
                />
              </div>
            </template>
          </EgDataListColumn>

          <!-- Address 视图：交互地址（紧挨交易时间；与 TxID 同 body-medium）。 -->
          <EgDataListColumn
            key="interaction-address"
            :hidden="isWalletView"
            prop="interactionAddress"
            :label="ui('Interaction Address')"
            :min-width="TRANSACTION_RECORD_ADDRESS_COLUMN_MIN_WIDTH"
            :width="TRANSACTION_RECORD_ADDRESS_COLUMN_WIDTH"
            align="left"
            :display-order="columnDisplayOrder.address"
            :sortable="false"
          >
            <template #default="{ data }">
              <EgListFieldOverflowText
                v-bind="interactionAddressOverflow(recordRow(data))"
                variant="primary"
                tooltip-trigger="hover"
              />
            </template>
          </EgDataListColumn>

          <!-- Address 视图：币种（在交互地址后）。 -->
          <EgDataListColumn
            key="address-token"
            :hidden="isWalletView"
            prop="token"
            :label="ui('Token')"
            :min-width="TRANSACTION_RECORD_TOKEN_COLUMN_MIN_WIDTH"
            align="left"
            :display-order="columnDisplayOrder.token"
            :sortable="false"
          >
            <template #default="{ data }">
              <div :class="styles.tokenCell">
                <TasksListFieldCurrency
                  :customize="buildReportTokenCustomize(recordRow(data))"
                />
              </div>
            </template>
          </EgDataListColumn>

          <EgDataListColumn
            prop="txHash"
            :label="ui('Transaction hash')"
            :min-width="TRANSACTION_RECORD_HASH_COLUMN_MIN_WIDTH"
            align="left"
            :flex-grow="isSpecificAddressMode"
            :display-order="columnDisplayOrder.hash"
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

          <!-- 用 hidden 替代 v-if，避免 DataList 列槽错绑导致钱包视图丢失「收支类型」。 -->
          <EgDataListColumn
            key="affiliated-wallet"
            :hidden="!isWalletView"
            prop="walletName"
            :label="ui('Affiliated Wallet')"
            :min-width="TRANSACTION_RECORD_WALLET_COLUMN_MIN_WIDTH"
            :display-order="columnDisplayOrder.wallet"
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
            :display-order="columnDisplayOrder.type"
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
            :display-order="columnDisplayOrder.direction"
            align="left"
            :sortable="false"
          >
            <template #default="{ data }">
              <EgListFieldOverflowText
                :text="directionLabelForRow(recordRow(data))"
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
            :display-order="columnDisplayOrder.amount"
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

    <Teleport to=".app-preview">
      <Transition
        :enter-active-class="styles.toastFadeActive"
        :leave-active-class="styles.toastFadeActive"
        :enter-from-class="styles.toastFadeFrom"
        :leave-to-class="styles.toastFadeFrom"
      >
        <div v-if="listToastText" :class="styles.toastHost" data-report-list-toast>
          <EgToast type="result" :text="listToastText" />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
