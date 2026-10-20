<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  EgButton,
  EgCrypto,
  EgDataList,
  EgDataListCellOverflow,
  EgDataListColumn,
  EgDivider,
  EgIcon,
  EgIconButtonPro,
  EgLayout,
  EgListFieldOverflowText,
  EgPaginer,
  EgPaginationItem,
  EgTag,
  EgToolBar,
  type CryptoName,
  type DataListItem,
  type TagStatus,
} from '@eds/desktop-components';
import ConditionFilterTrigger from '@/components/condition-filter/ConditionFilterTrigger.vue';
import { useAppI18n } from '@/composables/useAppI18n';
import DataListHeaderSortTrigger from '@/scenes/tasks/DataListHeaderSortTrigger.vue';
import { resolveCryptoNameFromSymbol } from '@/scenes/tasks/list-field/listFieldCryptoResolve';
import {
  ACTION_DATA_LIST_COLUMN_MIN_WIDTH,
  DATA_LIST_FIGMA_HEADER_HEIGHT,
  DATA_LIST_FIGMA_PAGE_SIZE_OPTIONS,
} from '@/scenes/tasks/tasksDataListPageData';
import { formatGroupedNumber } from '@/utils/formatGroupedDisplay';
import {
  PAYMENT_ENGINE_FILTER_FIELDS,
  paymentEngineFilterDefaultKeys,
} from './paymentEngineFilter';
import {
  isPaymentEngineListKind,
  type CallbackRecordRow,
  type ExceptionRecordRow,
  type ExceptionStatus,
  type OrderRecordRow,
  type OrderStatus,
  type PaymentEngineListKind,
  type SettlementRecordRow,
  type SettlementStatus,
} from './paymentEngineData';
import { paymentEngineState, usePaymentEnginePage } from './usePaymentEnginePage';
import { usePaginerStatisticsCollapse } from './usePaginerStatisticsCollapse';
import PaymentEngineSettingsPage from './PaymentEngineSettingsPage.vue';
import styles from './PaymentEnginePage.module.css';

const DATA_LIST_COLUMN_HEIGHT = 66;

const props = defineProps<{
  menuItem: string;
}>();

const { ui } = useAppI18n();

const listKind = computed((): PaymentEngineListKind => {
  if (isPaymentEngineListKind(props.menuItem)) return props.menuItem;
  return 'Order Record';
});

const isSettings = computed(() => props.menuItem === 'Settings');
const isOrder = computed(() => listKind.value === 'Order Record');
const isSettlement = computed(() => listKind.value === 'Settlement Record');
const isException = computed(() => listKind.value === 'Payment Exception Record');
const isCallback = computed(() => listKind.value === 'Callback Record');

const page = usePaymentEnginePage(() => listKind.value);
const {
  appliedFilter,
  dataList,
  statisticsItems,
  paginer,
  timeSortOrder,
  settlementNumberSortOrder,
  amountSortOrder,
  onRowClick,
  refreshList,
  onTimeSort,
  onSettlementNumberSort,
  onAmountSort,
} = page;

const {
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
  goFirstPage,
  goPrevPage,
  goNextPage,
  goLastPage,
  onManyPageItemClick,
  isManyPageSelected,
  onSettingsJump,
} = paginer;

const filterFields = computed(() => PAYMENT_ENGINE_FILTER_FIELDS[listKind.value]);
const filterDefaultKeys = computed(() => paymentEngineFilterDefaultKeys(listKind.value));

const paginerHostRef = ref<HTMLElement | null>(null);
const statsMeasureRef = ref<HTMLElement | null>(null);
const { statisticsCollapse } = usePaginerStatisticsCollapse(
  paginerHostRef,
  statsMeasureRef,
  statisticsItems,
);

function cryptoName(symbol: string): CryptoName {
  return resolveCryptoNameFromSymbol(symbol) ?? 'eds-btc-bitcoin';
}

function orderStatusKind(status: OrderStatus): TagStatus {
  if (status === 'Overpaid') return 'danger';
  if (status === 'Underpaid') return 'warning';
  if (status === 'Expired' || status === 'Canceled') return 'invalid';
  return 'success';
}

function orderStatusLabel(status: OrderStatus): string {
  if (status === 'Completed') return ui('Order Completed');
  return ui(status);
}

function settlementStatusKind(status: SettlementStatus): TagStatus {
  return status === 'Settling' ? 'warning' : 'success';
}

function onExportClick() {
  if (!isOrder.value && !isSettlement.value) return;
  paymentEngineState.exportOpen = true;
}

function exceptionStatusKind(status: ExceptionStatus): TagStatus {
  return status === 'Pending' ? 'danger' : 'success';
}

function asOrder(data: DataListItem): OrderRecordRow {
  return data as unknown as OrderRecordRow;
}

function asSettlement(data: DataListItem): SettlementRecordRow {
  return data as unknown as SettlementRecordRow;
}

function asException(data: DataListItem): ExceptionRecordRow {
  return data as unknown as ExceptionRecordRow;
}

function asCallback(data: DataListItem): CallbackRecordRow {
  return data as unknown as CallbackRecordRow;
}
</script>

<template>
  <div ref="paginerHostRef" :class="styles.dataListNest">
    <PaymentEngineSettingsPage v-if="isSettings" />

    <EgLayout v-else type="empty" show-toolbar show-paginer>
      <template #toolbar>
        <EgToolBar :title="ui(listKind)" show-divider>
          <template #functional>
            <ConditionFilterTrigger
              :label="ui('Filter')"
              icon="eds-filter"
              :fields="filterFields"
              :default-field-keys="filterDefaultKeys"
              v-model:applied="appliedFilter"
            />
            <EgIconButtonPro :label="ui('Refresh')" @click="refreshList">
              <EgIcon name="eds-arrow-refresh" size="sm" />
            </EgIconButtonPro>
            <EgIconButtonPro
              :label="ui('Export')"
              @click="onExportClick"
            >
              <EgIcon name="eds-arrow-download" size="sm" />
            </EgIconButtonPro>
          </template>
        </EgToolBar>
      </template>

      <div :class="styles.listRegion">
        <EgDataList
          :key="`${listKind}-${paymentEngineState.listRemountKey}`"
          :data-list="dataList"
          :header-height="DATA_LIST_FIGMA_HEADER_HEIGHT"
          :column-height="DATA_LIST_COLUMN_HEIGHT"
          :loading="false"
          :initing="false"
          :empty-text="ui('No matching records')"
          @row-click="onRowClick"
        >
          <template v-if="isOrder">
            <EgDataListColumn prop="orderId" :label="ui('Order ID')" min-width="220px" :sortable="false">
              <template #header>
                <div :class="styles.comboHeader">
                  <div :class="styles.comboHeaderSegment">
                    <div :class="styles.comboHeaderSegmentTextWrap">
                      <EgDataListCellOverflow :content-class="styles.comboHeaderSegmentText" context="header">
                        {{ ui('Order ID') }}
                      </EgDataListCellOverflow>
                    </div>
                  </div>
                  <EgDivider type="navigator" direction="vertical" />
                  <div :class="styles.comboHeaderSegment">
                    <div :class="styles.comboHeaderSegmentTextWrap">
                      <EgDataListCellOverflow :content-class="styles.comboHeaderSegmentText" context="header">
                        {{ ui('Merchant Order ID') }}
                      </EgDataListCellOverflow>
                    </div>
                  </div>
                </div>
              </template>
              <template #default="{ data }">
                <div :class="styles.comboCell">
                  <EgListFieldOverflowText :text="asOrder(data).orderId" size="medium" />
                  <span :class="styles.comboSecondary">
                    <EgListFieldOverflowText
                      :text="asOrder(data).merchantOrderId"
                      variant="secondary"
                    />
                  </span>
                </div>
              </template>
            </EgDataListColumn>

            <EgDataListColumn
              prop="status"
              :label="ui('Order Status')"
              min-width="140px"
              align="center"
              :sortable="false"
            >
              <template #default="{ data }">
                <div :class="styles.statusCell">
                  <EgTag
                    v-if="asOrder(data).status === 'New'"
                    family="colorful"
                    colorful-style="lime"
                    size="lg"
                  >
                    {{ ui('New') }}
                  </EgTag>
                  <EgTag
                    v-else
                    family="status"
                    :status="orderStatusKind(asOrder(data).status)"
                    size="lg"
                  >
                    {{ orderStatusLabel(asOrder(data).status) }}
                  </EgTag>
                </div>
              </template>
            </EgDataListColumn>

            <EgDataListColumn prop="createdAt" :label="ui('Creation Time')" min-width="170px" :sortable="false">
              <template #header>
                <div :class="styles.comboHeader">
                  <div :class="styles.comboHeaderSegment">
                    <div :class="styles.comboHeaderSegmentTextWrap">
                      <EgDataListCellOverflow :content-class="styles.comboHeaderSegmentText" context="header">
                        {{ ui('Creation Time') }}
                      </EgDataListCellOverflow>
                    </div>
                    <DataListHeaderSortTrigger
                      label="Creation Time"
                      :active-order="timeSortOrder"
                      @sort-change="onTimeSort"
                    />
                  </div>
                </div>
              </template>
              <template #default="{ data }">
                <EgListFieldOverflowText :text="asOrder(data).createdAt" size="medium" />
              </template>
            </EgDataListColumn>

            <EgDataListColumn
              prop="receivedAmount"
              :label="ui('Actual Received Amount')"
              min-width="324px"
              align="right"
              :sortable="false"
            >
              <template #header>
                <div :class="[styles.comboHeader, styles.comboHeaderAlignEnd]">
                  <div :class="styles.comboHeaderSegment">
                    <div :class="styles.comboHeaderSegmentTextWrap">
                      <EgDataListCellOverflow :content-class="styles.comboHeaderSegmentText" context="header">
                        {{ ui('Actual Received Amount') }}
                      </EgDataListCellOverflow>
                    </div>
                    <DataListHeaderSortTrigger
                      label="Actual Received Amount"
                      :active-order="amountSortOrder"
                      @sort-change="onAmountSort"
                    />
                  </div>
                  <EgDivider type="navigator" direction="vertical" />
                  <div :class="styles.comboHeaderSegment">
                    <div :class="styles.comboHeaderSegmentTextWrap">
                      <EgDataListCellOverflow :content-class="styles.comboHeaderSegmentText" context="header">
                        {{ ui('Order Amount') }}
                      </EgDataListCellOverflow>
                    </div>
                  </div>
                </div>
              </template>
              <template #default="{ data }">
                <div :class="[styles.comboCell, styles.comboCellEnd]">
                  <div :class="styles.amountPrimaryRow">
                    <EgListFieldOverflowText
                      :text="`${asOrder(data).receivedAmount} ${asOrder(data).receivedSymbol}`"
                      size="medium"
                      tabular
                    />
                    <EgTag
                      v-if="asOrder(data).chainTag"
                      size="sm"
                      system-type="stroke-subtle"
                    >
                      {{ asOrder(data).chainTag }}
                    </EgTag>
                  </div>
                  <span :class="styles.comboSecondary">
                    <EgListFieldOverflowText :text="asOrder(data).orderAmount" variant="secondary" tabular />
                  </span>
                </div>
              </template>
            </EgDataListColumn>
          </template>

          <template v-else-if="isSettlement">
            <EgDataListColumn prop="token" :label="ui('Token')" min-width="250px" :sortable="false">
              <template #header>
                <div :class="styles.comboHeader">
                  <div :class="styles.comboHeaderSegment">
                    <div :class="styles.comboHeaderSegmentTextWrap">
                      <EgDataListCellOverflow :content-class="styles.comboHeaderSegmentText" context="header">
                        {{ ui('Token') }}
                      </EgDataListCellOverflow>
                    </div>
                  </div>
                  <EgDivider type="navigator" direction="vertical" />
                  <div :class="styles.comboHeaderSegment">
                    <div :class="styles.comboHeaderSegmentTextWrap">
                      <EgDataListCellOverflow :content-class="styles.comboHeaderSegmentText" context="header">
                        {{ ui('Address') }}
                      </EgDataListCellOverflow>
                    </div>
                  </div>
                </div>
              </template>
              <template #default="{ data }">
                <div :class="styles.tokenCell">
                  <span :class="styles.tokenIcon">
                    <EgCrypto :name="cryptoName(asSettlement(data).token)" fit :label="asSettlement(data).token" />
                  </span>
                  <div :class="styles.tokenBody">
                    <div :class="styles.comboPrimary">
                      <EgListFieldOverflowText :text="asSettlement(data).token" size="medium" />
                      <EgTag
                        v-if="asSettlement(data).networkTag"
                        size="sm"
                        system-type="stroke-subtle"
                      >
                        {{ asSettlement(data).networkTag }}
                      </EgTag>
                    </div>
                    <span :class="styles.comboSecondary">
                      <EgListFieldOverflowText :text="asSettlement(data).address" variant="secondary" />
                    </span>
                  </div>
                </div>
              </template>
            </EgDataListColumn>

            <EgDataListColumn
              prop="status"
              :label="ui('Status')"
              min-width="140px"
              align="center"
              :sortable="false"
            >
              <template #default="{ data }">
                <div :class="styles.statusCell">
                  <EgTag
                    family="status"
                    :status="settlementStatusKind(asSettlement(data).status)"
                    size="lg"
                  >
                    {{ ui(asSettlement(data).status) }}
                  </EgTag>
                </div>
              </template>
            </EgDataListColumn>

            <EgDataListColumn
              prop="createdAt"
              :label="ui('Creation Time')"
              min-width="180px"
              :sortable="false"
            >
              <template #header>
                <div :class="styles.comboHeader">
                  <div :class="styles.comboHeaderSegment">
                    <div :class="styles.comboHeaderSegmentTextWrap">
                      <EgDataListCellOverflow :content-class="styles.comboHeaderSegmentText" context="header">
                        {{ ui('Creation Time') }}
                      </EgDataListCellOverflow>
                    </div>
                    <DataListHeaderSortTrigger
                      label="Creation Time"
                      :active-order="timeSortOrder"
                      @sort-change="onTimeSort"
                    />
                  </div>
                  <EgDivider type="navigator" direction="vertical" />
                  <div :class="styles.comboHeaderSegment">
                    <div :class="styles.comboHeaderSegmentTextWrap">
                      <EgDataListCellOverflow :content-class="styles.comboHeaderSegmentText" context="header">
                        {{ ui('Settlement Number') }}
                      </EgDataListCellOverflow>
                    </div>
                    <DataListHeaderSortTrigger
                      label="Settlement Number"
                      :active-order="settlementNumberSortOrder"
                      @sort-change="onSettlementNumberSort"
                    />
                  </div>
                </div>
              </template>
              <template #default="{ data }">
                <div :class="styles.timeStack">
                  <span :class="styles.timeStackSecondary">
                    <EgListFieldOverflowText :text="asSettlement(data).createdAt" />
                  </span>
                  <span :class="styles.timeStackPrimary">
                    <EgListFieldOverflowText :text="asSettlement(data).settlementNumber" size="medium" />
                  </span>
                </div>
              </template>
            </EgDataListColumn>

            <EgDataListColumn
              prop="receivedAmount"
              :label="ui('Actual Received Amount')"
              min-width="300px"
              align="right"
              :sortable="false"
            >
              <template #header>
                <div :class="[styles.comboHeader, styles.comboHeaderAlignEnd]">
                  <div :class="styles.comboHeaderSegment">
                    <div :class="styles.comboHeaderSegmentTextWrap">
                      <EgDataListCellOverflow :content-class="styles.comboHeaderSegmentText" context="header">
                        {{ ui('Actual Received Amount') }}
                      </EgDataListCellOverflow>
                    </div>
                    <DataListHeaderSortTrigger
                      label="Actual Received Amount"
                      :active-order="amountSortOrder"
                      @sort-change="onAmountSort"
                    />
                  </div>
                  <EgDivider type="navigator" direction="vertical" />
                  <div :class="styles.comboHeaderSegment">
                    <div :class="styles.comboHeaderSegmentTextWrap">
                      <EgDataListCellOverflow :content-class="styles.comboHeaderSegmentText" context="header">
                        {{ ui('Total Settled Amount') }}
                      </EgDataListCellOverflow>
                    </div>
                  </div>
                </div>
              </template>
              <template #default="{ data }">
                <div :class="[styles.comboCell, styles.comboCellEnd]">
                  <div :class="styles.amountPrimaryRow">
                    <EgListFieldOverflowText
                      :text="`${asSettlement(data).receivedAmount} ${asSettlement(data).receivedSymbol}`"
                      size="medium"
                      tabular
                    />
                    <EgTag
                      v-if="asSettlement(data).chainTag"
                      size="sm"
                      system-type="stroke-subtle"
                    >
                      {{ asSettlement(data).chainTag }}
                    </EgTag>
                  </div>
                  <span :class="styles.comboSecondary">
                    <EgListFieldOverflowText :text="asSettlement(data).settledAmount" variant="secondary" tabular />
                  </span>
                </div>
              </template>
            </EgDataListColumn>
          </template>

          <template v-else-if="isException">
            <EgDataListColumn prop="token" :label="ui('Token')" min-width="250px" :sortable="false">
              <template #header>
                <div :class="styles.comboHeader">
                  <div :class="styles.comboHeaderSegment">
                    <div :class="styles.comboHeaderSegmentTextWrap">
                      <EgDataListCellOverflow :content-class="styles.comboHeaderSegmentText" context="header">
                        {{ ui('Token') }}
                      </EgDataListCellOverflow>
                    </div>
                  </div>
                  <EgDivider type="navigator" direction="vertical" />
                  <div :class="styles.comboHeaderSegment">
                    <div :class="styles.comboHeaderSegmentTextWrap">
                      <EgDataListCellOverflow :content-class="styles.comboHeaderSegmentText" context="header">
                        {{ ui('Address') }}
                      </EgDataListCellOverflow>
                    </div>
                  </div>
                </div>
              </template>
              <template #default="{ data }">
                <div :class="styles.tokenCell">
                  <span :class="styles.tokenIcon">
                    <EgCrypto :name="cryptoName(asException(data).token)" fit :label="asException(data).token" />
                  </span>
                  <div :class="styles.tokenBody">
                    <div :class="styles.comboPrimary">
                      <EgListFieldOverflowText :text="asException(data).token" size="medium" />
                      <EgTag
                        v-if="asException(data).networkTag"
                        size="sm"
                        system-type="stroke-subtle"
                      >
                        {{ asException(data).networkTag }}
                      </EgTag>
                    </div>
                    <div :class="styles.addressFlow">
                      <span :class="styles.addressFlowText">
                        <EgListFieldOverflowText :text="asException(data).fromAddress" variant="secondary" />
                      </span>
                      <span :class="styles.addressArrow">
                        <EgIcon name="eds-arrow-right" fit />
                      </span>
                      <span :class="styles.addressFlowText">
                        <EgListFieldOverflowText :text="asException(data).toAddress" variant="secondary" />
                      </span>
                    </div>
                  </div>
                </div>
              </template>
            </EgDataListColumn>

            <EgDataListColumn
              prop="status"
              :label="ui('Settlement/ Refund Status')"
              min-width="140px"
              align="center"
              :sortable="false"
            >
              <template #default="{ data }">
                <div :class="styles.statusCell">
                  <EgTag
                    family="status"
                    :status="exceptionStatusKind(asException(data).status)"
                    size="lg"
                  >
                    {{ ui(asException(data).status) }}
                  </EgTag>
                </div>
              </template>
            </EgDataListColumn>

            <EgDataListColumn prop="receivedAt" :label="ui('Received Time')" min-width="170px" :sortable="false">
              <template #header>
                <div :class="styles.comboHeader">
                  <div :class="styles.comboHeaderSegment">
                    <div :class="styles.comboHeaderSegmentTextWrap">
                      <EgDataListCellOverflow :content-class="styles.comboHeaderSegmentText" context="header">
                        {{ ui('Received Time') }}
                      </EgDataListCellOverflow>
                    </div>
                    <DataListHeaderSortTrigger
                      label="Received Time"
                      :active-order="timeSortOrder"
                      @sort-change="onTimeSort"
                    />
                  </div>
                </div>
              </template>
              <template #default="{ data }">
                <EgListFieldOverflowText :text="asException(data).receivedAt" size="medium" />
              </template>
            </EgDataListColumn>

            <EgDataListColumn
              prop="amount"
              :label="ui('Amount')"
              min-width="200px"
              :sortable="false"
            >
              <template #header>
                <div :class="styles.comboHeader">
                  <div :class="styles.comboHeaderSegment">
                    <div :class="styles.comboHeaderSegmentTextWrap">
                      <EgDataListCellOverflow :content-class="styles.comboHeaderSegmentText" context="header">
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
              <template #default="{ data }">
                <EgListFieldOverflowText :text="asException(data).amount" size="medium" tabular />
              </template>
            </EgDataListColumn>

            <EgDataListColumn
              prop="actions"
              :label="ui('Action')"
              :min-width="ACTION_DATA_LIST_COLUMN_MIN_WIDTH"
              align="right"
              :sortable="false"
              is-action
            >
              <template #default="{ data }">
                <div
                  v-if="asException(data).status === 'Pending'"
                  :class="styles.actionCell"
                  @click.stop
                >
                  <EgButton variant="solid" size="md" tone="decor">
                    {{ ui('On-chain transfer') }}
                  </EgButton>
                </div>
              </template>
            </EgDataListColumn>
          </template>

          <template v-else-if="isCallback">
            <EgDataListColumn prop="orderId" :label="ui('Order ID')" min-width="220px" :sortable="false">
              <template #header>
                <div :class="styles.comboHeader">
                  <div :class="styles.comboHeaderSegment">
                    <div :class="styles.comboHeaderSegmentTextWrap">
                      <EgDataListCellOverflow :content-class="styles.comboHeaderSegmentText" context="header">
                        {{ ui('Order ID') }}
                      </EgDataListCellOverflow>
                    </div>
                  </div>
                  <EgDivider type="navigator" direction="vertical" />
                  <div :class="styles.comboHeaderSegment">
                    <div :class="styles.comboHeaderSegmentTextWrap">
                      <EgDataListCellOverflow :content-class="styles.comboHeaderSegmentText" context="header">
                        {{ ui('Merchant Order ID') }}
                      </EgDataListCellOverflow>
                    </div>
                  </div>
                </div>
              </template>
              <template #default="{ data }">
                <div :class="styles.comboCell">
                  <EgListFieldOverflowText :text="asCallback(data).orderId" size="medium" />
                  <span :class="styles.comboSecondary">
                    <EgListFieldOverflowText
                      :text="asCallback(data).merchantOrderId"
                      variant="secondary"
                    />
                  </span>
                </div>
              </template>
            </EgDataListColumn>

            <EgDataListColumn
              prop="status"
              :label="ui('Status')"
              min-width="140px"
              align="center"
              :sortable="false"
            >
              <template #default="{ data }">
                <div :class="styles.statusCell">
                  <EgTag
                    family="status"
                    :status="asCallback(data).status === 'Failed' ? 'danger' : 'success'"
                    size="lg"
                  >
                    {{ ui(asCallback(data).status) }}
                  </EgTag>
                </div>
              </template>
            </EgDataListColumn>

            <EgDataListColumn prop="callbackAt" :label="ui('Callback Time')" min-width="188px" :sortable="false">
              <template #header>
                <div :class="styles.comboHeader">
                  <div :class="styles.comboHeaderSegment">
                    <div :class="styles.comboHeaderSegmentTextWrap">
                      <EgDataListCellOverflow :content-class="styles.comboHeaderSegmentText" context="header">
                        {{ ui('Callback Time') }}
                      </EgDataListCellOverflow>
                    </div>
                    <DataListHeaderSortTrigger
                      label="Callback Time"
                      :active-order="timeSortOrder"
                      @sort-change="onTimeSort"
                    />
                  </div>
                </div>
              </template>
              <template #default="{ data }">
                <EgListFieldOverflowText :text="asCallback(data).callbackAt" size="medium" />
              </template>
            </EgDataListColumn>

            <EgDataListColumn prop="event" :label="ui('Event')" min-width="160px" :sortable="false">
              <template #default="{ data }">
                <EgListFieldOverflowText :text="ui(asCallback(data).event)" size="medium" />
              </template>
            </EgDataListColumn>
          </template>
        </EgDataList>
      </div>

      <template #paginer>
        <EgPaginer
          v-model:settings-level-index="settingsLevelIndex"
          v-model:settings-jump-value="settingsJumpValue"
          :show-statistics="statisticsItems.length > 0"
          :statistics-collapse="statisticsCollapse"
          :statistics-collapse-label="ui('Show statistics')"
          :statistics-items="statisticsItems"
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

    <div
      v-if="statisticsItems.length > 0"
      ref="statsMeasureRef"
      :class="styles.statsMeasure"
      aria-hidden="true"
    >
      <span
        v-for="(item, index) in statisticsItems"
        :key="`${item.text}-${item.number}-${index}`"
        :class="styles.statsMeasureItem"
      >
        <span :class="styles.statsMeasureText">{{ item.text }}</span>
        <span :class="styles.statsMeasureNumber">{{ item.number }}</span>
      </span>
    </div>
  </div>
</template>
