<script setup lang="ts">
import { computed } from 'vue';
import GoogleVerifyPopup from '@/scenes/manage/webhook/GoogleVerifyPopup.vue';
import { manageRoleOverlayRegistry } from './manageRoleOverlayContext';
import ManageRoleDeleteConfirmDialog from './ManageRoleDeleteConfirmDialog.vue';
import ManageRoleDetailPopup from './ManageRoleDetailPopup.vue';

const surface = computed(() => manageRoleOverlayRegistry.value);

const detailOpen = computed({
  get: () => surface.value?.detailOpen.value ?? false,
  set: (value: boolean) => {
    if (surface.value) surface.value.detailOpen.value = value;
  },
});

const detailRow = computed(() => surface.value?.detailRow.value ?? null);

const initialEnterEdit = computed(() => surface.value?.initialEnterEdit.value ?? false);

const enterEditNonce = computed(() => surface.value?.enterEditNonce.value ?? 0);

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

function onConsumeInitialEnterEdit() {
  surface.value?.consumeInitialEnterEdit();
}
</script>

<template>
  <template v-if="surface">
    <ManageRoleDetailPopup
      v-model:open="detailOpen"
      :row="detailRow"
      :initial-enter-edit="initialEnterEdit"
      :enter-edit-nonce="enterEditNonce"
      @consume-initial-enter-edit="onConsumeInitialEnterEdit"
    />

    <ManageRoleDeleteConfirmDialog
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
