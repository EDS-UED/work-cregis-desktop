<script setup lang="ts">
import { EgListFieldOverflowText, EgTag } from '@eds/desktop-components';
import styles from './WaasListFieldSubAddressMeta.module.css';

defineProps<{
  address: string;
  balance: string;
  symbol: string;
  tagLabel?: string;
}>();
</script>

<template>
  <div :class="styles.host">
    <div :class="styles.addressRow">
      <EgTag
        v-if="tagLabel"
        family="system"
        system-type="solid-brand"
        size="sm"
        :class="styles.addressTag"
      >
        {{ tagLabel }}
      </EgTag>
      <EgListFieldOverflowText
        :class="styles.addressText"
        :text="address"
        variant="primary"
        tabular
      />
    </div>
    <EgListFieldOverflowText :text="`${balance} ${symbol}`" variant="secondary" tabular />
  </div>
</template>
