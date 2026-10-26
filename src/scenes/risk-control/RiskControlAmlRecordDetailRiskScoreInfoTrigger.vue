<script setup lang="ts">
import RiskControlFormHintInfoTrigger from './RiskControlFormHintInfoTrigger.vue';
</script>

<template>
  <RiskControlFormHintInfoTrigger
    button-label-key="Risk score information"
    rich-risk-score-hint
    show-risk-score-unavailable-hint
    boundary-selector=".eds-popup"
  />
</template>