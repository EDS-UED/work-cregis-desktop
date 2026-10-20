<script setup lang="ts">
import { computed } from 'vue';
import GoogleVerifyPopup from '@/scenes/manage/webhook/GoogleVerifyPopup.vue';
import CallbackIgnoreConfirmDialog from '@/scenes/waas-project/CallbackIgnoreConfirmDialog.vue';
import CallbackPushOrderDialog from '@/scenes/waas-project/CallbackPushOrderDialog.vue';
import PaymentEngineDetailPopup from './PaymentEngineDetailPopup.vue';
import type { PaymentEngineDetailFlowInstance } from './paymentEngineDetailFlowContext';

const props = defineProps<{
  flow: PaymentEngineDetailFlowInstance;
}>();

const detailOpen = computed({
  get: () => props.flow.detailOpen.value,
  set: (value: boolean) => {
    props.flow.detailOpen.value = value;
  },
});

const detailPopupMounted = computed(
  () => props.flow.detailOpen.value || props.flow.detailRow.value != null,
);

const detail = computed(() => props.flow.detailRow.value);
const menuItem = computed(() => props.flow.detailMenuItem.value);
const initialActiveTab = computed(() => props.flow.detailActiveTab.value);

const pushOrderDialogOpen = computed({
  get: () => props.flow.pushOrderDialogOpen.value,
  set: (value: boolean) => {
    props.flow.pushOrderDialogOpen.value = value;
  },
});

const pushOrderDialogCallbackUrl = computed(
  () => props.flow.pushOrderDialogCallbackUrl.value,
);

const pushOrderGoogleVerifyOpen = computed({
  get: () => props.flow.pushOrderGoogleVerifyOpen.value,
  set: (value: boolean) => {
    props.flow.pushOrderGoogleVerifyOpen.value = value;
  },
});

const callbackIgnoreConfirmOpen = computed({
  get: () => props.flow.callbackIgnoreConfirmOpen.value,
  set: (value: boolean) => {
    props.flow.callbackIgnoreConfirmOpen.value = value;
  },
});

const callbackIgnoreGoogleVerifyOpen = computed({
  get: () => props.flow.callbackIgnoreGoogleVerifyOpen.value,
  set: (value: boolean) => {
    props.flow.callbackIgnoreGoogleVerifyOpen.value = value;
  },
});

</script>

<template>
  <GoogleVerifyPopup
    v-model:open="pushOrderGoogleVerifyOpen"
    @verified="flow.onPushOrderGoogleVerified()"
    @closed="flow.onPushOrderGoogleVerifyDismissed()"
  />

  <GoogleVerifyPopup
    v-model:open="callbackIgnoreGoogleVerifyOpen"
    @verified="flow.onCallbackIgnoreGoogleVerified()"
    @closed="flow.onCallbackIgnoreGoogleVerifyDismissed()"
  />

  <CallbackIgnoreConfirmDialog
    v-model:open="callbackIgnoreConfirmOpen"
    @confirm="() => void flow.confirmCallbackIgnore()"
    @cancel="flow.closeCallbackIgnoreConfirm()"
  />

  <CallbackPushOrderDialog
    v-model:open="pushOrderDialogOpen"
    :callback-url="pushOrderDialogCallbackUrl"
    @confirm="flow.confirmPushOrderDialog($event)"
    @cancel="flow.closePushOrderDialog()"
  />

  <PaymentEngineDetailPopup
    v-if="detailPopupMounted"
    v-model:open="detailOpen"
    :detail="detail"
    :menu-item="menuItem"
    :initial-active-tab="initialActiveTab"
    @popup-closed="flow.onDetailPopupClosed()"
  />
</template>
