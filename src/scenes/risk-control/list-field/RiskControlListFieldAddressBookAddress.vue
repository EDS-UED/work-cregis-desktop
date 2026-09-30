<script setup lang="ts">
import { EgListFieldOverflowText, EgTag } from '@eds/desktop-components';
import styles from './RiskControlListFieldAddressBookAddress.module.css';

defineProps<{
  address: string;
  tagLabel?: string;
}>();
</script>

<template>
  <div :class="styles.host">
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
</template>
