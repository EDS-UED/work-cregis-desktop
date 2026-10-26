<script setup lang="ts">
import { computed } from 'vue';
import GoogleVerifyPopup from '@/scenes/manage/webhook/GoogleVerifyPopup.vue';
import { manageTeamApiOverlayRegistry } from './manageTeamApiOverlayContext';
import TeamApiDeleteConfirmDialog from './TeamApiDeleteConfirmDialog.vue';
import TeamApiDetailPopup from './TeamApiDetailPopup.vue';
import TeamApiKeyRevealDialog from './TeamApiKeyRevealDialog.vue';
import TeamApiStatusToggleConfirmDialog from './TeamApiStatusToggleConfirmDialog.vue';

const surface = computed(() => manageTeamApiOverlayRegistry.value);

const detailOpen = computed({
  get: () => surface.value?.detailOpen.value ?? false,
  set: (value: boolean) => {
    if (surface.value) surface.value.detailOpen.value = value;
  },
});

const detailRow = computed(() => surface.value?.detailRow.value ?? null);

const verifyOpen = computed({
  get: () => surface.value?.verifyOpen.value ?? false,
  set: (value: boolean) => {
    if (surface.value) surface.value.verifyOpen.value = value;
  },
});

const keyDialogOpen = computed({
  get: () => surface.value?.keyDialogOpen.value ?? false,
  set: (value: boolean) => {
    if (surface.value) surface.value.keyDialogOpen.value = value;
  },
});

const deleteDialogOpen = computed({
  get: () => surface.value?.deleteDialogOpen.value ?? false,
  set: (value: boolean) => {
    if (surface.value) surface.value.deleteDialogOpen.value = value;
  },
});

const statusToggleDialogOpen = computed({
  get: () => surface.value?.statusToggleDialogOpen.value ?? false,
  set: (value: boolean) => {
    if (surface.value) surface.value.statusToggleDialogOpen.value = value;
  },
});

const statusToggleEnabling = computed(
  () => surface.value?.statusToggleEnabling.value ?? false,
);

const keyDialogRecord = computed(() => surface.value?.keyDialogRecord.value ?? null);
</script>

<template>
  <template v-if="surface">
    <TeamApiDetailPopup v-model:open="detailOpen" :row="detailRow" />

    <TeamApiKeyRevealDialog
      v-model:open="keyDialogOpen"
      :record="keyDialogRecord"
    />

    <TeamApiStatusToggleConfirmDialog
      v-model:open="statusToggleDialogOpen"
      :enabling="statusToggleEnabling"
      @confirm="surface.onStatusToggleConfirm()"
      @cancel="surface.onStatusToggleCancel()"
    />

    <TeamApiDeleteConfirmDialog
      v-model:open="deleteDialogOpen"
      @confirm="surface.onDeleteConfirm()"
      @cancel="surface.onDeleteCancel()"
    />

    <GoogleVerifyPopup
      v-model:open="verifyOpen"
      @verified="surface.onVerifySucceeded()"
      @closed="surface.onVerifyClosed()"
    />
  </template>
</template>
