<script setup lang="ts">
import {
  EgBusinessTag,
  EgDataList,
  EgDataListCellOverflow,
  EgDataListColumn,
  EgListFieldOverflowText,
  type DataListItem,
  type TagCustomStyle,
} from '@eds/desktop-components';
import { computed } from 'vue';
import { useAppI18n } from '@/composables/useAppI18n';
import { formatGroupedDecimalAmount } from '@/utils/formatGroupedDisplay';
import type { RiskControlAmlCounterpartyRow } from './riskControlAmlRecordDetailTypes';
import styles from './RiskControlAmlRecordDetailCounterpartyTable.module.css';

const props = defineProps<{
  rows: RiskControlAmlCounterpartyRow[];
}>();

const { ui } = useAppI18n();

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
  <div :class="styles.host">
    <EgDataList :data-list="dataList">
      <EgDataListColumn
        prop="directionKey"
        :label="ui('Direction')"
        min-width="120"
        align="left"
        :sortable="false"
      >
        <template #default="{ data }">
          <EgDataListCellOverflow :text="ui(String(rowFromData(data).directionKey))" />
        </template>
      </EgDataListColumn>

      <EgDataListColumn
        prop="entity"
        :label="ui('Belonging Entity')"
        min-width="140"
        align="left"
        :sortable="false"
      >
        <template #default="{ data }">
          <EgListFieldOverflowText
            :text="String(rowFromData(data).entity)"
            variant="primary"
          />
        </template>
      </EgDataListColumn>

      <EgDataListColumn
        prop="exposureType"
        :label="ui('Exposure type')"
        min-width="100"
        align="left"
        :sortable="false"
      >
        <template #default="{ data }">
          <EgDataListCellOverflow :text="String(rowFromData(data).exposureType)" />
        </template>
      </EgDataListColumn>

      <EgDataListColumn
        prop="riskTag"
        :label="ui('Entity Tags')"
        min-width="120"
        align="left"
        :sortable="false"
      >
        <template #default="{ data }">
          <EgBusinessTag
            family="custom"
            :custom-style="rowFromData(data).riskTagCustomStyle as TagCustomStyle"
            size="sm"
          >
            {{ rowFromData(data).riskTag }}
          </EgBusinessTag>
        </template>
      </EgDataListColumn>

      <EgDataListColumn
        prop="amountUsd"
        :label="ui('Funds (USD)')"
        min-width="120"
        align="right"
        :sortable="false"
      >
        <template #default="{ data }">
          <EgDataListCellOverflow
            :text="String(rowFromData(data).amountUsd)"
            align="right"
          />
        </template>
      </EgDataListColumn>

      <EgDataListColumn
        prop="contribution"
        :label="ui('Contribution ratio')"
        min-width="100"
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
