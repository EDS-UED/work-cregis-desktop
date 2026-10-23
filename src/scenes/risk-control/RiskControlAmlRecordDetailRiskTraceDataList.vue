<script setup lang="ts">
import {
  EgBusinessTag,
  EgDataList,
  EgDataListColumn,
  EgDivider,
  EgListFieldHashLikeLine,
  EgListFieldOverflowText,
  type DataListItem,
  type TagCustomStyle,
} from '@eds/desktop-components';
import { computed } from 'vue';
import { useAppI18n } from '@/composables/useAppI18n';
import pageStyles from '@/scenes/tasks/TasksDataListPage.module.css';
import listStyles from '@/scenes/payment-engine/PaymentEngineDataListPage.module.css';
import batchStyles from '@/scenes/tasks/signing/batch/batchSigning.shared.module.css';
import emptyListStyles from './RiskControlAmlRecordDetailDataListEmpty.module.css';
import {
  AML_RISK_TRACE_DATA_LIST_COLUMN_HEIGHT,
  AML_RISK_TRACE_DATA_LIST_HEADER_HEIGHT,
  AML_RISK_TRACE_ENTITY_TAGS_MIN_WIDTH,
  AML_RISK_TRACE_EXPOSURE_TYPE_MIN_WIDTH,
  AML_RISK_TRACE_FUNDS_COMBO_MIN_WIDTH,
} from './riskControlAmlRiskTraceDataListLayout';
import type { AmlRiskTraceTableRow } from './riskControlAmlRiskTraceTableRows';
import styles from './RiskControlAmlRecordDetailRiskTraceDataList.module.css';

const props = defineProps<{
  rows: readonly AmlRiskTraceTableRow[];
}>();

const { ui } = useAppI18n();

const dataList = computed<DataListItem[]>(() =>
  props.rows.map((row) => ({ ...row })),
);

function rowFromData(data: DataListItem) {
  return props.rows.find((entry) => entry.id === data.id) ?? props.rows[0]!;
}
</script>

<template>
  <div
    :class="[
      batchStyles.batchDetailDataList,
      batchStyles.batchDetailDataListFill,
      emptyListStyles.listWrap,
      styles.host,
      dataList.length === 0 && emptyListStyles.listWrapEmpty,
    ]"
  >
    <EgDataList
      :data-list="dataList"
      :empty-text="ui('No data')"
      :header-height="AML_RISK_TRACE_DATA_LIST_HEADER_HEIGHT"
      :column-height="AML_RISK_TRACE_DATA_LIST_COLUMN_HEIGHT"
    >
      <EgDataListColumn
        prop="entityLabel"
        :label="ui('Entity of Target Address')"
        :min-width="AML_RISK_TRACE_ENTITY_TAGS_MIN_WIDTH"
        align="left"
        :sortable="false"
      >
        <template #header>
          <div :class="pageStyles.comboHeader">
            <span>{{ ui('Entity of Target Address') }}</span>
            <EgDivider type="navigator" direction="vertical" />
            <span>{{ ui('Label') }}</span>
          </div>
        </template>
        <template #default="{ data }">
          <div :class="listStyles.cellStack">
            <EgListFieldOverflowText
              :text="String(rowFromData(data).entityLabel)"
              variant="primary"
            />
            <EgBusinessTag
              family="custom"
              :custom-style="rowFromData(data).entityTagCustomStyle as TagCustomStyle"
              size="sm"
            >
              {{ rowFromData(data).entityTagLabel }}
            </EgBusinessTag>
          </div>
        </template>
      </EgDataListColumn>

      <EgDataListColumn
        prop="exposureTypeLabel"
        :label="ui('Exposure type')"
        :min-width="AML_RISK_TRACE_EXPOSURE_TYPE_MIN_WIDTH"
        align="left"
        :sortable="false"
      >
        <template #default="{ data }">
          <div
            class="desktopTokens list-field-general-structure"
            :class="styles.exposureTypeListField"
          >
            <span class="hash-like-combo" :class="styles.exposureHashLikeCombo">
              <EgListFieldHashLikeLine
                :text="rowFromData(data).exposureTypeLabel"
                variant="primary"
                tooltip-trigger="hover"
                :copy-on-row-hover="false"
              />
            </span>
          </div>
        </template>
      </EgDataListColumn>

      <EgDataListColumn
        prop="amountUsd"
        :label="ui('Funds (USD)')"
        :min-width="AML_RISK_TRACE_FUNDS_COMBO_MIN_WIDTH"
        align="right"
        :sortable="false"
      >
        <template #header>
          <div :class="[pageStyles.comboHeader, pageStyles.comboHeaderAlignEnd]">
            <span>{{ ui('Funds (USD)') }}</span>
            <EgDivider type="navigator" direction="vertical" />
            <span>{{ ui('Contribution ratio') }}</span>
          </div>
        </template>
        <template #default="{ data }">
          <div
            class="desktopTokens list-field-general-structure"
            :class="styles.fundsListField"
          >
            <span class="hash-like-combo" :class="styles.fundsHashLikeCombo">
              <EgListFieldHashLikeLine
                :text="String(rowFromData(data).amountUsd)"
                variant="primary"
                tooltip-trigger="hover"
                :copy-on-row-hover="false"
              />
              <EgListFieldHashLikeLine
                :text="String(rowFromData(data).contribution)"
                variant="secondary"
                tooltip-trigger="hover"
                :copy-on-row-hover="false"
              />
            </span>
          </div>
        </template>
      </EgDataListColumn>
    </EgDataList>
  </div>
</template>
