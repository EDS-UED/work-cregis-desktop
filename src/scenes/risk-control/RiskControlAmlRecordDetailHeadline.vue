<script setup lang="ts">
import type { RiskControlAmlQueryRecordDetail } from './riskControlAmlQueryRecordDetailData';
import RiskControlAmlRecordDetailTopCard from './RiskControlAmlRecordDetailTopCard.vue';

defineProps<{
  detail: RiskControlAmlQueryRecordDetail;
}>();
</script>

<template>
  <RiskControlAmlRecordDetailTopCard :detail="detail" />
</template>
