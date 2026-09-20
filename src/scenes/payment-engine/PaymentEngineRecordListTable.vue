<script setup lang="ts">
import { computed } from 'vue';
import {
  EgDataList,
  EgDataListCellOverflow,
  EgDataListColumn,
  EgDivider,
  type DataListBatchActionResult,
  type DataListItem,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import DataListHeaderSortTrigger from '@/scenes/tasks/DataListHeaderSortTrigger.vue';
import TasksListFieldCurrency from '@/scenes/tasks/list-field/TasksListFieldCurrency.vue';
import TasksListFieldStatus from '@/scenes/tasks/list-field/TasksListFieldStatus.vue';
import TasksListFieldTime from '@/scenes/tasks/list-field/TasksListFieldTime.vue';
import { buildTasksListFieldTimeCustomize } from '@/scenes/tasks/list-field/tasksListFieldTimeDefaults';
import pageStyles from '@/scenes/tasks/TasksDataListPage.module.css';
import PaymentEngineListFieldAmount from './list-field/PaymentEngineListFieldAmount.vue';
import PaymentEngineListFieldCallbackEvent from './list-field/PaymentEngineListFieldCallbackEvent.vue';
import PaymentEngineListFieldCallbackUrl from './list-field/PaymentEngineListFieldCallbackUrl.vue';
import PaymentEngineListFieldOrderAmounts from './list-field/PaymentEngineListFieldOrderAmounts.vue';
import PaymentEngineListFieldMeta from './list-field/PaymentEngineListFieldMeta.vue';
import PaymentEngineListFieldOrderIds from './list-field/PaymentEngineListFieldOrderIds.vue';
import PaymentEngineListFieldSettlementNumber from './list-field/PaymentEngineListFieldSettlementNumber.vue';
import PaymentEngineListFieldOrderStatus from './list-field/PaymentEngineListFieldOrderStatus.vue';
import {
  buildBulkTransferCryptoCustomize,
  buildPaymentExceptionCryptoCustomize,
  buildRefundTokenCryptoCustomize,
  buildWalletPayoutCryptoCustomize,
} from './paymentEngineListFieldCustomize';
import {
  isPaymentCallbackRecordMenuItem,
  isPaymentOrderRecordMenuItem,
  isPaymentSettlementRecordMenuItem,
} from './paymentEngineOrderRecordData';
import {
  type PaymentEngineRecordColumnConfig,
  type PaymentEngineRecordRow,
} from './paymentEngineRecordConfigs';
import type { PaymentEngineRecordSortTarget } from './paymentEngineRecordSort';
import type { TasksDataListSortOrder } from '@/scenes/tasks/tasksDataListSort';
import { buildPaymentEngineRecordStatusCustomize } from './paymentEngineRecordStatusCustomize';
import {
  PAYMENT_ENGINE_COLUMN_HEIGHT,
  PAYMENT_ENGINE_HEADER_HEIGHT,
} from './usePaymentEngineDataListPage';
import styles from './PaymentEngineDataListPage.module.css';

const props = defineProps<{
  menuItem: string;
  columns: PaymentEngineRecordColumnConfig[];
  rows: PaymentEngineRecordRow[];
  loading: boolean;
  initing: boolean;
  batchActions: Array<{ key: string; label: string }>;
  onBatchAction: (
    key: string,
    rows: Array<Record<string, unknown> & { _index: number }>,
  ) => Promise<DataListBatchActionResult | void>;
  activeSort?: PaymentEngineRecordSortTarget | null;
}>();

const emit = defineEmits<{
  'update:selectMode': [value: boolean];
  'row-click': [data: DataListItem];
  'sort-change': [value: PaymentEngineRecordSortTarget | null];
}>();

const selectMode = defineModel<boolean>('selectMode', { default: false });

const { ui } = useAppI18n();

function recordRow(data: DataListItem): PaymentEngineRecordRow {
  return data as PaymentEngineRecordRow;
}

function statusCustomize(row: PaymentEngineRecordRow): Record<string, unknown> {
  return buildPaymentEngineRecordStatusCustomize(row, props.menuItem);
}

function cryptoCustomize(
  row: PaymentEngineRecordRow,
  column: PaymentEngineRecordColumnConfig,
): Record<string, unknown> {
  if (props.menuItem === 'Refund Record') {
    return buildRefundTokenCryptoCustomize(row, column.minWidth);
  }
  if (props.menuItem === 'Wallet Payout') {
    return buildWalletPayoutCryptoCustomize(row, column.minWidth);
  }
  if (props.menuItem === 'Payment Exception Record') {
    return buildPaymentExceptionCryptoCustomize(row, column.minWidth);
  }
  if (props.menuItem === 'Bulk Transfer Record') {
    return buildBulkTransferCryptoCustomize(row, column.minWidth);
  }
  return buildRefundTokenCryptoCustomize(row, column.minWidth);
}

function columnProp(column: PaymentEngineRecordColumnConfig): string {
  if (column.key === 'orderIds' || column.key === 'settlementNumber') return 'id';
  if (column.key === 'status') return 'status';
  if (column.key === 'createdAt') return 'createdAt';
  if (column.key === 'orderAmounts') return 'orderAmount';
  if (column.key === 'receivedAmount') return 'receivedAmount';
  if (column.key === 'orderAmount') return 'orderAmount';
  if (column.key === 'crypto') return 'currencySymbol';
  if (column.key === 'bulkState' || column.key === 'refundState') return 'status';
  if (column.key === 'bulkMeta' || column.key === 'refundMeta') return 'createdAt';
  if (column.key === 'callbackEvent') return 'callbackEventId';
  if (column.key === 'callbackAmount') return 'orderAmount';
  if (column.key === 'callbackStatus') return 'callbackStatus';
  if (column.key === 'callbackTime') return 'createdAt';
  if (column.key === 'callbackUrl') return 'callbackUrl';
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

function resolveSortOrder(
  column: PaymentEngineRecordColumnConfig,
  segment: 'primary' | 'secondary',
): TasksDataListSortOrder | '' {
  const activeSort = props.activeSort;
  if (!activeSort) return '';
  if (activeSort.columnKey !== column.key || activeSort.segment !== segment) return '';
  return activeSort.order;
}

function onColumnSortChange(
  column: PaymentEngineRecordColumnConfig,
  segment: 'primary' | 'secondary',
  order: TasksDataListSortOrder | null,
) {
  emit(
    'sort-change',
    order ? { columnKey: column.key, segment, order } : null,
  );
}

const isHeaderSortDisabled = computed(
  () => props.loading || props.rows.length === 0 || selectMode.value,
);
</script>

<template>
  <div :class="styles.listRegion">
<EgDataList
          v-model:select-mode="selectMode"
          :data-list="rows"
          :header-height="PAYMENT_ENGINE_HEADER_HEIGHT"
          :column-height="PAYMENT_ENGINE_COLUMN_HEIGHT"
          :loading="loading"
          :initing="initing"
          :initing-text="ui('Loading')"
          :batch-actions="batchActions"
          :on-batch-action="onBatchAction"
          :batch-count-suffix="ui('Selected')"
          @row-click="emit('row-click', $event)"
        >
          <EgDataListColumn
            v-for="column in columns"
            :key="column.key"
            :prop="columnProp(column)"
            :label="ui(column.labelKey)"
            :min-width="column.minWidth"
            :width="column.width"
            :flex-grow="column.flexGrow"
            :display-order="column.displayOrder"
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
                    :active-order="resolveSortOrder(column, 'primary')"
                    @sort-change="(order) => onColumnSortChange(column, 'primary', order)"
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
                    :active-order="resolveSortOrder(column, 'secondary')"
                    @sort-change="(order) => onColumnSortChange(column, 'secondary', order)"
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
                    :active-order="resolveSortOrder(column, 'primary')"
                    @sort-change="(order) => onColumnSortChange(column, 'primary', order)"
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

              <template v-else-if="column.key === 'settlementNumber'">
                <PaymentEngineListFieldSettlementNumber
                  :settlement-number="recordRow(data).id"
                />
              </template>

              <template v-else-if="column.key === 'status' && isPaymentOrderRecordMenuItem(menuItem)">
                <PaymentEngineListFieldOrderStatus :status="recordRow(data).status" />
              </template>

              <template
                v-else-if="
                  column.key === 'status'
                    || column.key === 'bulkState'
                    || column.key === 'refundState'
                    || column.key === 'callbackStatus'
                "
              >
                <TasksListFieldStatus :customize="statusCustomize(recordRow(data))" />
              </template>

              <template v-else-if="column.key === 'createdAt'">
                <TasksListFieldTime
                  :customize="{
                    ...buildTasksListFieldTimeCustomize(column.minWidth),
                    datetime: recordRow(data).createdAt,
                  }"
                />
              </template>

              <template v-else-if="column.key === 'bulkMeta'">
                <PaymentEngineListFieldMeta
                  :primary="recordRow(data).createdAt"
                  :secondary="recordRow(data).bulkTransferId ?? recordRow(data).merchantOrderId"
                />
              </template>

              <template v-else-if="column.key === 'refundMeta'">
                <PaymentEngineListFieldMeta
                  :primary="recordRow(data).createdAt"
                  :secondary="recordRow(data).merchantOrderId"
                />
              </template>

              <template v-else-if="column.key === 'callbackEvent'">
                <PaymentEngineListFieldCallbackEvent
                  :row="recordRow(data)"
                  :show-trigger-mode-tag="menuItem === 'History Callback'"
                />
              </template>

              <template v-else-if="column.key === 'callbackTime'">
                <TasksListFieldTime
                  :customize="{
                    ...buildTasksListFieldTimeCustomize(column.minWidth),
                    datetime: recordRow(data).createdAt,
                  }"
                />
              </template>

              <template v-else-if="column.key === 'callbackUrl'">
                <PaymentEngineListFieldCallbackUrl
                  :url="recordRow(data).callbackUrl ?? ''"
                  :show-actions="isPaymentCallbackRecordMenuItem(menuItem) && menuItem === 'Callback Error'"
                />
              </template>

              <template v-else-if="column.key === 'crypto'">
                <TasksListFieldCurrency :customize="cryptoCustomize(recordRow(data), column)" />
              </template>

              <template v-else-if="column.key === 'orderAmounts'">
                <PaymentEngineListFieldOrderAmounts
                  :received-amount="recordRow(data).receivedAmount"
                  :received-symbol="recordRow(data).receivedSymbol"
                  :received-fiat="recordRow(data).receivedFiat"
                  :order-amount="recordRow(data).orderAmount"
                  :order-symbol="recordRow(data).orderSymbol"
                  :order-crypto-name="
                    isPaymentSettlementRecordMenuItem(menuItem)
                      ? recordRow(data).currencyCryptoName
                      : undefined
                  "
                  :order-fiat="recordRow(data).orderFiat"
                  :network-label="recordRow(data).networkLabel"
                  :order-approximate-fiat="!isPaymentSettlementRecordMenuItem(menuItem)"
                />
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
                  :crypto-name="
                    column.key === 'orderAmount'
                      ? recordRow(data).currencyCryptoName
                      : undefined
                  "
                  :fiat-amount="
                    column.key === 'receivedAmount'
                      ? recordRow(data).receivedFiat
                      : recordRow(data).orderFiat
                  "
                  :network-label="
                    column.key === 'orderAmount' ? recordRow(data).networkLabel : undefined
                  "
                  :network-label-placement="
                    isPaymentSettlementRecordMenuItem(menuItem) && column.key === 'orderAmount'
                      ? 'secondary'
                      : 'primary'
                  "
                  :approximate-fiat="!isPaymentSettlementRecordMenuItem(menuItem)"
                  align-end
                />
              </template>

              <template v-else-if="column.key === 'callbackAmount'">
                <PaymentEngineListFieldAmount
                  :crypto-amount="recordRow(data).orderAmount"
                  :crypto-symbol="recordRow(data).orderSymbol"
                  :network-label="recordRow(data).networkLabel"
                />
              </template>

              <template v-else-if="column.key === 'bulkAmount'">
                <PaymentEngineListFieldAmount
                  :crypto-amount="recordRow(data).orderAmount"
                  :crypto-symbol="recordRow(data).orderSymbol"
                  :fiat-amount="recordRow(data).orderFiat"
                  :action-label-key="
                    menuItem === 'Payment Exception Record'
                      && recordRow(data).status === 'pending'
                      ? 'Transfer'
                      : undefined
                  "
                  align-end
                />
              </template>

              <template v-else-if="column.key === 'refundAmount'">
                <PaymentEngineListFieldAmount
                  :crypto-amount="recordRow(data).orderAmount"
                  :crypto-symbol="recordRow(data).orderSymbol"
                  :fiat-amount="recordRow(data).orderFiat"
                  :action-label-key="recordRow(data).status === 'initiated' ? 'Refund' : undefined"
                  align-end
                />
              </template>
            </template>
          </EgDataListColumn>
        </EgDataList>
  </div>
</template>
