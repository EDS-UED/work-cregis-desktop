<script setup lang="ts">
import { computed } from 'vue';
import { EgIcon } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import { resolveAmlRiskRatingVisual } from './list-field/resolveAmlRiskRatingVisual';
import styles from './RiskControlAmlRecordDetailRiskRatingValue.module.css';

const props = defineProps<{
  labelKey: string;
  customStyle: string | undefined;
  queryFailed?: boolean;
  queryException?: boolean;
  manualReviewCompleted?: boolean;
}>();

const { ui } = useAppI18n();

const riskLabel = computed(() => ui(props.labelKey));

const manualReviewTag = computed(() => {
  if (!props.manualReviewCompleted) return '';
  return ui('AML risk rating manual review tag').trim();
});
const riskVisual = computed(() => {
  if (props.queryException) return resolveAmlRiskRatingVisual('aml-suspicious');
  return resolveAmlRiskRatingVisual(props.customStyle);
});

const riskToneClass = computed(() => {
  if (props.queryFailed) return styles.riskToneNa;
  if (riskVisual.value.tone === 'danger') return styles.riskToneDanger;
  if (riskVisual.value.tone === 'warning') return styles.riskToneWarning;
  return styles.riskToneSuccess;
});
</script>

<template>
  <div v-if="queryFailed" :class="[styles.host, styles.riskToneNa]">
    <span :class="['typography-body-small-strong', styles.riskLabel]">
      {{ riskLabel }}
      <span v-if="manualReviewTag" :class="styles.riskLabelSuffix">
        ({{ manualReviewTag }})
      </span>
    </span>
  </div>
  <div v-else :class="[styles.host, riskToneClass]">
    <span :class="styles.riskIcon">
      <EgIcon :name="riskVisual.iconName" size="sm" fit fill-tone="primary" />
    </span>
    <span :class="['typography-body-small-strong', styles.riskLabel]">
      {{ riskLabel }}
      <span v-if="manualReviewTag" :class="styles.riskLabelSuffix">
        ({{ manualReviewTag }})
      </span>
    </span>
  </div>
</template>
