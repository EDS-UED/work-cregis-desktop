<script setup lang="ts">
import { computed } from 'vue';
import {
  EgListFieldHashLikeLine,
  EgTag,
} from '@eds/desktop-components';
import styles from './RiskControlAmlRecordDetailAddressValue.module.css';

const props = defineProps<{
  address: string;
  networkLabel?: string;
}>();

const network = computed(() => props.networkLabel?.trim() ?? '');
</script>

<template>
  <div :class="styles.host">
    <EgListFieldHashLikeLine
      :text="address"
      variant="primary"
      tooltip-trigger="hover"
      :copy-on-row-hover="false"
    />
    <EgTag
      v-if="network"
      family="system"
      system-type="stroke-subtle"
      size="sm"
      truncate
    >
      {{ network }}
    </EgTag>
  </div>
</template>
