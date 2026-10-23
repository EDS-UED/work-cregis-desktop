<script setup lang="ts">
import { computed, ref, toRef, watch } from 'vue';
import {
  EgCryptoAddressTags,
  EgDataList,
  EgDataListCellOverflow,
  EgDataListColumn,
  EgIcon,
  EgIconProButton,
  EgLayout,
  EgListFieldOverflowText,
  EgPaginer,
  EgPaginationGroupButton,
  EgPopup,
  EgToolBar,
  type DataListItem,
} from '@eds/desktop-components';
import DataListHeaderSortTrigger from '../DataListHeaderSortTrigger.vue';
import { parseAmountSortValue, type TasksDataListSortOrder } from '../tasksDataListSort';
import pageStyles from '../TasksDataListPage.module.css';
import { showAppEndFeedbackAfterOverlay } from '@/composables/appEndFeedback';
import { useAppI18n } from '@/composables/useAppI18n';
import {
  buildCurrencyAddressTags,
  currencyAddressDangerTagOverrides,
  currencyTagShowKey,
  localizeCurrencyAddressTags,
} from '../list-field/listFieldCurrencyTagCustomize';
import { currencyAddressTagsEnabledKey } from '../list-field/listFieldCurrencyShared';
import { formatEmptyDisplayValue } from '@/utils/formatEmptyDisplay';
import { formatGroupedNumber } from '@/utils/formatGroupedDisplay';
import { useDataListPaginer } from '../useDataListPaginer';
import {
  DATA_LIST_FIGMA_HEADER_HEIGHT,
  DATA_LIST_FIGMA_PAGE_SIZE_OPTIONS,
  DATA_LIST_FIGMA_PAGINER,
} from '../tasksDataListPageData';
import SigningBatchPopupSlotChrome from '../signing/batch/SigningBatchPopupSlotChrome.vue';
import { usePopupShellLifecycle } from './usePopupShellLifecycle';
import {
  buildTaskAddressDetailsOrderRows,
  type TaskAddressDetailsSide,
} from './buildTaskAddressDetailsOrderRows';
import {
  TASK_ADDRESS_DETAILS_ADDRESS_COLUMN_MIN_WIDTH,
  TASK_ADDRESS_DETAILS_AMOUNT_COLUMN_MIN_WIDTH,
  TASK_ADDRESS_DETAILS_MEMO_COLUMN_MIN_WIDTH,
  TASK_ADDRESS_DETAILS_POPUP_HEIGHT,
  TASK_ADDRESS_DETAILS_POPUP_WIDTH,
  TASK_ADDRESS_DETAILS_REMARK_COLUMN_MIN_WIDTH,
} from './taskAddressDetailsPopup.constants';
import styles from './TaskAddressDetailsPopup.module.css';
import batchStyles from '../signing/batch/batchSigning.shared.module.css';

const props = defineProps<{
  open: boolean;
  shellSuspended?: boolean;
  side: TaskAddressDetailsSide | null;
  detail: {
    senders: Array<{ alias?: string; address: string; amount?: string; memo?: string }>;
    receivers: Array<{ alias?: string; address: string; amount?: string; memo?: string }>;
    senderOrderCount?: number;
    receiverOrderCount?: number;
    amountCryptoSymbol?: string;
  } | null;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
  closed: [];
}>();

const { ui } = useAppI18n();

const { popupMounted, popupOpen, onPopupClosed } = usePopupShellLifecycle({
  open: toRef(props, 'open'),
  suspended: toRef(props, 'shellSuspended'),
  onClosed: () => {
    emit('update:open', false);
    emit('closed');
  },
});

const allRows = computed(() => {
  if (!props.detail || !props.side) return [];
  return buildTaskAddressDetailsOrderRows(props.detail, props.side);
});

const amountSortOrder = ref<TasksDataListSortOrder | ''>('');

const sortedAllRows = computed(() => {
  const rows = allRows.value;
  const order = amountSortOrder.value;
  if (!order) return rows;

  const direction = order === 'asc' ? 1 : -1;
  return [...rows].sort((rowA, rowB) => {
    const cmp = parseAmountSortValue(rowA.amount) - parseAmountSortValue(rowB.amount);
    if (cmp !== 0) return cmp * direction;
    return rowA.id.localeCompare(rowB.id);
  });
});

const {
  settingsLevelIndex,
  settingsJumpValue,
  totalRowCount,
  paginateItems,
  isManyPagination,
  manyPageItems,
  firstPagination,
  prevPagination,
  pagePagination,
  nextPagination,
  lastPagination,
  prevNavDisabled,
  nextNavDisabled,
  goFirstPage,
  goPrevPage,
  goNextPage,
  goLastPage,
  onManyPageItemClick,
  isManyPageSelected,
  onSettingsJump,
  currentPage,
} = useDataListPaginer(() => sortedAllRows.value.length);

const paginatedRows = computed(() => paginateItems(sortedAllRows.value));

function onAmountSortChange(order: TasksDataListSortOrder | null) {
  amountSortOrder.value = order ?? '';
  goFirstPage();
}

const addressDangerTagCustomize = {
  [currencyAddressTagsEnabledKey('to', 1)]: true,
  [currencyTagShowKey('to', 1, 'custom')]: false,
  ...currencyAddressDangerTagOverrides('to', 1, 1, true),
};
const addressDangerTags = computed(() =>
  localizeCurrencyAddressTags(
    buildCurrencyAddressTags('to', 1, addressDangerTagCustomize),
    ui,
  ),
);

const dataList = computed<DataListItem[]>(() =>
  paginatedRows.value.map((row) => ({
    id: row.id,
    address: row.address,
    amount: row.amount,
    memo: row.memo,
    remark: row.remark,
    showAddressDangerTag: row.showAddressDangerTag,
  })),
);

watch(
  () => props.open,
  (open) => {
    if (open) {
      settingsLevelIndex.value = 0;
      settingsJumpValue.value = '';
      amountSortOrder.value = '';
    }
  },
);

function rowFromData(data: DataListItem) {
  return {
    address: String(data.address ?? ''),
    amount: String(data.amount ?? ''),
    memo: String(data.memo ?? ''),
    remark: String(data.remark ?? ''),
    showAddressDangerTag: Boolean(data.showAddressDangerTag),
  };
}

function onExport() {
  showAppEndFeedbackAfterOverlay('Success');
}

function displayRemark(raw: string): string {
  const key = raw.trim();
  if (!key) return formatEmptyDisplayValue('');
  if (key === 'Task address details sample remark') {
    return ui(key);
  }
  return key;
}

function onClose() {
  popupOpen.value = false;
}

const displayPaginerTotal = computed(() => ui(DATA_LIST_FIGMA_PAGINER.dataVolumeTotal));
const displayPaginerResults = computed(() => ui(DATA_LIST_FIGMA_PAGINER.dataVolumeResults));
</script>

<template>
  <EgPopup
    v-if="popupMounted"
    v-model:open="popupOpen"
    uses="custom"
    custom-box-size-preset="custom"
    :box-width="TASK_ADDRESS_DETAILS_POPUP_WIDTH"
    :box-height="TASK_ADDRESS_DETAILS_POPUP_HEIGHT"
    @close="onPopupClosed"
  >
    <SigningBatchPopupSlotChrome
      :class="styles.root"
      content-fill
      content-inset-preset="xs"
      :show-toolbar="false"
      @close="onClose"
    >
      <div :class="batchStyles.batchPopupSubPage">
      <EgLayout type="empty" show-toolbar show-paginer :class="styles.layout">
        <template #toolbar>
          <EgToolBar
            :title="ui('Address Details')"
            :show-back="false"
            :show-operation="true"
            :show-divider="true"
          >
            <template #functional>
              <EgIconProButton :label="ui('Export')" @click="onExport">
                <EgIcon name="eds-arrow-download" size="sm" />
              </EgIconProButton>
            </template>
          </EgToolBar>
        </template>

        <div
          :class="[
            batchStyles.batchDetailDataList,
            batchStyles.batchDetailDataListFill,
            styles.listRegion,
          ]"
        >
          <EgDataList
            :data-list="dataList"
            :header-height="DATA_LIST_FIGMA_HEADER_HEIGHT"
            :column-height="40"
          >
            <EgDataListColumn
              prop="address"
              :label="ui('Address')"
              :min-width="TASK_ADDRESS_DETAILS_ADDRESS_COLUMN_MIN_WIDTH"
              flex-grow
              align="left"
              :sortable="false"
            >
              <template #default="{ data }">
                <div :class="styles.addressCell">
                  <EgListFieldOverflowText
                    :text="rowFromData(data).address"
                    variant="primary"
                  />
                  <EgCryptoAddressTags
                    v-if="rowFromData(data).showAddressDangerTag"
                    :tags="addressDangerTags"
                  />
                </div>
              </template>
            </EgDataListColumn>

            <EgDataListColumn
              prop="amount"
              :label="ui('Amount')"
              :min-width="TASK_ADDRESS_DETAILS_AMOUNT_COLUMN_MIN_WIDTH"
              align="left"
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
                      boundary-selector=".app-preview"
                      @sort-change="onAmountSortChange"
                    />
                  </div>
                </div>
              </template>
              <template #default="{ data }">
                <EgListFieldOverflowText
                  :text="rowFromData(data).amount"
                  variant="primary"
                  tabular
                />
              </template>
            </EgDataListColumn>

            <EgDataListColumn
              prop="memo"
              :label="ui('Memo')"
              :min-width="TASK_ADDRESS_DETAILS_MEMO_COLUMN_MIN_WIDTH"
              align="left"
              :sortable="false"
            >
              <template #default="{ data }">
                <EgListFieldOverflowText
                  :text="formatEmptyDisplayValue(rowFromData(data).memo)"
                  variant="primary"
                />
              </template>
            </EgDataListColumn>

            <EgDataListColumn
              prop="remark"
              :label="ui('Remark')"
              :min-width="TASK_ADDRESS_DETAILS_REMARK_COLUMN_MIN_WIDTH"
              align="right"
              :sortable="false"
            >
              <template #default="{ data }">
                <div :class="styles.cellAlignEnd">
                  <EgListFieldOverflowText
                    :text="displayRemark(rowFromData(data).remark)"
                    variant="primary"
                  />
                </div>
              </template>
            </EgDataListColumn>
          </EgDataList>
        </div>

        <template #paginer>
          <EgPaginer
            v-model:settings-level-index="settingsLevelIndex"
            v-model:settings-jump-value="settingsJumpValue"
            :class="batchStyles.batchPopupPaginerBar"
            :show-statistics="false"
            :data-volume-total="displayPaginerTotal"
            :data-volume-count="formatGroupedNumber(totalRowCount)"
            :data-volume-results="displayPaginerResults"
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
                :interactive="item.kind !== 'ellipsis'"
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
              <EgIcon name="eds-arrow-go-next" fit />
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
    </SigningBatchPopupSlotChrome>
  </EgPopup>
</template>
