<script setup lang="ts">
import {
  EgBusinessTag,
  EgDataList,
  EgDataListCellOverflow,
  EgDataListColumn,
  EgDivider,
  EgListFieldOverflowText,
  type DataListItem,
  type TagCustomStyle,
} from '@eds/desktop-components';
import { computed } from 'vue';
import { useAppI18n } from '@/composables/useAppI18n';
import pageStyles from '@/scenes/tasks/TasksDataListPage.module.css';
import listStyles from '@/scenes/payment-engine/PaymentEngineDataListPage.module.css';
import { formatGroupedDecimalAmount } from '@/utils/formatGroupedDisplay';
import type { RiskControlAmlCounterpartyRow } from './riskControlAmlRecordDetailTypes';
import batchStyles from '@/scenes/tasks/signing/batch/batchSigning.shared.module.css';
import {
  AML_COUNTERPARTY_CONTRIBUTION_MIN_WIDTH,
  AML_COUNTERPARTY_DATA_LIST_COLUMN_HEIGHT,
  AML_COUNTERPARTY_DATA_LIST_HEADER_HEIGHT,
  AML_COUNTERPARTY_DIRECTION_EXPOSURE_MIN_WIDTH,
  AML_COUNTERPARTY_ENTITY_TAGS_MIN_WIDTH,
  AML_COUNTERPARTY_FUNDS_MIN_WIDTH,
  computeAmlCounterpartyDataListHeight,
} from './riskControlAmlCounterpartyDataListLayout';
import emptyListStyles from './RiskControlAmlRecordDetailDataListEmpty.module.css';
import styles from './RiskControlAmlRecordDetailCounterpartyTable.module.css';

const props = defineProps<{
  rows: RiskControlAmlCounterpartyRow[];
}>();

const { ui } = useAppI18n();

const listHeightPx = computed(() => computeAmlCounterpartyDataListHeight(props.rows.length));
const dataList = computed<DataListItem[]>(() =>
  props.rows.map((row) => ({
    id: row.id,
    directionKey: row.direction === 'source' ? 'Inbound direction' : 'Outbound direction',
    entity: row.entity,
    exposureType: ui(row.exposureTypeKey),
    riskTag: row.riskTagLabel,
    riskTagCustomStyle: row.riskTagCustomStyle,
    amountUsd: formatGroupedDecimalAmount(row.amountUsd),
    contribution: `${formatGroupedDecimalAmount(row.contributionPercent)}%`,
  })),
);

function rowFromData(data: DataListItem) {
  return dataList.value.find((entry) => entry.id === data.id) ?? dataList.value[0]!;
}
</script>

<template>
  <div
    :class="[
      batchStyles.batchDetailDataList,
      batchStyles.batchDetailDataListSized,
      emptyListStyles.listWrap,
      styles.host,
      dataList.length === 0 && emptyListStyles.listWrapEmpty,
    ]"
    :style="{ height: `${listHeightPx}px` }"
  >
    <EgDataList
      :data-list="dataList"
      :empty-text="ui('No data')"
      :header-height="AML_COUNTERPARTY_DATA_LIST_HEADER_HEIGHT"
      :column-height="AML_COUNTERPARTY_DATA_LIST_COLUMN_HEIGHT"
    >
      <EgDataListColumn
        prop="directionKey"
        :label="ui('Direction')"
        :min-width="AML_COUNTERPARTY_DIRECTION_EXPOSURE_MIN_WIDTH"
        align="left"
        :sortable="false"
      >
        <template #header>
          <div :class="pageStyles.comboHeader">
            <span>{{ ui('Direction') }}</span>
            <EgDivider type="navigator" direction="vertical" />
            <span>{{ ui('Exposure type') }}</span>
          </div>
        </template>
        <template #default="{ data }">
          <div :class="listStyles.cellStack">
            <EgListFieldOverflowText
              :text="ui(String(rowFromData(data).directionKey))"
              variant="primary"
            />
            <EgDataListCellOverflow :text="String(rowFromData(data).exposureType)" />
          </div>
        </template>
      </EgDataListColumn>

      <EgDataListColumn
        prop="entity"
        :label="ui('Entity')"
        :min-width="AML_COUNTERPARTY_ENTITY_TAGS_MIN_WIDTH"
        align="left"
        :sortable="false"
      >
        <template #header>
          <div :class="pageStyles.comboHeader">
            <span>{{ ui('Entity') }}</span>
            <EgDivider type="navigator" direction="vertical" />
            <span>{{ ui('Label') }}</span>
          </div>
        </template>
        <template #default="{ data }">
          <div :class="listStyles.cellStack">
            <EgListFieldOverflowText
              :text="String(rowFromData(data).entity)"
              variant="primary"
            />
            <EgBusinessTag
              family="custom"
              :custom-style="rowFromData(data).riskTagCustomStyle as TagCustomStyle"
              size="sm"
            >
              {{ rowFromData(data).riskTag }}
            </EgBusinessTag>
          </div>
        </template>
      </EgDataListColumn>

      <EgDataListColumn
        prop="amountUsd"
        :label="ui('Funds (USD)')"
        :min-width="AML_COUNTERPARTY_FUNDS_MIN_WIDTH"
        align="left"
        :sortable="false"
      >
        <template #default="{ data }">
          <EgDataListCellOverflow :text="String(rowFromData(data).amountUsd)" align="left" />
        </template>
      </EgDataListColumn>

      <EgDataListColumn
        prop="contribution"
        :label="ui('Contribution ratio')"
        :min-width="AML_COUNTERPARTY_CONTRIBUTION_MIN_WIDTH"
        align="right"
        :sortable="false"
      >
        <template #default="{ data }">
          <EgDataListCellOverflow
            :text="String(rowFromData(data).contribution)"
            align="right"
          />
        </template>
      </EgDataListColumn>
    </EgDataList>
  </div>
</template>
