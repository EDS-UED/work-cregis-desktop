<script setup lang="ts">
import { computed } from 'vue';
import {
  EgDataList,
  EgDataListColumn,
  EgDivider,
  EgListFieldAddressLine,
  EgListFieldHashLikeLine,
  EgListFieldOverflowText,
  type DataListItem,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import { useDataListUserTimeColumnTitle } from '@/composables/useDataListUserTimeColumnTitle';
import { useAppUserTimezoneSelection } from '@/scenes/shared/appUserTimezoneSession';
import PaymentEngineListFieldAmount from './list-field/PaymentEngineListFieldAmount.vue';
import TasksListFieldStatus from '@/scenes/tasks/list-field/TasksListFieldStatus.vue';
import TasksListFieldTime from '@/scenes/tasks/list-field/TasksListFieldTime.vue';
import { buildTasksListFieldTimeCustomize } from '@/scenes/tasks/list-field/tasksListFieldTimeDefaults';
import pageStyles from '@/scenes/tasks/TasksDataListPage.module.css';
import listStyles from './PaymentEngineDataListPage.module.css';
import hashComboStyles from './list-field/PaymentEngineListFieldCallbackAmountTime.module.css';
import { buildPaymentEngineCollectionDetailLineStatusCustomize } from './paymentEngineCollectionDetailLineStatusCustomize';
import type { PaymentEngineCollectionDetailTabKind } from './paymentEngineCollectionDetailView';
import collectionStyles from './PaymentEngineCollectionDetailPage.module.css';
import {
  COLLECTION_DETAIL_ADDRESS_HASH_COLUMN_MIN_WIDTH,
  COLLECTION_DETAIL_AMOUNT_FEE_COLUMN_MIN_WIDTH,
  COLLECTION_DETAIL_COLUMN_HEIGHT,
  COLLECTION_DETAIL_HEADER_HEIGHT,
  COLLECTION_DETAIL_STATUS_COLUMN_MIN_WIDTH,
  COLLECTION_DETAIL_TIME_COLUMN_MIN_WIDTH,
  computeCollectionDetailTableMeasureHeight,
  computeCollectionDetailTableVisibleHeight,
} from './paymentEngineCollectionDetailLayout';
import type { PaymentEngineCollectionDetailLineRecord } from './paymentEngineRecordConfigs';

const props = withDefaults(
  defineProps<{
    lines: readonly PaymentEngineCollectionDetailLineRecord[];
    tableKind?: PaymentEngineCollectionDetailTabKind;
  }>(),
  {
    tableKind: 'collection',
  },
);

const { ui } = useAppI18n();
const detailTimeColumnTitle = useDataListUserTimeColumnTitle('Time');
const { selectedIndex: userTimezoneIndex } = useAppUserTimezoneSelection();

const visibleHeightPx = computed(() => computeCollectionDetailTableVisibleHeight(props.lines.length));
const measureHeightPx = computed(() => computeCollectionDetailTableMeasureHeight(props.lines.length));

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

function lineIndexFromData(data: DataListItem): number {
  return Number(data.lineIndex ?? 0);
}
</script>

<template>
  <div
    :class="collectionStyles.recordsTableClip"
    :style="{ height: `${visibleHeightPx}px` }"
  >
    <div
      :class="[
        collectionStyles.recordsDataList,
        tableKind === 'eip7702' && collectionStyles.recordsDataListEip7702,
        tableKind === 'gas-top-up' && collectionStyles.recordsDataListGasTopUp,
      ]"
      :data-collection-table-kind="tableKind"
      :style="{ height: `${measureHeightPx}px` }"
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
                :crypto-name="lineFromData(data).cryptoName"
                :network-label="
                  lineIndexFromData(data) === 0
                    ? lineFromData(data).networkLabel
                    : ''
                "
                :show-crypto-icon="false"
                :show-symbol="true"
              />
              <EgListFieldOverflowText
                :text="`${lineFromData(data).minerFee} ${lineFromData(data).symbol}`"
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
            <div
              class="desktopTokens list-field-general-structure"
              :class="hashComboStyles.host"
            >
              <span class="hash-like-combo" :class="hashComboStyles.hashLikeCombo">
                <EgListFieldAddressLine
                  :text="lineFromData(data).address"
                  tooltip-trigger="hover"
                  :show-row-tag="
                    lineIndexFromData(data) === 0
                      && Boolean(lineFromData(data).receivingAlias?.trim())
                  "
                  :row-tag-label="
                    lineIndexFromData(data) === 0
                      ? (lineFromData(data).receivingAlias ?? '')
                      : ''
                  "
                  row-tag-system-type="solid-brand"
                />
                <EgListFieldHashLikeLine
                  v-if="lineFromData(data).txHash?.trim()"
                  :text="lineFromData(data).txHash!.trim()"
                  variant="secondary"
                  tooltip-trigger="hover"
                  :copy-on-row-hover="false"
                />
              </span>
            </div>
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
              :customize="{
                ...buildPaymentEngineCollectionDetailLineStatusCustomize(lineFromData(data)),
                minWidth: COLLECTION_DETAIL_STATUS_COLUMN_MIN_WIDTH.replace(/px$/i, '').trim(),
                truncate: true,
              }"
            />
          </template>
        </EgDataListColumn>

        <EgDataListColumn
          :key="`collection-detail-time-${userTimezoneIndex}`"
          prop="time"
          :label="detailTimeColumnTitle"
          :min-width="COLLECTION_DETAIL_TIME_COLUMN_MIN_WIDTH"
          align="right"
          :sortable="false"
        >
          <template #default="{ data }">
            <TasksListFieldTime
              :customize="{
                ...buildTasksListFieldTimeCustomize(COLLECTION_DETAIL_TIME_COLUMN_MIN_WIDTH),
                datetime: lineFromData(data).timestamp,
                alignEnd: true,
              }"
            />
          </template>
        </EgDataListColumn>
      </EgDataList>
    </div>
  </div>
</template>
