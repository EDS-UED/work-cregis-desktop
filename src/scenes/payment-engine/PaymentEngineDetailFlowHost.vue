<script setup lang="ts">
import { computed } from 'vue';
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
</script>

<template>
  <PaymentEngineDetailPopup
    v-if="detailPopupMounted"
    v-model:open="detailOpen"
    :detail="detail"
    :menu-item="menuItem"
    :initial-active-tab="initialActiveTab"
    @popup-closed="flow.onDetailPopupClosed()"
  />
</template>
