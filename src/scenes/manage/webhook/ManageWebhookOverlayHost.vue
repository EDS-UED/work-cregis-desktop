<script setup lang="ts">
import { computed } from 'vue';
import { manageWebhookOverlayRegistry } from './manageWebhookOverlayContext';
import GoogleVerifyPopup from './GoogleVerifyPopup.vue';
import WebhookDeleteConfirmDialog from './WebhookDeleteConfirmDialog.vue';
import WebhookKeyRevealDialog from './WebhookKeyRevealDialog.vue';
import WebhookPushDetailDialog from './WebhookPushDetailDialog.vue';

const surface = computed(() => manageWebhookOverlayRegistry.value);

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

const pushDetailOpen = computed({
  get: () => surface.value?.pushDetailOpen.value ?? false,
  set: (value: boolean) => {
    if (surface.value) surface.value.pushDetailOpen.value = value;
  },
});

const deleteDialogOpen = computed({
  get: () => surface.value?.deleteDialogOpen.value ?? false,
  set: (value: boolean) => {
    if (surface.value) surface.value.deleteDialogOpen.value = value;
  },
});

const keyDialogRecord = computed(() => surface.value?.keyDialogRecord.value ?? null);
const keyDialogOneTime = computed(() => surface.value?.keyDialogOneTime.value ?? false);
const pushDetailRow = computed(() => surface.value?.pushDetailRow.value ?? null);
</script>

<template>
  <template v-if="surface">
    <GoogleVerifyPopup v-model:open="verifyOpen" @verified="surface.onVerified()" />

    <WebhookKeyRevealDialog
      v-model:open="keyDialogOpen"
      :record="keyDialogRecord"
      :one-time-create="keyDialogOneTime"
      @confirm="surface.onKeyDialogConfirm()"
    />

    <WebhookPushDetailDialog
      v-model:open="pushDetailOpen"
      :row="pushDetailRow"
      @repush="surface.onPushDetailRepush()"
    />

    <WebhookDeleteConfirmDialog
      v-model:open="deleteDialogOpen"
      @confirm="surface.onDeleteConfirm()"
      @cancel="surface.onDeleteCancel()"
    />
  </template>
</template>
