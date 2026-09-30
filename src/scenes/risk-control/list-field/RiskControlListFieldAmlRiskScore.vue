<script setup lang="ts">
import { computed } from 'vue';
import {
  EgIcon,
  EgListFieldHashLikeLine,
  EgListFieldOverflowText,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { resolveAmlRiskRatingVisual } from './resolveAmlRiskRatingVisual';
import styles from './RiskControlListFieldAmlRiskScore.module.css';

const props = defineProps<{
  row: PaymentEngineRecordRow;
  alignEnd?: boolean;
}>();

const { ui } = useAppI18n();

const riskLabelKey = computed(() => props.row.amlRiskLabelKey ?? 'Safe');
const riskLabel = computed(() => ui(riskLabelKey.value));
const riskVisual = computed(() =>
  resolveAmlRiskRatingVisual(props.row.amlRiskCustomStyle),
);
const riskScore = computed(() => props.row.amlRiskScore ?? '0.0');

const riskToneClass = computed(() => {
  if (riskVisual.value.tone === 'danger') return styles.riskToneDanger;
  if (riskVisual.value.tone === 'warning') return styles.riskToneWarning;
  return styles.riskToneSuccess;
});
</script>

<template>
  <div
    class="desktopTokens list-field-general-structure"
    :class="[styles.host, alignEnd && styles.hostAlignEnd]"
  >
    <span class="hash-like-combo" :class="styles.hashLikeCombo">
      <div :class="[styles.titleRow, riskToneClass]">
        <span :class="styles.riskIcon">
          <EgIcon :name="riskVisual.iconName" size="sm" fit fill-tone="primary" />
        </span>
        <EgListFieldOverflowText
          :text="riskLabel"
          variant="primary"
          :class="styles.riskLabel"
        />
      </div>
      <EgListFieldHashLikeLine
        :class="styles.scoreLine"
        :text="riskScore"
        variant="secondary"
        tooltip-trigger="hover"
        :copy-on-row-hover="false"
      />
    </span>
  </div>
</template>
