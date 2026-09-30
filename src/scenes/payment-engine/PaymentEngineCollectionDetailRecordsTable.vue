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
import { buildPaymentEngineCollectionDetailLineStatusCustomize } from './paymentEngineCollectionDetailLineStatusCustomize';
import {
  COLLECTION_DETAIL_ADDRESS_HASH_COLUMN_MIN_WIDTH,
  COLLECTION_DETAIL_AMOUNT_FEE_COLUMN_MIN_WIDTH,
  COLLECTION_DETAIL_COLUMN_HEIGHT,
  COLLECTION_DETAIL_HEADER_HEIGHT,
  COLLECTION_DETAIL_STATUS_COLUMN_MIN_WIDTH,
  COLLECTION_DETAIL_TIME_COLUMN_MIN_WIDTH,
  computeCollectionDetailDataListHeight,
} from './paymentEngineCollectionDetailLayout';
import type { PaymentEngineCollectionDetailLineRecord } from './paymentEngineRecordConfigs';

const props = withDefaults(
  defineProps<{
    lines: readonly PaymentEngineCollectionDetailLineRecord[];
    fill?: boolean;
  }>(),
  { fill: false },
);

const { ui } = useAppI18n();

const listHeightPx = computed(() => computeCollectionDetailDataListHeight(props.lines.length));

const dataList = computed<DataListItem[]>(() =>
  props.lines.map((line, index) => ({
    id: line.id,
    lineIndex: index,
  })),
);

function lineFromData(data: DataListItem): PaymentEngineCollectionDetailLineRecord {
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
      :header-height="COLLECTION_DETAIL_HEADER_HEIGHT"
      :column-height="COLLECTION_DETAIL_COLUMN_HEIGHT"
    >
      <EgDataListColumn
        prop="amount"
        :label="ui('Amount')"
        :min-width="COLLECTION_DETAIL_AMOUNT_FEE_COLUMN_MIN_WIDTH"
        align="left"
        :sortable="false"
      >
        <template #header>
          <div :class="pageStyles.comboHeader">
            <span>{{ ui('Amount') }}</span>
            <EgDivider type="navigator" direction="vertical" />
            <span>{{ ui('Miner Fee') }}</span>
          </div>
        </template>
        <template #default="{ data }">
          <div :class="listStyles.cellStack">
            <PaymentEngineListFieldAmount
              :crypto-amount="lineFromData(data).amount"
              :crypto-symbol="lineFromData(data).symbol"
              :show-crypto-icon="false"
            />
            <EgListFieldOverflowText
              :text="`${lineFromData(data).minerFee} ${lineFromData(data).minerFeeSymbol}`"
              variant="secondary"
              tabular
            />
          </div>
        </template>
      </EgDataListColumn>

      <EgDataListColumn
        prop="address"
        :label="ui('Address')"
        :min-width="COLLECTION_DETAIL_ADDRESS_HASH_COLUMN_MIN_WIDTH"
        align="left"
        :sortable="false"
      >
        <template #header>
          <div :class="pageStyles.comboHeader">
            <span>{{ ui('Address') }}</span>
            <EgDivider type="navigator" direction="vertical" />
            <span>{{ ui('Transaction hash') }}</span>
          </div>
        </template>
        <template #default="{ data }">
          <PaymentEngineListFieldMeta
            :primary="lineFromData(data).address"
            :secondary="lineFromData(data).txHash ?? ''"
          />
        </template>
      </EgDataListColumn>

      <EgDataListColumn
        prop="status"
        :label="ui('Status')"
        :min-width="COLLECTION_DETAIL_STATUS_COLUMN_MIN_WIDTH"
        align="center"
        :sortable="false"
      >
        <template #default="{ data }">
          <TasksListFieldStatus
            :customize="buildPaymentEngineCollectionDetailLineStatusCustomize(lineFromData(data), ui)"
          />
        </template>
      </EgDataListColumn>

      <EgDataListColumn
        prop="time"
        :label="ui('Time')"
        :min-width="COLLECTION_DETAIL_TIME_COLUMN_MIN_WIDTH"
        align="left"
        :sortable="false"
      >
        <template #default="{ data }">
          <TasksListFieldTime
            :customize="buildTasksListFieldTimeCustomize(lineFromData(data).timestamp)"
          />
        </template>
      </EgDataListColumn>
    </EgDataList>
  </div>
</template>
