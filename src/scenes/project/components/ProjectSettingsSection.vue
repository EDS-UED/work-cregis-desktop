<script setup lang="ts">
import { EgDivider } from '@eds/desktop-components';
import styles from './ProjectSettingsSection.module.css';

defineProps<{
  title: string;
  showDivider?: boolean;
  interfaceHeading?: boolean;
}>();
</script>

<template>
  <section :class="styles.section">
    <EgDivider
      v-if="showDivider"
      :class="styles.divider"
      type="module"
      direction="horizontal"
    />
    <div :class="[styles.headingRow, interfaceHeading && styles.headingRowInterface]">
      <h3 :class="styles.heading">{{ title }}</h3>
      <div v-if="$slots.action" :class="styles.action">
        <slot name="action" />
      </div>
    </div>
    <div :class="styles.items">
      <slot />
    </div>
  </section>
</template>
