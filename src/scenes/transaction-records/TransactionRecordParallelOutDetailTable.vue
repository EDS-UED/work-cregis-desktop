<script setup lang="ts">
import { computed } from 'vue';
import {
  EgDataList,
  EgDataListCellOverflow,
  EgDataListColumn,
  EgListFieldOverflowText,
  type DataListItem,
} from '@eds/desktop-components';
import pageStyles from '@/scenes/tasks/TasksDataListPage.module.css';
import { useAppI18n } from '@/composables/useAppI18n';
import TasksListFieldAddressLine from '@/scenes/tasks/list-field/TasksListFieldAddressLine.vue';
import TasksListFieldAmount from '@/scenes/tasks/list-field/TasksListFieldAmount.vue';
import batchStyles from '@/scenes/tasks/signing/batch/batchSigning.shared.module.css';
import {
  buildParallelOutDetailAmountCustomize,
  buildParallelOutDetailReceiverCustomize,
  buildParallelOutDetailSenderCustomize,
} from './parallelOutDetailListFieldCustomize';
import {
  PARALLEL_OUT_DETAIL_AMOUNT_COLUMN_MIN_WIDTH,
  PARALLEL_OUT_DETAIL_COLUMN_HEIGHT,
  PARALLEL_OUT_DETAIL_HEADER_HEIGHT,
  PARALLEL_OUT_DETAIL_RECEIVER_COLUMN_MIN_WIDTH,
  PARALLEL_OUT_DETAIL_SENDER_COLUMN_MIN_WIDTH,
  PARALLEL_OUT_DETAIL_TYPE_COLUMN_MIN_WIDTH,
} from './transactionRecordParallelOutDetailLayout';
import type { TransactionRecordParallelOutDetailLine } from './transactionRecordParallelOutDetailTypes';

const props = defineProps<{
  lines: TransactionRecordParallelOutDetailLine[];
}>();

const { ui } = useAppI18n();

const dataList = computed<DataListItem[]>(() =>
  props.lines.map((line) => ({
    id: line.id,
    lineIndex: line.lineIndex,
  })),
);

function lineFromData(data: DataListItem): TransactionRecordParallelOutDetailLine {
  const lineIndex = Number(data.lineIndex ?? 0);
  return props.lines[lineIndex] ?? props.lines[0]!;
}
</script>

<template>
  <div :class="[batchStyles.batchDetailDataList, batchStyles.batchDetailDataListFill]">
    <EgDataList
      :data-list="dataList"
      :header-height="PARALLEL_OUT_DETAIL_HEADER_HEIGHT"
      :column-height="PARALLEL_OUT_DETAIL_COLUMN_HEIGHT"
    >
      <EgDataListColumn
        prop="amount"
        :label="ui('Transaction Amount')"
        :min-width="PARALLEL_OUT_DETAIL_AMOUNT_COLUMN_MIN_WIDTH"
        align="left"
        :sortable="false"
      >
        <template #default="{ data }">
          <TasksListFieldAmount
            :customize="buildParallelOutDetailAmountCustomize(lineFromData(data))"
          />
        </template>
      </EgDataListColumn>

      <EgDataListColumn
        prop="transactionType"
        :label="ui('Transaction Type')"
        :min-width="PARALLEL_OUT_DETAIL_TYPE_COLUMN_MIN_WIDTH"
        align="left"
        :sortable="false"
      >
        <template #default="{ data }">
          <EgListFieldOverflowText
            :text="lineFromData(data).transactionType"
            variant="primary"
            tooltip-trigger="hover"
          />
        </template>
      </EgDataListColumn>

      <EgDataListColumn
        prop="sender"
        :label="ui('Sender')"
        :min-width="PARALLEL_OUT_DETAIL_SENDER_COLUMN_MIN_WIDTH"
        align="left"
        :sortable="false"
      >
        <template #default="{ data }">
          <TasksListFieldAddressLine
            prefix="from"
            :customize="buildParallelOutDetailSenderCustomize(lineFromData(data))"
            tooltip-trigger="hover"
          />
        </template>
      </EgDataListColumn>

      <EgDataListColumn
        prop="receiver"
        :label="ui('Receiver')"
        :min-width="PARALLEL_OUT_DETAIL_RECEIVER_COLUMN_MIN_WIDTH"
        align="right"
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
                  {{ ui('Receiver') }}
                </EgDataListCellOverflow>
              </div>
            </div>
          </div>
        </template>
        <template #default="{ data }">
          <TasksListFieldAddressLine
            prefix="to"
            :customize="buildParallelOutDetailReceiverCustomize(lineFromData(data))"
            align-end
            tooltip-trigger="hover"
          />
        </template>
      </EgDataListColumn>
    </EgDataList>
  </div>
</template>
