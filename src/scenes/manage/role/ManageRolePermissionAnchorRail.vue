<script setup lang="ts">
import styles from './ManageRolePermissionAnchorRail.module.css';

defineProps<{
  itemLabels: string[];
  activeIndex: number;
}>();

const emit = defineEmits<{
  select: [index: number];
}>();

function onSelect(index: number) {
  emit('select', index);
}
</script>

<template>
  <nav :class="styles.rail" aria-label="Permission modules">
    <button
      v-for="(label, index) in itemLabels"
      :key="`${label}-${index}`"
      type="button"
      :class="[styles.markButton, index === activeIndex && styles.markButtonActive]"
      :aria-label="label"
      :aria-current="index === activeIndex ? 'true' : undefined"
      @click="onSelect(index)"
    >
      <span :class="[styles.mark, index === activeIndex && styles.markActive]" />
    </button>
  </nav>
</template>
