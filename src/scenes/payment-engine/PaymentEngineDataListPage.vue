<script setup lang="ts">
import { computed } from 'vue';
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
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import DataListHeaderSortTrigger from '@/scenes/tasks/DataListHeaderSortTrigger.vue';
import TasksListFieldCurrency from '@/scenes/tasks/list-field/TasksListFieldCurrency.vue';
import { resolveCryptoNameFromSymbol } from '@/scenes/tasks/list-field/listFieldCryptoResolve';
import TasksListFieldStatus from '@/scenes/tasks/list-field/TasksListFieldStatus.vue';
import TasksListFieldTime from '@/scenes/tasks/list-field/TasksListFieldTime.vue';
import pageStyles from '@/scenes/tasks/TasksDataListPage.module.css';
import PaymentEngineListFieldAmount from './list-field/PaymentEngineListFieldAmount.vue';
import PaymentEngineListFieldMeta from './list-field/PaymentEngineListFieldMeta.vue';
import PaymentEngineListFieldOrderIds from './list-field/PaymentEngineListFieldOrderIds.vue';
import { buildPaymentEngineRecordRows } from './paymentEngineOrderRecordData';
import {
  resolvePaymentEngineRecordConfig,
  type PaymentEngineRecordColumnConfig,
  type PaymentEngineRecordRow,
} from './paymentEngineRecordConfigs';
import {
  PAYMENT_ENGINE_COLUMN_HEIGHT,
  PAYMENT_ENGINE_HEADER_HEIGHT,
  usePaymentEngineDataListPage,
} from './usePaymentEngineDataListPage';
import styles from './PaymentEngineDataListPage.module.css';

const props = defineProps<{
  menuItem: string;
}>();

const { ui } = useAppI18n();

const pageConfig = computed(() => resolvePaymentEngineRecordConfig(props.menuItem));
const allRows = computed(() => buildPaymentEngineRecordRows(props.menuItem, 68));
const displayToolbarTitle = computed(() => ui(props.menuItem));

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
  toolbarActionButtons,
  totalRowCount,
} = usePaymentEngineDataListPage({
  rows: allRows,
  showExport: computed(() => pageConfig.value.showExport),
  filterBadge: computed(() => pageConfig.value.filterBadge ?? 0),
});

const paginerStatistics = computed(() =>
  (pageConfig.value.statistics ?? []).map((item) => ({
    text: ui(item.labelKey),
    number: item.value,
  })),
);

function recordRow(data: DataListItem): PaymentEngineRecordRow {
  return data as PaymentEngineRecordRow;
}

const STATUS_LABEL_KEYS: Record<PaymentEngineRecordRow['status'], string> = {
  initiated: 'Initiated',
  'additional-payment-required': 'Additional Payment Required',
  expired: 'Expired',
  cancelled: 'Cancelled',
  paid: 'Paid',
  transferred: 'Transferred',
  pending: 'Pending',
  success: 'Success',
  failed: 'Failed',
};

function statusCustomize(row: PaymentEngineRecordRow): Record<string, unknown> {
  const status = row.status;

  if (props.menuItem === 'Refund Record') {
    const refundMap: Record<string, { tone: string; label: string }> = {
      pending: { tone: 'warning', label: 'Refunding' },
      success: { tone: 'success', label: 'Refunded' },
      failed: { tone: 'danger', label: 'Refund Failed' },
    };
    const item = refundMap[status];
    if (item) return { status: item.tone, label: item.label };
  }

  if (props.menuItem === 'Bulk Transfer Record' || props.menuItem === 'Wallet Payout') {
    const bulkMap: Record<string, { tone: string; label: string }> = {
      pending: { tone: 'warning', label: 'Transferring' },
      success: { tone: 'success', label: 'Transfer Completed' },
      failed: { tone: 'danger', label: 'Failed' },
    };
    const item = bulkMap[status];
    if (item) return { status: item.tone, label: item.label };
  }

  let tone: string = 'success';
  if (status === 'additional-payment-required' || status === 'failed') tone = 'danger';
  else if (status === 'expired' || status === 'cancelled' || status === 'pending') tone = 'warning';

  return {
    status: tone,
    label: STATUS_LABEL_KEYS[status],
  };
}

function cryptoCustomize(row: PaymentEngineRecordRow): Record<string, unknown> {
  const symbol = row.currencySymbol ?? 'USDT';
  const cryptoName = resolveCryptoNameFromSymbol(symbol) ?? 'eds-usdt-tether';
  return {
    symbol,
    cryptoName,
    showNetwork: true,
    networkLabel: row.currencyNetwork ?? 'Ethereum',
    comboMode: 'currency-only',
    entryBadgeMode: 'none',
  };
}

function columnProp(column: PaymentEngineRecordColumnConfig): string {
  if (column.key === 'orderIds') return 'id';
  if (column.key === 'status') return 'status';
  if (column.key === 'createdAt') return 'createdAt';
  if (column.key === 'receivedAmount') return 'receivedAmount';
  if (column.key === 'orderAmount') return 'orderAmount';
  if (column.key === 'crypto') return 'currencySymbol';
  if (column.key === 'bulkState' || column.key === 'refundState') return 'status';
  if (column.key === 'bulkMeta' || column.key === 'refundMeta') return 'createdAt';
  return 'orderAmount';
}

function columnAlign(column: PaymentEngineRecordColumnConfig): 'left' | 'center' | 'right' {
  if (column.align === 'end') return 'right';
  if (column.align === 'center') return 'center';
  return 'left';
}

function columnHeaderAlign(column: PaymentEngineRecordColumnConfig): 'start' | 'end' {
  return column.align === 'end' ? 'end' : 'start';
}

const isHeaderSortDisabled = computed(() => Boolean(customize.value.loading));
</script>

<template>
  <div :class="styles.dataListNest">
    <EgLayout type="empty" show-toolbar show-paginer>
      <template #toolbar>
        <EgToolBar
          :title="displayToolbarTitle"
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
          :data-list="paginatedRows"
          :header-height="PAYMENT_ENGINE_HEADER_HEIGHT"
          :column-height="PAYMENT_ENGINE_COLUMN_HEIGHT"
          :loading="Boolean(customize.loading)"
        >
          <EgDataListColumn
            v-for="column in pageConfig.columns"
            :key="column.key"
            :prop="columnProp(column)"
            :label="ui(column.labelKey)"
            :min-width="column.minWidth"
            :flex-grow="column.flexGrow"
            :align="columnAlign(column)"
            :sortable="false"
          >
            <template v-if="column.headerKind === 'combo'" #header>
              <div
                :class="[
                  pageStyles.comboHeader,
                  column.comboAlignEnd && pageStyles.comboHeaderAlignEnd,
                ]"
              >
                <div :class="pageStyles.comboHeaderSegment">
                  <div :class="pageStyles.comboHeaderSegmentTextWrap">
                    <EgDataListCellOverflow
                      :content-class="pageStyles.comboHeaderSegmentText"
                      context="header"
                    >
                      {{ ui(column.labelKey) }}
                    </EgDataListCellOverflow>
                  </div>
                  <DataListHeaderSortTrigger
                    v-if="column.sortable"
                    :label="column.labelKey"
                    :align="columnHeaderAlign(column)"
                    :disabled="isHeaderSortDisabled"
                  />
                </div>
                <EgDivider type="navigator" direction="vertical" />
                <div :class="pageStyles.comboHeaderSegment">
                  <div :class="pageStyles.comboHeaderSegmentTextWrap">
                    <EgDataListCellOverflow
                      :content-class="pageStyles.comboHeaderSegmentText"
                      context="header"
                    >
                      {{ ui(column.secondaryLabelKey ?? '') }}
                    </EgDataListCellOverflow>
                  </div>
                  <DataListHeaderSortTrigger
                    v-if="column.secondarySortable"
                    :label="column.secondaryLabelKey ?? ''"
                    :align="columnHeaderAlign(column)"
                    :disabled="isHeaderSortDisabled"
                  />
                </div>
              </div>
            </template>

            <template v-else-if="column.sortable" #header>
              <div
                :class="[
                  pageStyles.comboHeader,
                  column.align === 'end' && pageStyles.comboHeaderAlignEnd,
                ]"
              >
                <div :class="pageStyles.comboHeaderSegment">
                  <div :class="pageStyles.comboHeaderSegmentTextWrap">
                    <EgDataListCellOverflow
                      :content-class="pageStyles.comboHeaderSegmentText"
                      context="header"
                    >
                      {{ ui(column.labelKey) }}
                    </EgDataListCellOverflow>
                  </div>
                  <DataListHeaderSortTrigger
                    :label="column.labelKey"
                    :align="columnHeaderAlign(column)"
                    :disabled="isHeaderSortDisabled"
                  />
                </div>
              </div>
            </template>

            <template #default="{ data }">
              <template v-if="column.key === 'orderIds'">
                <PaymentEngineListFieldOrderIds
                  :order-id="recordRow(data).id"
                  :merchant-order-id="recordRow(data).merchantOrderId"
                />
              </template>

              <template
                v-else-if="column.key === 'status' || column.key === 'bulkState' || column.key === 'refundState'"
              >
                <TasksListFieldStatus :customize="statusCustomize(recordRow(data))" />
              </template>

              <template v-else-if="column.key === 'createdAt'">
                <TasksListFieldTime :customize="{ datetime: recordRow(data).createdAt }" />
              </template>

              <template v-else-if="column.key === 'bulkMeta' || column.key === 'refundMeta'">
                <PaymentEngineListFieldMeta
                  :primary="recordRow(data).createdAt"
                  :secondary="
                    recordRow(data).bulkTransferId ?? recordRow(data).refundId ?? recordRow(data).id
                  "
                />
              </template>

              <template v-else-if="column.key === 'crypto'">
                <TasksListFieldCurrency :customize="cryptoCustomize(recordRow(data))" />
              </template>

              <template v-else-if="column.key === 'receivedAmount' || column.key === 'orderAmount'">
                <PaymentEngineListFieldAmount
                  :crypto-amount="
                    column.key === 'receivedAmount'
                      ? recordRow(data).receivedAmount
                      : recordRow(data).orderAmount
                  "
                  :crypto-symbol="
                    column.key === 'receivedAmount'
                      ? recordRow(data).receivedSymbol
                      : recordRow(data).orderSymbol
                  "
                  :fiat-amount="
                    column.key === 'receivedAmount'
                      ? recordRow(data).receivedFiat
                      : recordRow(data).orderFiat
                  "
                  :network-label="
                    column.key === 'orderAmount' ? recordRow(data).networkLabel : undefined
                  "
                  align-end
                />
              </template>

              <template v-else-if="column.key === 'bulkAmount' || column.key === 'refundAmount'">
                <PaymentEngineListFieldAmount
                  :crypto-amount="recordRow(data).orderAmount"
                  :crypto-symbol="recordRow(data).orderSymbol"
                  :fiat-amount="recordRow(data).orderFiat ?? recordRow(data).receivedFiat"
                  align-end
                />
              </template>
            </template>
          </EgDataListColumn>
        </EgDataList>
      </div>

      <template #paginer>
        <EgPaginer
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
