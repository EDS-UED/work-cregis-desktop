<script setup lang="ts">
import { computed } from 'vue';
import { useAppI18n } from '@/composables/useAppI18n';
import detailChromeStyles from '@/scenes/tasks/shared/detailPopupChrome.module.css';
import type { RiskControlAmlQueryRecordDetail } from './riskControlAmlQueryRecordDetailData';
import RiskControlAmlRecordDetailExceptionHandling from './RiskControlAmlRecordDetailExceptionHandling.vue';
import RiskControlAmlRecordDetailQueryResultPanel from './RiskControlAmlRecordDetailQueryResultPanel.vue';
import RiskControlAmlRecordDetailRiskProfileEmptyPanel from './RiskControlAmlRecordDetailRiskProfileEmptyPanel.vue';
import styles from './RiskControlAmlRecordDetailQueryResultPanel.module.css';

const props = defineProps<{
  detail: RiskControlAmlQueryRecordDetail;
  showSuccessPanel: boolean;
  showExceptionHandling: boolean;
}>();

const { ui } = useAppI18n();

/** 查询失败（列表 NA）等无画像内容时展示 EgDataList 空态。 */
const showRiskProfileEmpty = computed(
  () =>
    !props.showSuccessPanel
    && !props.showExceptionHandling
    && props.detail.isQueryFailed,
);
</script>

<template>
  <div
    :class="[
      detailChromeStyles.appendSection,
      styles.queryResultAppendSection,
      showRiskProfileEmpty && styles.queryResultAppendEmptyFill,
    ]"
    :data-aml-risk-profile-empty="showRiskProfileEmpty || undefined"
  >
    <RiskControlAmlRecordDetailQueryResultPanel
      v-if="showSuccessPanel"
      :detail="detail"
      embedded
    />
    <RiskControlAmlRecordDetailExceptionHandling
      v-else-if="showExceptionHandling"
      embedded
      :actions-disabled="detail.exceptionHandlingResolved"
    />
    <RiskControlAmlRecordDetailRiskProfileEmptyPanel
      v-else-if="showRiskProfileEmpty"
    />
    <p
      v-if="showSuccessPanel"
      :class="['typography-footnote', styles.queryResultDisclaimer]"
    >
      {{ ui('AML query result disclaimer') }}
    </p>
  </div>
</template>
