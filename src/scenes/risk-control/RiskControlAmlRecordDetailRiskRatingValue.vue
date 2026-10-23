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
}>();

const { ui } = useAppI18n();

const riskLabel = computed(() => ui(props.labelKey));
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
    </span>
  </div>
  <div v-else :class="[styles.host, riskToneClass]">
    <span :class="styles.riskIcon">
      <EgIcon :name="riskVisual.iconName" size="sm" fit fill-tone="primary" />
    </span>
    <span :class="['typography-body-small-strong', styles.riskLabel]">
      {{ riskLabel }}
    </span>
  </div>
</template>
