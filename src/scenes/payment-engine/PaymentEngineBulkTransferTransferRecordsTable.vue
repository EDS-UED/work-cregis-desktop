<script setup lang="ts">
import { computed } from 'vue';
import {
  EgDataList,
  EgDataListCellOverflow,
  EgDataListColumn,
  EgDivider,
  EgListFieldOverflowText,
  type DataListItem,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import PaymentEngineListFieldAmount from './list-field/PaymentEngineListFieldAmount.vue';
import PaymentEngineListFieldMeta from './list-field/PaymentEngineListFieldMeta.vue';
import TasksListFieldStatus from '@/scenes/tasks/list-field/TasksListFieldStatus.vue';
import TasksListFieldTime from '@/scenes/tasks/list-field/TasksListFieldTime.vue';
import { buildTasksListFieldTimeCustomize } from '@/scenes/tasks/list-field/tasksListFieldTimeDefaults';
import pageStyles from '@/scenes/tasks/TasksDataListPage.module.css';
import listStyles from './PaymentEngineDataListPage.module.css';
import batchStyles from '@/scenes/tasks/signing/batch/batchSigning.shared.module.css';
import { buildPaymentEngineBulkTransferLineStatusCustomize } from './paymentEngineBulkTransferLineStatusCustomize';
import {
  BULK_TRANSFER_DETAIL_AMOUNT_ID_COLUMN_MIN_WIDTH,
  BULK_TRANSFER_DETAIL_COLUMN_HEIGHT,
  BULK_TRANSFER_DETAIL_HASH_SENDER_COLUMN_MIN_WIDTH,
  BULK_TRANSFER_DETAIL_HEADER_HEIGHT,
  BULK_TRANSFER_DETAIL_ONCHAIN_TIME_COLUMN_MIN_WIDTH,
  BULK_TRANSFER_DETAIL_STATUS_COLUMN_MIN_WIDTH,
  computeBulkTransferDataListHeight,
} from './paymentEngineBulkTransferDetailLayout';
import type { PaymentEngineBulkTransferLineRecord } from './paymentEngineRecordConfigs';

const props = withDefaults(
  defineProps<{
    lines: readonly PaymentEngineBulkTransferLineRecord[];
    /** true：撑满父级 flex，DataList 补 blank 行；false：按行数定高（§6.5.4 默认）。 */
    fill?: boolean;
  }>(),
  { fill: false },
);

const { ui } = useAppI18n();

const listHeightPx = computed(() => computeBulkTransferDataListHeight(props.lines.length));

const dataList = computed<DataListItem[]>(() =>
  props.lines.map((line, index) => ({
    id: line.transferId,
    lineIndex: index,
  })),
);

function lineFromData(data: DataListItem): PaymentEngineBulkTransferLineRecord {
  const lineIndex = Number(data.lineIndex ?? 0);
  return props.lines[lineIndex] ?? props.lines[0]!;
}
</script>

<template>
  <div
    :class="[
      batchStyles.batchDetailDataList,
      fill && batchStyles.batchDetailDataListFill,
      !fill && batchStyles.batchDetailDataListSized,
    ]"
    :style="fill ? undefined : { height: `${listHeightPx}px` }"
  >
    <EgDataList
      :data-list="dataList"
      :header-height="BULK_TRANSFER_DETAIL_HEADER_HEIGHT"
      :column-height="BULK_TRANSFER_DETAIL_COLUMN_HEIGHT"
    >
      <EgDataListColumn
        prop="amount"
        :label="ui('Amount')"
        :min-width="BULK_TRANSFER_DETAIL_AMOUNT_ID_COLUMN_MIN_WIDTH"
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
            </div>
            <EgDivider type="navigator" direction="vertical" />
            <div :class="pageStyles.comboHeaderSegment">
              <div :class="pageStyles.comboHeaderSegmentTextWrap">
                <EgDataListCellOverflow
                  :content-class="pageStyles.comboHeaderSegmentText"
                  context="header"
                >
                  {{ ui('Transfer Order ID') }}
                </EgDataListCellOverflow>
              </div>
            </div>
          </div>
        </template>
        <template #default="{ data }">
          <div :class="listStyles.cellStack">
            <PaymentEngineListFieldAmount
              :crypto-amount="lineFromData(data).amount"
              :crypto-symbol="lineFromData(data).symbol"
              :network-label="lineFromData(data).networkLabel"
            />
            <EgListFieldOverflowText
              :text="lineFromData(data).transferId"
              variant="secondary"
              tabular
            />
          </div>
        </template>
      </EgDataListColumn>

      <EgDataListColumn
        prop="hash"
        :label="ui('Transaction hash')"
        :min-width="BULK_TRANSFER_DETAIL_HASH_SENDER_COLUMN_MIN_WIDTH"
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
                  {{ ui('Transaction hash') }}
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
                  {{ ui('Sender') }}
                </EgDataListCellOverflow>
              </div>
            </div>
          </div>
        </template>
        <template #default="{ data }">
          <PaymentEngineListFieldMeta
            :primary="lineFromData(data).txHash"
            :secondary="lineFromData(data).senderAddress"
          />
        </template>
      </EgDataListColumn>

      <EgDataListColumn
        prop="status"
        :label="ui('Transfer Status')"
        :min-width="BULK_TRANSFER_DETAIL_STATUS_COLUMN_MIN_WIDTH"
        align="center"
        :sortable="false"
      >
        <template #default="{ data }">
          <TasksListFieldStatus
            :customize="buildPaymentEngineBulkTransferLineStatusCustomize(lineFromData(data), ui)"
          />
        </template>
      </EgDataListColumn>

      <EgDataListColumn
        prop="blockTimestamp"
        :label="ui('Transfer On-chain Transaction Time')"
        :min-width="BULK_TRANSFER_DETAIL_ONCHAIN_TIME_COLUMN_MIN_WIDTH"
        align="left"
        :sortable="false"
      >
        <template #default="{ data }">
          <TasksListFieldTime
            :customize="{
              ...buildTasksListFieldTimeCustomize(BULK_TRANSFER_DETAIL_ONCHAIN_TIME_COLUMN_MIN_WIDTH),
              datetime: lineFromData(data).blockTimestamp,
            }"
          />
        </template>
      </EgDataListColumn>
    </EgDataList>
  </div>
</template>
