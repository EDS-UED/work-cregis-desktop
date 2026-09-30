<script setup lang="ts">
import { EgColorfulTag } from '@eds/desktop-components';
import type { RiskControlAmlEntityTag } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import styles from './RiskControlAmlRecordDetailEntityTags.module.css';

defineProps<{
  tags: RiskControlAmlEntityTag[];
}>();
</script>

<template>
  <div :class="styles.host">
    <EgColorfulTag
      v-for="(tag, index) in tags"
      :key="`${tag.label}-${index}`"
      :colorful-style="tag.colorfulStyle"
      size="sm"
    >
      {{ tag.label }}
    </EgColorfulTag>
  </div>
</template>
