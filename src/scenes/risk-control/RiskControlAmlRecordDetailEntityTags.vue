<script setup lang="ts">
import { EgBusinessTag } from '@eds/desktop-components';
import type { RiskControlAmlEntityTag } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import styles from './RiskControlAmlRecordDetailEntityTags.module.css';

defineProps<{
  tags: RiskControlAmlEntityTag[];
}>();
</script>

<template>
  <div :class="styles.host">
    <EgBusinessTag
      v-for="(tag, index) in tags"
      :key="`${tag.label}-${index}`"
      :custom-style="tag.customStyle"
      size="md"
      truncate
    >
      {{ tag.label }}
    </EgBusinessTag>
  </div>
</template>
