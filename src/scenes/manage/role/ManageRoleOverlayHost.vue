<script setup lang="ts">
import { computed } from 'vue';
import { manageRoleOverlayRegistry } from './manageRoleOverlayContext';
import ManageRoleDetailPopup from './ManageRoleDetailPopup.vue';

const surface = computed(() => manageRoleOverlayRegistry.value);

const detailOpen = computed({
  get: () => surface.value?.detailOpen.value ?? false,
  set: (value: boolean) => {
    if (surface.value) surface.value.detailOpen.value = value;
  },
});

const detailRow = computed(() => surface.value?.detailRow.value ?? null);
</script>

<template>
  <ManageRoleDetailPopup
    v-if="surface"
    v-model:open="detailOpen"
    :row="detailRow"
  />
</template>
