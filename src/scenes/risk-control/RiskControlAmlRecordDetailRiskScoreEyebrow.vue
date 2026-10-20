<script setup lang="ts">
import { useAppI18n } from '@/composables/useAppI18n';
import RiskControlAmlRecordDetailRiskScoreInfoTrigger from './RiskControlAmlRecordDetailRiskScoreInfoTrigger.vue';
import styles from './RiskControlAmlRecordDetailRiskScoreEyebrow.module.css';

const { ui } = useAppI18n();
</script>

<template>
  <span :class="styles.eyebrowRow">
    <span :class="styles.eyebrowText">{{ ui('Risk Score') }}</span>
    <RiskControlAmlRecordDetailRiskScoreInfoTrigger />
  </span>
</template>
