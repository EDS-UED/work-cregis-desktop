<script setup lang="ts">
import { computed } from 'vue';
import { EgIcon, EgListFieldOverflowText } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import { resolveAmlRiskRatingVisual } from './list-field/resolveAmlRiskRatingVisual';
import styles from './RiskControlAmlRecordDetailRiskRatingValue.module.css';

const props = defineProps<{
  labelKey: string;
  customStyle: string | undefined;
}>();

const { ui } = useAppI18n();

const riskLabel = computed(() => ui(props.labelKey));
const riskVisual = computed(() => resolveAmlRiskRatingVisual(props.customStyle));

const riskToneClass = computed(() => {
  if (riskVisual.value.tone === 'danger') return styles.riskToneDanger;
  if (riskVisual.value.tone === 'warning') return styles.riskToneWarning;
  return styles.riskToneSuccess;
});
</script>

<template>
  <div :class="[styles.host, riskToneClass]">
    <span :class="styles.riskIcon">
      <EgIcon :name="riskVisual.iconName" size="sm" fit fill-tone="primary" />
    </span>
    <EgListFieldOverflowText
      :text="riskLabel"
      variant="primary"
      :class="styles.riskLabel"
    />
  </div>
</template>
