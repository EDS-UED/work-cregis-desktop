<script setup lang="ts">
import { computed } from 'vue';
import GoogleVerifyPopup from '@/scenes/manage/webhook/GoogleVerifyPopup.vue';
import { manageMemberOverlayRegistry } from './manageMemberOverlayContext';
import ManageMemberDeleteConfirmDialog from './ManageMemberDeleteConfirmDialog.vue';
import ManageMemberDetailPopup from './ManageMemberDetailPopup.vue';

const surface = computed(() => manageMemberOverlayRegistry.value);

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

const deleteDialogOpen = computed({
  get: () => surface.value?.deleteDialogOpen.value ?? false,
  set: (value: boolean) => {
    if (surface.value) surface.value.deleteDialogOpen.value = value;
  },
});

function onDeleteConfirm() {
  surface.value?.onDeleteConfirm();
}

function onDeleteCancel() {
  surface.value?.onDeleteCancel();
}

function onVerifySucceeded() {
  surface.value?.onVerifySucceeded();
}

function onVerifyClosed() {
  surface.value?.onVerifyClosed();
}
</script>

<template>
  <template v-if="surface">
    <ManageMemberDetailPopup
      v-model:open="detailOpen"
      :row="detailRow"
    />

    <ManageMemberDeleteConfirmDialog
      v-model:open="deleteDialogOpen"
      @confirm="onDeleteConfirm"
      @cancel="onDeleteCancel"
    />

    <GoogleVerifyPopup
      v-model:open="verifyOpen"
      @verified="onVerifySucceeded"
      @closed="onVerifyClosed"
    />
  </template>
</template>
