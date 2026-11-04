<script setup lang="ts">
import { computed } from 'vue';
import ManageOrderManagementDetailPopup from './ManageOrderManagementDetailPopup.vue';
import { manageOrderManagementOverlayRegistry } from './manageOrderManagementOverlayContext';

const surface = computed(() => manageOrderManagementOverlayRegistry.value);

const detailOpen = computed({
  get: () => surface.value?.detailOpen.value ?? false,
  set: (value: boolean) => {
    if (surface.value) surface.value.detailOpen.value = value;
  },
});

const detailRow = computed(() => surface.value?.detailRow.value ?? null);
</script>

<template>
  <ManageOrderManagementDetailPopup
    v-if="surface"
    v-model:open="detailOpen"
    :row="detailRow"
  />
</template>
