<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { RiskControlAmlRiskTraceSection } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import SigningBatchDataListPaginerBar from '@/scenes/tasks/signing/batch/SigningBatchDataListPaginerBar.vue';
import detailChromeStyles from '@/scenes/tasks/shared/detailPopupChrome.module.css';
import { buildAmlRiskTraceTableRows, type AmlRiskTraceTableRow } from './riskControlAmlRiskTraceTableRows';
import { useAppI18n } from '@/composables/useAppI18n';
import RiskControlAmlRecordDetailRiskTraceDataList from './RiskControlAmlRecordDetailRiskTraceDataList.vue';
import styles from './RiskControlAmlRecordDetailRiskTracePanel.module.css';

const props = defineProps<{
  sourceTrace: RiskControlAmlRiskTraceSection;
  destinationTrace: RiskControlAmlRiskTraceSection;
}>();

const { ui } = useAppI18n();

const traceRows = computed(() =>
  buildAmlRiskTraceTableRows(props.sourceTrace, props.destinationTrace, ui),
);

const displayRows = ref<AmlRiskTraceTableRow[]>([]);

/** 首屏与 trace 变更同步；分页由底栏 paginated-change 接管。 */
watch(
  traceRows,
  (rows) => {
    displayRows.value = [...rows];
  },
  { immediate: true },
);

function onPaginatedChange(rows: AmlRiskTraceTableRow[]) {
  displayRows.value = rows;
}
</script>

<template>
  <div
    :class="[
      detailChromeStyles.appendSection,
      detailChromeStyles.appendSectionTabFlushTop,
      styles.dataListRegion,
    ]"
    data-aml-risk-trace-append
  >
    <div
      :class="styles.dataListTable"
      data-aml-risk-trace-list-shell
    >
      <RiskControlAmlRecordDetailRiskTraceDataList :rows="displayRows" />
    </div>
    <SigningBatchDataListPaginerBar
      :class="styles.paginerBar"
      :items="traceRows"
      @paginated-change="onPaginatedChange"
    />
  </div>
</template>
